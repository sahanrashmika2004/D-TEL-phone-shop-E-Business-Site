<?php
require_once __DIR__ . '/db.php';
$stmt = $conn->query("SELECT product_id, category_id, product_name, price, stock, status FROM product ORDER BY product_id ASC");
$rows = $stmt->fetchAll();
echo json_encode(['count' => count($rows), 'rows' => $rows]);
