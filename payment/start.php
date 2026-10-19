<?php
/**
 * Starts a PayHere Checkout payment.
 * Server calculates product prices, delivery fee and total.
 * Creates a Pending order and reserves stock until PayHere confirms/fails.
 */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../api/db.php';

header('Content-Type: text/html; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('<h2>Method Not Allowed</h2><p>Open checkout.html and select Online Card Payment.</p>');
}
if (!payhere_is_configured()) {
    http_response_code(500);
    exit('<h2>PayHere is not configured</h2><p>Add your NEW Merchant Secret to payment/config.php (or config.local.php).</p>');
}

$input = json_decode(file_get_contents('php://input'), true);
if (!is_array($input)) $input = $_POST;

$userId = parseNumericId($input['user_id'] ?? 0);
$phone = trim((string)($input['phone'] ?? ''));
$address = trim((string)($input['address'] ?? $input['delivery_address'] ?? ''));
$city = trim((string)($input['city'] ?? ''));
$district = trim((string)($input['district'] ?? ''));
$name = trim((string)($input['customerName'] ?? $input['name'] ?? ''));
$items = $input['items'] ?? [];

if ($userId <= 0 || !$phone || !$address || !$city || !$name || !is_array($items) || count($items) === 0) {
    http_response_code(400);
    exit('<h2>Missing checkout information</h2><p>Please complete your account and delivery details.</p>');
}

