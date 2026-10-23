<?php
/**
 * Image Upload Endpoint for D-TEL E-Business System
 * Allows Admin to upload product images directly to images/uploads/
 */

require_once __DIR__ . '/db.php';

// Set response header
header('Content-Type: application/json; charset=UTF-8');

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Only POST requests are allowed"]);
    exit();
}

if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    $errorMsg = isset($_FILES['image']) ? "Upload error code: " . $_FILES['image']['error'] : "No image file provided";
    echo json_encode(["status" => "error", "message" => $errorMsg]);
    exit();
}

$file = $_FILES['image'];
$allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'svg', 'gif'];
$maxSize = 10 * 1024 * 1024; // 10MB limit

$fileName = $file['name'];
$fileSize = $file['size'];
$fileTmp  = $file['tmp_name'];

$extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "message" => "Invalid file extension. Allowed formats: JPG, PNG, WEBP, SVG, GIF"
    ]);
    exit();
}

if ($fileSize > $maxSize) {
    http_response_code(400);
    echo json_encode([
        "status" => "error", 
        "message" => "File size exceeds maximum limit of 10MB"
    ]);
    exit();
}

// Uploads target directory
$targetDir = __DIR__ . '/../images/uploads/';
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// Unique filename to prevent overwrite collisions
$newFileName = 'prod_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $extension;
$destination = $targetDir . $newFileName;

if (move_uploaded_file($fileTmp, $destination)) {
    $webPath = 'images/uploads/' . $newFileName;
    
    // Auto-save image directly into MySQL database if product_id is provided
    $autoSaved = false;
    $targetProductId = null;
    $targetSlot = 1;
    if (!empty($_POST['product_id']) || !empty($_REQUEST['product_id'])) {
        $rawPid = $_POST['product_id'] ?? $_REQUEST['product_id'];
        $cleanPid = intval(preg_replace('/[^0-9]/', '', (string)$rawPid));
        $slotNum = intval($_POST['slot'] ?? $_REQUEST['slot'] ?? 1);
        if ($slotNum < 1 || $slotNum > 3) $slotNum = 1;
        $targetSlot = $slotNum;
        
        if ($cleanPid > 0) {
            $colName = ($slotNum === 2) ? 'image_2' : (($slotNum === 3) ? 'image_3' : 'image');
            try {
                $upStmt = $conn->prepare("UPDATE product SET `$colName` = ? WHERE product_id = ?");
                $upStmt->execute([$webPath, $cleanPid]);
                $autoSaved = true;
                $targetProductId = $cleanPid;
            } catch (Exception $dbEx) {
                error_log('[D-TEL Upload Auto-Save Error] ' . $dbEx->getMessage());
            }
        }
    }

    echo json_encode([
        "status" => "success",
        "message" => $autoSaved ? "Image uploaded and auto-saved to database successfully" : "Image uploaded successfully",
        "url" => $webPath,
        "filename" => $newFileName,
        "auto_saved" => $autoSaved,
        "product_id" => $targetProductId,
        "slot" => $targetSlot
    ]);
} else {
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "Failed to save uploaded image to destination directory"
    ]);
}
