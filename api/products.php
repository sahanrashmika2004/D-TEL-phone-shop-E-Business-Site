<?php
/**
 * Products API Endpoint
 * Handles: GET, POST, PUT, DELETE for Products
 * Supports Multi-Image Views (image, image_2, image_3) and Category Mapping
 */
require_once __DIR__ . '/db.php';

// Auto-Migration check: Ensure image_2 and image_3 columns exist
try {
    $checkCols = $conn->query("SHOW COLUMNS FROM `product` LIKE 'image_2'")->fetch();
    if (!$checkCols) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `image_2` VARCHAR(255) DEFAULT NULL AFTER `image`");
    }
    $checkCols3 = $conn->query("SHOW COLUMNS FROM `product` LIKE 'image_3'")->fetch();
    if (!$checkCols3) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `image_3` VARCHAR(255) DEFAULT NULL AFTER `image_2`");
    }
    $checkBrand = $conn->query("SHOW COLUMNS FROM `product` LIKE 'brand'")->fetch();
    if (!$checkBrand) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `brand` VARCHAR(100) DEFAULT 'Generic' AFTER `product_name`");
    }
    $checkModel = $conn->query("SHOW COLUMNS FROM `product` LIKE 'model'")->fetch();
    if (!$checkModel) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `model` VARCHAR(100) DEFAULT NULL AFTER `brand`");
    }
    $checkSpecs = $conn->query("SHOW COLUMNS FROM `product` LIKE 'specs'")->fetch();
    if (!$checkSpecs) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `specs` TEXT DEFAULT NULL AFTER `description`");
    }
} catch (Exception $e) {
    // Suppress column check errors if permissions restricted
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

switch ($method) {
    case 'GET':
        if (isset($_GET['id'])) {
            $id = parseNumericId($_GET['id']);
            $stmt = $conn->prepare("
                SELECT p.*, c.category_name, a.name AS admin_name 
                FROM product p 
                LEFT JOIN category c ON p.category_id = c.category_id 
                LEFT JOIN admin a ON p.admin_id = a.admin_id 
                WHERE p.product_id = ?
            ");
            $stmt->execute([$id]);
            $product = $stmt->fetch();
            if ($product) {
                echo json_encode(["status" => "success", "data" => $product]);
            } else {
                http_response_code(404);
                echo json_encode(["status" => "error", "message" => "Product not found"]);
            }
        } else {
            $category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;
            $search = isset($_GET['search']) ? '%' . trim($_GET['search']) . '%' : null;
            
            $sql = "
                SELECT p.*, c.category_name 
                FROM product p 
                LEFT JOIN category c ON p.category_id = c.category_id 
                WHERE 1=1
            ";
            $params = [];

            if ($category_id) {
                $sql .= " AND p.category_id = ?";
                $params[] = $category_id;
            }
            if ($search) {
                $sql .= " AND (p.product_name LIKE ? OR p.description LIKE ?)";
                $params[] = $search;
                $params[] = $search;
            }

            $sql .= " ORDER BY p.product_id DESC";

            $stmt = $conn->prepare($sql);
            $stmt->execute($params);
            $products = $stmt->fetchAll();

            $brandNormalizeMap = ['apple' => 'Apple', 'samsung' => 'Samsung', 'xiaomi' => 'Xiaomi', 'google' => 'Google', 'anker' => 'Anker', 'baseus' => 'Baseus', 'esr' => 'ESR', 'jbl' => 'JBL', 'spigen' => 'Spigen', 'sony' => 'Sony'];
            foreach ($products as &$prod) {
                $b = !empty($prod['brand']) ? trim($prod['brand']) : '';
                if (empty($b) || $b === 'Generic') {
                    if (stripos($prod['product_name'], 'iPhone') !== false || stripos($prod['product_name'], 'Apple') !== false || stripos($prod['product_name'], 'AirPods') !== false || stripos($prod['product_name'], 'AirTag') !== false) {
                        $b = 'Apple';
                    } elseif (stripos($prod['product_name'], 'Samsung') !== false || stripos($prod['product_name'], 'Galaxy') !== false) {
                        $b = 'Samsung';
                    } elseif (stripos($prod['product_name'], 'Xiaomi') !== false) {
                        $b = 'Xiaomi';
                    } elseif (stripos($prod['product_name'], 'Pixel') !== false || stripos($prod['product_name'], 'Google') !== false) {
                        $b = 'Google';
                    } elseif (stripos($prod['product_name'], 'Anker') !== false) {
                        $b = 'Anker';
                    } elseif (stripos($prod['product_name'], 'Baseus') !== false) {
                        $b = 'Baseus';
                    } elseif (stripos($prod['product_name'], 'ESR') !== false) {
                        $b = 'ESR';
                    } elseif (stripos($prod['product_name'], 'Spigen') !== false) {
                        $b = 'Spigen';
                    } elseif (stripos($prod['product_name'], 'JBL') !== false) {
                        $b = 'JBL';
                    } elseif (stripos($prod['product_name'], 'Sony') !== false) {
                        $b = 'Sony';
                    }
                }
                $lowerB = strtolower($b);
                $prod['brand'] = isset($brandNormalizeMap[$lowerB]) ? $brandNormalizeMap[$lowerB] : ($b ? ucfirst($b) : 'Generic');
            }
            unset($prod);

            echo json_encode(["status" => "success", "data" => $products]);
        }
        break;

    case 'POST':
        // Add new product
        $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;
        if (empty($input['product_name']) || !isset($input['price']) || empty($input['category_id'])) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Missing required product fields (product_name, price, category_id)"]);
            exit();
        }

        $admin_id = !empty($input['admin_id']) ? intval($input['admin_id']) : 1;
        $status = !empty($input['status']) ? $input['status'] : 'active';
        $image = !empty($input['image']) ? $input['image'] : 'images/cat-chargers.svg';
        $image_2 = !empty($input['image_2']) ? $input['image_2'] : (!empty($input['image2']) ? $input['image2'] : null);
        $image_3 = !empty($input['image_3']) ? $input['image_3'] : (!empty($input['image3']) ? $input['image3'] : null);
        $rawBrand = !empty($input['brand']) ? trim($input['brand']) : 'Generic';
        $knownBrands = ['apple' => 'Apple', 'samsung' => 'Samsung', 'xiaomi' => 'Xiaomi', 'google' => 'Google', 'anker' => 'Anker', 'baseus' => 'Baseus', 'esr' => 'ESR', 'jbl' => 'JBL', 'spigen' => 'Spigen', 'sony' => 'Sony'];
        $brand = isset($knownBrands[strtolower($rawBrand)]) ? $knownBrands[strtolower($rawBrand)] : ucfirst($rawBrand);
        $model = !empty($input['model']) ? $input['model'] : '';
        $specs = !empty($input['specs']) ? $input['specs'] : '';

        $stmt = $conn->prepare("
            INSERT INTO product (category_id, admin_id, product_name, brand, model, price, stock, description, specs, image, image_2, image_3, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            intval($input['category_id']),
            $admin_id,
            $input['product_name'],
            $brand,
            $model,
            floatval($input['price']),
            intval($input['stock'] ?? 0),
            $input['description'] ?? '',
            $specs,
            $image,
            $image_2,
            $image_3,
            $status
        ]);

        $newId = $conn->lastInsertId();
        echo json_encode([
            "status" => "success", 
            "message" => "Product created successfully", 
            "product_id" => $newId,
            "data" => [
                "product_id" => $newId,
                "category_id" => intval($input['category_id']),
                "product_name" => $input['product_name'],
                "image" => $image,
                "image_2" => $image_2,
                "image_3" => $image_3
            ]
        ]);
        break;

    case 'PUT':
        // Update product
        $input = json_decode(file_get_contents('php://input'), true);
        $prodId = parseNumericId($input['product_id'] ?? 0);
        if (!$prodId) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "product_id is required"]);
            exit();
        }

        $image = !empty($input['image']) ? $input['image'] : 'images/cat-chargers.svg';
        $image_2 = !empty($input['image_2']) ? $input['image_2'] : (!empty($input['image2']) ? $input['image2'] : null);
        $image_3 = !empty($input['image_3']) ? $input['image_3'] : (!empty($input['image3']) ? $input['image3'] : null);
        $rawBrand = !empty($input['brand']) ? trim($input['brand']) : 'Generic';
        $knownBrands = ['apple' => 'Apple', 'samsung' => 'Samsung', 'xiaomi' => 'Xiaomi', 'google' => 'Google', 'anker' => 'Anker', 'baseus' => 'Baseus', 'esr' => 'ESR', 'jbl' => 'JBL', 'spigen' => 'Spigen', 'sony' => 'Sony'];
        $brand = isset($knownBrands[strtolower($rawBrand)]) ? $knownBrands[strtolower($rawBrand)] : ucfirst($rawBrand);
        $model = !empty($input['model']) ? $input['model'] : '';
        $specs = !empty($input['specs']) ? $input['specs'] : '';

        $stmt = $conn->prepare("
            UPDATE product 
            SET category_id = ?, product_name = ?, brand = ?, model = ?, price = ?, stock = ?, description = ?, specs = ?, image = ?, image_2 = ?, image_3 = ?, status = ?
            WHERE product_id = ?
        ");
        $stmt->execute([
            intval($input['category_id'] ?? 1),
            $input['product_name'] ?? $input['name'],
            $brand,
            $model,
            floatval($input['price']),
            intval($input['stock'] ?? 0),
            $input['description'] ?? '',
            $specs,
            $image,
            $image_2,
            $image_3,
            $input['status'] ?? 'active',
            $prodId
        ]);

        echo json_encode(["status" => "success", "message" => "Product updated successfully"]);
        break;

    case 'DELETE':
        $rawId = $_GET['id'] ?? null;
        if (!$rawId) {
            $input = json_decode(file_get_contents('php://input'), true);
            $rawId = $input['product_id'] ?? null;
        }

        $id = parseNumericId($rawId);
        if (!$id) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "product_id is required"]);
            exit();
        }

        $stmt = $conn->prepare("DELETE FROM product WHERE product_id = ?");
        $stmt->execute([$id]);

        echo json_encode(["status" => "success", "message" => "Product deleted successfully"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
