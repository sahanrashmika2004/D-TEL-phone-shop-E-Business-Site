<?php
/**
 * Categories API Endpoint
 */
require_once __DIR__ . '/db.php';

$stmt = $conn->query("
    SELECT c.*, COUNT(p.product_id) as total_products 
    FROM category c 
    LEFT JOIN product p ON c.category_id = p.category_id 
    GROUP BY c.category_id
    ORDER BY c.category_id ASC
");
$categories = $stmt->fetchAll();

echo json_encode(["status" => "success", "data" => $categories]);
