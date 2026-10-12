<?php
/**
 * Cart API Endpoint
 * Handles: GET, POST (add item), PUT (update quantity), DELETE (remove item / clear)
 */
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$rawInput = file_get_contents('php://input');
$jsonInput = json_decode($rawInput, true);
$input = is_array($jsonInput) ? $jsonInput : $_POST;

$rawUserId = $_GET['user_id'] ?? ($input['user_id'] ?? ($_POST['user_id'] ?? 1));
$userId = parseNumericId($rawUserId);
if ($userId <= 0) $userId = 1;

// Helper function to get or create cart_id for a user
function getCartId($conn, $userId) {
    // Ensure user exists in user table
    $uChk = $conn->prepare("SELECT user_id FROM user WHERE user_id = ?");
    $uChk->execute([$userId]);
    if (!$uChk->fetch()) {
        $fallback = $conn->query("SELECT user_id FROM user ORDER BY user_id ASC LIMIT 1")->fetch();
        $userId = $fallback ? intval($fallback['user_id']) : 1;
    }

    $stmt = $conn->prepare("SELECT cart_id FROM cart WHERE user_id = ?");
    $stmt->execute([$userId]);
    $cart = $stmt->fetch();
    if ($cart) {
        return $cart['cart_id'];
    }
    $create = $conn->prepare("INSERT INTO cart (user_id) VALUES (?)");
    $create->execute([$userId]);
    return $conn->lastInsertId();
}

$cartId = getCartId($conn, $userId);

switch ($method) {
    case 'GET':
        // Retrieve cart items
        $stmt = $conn->prepare("
            SELECT ci.cart_item_id, ci.cart_id, ci.product_id, ci.quantity, ci.subtotal,
                   p.product_name, p.price, p.image, p.stock, c.category_name
            FROM cart_item ci
            JOIN product p ON ci.product_id = p.product_id
            LEFT JOIN category c ON p.category_id = c.category_id
            WHERE ci.cart_id = ?
        ");
        $stmt->execute([$cartId]);
        $items = $stmt->fetchAll();

        $total = 0;
        foreach ($items as $item) {
            $total += floatval($item['subtotal']);
        }

        echo json_encode([
            "status" => "success",
            "cart_id" => $cartId,
            "items" => $items,
            "total" => $total
        ]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        $productId = parseNumericId($input['product_id'] ?? 0);
        $quantity = intval($input['quantity'] ?? 1);

        if (!$productId || $quantity <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid product_id or quantity"]);
            exit();
        }

        // Get product price
        $prodStmt = $conn->prepare("SELECT price, stock FROM product WHERE product_id = ?");
        $prodStmt->execute([$productId]);
        $prod = $prodStmt->fetch();
        if (!$prod) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "Product not found"]);
            exit();
        }

        $unitPrice = floatval($prod['price']);

        // Check if item already in cart
        $checkStmt = $conn->prepare("SELECT cart_item_id, quantity FROM cart_item WHERE cart_id = ? AND product_id = ?");
        $checkStmt->execute([$cartId, $productId]);
        $existing = $checkStmt->fetch();

        if ($existing) {
            $newQty = $existing['quantity'] + $quantity;
            $newSubtotal = $newQty * $unitPrice;
            $update = $conn->prepare("UPDATE cart_item SET quantity = ?, subtotal = ? WHERE cart_item_id = ?");
            $update->execute([$newQty, $newSubtotal, $existing['cart_item_id']]);
        } else {
            $subtotal = $quantity * $unitPrice;
            $insert = $conn->prepare("INSERT INTO cart_item (cart_id, product_id, quantity, subtotal) VALUES (?, ?, ?, ?)");
            $insert->execute([$cartId, $productId, $quantity, $subtotal]);
        }

        echo json_encode(["status" => "success", "message" => "Item added to cart"]);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $cartItemId = intval($input['cart_item_id'] ?? 0);
        $quantity = intval($input['quantity'] ?? 0);

        if (!$cartItemId) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "cart_item_id required"]);
            exit();
        }

        if ($quantity <= 0) {
            // Remove item
            $del = $conn->prepare("DELETE FROM cart_item WHERE cart_item_id = ? AND cart_id = ?");
            $del->execute([$cartItemId, $cartId]);
            echo json_encode(["status" => "success", "message" => "Item removed from cart"]);
        } else {
            // Get price from product
            $stmt = $conn->prepare("
                SELECT p.price FROM cart_item ci 
                JOIN product p ON ci.product_id = p.product_id 
                WHERE ci.cart_item_id = ?
            ");
            $stmt->execute([$cartItemId]);
            $item = $stmt->fetch();
            if ($item) {
                $subtotal = $quantity * floatval($item['price']);
                $update = $conn->prepare("UPDATE cart_item SET quantity = ?, subtotal = ? WHERE cart_item_id = ? AND cart_id = ?");
                $update->execute([$quantity, $subtotal, $cartItemId, $cartId]);
                echo json_encode(["status" => "success", "message" => "Cart updated"]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Item not found"]);
            }
        }
        break;

    case 'DELETE':
        $cartItemId = isset($_GET['cart_item_id']) ? intval($_GET['cart_item_id']) : null;
        if ($cartItemId) {
            $stmt = $conn->prepare("DELETE FROM cart_item WHERE cart_item_id = ? AND cart_id = ?");
            $stmt->execute([$cartItemId, $cartId]);
            echo json_encode(["status" => "success", "message" => "Item deleted"]);
        } else {
            // Clear entire cart
            $stmt = $conn->prepare("DELETE FROM cart_item WHERE cart_id = ?");
            $stmt->execute([$cartId]);
            echo json_encode(["status" => "success", "message" => "Cart cleared"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