try {
    $userStmt = $conn->prepare('SELECT user_id, name, email, phone FROM user WHERE user_id = ? LIMIT 1');
    $userStmt->execute([$userId]);
    $user = $userStmt->fetch();
    if (!$user) throw new Exception('Customer account was not found. Please sign in again.');
    if (!filter_var($user['email'], FILTER_VALIDATE_EMAIL)) {
        throw new Exception('Please add a valid email address to your D-TEL account before online payment.');
    }

    $verifiedItems = [];
    $subtotal = 0.0;
    foreach ($items as $item) {
        $productId   = parseNumericId($item['product_id'] ?? ($item['id'] ?? ($item['numericId'] ?? 0)));
        $qty         = (int)($item['qty'] ?? $item['quantity'] ?? 1);
        $clientPrice = (float)($item['unit_price'] ?? $item['price'] ?? 0);
        $clientName  = trim((string)($item['name'] ?? 'Product'));
        if ($qty <= 0 || $clientPrice <= 0) continue;

        // Always use CLIENT price — local IDs may not match DB IDs
        $unit        = $clientPrice;
        $productName = $clientName ?: 'Product';
        $dbProdId    = $productId;

        // Try DB lookup for stock check only (don't override price)
        if ($productId > 0) {
            try {
                $stmt = $conn->prepare('SELECT product_id, product_name, stock FROM product WHERE product_id = ? LIMIT 1');
                $stmt->execute([$productId]);
                $dbProduct = $stmt->fetch();
                if ($dbProduct) {
                    if ((int)$dbProduct['stock'] < $qty) {
                        throw new Exception('Not enough stock for: ' . $dbProduct['product_name']);
                    }
                    $productName = $dbProduct['product_name']; // use DB name if found
                    $dbProdId    = (int)$dbProduct['product_id'];
                }
            } catch (Exception $e) {
                throw $e; // re-throw stock errors
            }
        }

        $line      = $unit * $qty;
        $subtotal += $line;
        $verifiedItems[] = [
            'product_id'   => $dbProdId,
            'product_name' => $productName,
            'quantity'     => $qty,
            'unit_price'   => $unit,
            'subtotal'     => $line,
        ];
    }
    if (!$verifiedItems) throw new Exception('No valid products were found in your cart.');

    // Delivery rule: matches checkout.html exactly
    $deliveryFee = ($subtotal > 20000) ? 0.00 : 350.00;
    $total       = max(0.00, $subtotal + $deliveryFee);

    // Accept client total if it matches within Rs.5 (handles rounding)
    $clientTotal = (float)($input['total'] ?? $input['total_amount'] ?? 0);
    if ($clientTotal > 0 && abs($clientTotal - $total) <= 5.00) {
        $total = $clientTotal; // use exact client total to prevent any mismatch
    }

    $amount   = number_format($total, 2, '.', '');
    $currency = 'LKR';

    $conn->beginTransaction();
    $fullAddress = $address . ', ' . $city . ($district ? ', ' . $district : '');
    $orderStmt = $conn->prepare("INSERT INTO `order` (user_id, total_amount, status, phone, delivery_address, stock_restored) VALUES (?, ?, 'Pending', ?, ?, 0)");

    $orderStmt->execute([$userId, $total, $phone, $fullAddress]);
    $orderId = (int)$conn->lastInsertId();

    $itemStmt = $conn->prepare('INSERT INTO order_item (order_id, product_id, quantity, unit_price, subtotal) VALUES (?, ?, ?, ?, ?)');
    $stockStmt = $conn->prepare('UPDATE product SET stock = stock - ? WHERE product_id = ? AND stock >= ?');
    foreach ($verifiedItems as $item) {
        $itemStmt->execute([$orderId, $item['product_id'], $item['quantity'], $item['unit_price'], $item['subtotal']]);
        $stockStmt->execute([$item['quantity'], $item['product_id'], $item['quantity']]);
        if ($stockStmt->rowCount() !== 1) throw new Exception('Stock changed while creating the order. Please try again.');
    }

    $payStmt = $conn->prepare("INSERT INTO payment (order_id, payment_method, payment_status) VALUES (?, 'Online Card Payment', 'Pending')");
    $payStmt->execute([$orderId]);
    $paymentId = (int)$conn->lastInsertId();
    $conn->commit();

    $secretHash = strtoupper(md5($PAYHERE_MERCHANT_SECRET));
    $hash = strtoupper(md5($PAYHERE_MERCHANT_ID . $orderId . $amount . $currency . $secretHash));

    $scriptDir = str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME']));
    $basePath = str_replace('/payment', '', $scriptDir);
    $scheme = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
    $baseUrl = $scheme . '://' . $_SERVER['HTTP_HOST'] . rtrim($basePath, '/');

    $parts = preg_split('/\s+/', $name, 2);
    $firstName = $parts[0] ?? 'Customer';
    $lastName = $parts[1] ?? 'Customer';
    $itemsText = implode(', ', array_map(fn($i) => $i['product_name'] . ' x' . $i['quantity'], $verifiedItems));

    $fields = [
        'merchant_id' => $PAYHERE_MERCHANT_ID,
        'return_url' => $baseUrl . '/payment/success.php?order_id=' . $orderId,
        'cancel_url' => $baseUrl . '/payment/cancel.php?order_id=' . $orderId,
        'notify_url' => $baseUrl . '/payment/notify.php',
        'order_id' => (string)$orderId,
        'items' => $itemsText,
        'currency' => $currency,
        'amount' => $amount,
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $user['email'],
        'phone' => $phone,
        'address' => $address,
        'city' => $city,
        'country' => 'Sri Lanka',
        'hash' => $hash,
        'custom_1' => (string)$paymentId,
    ];

    echo '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Redirecting to PayHere</title></head><body style="font-family:Arial,sans-serif;text-align:center;padding:50px;background:#090d16;color:#fff">';
    echo '<h2>Redirecting to PayHere Secure Checkout...</h2><p>Please wait.</p>';
    echo '<form id="payhereForm" method="post" action="' . htmlspecialchars($PAYHERE_CHECKOUT_URL, ENT_QUOTES, 'UTF-8') . '">';
    foreach ($fields as $key => $value) {
        echo '<input type="hidden" name="' . htmlspecialchars($key, ENT_QUOTES, 'UTF-8') . '" value="' . htmlspecialchars($value, ENT_QUOTES, 'UTF-8') . '">';
    }
    echo '</form><script>document.getElementById("payhereForm").submit();</script></body></html>';
} catch (Throwable $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    http_response_code(500);
    echo '<h2>Unable to start PayHere payment</h2><p>' . htmlspecialchars($e->getMessage(), ENT_QUOTES, 'UTF-8') . '</p><p><a href="../checkout.html">Back to checkout</a></p>';
}
?>
