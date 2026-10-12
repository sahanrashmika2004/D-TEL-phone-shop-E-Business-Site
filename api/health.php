<?php
require_once __DIR__ . '/db.php';
try {
    $row = $conn->query('SELECT 1 AS ok')->fetch();
    echo json_encode([
        'status' => 'success',
        'message' => 'D-TEL API and MySQL connection are working.',
        'database' => 'dtel_mobile_shop',
        'mysql' => (int)$row['ok'] === 1
    ]);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => 'MySQL test failed: ' . $e->getMessage()]);
}
