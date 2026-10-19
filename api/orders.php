<?php
/**
 * Orders & Payments API Endpoint
 * Handles: POST (place order with items & payment), GET (fetch orders), PUT (update order/payment status), DELETE (delete order)
 */
require_once __DIR__ . '/db.php';

// Ensure bank_slip_path column exists in payment table
try {
    $colCheck = $conn->query("SHOW COLUMNS FROM `payment` LIKE 'bank_slip_path'");
    if ($colCheck && $colCheck->rowCount() === 0) {
        $conn->exec("ALTER TABLE `payment` ADD COLUMN `bank_slip_path` VARCHAR(255) DEFAULT NULL AFTER `payhere_payment_id`");
    }
} catch (Throwable $ignored) {
    // Graceful fallback if table is different or permission restricted
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        // Retrieve orders
        $userId = isset($_GET['user_id']) ? intval($_GET['user_id']) : null;
        $orderId = isset($_GET['order_id']) ? intval($_GET['order_id']) : null;

        if ($orderId) {
            // Get single order with its items & payment
            $stmt = $conn->prepare("
                SELECT o.*, 
                       COALESCE(u.name, 'Customer') as customer_name, 
                       u.email as customer_email, 
                       COALESCE(o.phone, u.phone) as customer_phone,
                       COALESCE(o.delivery_address, u.address) as customer_address,
                       p.payment_id, p.payment_method, p.payment_status, p.payment_date,
                       p.bank_slip_path
                FROM `order` o
                LEFT JOIN user u ON o.user_id = u.user_id
                LEFT JOIN payment p ON o.order_id = p.order_id
                WHERE o.order_id = ?
            ");
            $stmt->execute([$orderId]);
            $order = $stmt->fetch();

            if ($order) {
                // Privacy Check: if user_id is provided, verify that the order belongs to this user
                if ($userId && intval($order['user_id']) !== $userId) {
                    http_response_code(403);
                    echo json_encode(["status" => "error", "message" => "Access denied: You can only view orders placed by your own account."]);
                    exit();
                }

                // Get order items
                $itemsStmt = $conn->prepare("
                    SELECT oi.*, pr.product_name, pr.image, pr.brand, pr.model, pr.price as catalog_price
                    FROM order_item oi
                    LEFT JOIN product pr ON oi.product_id = pr.product_id
                    WHERE oi.order_id = ?
                ");
                $itemsStmt->execute([$orderId]);
                $order['items'] = $itemsStmt->fetchAll();

                echo json_encode(["status" => "success", "data" => $order]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Order not found"]);
            }
        } else {
            // Fetch list of orders
            $sql = "
                SELECT o.*, 
                       COALESCE(u.name, 'Customer') as customer_name, 
                       u.email as customer_email, 
                       COALESCE(o.phone, u.phone) as customer_phone,
                       COALESCE(o.delivery_address, u.address) as customer_address,
                       p.payment_id, p.payment_method, p.payment_status, p.payment_date,
                       p.bank_slip_path
                FROM `order` o
                LEFT JOIN user u ON o.user_id = u.user_id
                LEFT JOIN payment p ON o.order_id = p.order_id
            ";
            $params = [];

            if ($userId) {
                $sql .= " WHERE o.user_id = ?";
                $params[] = $userId;
            }

            $sql .= " ORDER BY o.order_id DESC";

            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            $orders = $stmt->fetchAll();

            // Attach items for each order
            foreach ($orders as &$ord) {
                $itemStmt = $conn->prepare("
                    SELECT oi.*, pr.product_name, pr.image, pr.brand, pr.model
                    FROM order_item oi
                    LEFT JOIN product pr ON oi.product_id = pr.product_id
                    WHERE oi.order_id = ?
                ");
                $itemStmt->execute([$ord['order_id']]);
                $ord['items'] = $itemStmt->fetchAll();
            }

            echo json_encode(["status" => "success", "data" => $orders]);
        }
        break;

    case 'POST':
        // Place COD / Bank Transfer order. Online Card Payment uses payment/start.php.
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $phone = trim((string)($input['phone'] ?? ''));
        $address = trim((string)($input['delivery_address'] ?? ($input['address'] ?? '')));
        $customerName = trim((string)($input['customerName'] ?? ($input['name'] ?? '')));
        $customerEmail = trim((string)($input['email'] ?? ($input['customerEmail'] ?? '')));
        $items = $input['items'] ?? [];
        $paymentMethod = trim((string)($input['payment_method'] ?? ($input['paymentMethod'] ?? 'Cash on Delivery')));

        if (!$phone || !$address || !$customerName || !is_array($items) || count($items) === 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing required order information"]);
            exit();
        }
        if ($paymentMethod === 'Online Card Payment') {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Use PayHere checkout for Online Card Payment"]);
            exit();
        }

        $userId = parseNumericId($input['user_id'] ?? 0);
        try {
            if ($userId > 0) {
                $u = $conn->prepare('SELECT user_id FROM user WHERE user_id = ? LIMIT 1');
                $u->execute([$userId]);
                if (!$u->fetch()) $userId = 0;
            }
            if ($userId === 0 && $customerEmail && filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
                $u = $conn->prepare('SELECT user_id FROM user WHERE email = ? LIMIT 1');
                $u->execute([$customerEmail]);
                $row = $u->fetch();
                if ($row) $userId = (int)$row['user_id'];
            }
            if ($userId === 0) {
                if (!$customerEmail || !filter_var($customerEmail, FILTER_VALIDATE_EMAIL)) {
                    throw new Exception('A valid customer email is required. Please sign in or register first.');
                }
                $u = $conn->prepare('INSERT INTO user (name, email, phone, password, address) VALUES (?, ?, ?, ?, ?)');
                $u->execute([$customerName, $customerEmail, $phone, 'guest123', $address]);
                $userId = (int)$conn->lastInsertId();
            }

            $conn->beginTransaction();
            $verified = [];
            $subtotal = 0.0;
            foreach ($items as $item) {
                $prodId = parseNumericId($item['product_id'] ?? ($item['id'] ?? ($item['numericId'] ?? 0)));
                $qty = (int)($item['quantity'] ?? ($item['qty'] ?? 1));
                if ($prodId <= 0 || $qty <= 0) continue;
                $pstmt = $conn->prepare('SELECT product_id, product_name, price, stock FROM product WHERE product_id = ? LIMIT 1 FOR UPDATE');
                $pstmt->execute([$prodId]);
                $prod = $pstmt->fetch();
                if (!$prod) throw new Exception('Product not found');
                if ((int)$prod['stock'] < $qty) throw new Exception('Not enough stock for: ' . $prod['product_name']);
                $unit = (float)$prod['price'];
                $line = $unit * $qty;
                $subtotal += $line;
                $verified[] = [$prodId, $qty, $unit, $line];
            }
            if (!$verified) throw new Exception('No valid products in order');

            $deliveryFee = ($subtotal > 20000) ? 0.00 : 350.00;
            $totalAmount = round($subtotal + $deliveryFee, 2);
            $orderStmt = $conn->prepare("INSERT INTO `order` (user_id, total_amount, status, phone, delivery_address, stock_restored) VALUES (?, ?, 'Pending', ?, ?, 0)");
            $orderStmt->execute([$userId, $totalAmount, $phone, $address]);
            $orderId = (int)$conn->lastInsertId();

            $itemStmt = $conn->prepare('INSERT INTO order_item (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)');
            $stockStmt = $conn->prepare('UPDATE product SET stock = stock - ? WHERE product_id = ? AND stock >= ?');
            foreach ($verified as [$prodId, $qty, $unit, $line]) {
                $itemStmt->execute([$orderId, $prodId, $qty, $unit, $line]);
                $stockStmt->execute([$qty, $prodId, $qty]);
                if ($stockStmt->rowCount() !== 1) throw new Exception('Stock changed. Please try again.');
            }

            $payStmt = $conn->prepare("INSERT INTO payment (order_id, payment_method, payment_status) VALUES (?, ?, 'Pending')");
            $payStmt->execute([$orderId, $paymentMethod]);
            $paymentId = (int)$conn->lastInsertId();

            $conn->commit();
            echo json_encode(["status" => "success", "message" => "Order placed successfully!", "order_id" => $orderId, "payment_id" => $paymentId, "total_amount" => $totalAmount]);
        } catch (Throwable $e) {
            if ($conn->inTransaction()) $conn->rollBack();
            http_response_code(500);
            echo json_encode(["status" => "error", "message" => "Failed to process order: " . $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update order status & payment status
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['order_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "order_id is required"]);
            exit();
        }

        $orderId = intval($input['order_id']);

        if (!empty($input['status'])) {
            $stmt = $conn->prepare("UPDATE `order` SET status = ? WHERE order_id = ?");
            $stmt->execute([$input['status'], $orderId]);
        }

        if (!empty($input['payment_status'])) {
            $stmt = $conn->prepare("UPDATE payment SET payment_status = ? WHERE order_id = ?");
            $stmt->execute([$input['payment_status'], $orderId]);
        }

        echo json_encode(["status" => "success", "message" => "Order status updated successfully"]);
        break;

    case 'DELETE':
        $orderId = isset($_GET['order_id']) ? intval($_GET['order_id']) : null;
        if (!$orderId) {
            $input = json_decode(file_get_contents('php://input'), true);
            $orderId = intval($input['order_id'] ?? 0);
        }

        if ($orderId <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "order_id is required"]);
            exit();
        }

        $delStmt = $conn->prepare("DELETE FROM `order` WHERE order_id = ?");
        $delStmt->execute([$orderId]);

        echo json_encode(["status" => "success", "message" => "Order deleted successfully"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}

