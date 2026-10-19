<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=4307;dbname=dtel_db', 'root', '', [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_TIMEOUT => 5
    ]);
    $stmt = $pdo->query('SELECT product_id, product_name, stock, status FROM product LIMIT 5');
    echo "OK\n";
    while ($r = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo $r['product_id'].': '.$r['product_name'].' | stock='.$r['stock'].' | status='.$r['status']."\n";
    }
} catch (Exception $e) {
    echo "ERROR: ".$e->getMessage();
}
