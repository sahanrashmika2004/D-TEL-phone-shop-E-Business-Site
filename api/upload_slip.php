<?php
/**
 * Bank Slip / PDF Receipt Upload Endpoint - D-TEL Mobile Shop
 * Handles customer deposit slip uploads for Bank Transfer orders
 * Accepts: PDF, JPG, JPEG, PNG, WEBP (Max 10MB)
 * Saves to: images/uploads/bank_slips/
 * Updates: payment.bank_slip_path in database
 */

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=UTF-8');

// Ensure bank_slip_path column exists in payment table (auto-migration)
try {
    $colCheck = $conn->query("SHOW COLUMNS FROM `payment` LIKE 'bank_slip_path'");
    if ($colCheck && $colCheck->rowCount() === 0) {
        $conn->exec("ALTER TABLE `payment` ADD COLUMN `bank_slip_path` VARCHAR(255) DEFAULT NULL AFTER `payhere_payment_id`");
    }
} catch (Throwable $ignored) {
    // Column might already exist or user lacks ALTER permissions; proceed gracefully
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    echo json_encode(["status" => "error", "message" => "Only POST requests are allowed"]);
    exit();
}

$orderId = isset($_POST['order_id']) ? intval($_POST['order_id']) : 0;
if ($orderId <= 0) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => "Valid order_id is required"]);
    exit();
}

$fileField = isset($_FILES['bank_slip']) ? 'bank_slip' : (isset($_FILES['slip']) ? 'slip' : null);
if (!$fileField || !isset($_FILES[$fileField]) || $_FILES[$fileField]['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    $errorCode = isset($_FILES[$fileField]) ? $_FILES[$fileField]['error'] : 'no_file';
    echo json_encode(["status" => "error", "message" => "No slip file uploaded or upload error occurred (code: $errorCode)"]);
    exit();
}

$file = $_FILES[$fileField];
$allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'webp'];
$maxSize = 10 * 1024 * 1024; // 10MB limit

$fileName = $file['name'];
$fileSize = $file['size'];
$fileTmp  = $file['tmp_name'];

$extension = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));

if (!in_array($extension, $allowedExtensions)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Invalid file format. Only PDF, JPG, JPEG, PNG, and WEBP files are accepted."
    ]);
    exit();
}

if ($fileSize > $maxSize) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "File size exceeds 10MB limit. Please upload a smaller file."
    ]);
    exit();
}

// Target folder: images/uploads/bank_slips/
$targetDir = __DIR__ . '/../images/uploads/bank_slips/';
if (!is_dir($targetDir)) {
    mkdir($targetDir, 0777, true);
}

// Generate secure unique filename
$randomSuffix = bin2hex(random_bytes(4));
$newFileName = 'slip_ord' . $orderId . '_' . time() . '_' . $randomSuffix . '.' . $extension;
$destination = $targetDir . $newFileName;

if (!move_uploaded_file($fileTmp, $destination)) {
    http_response_code(500);
    echo json_encode(["status" => "error", "message" => "Failed to save bank slip to storage directory"]);
    exit();
}

$webPath = 'images/uploads/bank_slips/' . $newFileName;

// Update payment record in database
try {
    // Check if payment row already exists for this order
    $checkStmt = $conn->prepare("SELECT payment_id FROM `payment` WHERE `order_id` = ? LIMIT 1");
    $checkStmt->execute([$orderId]);
    $payRow = $checkStmt->fetch();

    if ($payRow) {
        $upd = $conn->prepare("UPDATE `payment` SET `bank_slip_path` = ? WHERE `order_id` = ?");
        $upd->execute([$webPath, $orderId]);
    } else {
        $ins = $conn->prepare("INSERT INTO `payment` (`order_id`, `payment_method`, `payment_status`, `bank_slip_path`) VALUES (?, 'Bank Transfer', 'Pending', ?)");
        $ins->execute([$orderId, $webPath]);
    }

    echo json_encode([
        "status" => "success",
        "message" => "Bank slip uploaded and saved successfully",
        "slip_path" => $webPath,
        "order_id" => $orderId
    ]);
} catch (Throwable $e) {
    // File was saved, but DB record update failed
    http_response_code(500);
    echo json_encode([
        "status" => "error",
        "message" => "File uploaded but failed to update database: " . $e->getMessage(),
        "slip_path" => $webPath
    ]);
}
