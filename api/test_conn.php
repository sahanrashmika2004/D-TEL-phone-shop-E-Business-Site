<?php
try {
    $pdo = new PDO('mysql:host=127.0.0.1;port=4307;dbname=dtel_mobile_shop;charset=utf8mb4','root','');
    echo json_encode(['status'=>'success','message'=>'Connected OK on port 4307']);
} catch(Exception $e) {
    echo json_encode(['status'=>'error','message'=>$e->getMessage()]);
}
