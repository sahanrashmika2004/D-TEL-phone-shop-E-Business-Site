<?php
header('Content-Type: text/html; charset=UTF-8');
require_once __DIR__ . '/../api/db.php';
$orderId = (int)($_GET['order_id'] ?? 0);
$status = 'Pending';
$paymentStatus = 'Pending';
if ($orderId > 0) {
    $stmt = $conn->prepare('SELECT o.status, p.payment_status FROM `order` o LEFT JOIN payment p ON p.order_id=o.order_id WHERE o.order_id=? ORDER BY p.payment_id DESC LIMIT 1');
    $stmt->execute([$orderId]);
    if ($row = $stmt->fetch()) {
        $status = $row['status'] ?? 'Pending';
        $paymentStatus = $row['payment_status'] ?? 'Pending';
    }
}
$paid = ($paymentStatus === 'Paid');
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>D-TEL Payment Result</title><style>body{font-family:Arial,sans-serif;background:#090d16;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0}.box{max-width:620px;width:90%;padding:32px;border:1px solid #334155;border-radius:16px;background:#111827;text-align:center}.ok{color:#22c55e}.wait{color:#f59e0b}a{display:inline-block;margin-top:20px;padding:12px 20px;background:#06b6d4;color:#001018;text-decoration:none;border-radius:8px;font-weight:700}</style></head><body><div class="box"><h1 class="<?php echo $paid ? 'ok' : 'wait'; ?>"><?php echo $paid ? 'Payment Successful' : 'Payment Submitted'; ?></h1><p>Order ID: <strong>#<?php echo htmlspecialchars((string)$orderId); ?></strong></p><p>Payment status: <strong><?php echo htmlspecialchars($paymentStatus); ?></strong></p><p>Order status: <strong><?php echo htmlspecialchars($status); ?></strong></p><?php if (!$paid): ?><p>The payment notification may still be processing. The final status is taken from PayHere’s server notification.</p><?php endif; ?><a href="../index.html">Back to D-TEL</a></div></body></html>
