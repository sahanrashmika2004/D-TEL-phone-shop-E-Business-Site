<?php
header('Content-Type: text/html; charset=UTF-8');
require_once __DIR__ . '/../api/db.php';
$orderId = (int)($_GET['order_id'] ?? 0);
if ($orderId > 0) {
    $stmt = $conn->prepare("UPDATE payment SET payment_status='Failed' WHERE order_id=? AND payment_status='Pending'");
    $stmt->execute([$orderId]);
}
?><!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>D-TEL Payment Cancelled</title><style>body{font-family:Arial,sans-serif;background:#090d16;color:#fff;display:grid;place-items:center;min-height:100vh;margin:0}.box{max-width:620px;width:90%;padding:32px;border:1px solid #334155;border-radius:16px;background:#111827;text-align:center}a{display:inline-block;margin-top:20px;padding:12px 20px;background:#06b6d4;color:#001018;text-decoration:none;border-radius:8px;font-weight:700}</style></head><body><div class="box"><h1>Payment Cancelled</h1><p>Your PayHere payment was cancelled or not completed.</p><a href="../checkout.html">Return to Checkout</a></div></body></html>
