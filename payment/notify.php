<?php
/** PayHere server-to-server notification endpoint. */
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/../api/db.php';
header('Content-Type: text/plain; charset=UTF-8');

$merchantId = trim((string)($_POST['merchant_id'] ?? ''));
$orderId = (int)($_POST['order_id'] ?? 0);
$payherePaymentId = trim((string)($_POST['payment_id'] ?? ''));
$amount = trim((string)($_POST['payhere_amount'] ?? ''));
$currency = strtoupper(trim((string)($_POST['payhere_currency'] ?? '')));
$statusCode = trim((string)($_POST['status_code'] ?? ''));
$md5sig = strtoupper(trim((string)($_POST['md5sig'] ?? '')));

if (!$merchantId || $orderId <= 0 || !$amount || !$currency || $statusCode === '' || !$md5sig) {
    http_response_code(400); exit('Missing payment notification fields');
}
if ((string)$merchantId !== (string)$PAYHERE_MERCHANT_ID) {
    http_response_code(400); exit('Invalid merchant');
}

$localSig = strtoupper(md5($merchantId . $orderId . $amount . $currency . $statusCode . strtoupper(md5($PAYHERE_MERCHANT_SECRET))));
if (!hash_equals($localSig, $md5sig)) {
    http_response_code(400); exit('Invalid payment signature');
}
if ($currency !== 'LKR') {
    http_response_code(400); exit('Invalid currency');
}

try {
    $conn->beginTransaction();

    $orderStmt = $conn->prepare("SELECT order_id, total_amount, status, stock_restored FROM `order` WHERE order_id = ? FOR UPDATE");
    $orderStmt->execute([$orderId]);
    $order = $orderStmt->fetch();
    if (!$order) throw new Exception('Order not found');

    if (number_format((float)$order['total_amount'], 2, '.', '') !== number_format((float)$amount, 2, '.', '')) {
        throw new Exception('Payment amount does not match order amount');
    }

    $payStmt = $conn->prepare("SELECT payment_id, payment_status FROM payment WHERE order_id = ? ORDER BY payment_id DESC LIMIT 1 FOR UPDATE");
    $payStmt->execute([$orderId]);
    $payment = $payStmt->fetch();
    if (!$payment) throw new Exception('Payment record not found');

    if ($payherePaymentId !== '') {
        $idStmt = $conn->prepare("UPDATE payment SET payhere_payment_id = ? WHERE payment_id = ?");
        $idStmt->execute([$payherePaymentId, $payment['payment_id']]);
    }

    if ($statusCode === '2') {
        $stmt = $conn->prepare("UPDATE payment SET payment_status = 'Paid', payment_date = CURRENT_TIMESTAMP WHERE payment_id = ?");
        $stmt->execute([$payment['payment_id']]);
        $stmt = $conn->prepare("UPDATE `order` SET status = 'Processing' WHERE order_id = ? AND status <> 'Delivered'");
        $stmt->execute([$orderId]);
    } elseif ($statusCode === '-1' || $statusCode === '-2' || $statusCode === '-3') {
        $stmt = $conn->prepare("UPDATE payment SET payment_status = 'Failed', payment_date = CURRENT_TIMESTAMP WHERE payment_id = ?");
        $stmt->execute([$payment['payment_id']]);

        // Stock was reserved when the PayHere order was created. Restore it only once.
        if ((int)$order['stock_restored'] === 0) {
            $itemsStmt = $conn->prepare('SELECT product_id, quantity FROM order_item WHERE order_id = ?');
            $itemsStmt->execute([$orderId]);
            $restoreStmt = $conn->prepare('UPDATE product SET stock = stock + ? WHERE product_id = ?');
            foreach ($itemsStmt->fetchAll() as $item) {
                $restoreStmt->execute([(int)$item['quantity'], (int)$item['product_id']]);
            }
            $markStmt = $conn->prepare("UPDATE `order` SET stock_restored = 1, status = 'Cancelled' WHERE order_id = ?");
            $markStmt->execute([$orderId]);
        } else {
            $markStmt = $conn->prepare("UPDATE `order` SET status = 'Cancelled' WHERE order_id = ?");
            $markStmt->execute([$orderId]);
        }
    }

    $conn->commit();
    http_response_code(200);
    echo 'OK';
} catch (Throwable $e) {
    if ($conn->inTransaction()) $conn->rollBack();
    http_response_code(400);
    echo 'Notification rejected: ' . $e->getMessage();
}
?>
