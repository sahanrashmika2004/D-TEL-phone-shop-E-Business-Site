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
    $checkIsOffer = $conn->query("SHOW COLUMNS FROM `product` LIKE 'is_offer'")->fetch();
    if (!$checkIsOffer) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `is_offer` TINYINT(1) NOT NULL DEFAULT 0 AFTER `status`");
    }
    $checkOfferPrice = $conn->query("SHOW COLUMNS FROM `product` LIKE 'offer_price'")->fetch();
    if (!$checkOfferPrice) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `offer_price` DECIMAL(12,2) DEFAULT NULL AFTER `is_offer`");
    }
    $checkOrigPrice = $conn->query("SHOW COLUMNS FROM `product` LIKE 'original_price'")->fetch();
    if (!$checkOrigPrice) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `original_price` DECIMAL(12,2) DEFAULT NULL AFTER `offer_price`");
    }
    $checkQualityGrade = $conn->query("SHOW COLUMNS FROM `product` LIKE 'quality_grade'")->fetch();
    if (!$checkQualityGrade) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `quality_grade` VARCHAR(50) DEFAULT 'Original' AFTER `model`");
    }
    $checkWattage = $conn->query("SHOW COLUMNS FROM `product` LIKE 'wattage'")->fetch();
    if (!$checkWattage) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `wattage` VARCHAR(20) DEFAULT NULL AFTER `quality_grade`");
    }
    $checkConnector = $conn->query("SHOW COLUMNS FROM `product` LIKE 'connector'")->fetch();
    if (!$checkConnector) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `connector` VARCHAR(50) DEFAULT 'USB-C' AFTER `wattage`");
    }
    $checkQualityTier = $conn->query("SHOW COLUMNS FROM `product` LIKE 'quality_tier'")->fetch();
    if (!$checkQualityTier) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `quality_tier` VARCHAR(50) DEFAULT NULL AFTER `connector`");
    }
    $checkTierRank = $conn->query("SHOW COLUMNS FROM `product` LIKE 'tier_rank'")->fetch();
    if (!$checkTierRank) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `tier_rank` INT DEFAULT 99 AFTER `quality_tier`");
    }
    $checkRating = $conn->query("SHOW COLUMNS FROM `product` LIKE 'rating'")->fetch();
    if (!$checkRating) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `rating` DECIMAL(2,1) DEFAULT 4.8 AFTER `status`");
    }
    $checkReviewsCount = $conn->query("SHOW COLUMNS FROM `product` LIKE 'reviews_count'")->fetch();
    if (!$checkReviewsCount) {
        $conn->exec("ALTER TABLE `product` ADD COLUMN `reviews_count` INT DEFAULT 25 AFTER `rating`");
    }
    // Auto-create product_offer dedicated table
    $conn->exec("
        CREATE TABLE IF NOT EXISTS `product_offer` (
            `offer_id` INT AUTO_INCREMENT PRIMARY KEY,
            `product_id` INT NOT NULL,
            `offer_title` VARCHAR(255) DEFAULT 'Special Deal',
            `original_price` DECIMAL(12,2) NOT NULL,
            `offer_price` DECIMAL(12,2) NOT NULL,
            `discount_percent` INT DEFAULT 0,
            `status` ENUM('active', 'inactive') DEFAULT 'active',
            `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            INDEX (`product_id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    ");
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

            $is_offer = isset($_GET['is_offer']) ? intval($_GET['is_offer']) : (isset($_GET['sale']) && $_GET['sale'] === 'true' ? 1 : null);
            if ($is_offer !== null) {
                $sql .= " AND p.is_offer = ?";
                $params[] = $is_offer;
            }

            $sql .= " ORDER BY p.category_id ASC, p.product_id ASC";

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

                // Rich attribute fallbacks for seamless filtering
                if (empty($prod['quality_grade'])) {
                    if (stripos($prod['product_name'], 'budget') !== false || stripos($prod['description'] ?? '', 'budget') !== false || stripos($prod['product_name'], 'compatible') !== false) {
                        $prod['quality_grade'] = 'Budget';
                    } elseif (stripos($prod['product_name'], 'original') !== false || intval($prod['category_id']) === 1) {
                        $prod['quality_grade'] = 'Original';
                    } else {
                        $prod['quality_grade'] = 'High Grade';
                    }
                }

                if (empty($prod['wattage'])) {
                    if (preg_match('/(20W|25W|30W|45W|65W|100W|140W)/i', $prod['product_name'] . ' ' . ($prod['specs'] ?? ''), $wm)) {
                        $prod['wattage'] = strtoupper($wm[1]);
                    }
                }

                if (empty($prod['connector'])) {
                    if (stripos($prod['product_name'], 'lightning') !== false) {
                        $prod['connector'] = 'Lightning';
                    } elseif (stripos($prod['product_name'], 'micro') !== false) {
                        $prod['connector'] = 'Micro USB';
                    } else {
                        $prod['connector'] = 'USB-C';
                    }
                }

                if (empty($prod['quality_tier']) && intval($prod['category_id']) === 3) {
                    if (stripos($prod['product_name'], 'Super D') !== false) {
                        $prod['quality_tier'] = 'Super D';
                        $prod['tier_rank'] = 1;
                    } elseif (stripos($prod['product_name'], 'HD+') !== false) {
                        $prod['quality_tier'] = 'HD+';
                        $prod['tier_rank'] = 2;
                    } elseif (stripos($prod['product_name'], 'MTB') !== false) {
                        $prod['quality_tier'] = 'MTB';
                        $prod['tier_rank'] = 3;
                    }
                }

                if (empty($prod['rating'])) {
                    $prod['rating'] = 4.8;
                } else {
                    $prod['rating'] = floatval($prod['rating']);
                }

                if (empty($prod['reviews_count'])) {
                    $prod['reviews_count'] = 25;
                } else {
                    $prod['reviews_count'] = intval($prod['reviews_count']);
                }
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

        $stockVal = intval($input['stock'] ?? 0);
        // Auto-determine status based on stock
        if (isset($input['status']) && $input['status'] === 'inactive') {
            $status = 'inactive';
        } elseif ($stockVal <= 0) {
            $status = 'out_of_stock';
        } else {
            $status = 'active';
        }

        $isOffer = !empty($input['is_offer']) ? 1 : 0;
        $offerPrice = (isset($input['offer_price']) && is_numeric($input['offer_price']) && floatval($input['offer_price']) > 0)
            ? floatval($input['offer_price'])
            : null;
        $originalPrice = (isset($input['original_price']) && is_numeric($input['original_price']) && floatval($input['original_price']) > 0)
            ? floatval($input['original_price'])
            : (isset($input['oldPrice']) && is_numeric($input['oldPrice']) ? floatval($input['oldPrice']) : null);

        $basePrice = floatval($input['price']);
        $finalPrice = $basePrice;
        if ($isOffer && $offerPrice !== null) {
            $finalPrice = $offerPrice;
            if (!$originalPrice || $originalPrice <= $offerPrice) {
                $originalPrice = $basePrice;
            }
        }

        $qualityGrade = !empty($input['quality_grade']) ? $input['quality_grade'] : (!empty($input['qualityGrade']) ? $input['qualityGrade'] : (intval($input['category_id']) === 1 ? 'Original' : 'High Grade'));
        $wattage = !empty($input['wattage']) ? $input['wattage'] : null;
        $connector = !empty($input['connector']) ? $input['connector'] : 'USB-C';
        $qualityTier = !empty($input['quality_tier']) ? $input['quality_tier'] : (!empty($input['qualityTier']) ? $input['qualityTier'] : null);
        $tierRank = !empty($input['tier_rank']) ? intval($input['tier_rank']) : (!empty($input['tierRank']) ? intval($input['tierRank']) : 99);
        $rating = !empty($input['rating']) ? floatval($input['rating']) : 4.8;
        $reviewsCount = !empty($input['reviews_count']) ? intval($input['reviews_count']) : (!empty($input['reviewsCount']) ? intval($input['reviewsCount']) : 25);

        $stmt = $conn->prepare("
            INSERT INTO product (category_id, admin_id, product_name, brand, model, quality_grade, wattage, connector, quality_tier, tier_rank, price, is_offer, offer_price, original_price, stock, description, specs, image, image_2, image_3, status, rating, reviews_count) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            intval($input['category_id']),
            $admin_id,
            $input['product_name'],
            $brand,
            $model,
            $qualityGrade,
            $wattage,
            $connector,
            $qualityTier,
            $tierRank,
            $finalPrice,
            $isOffer,
            $offerPrice,
            $originalPrice,
            $stockVal,
            $input['description'] ?? '',
            $specs,
            $image,
            $image_2,
            $image_3,
            $status,
            $rating,
            $reviewsCount
        ]);

        $newId = $conn->lastInsertId();

        // If it is an offer, also insert record into product_offer table
        if ($isOffer && $newId) {
            try {
                $discountPercent = ($originalPrice && $originalPrice > $offerPrice)
                    ? round((($originalPrice - $offerPrice) / $originalPrice) * 100)
                    : 0;
                $offerStmt = $conn->prepare("
                    INSERT INTO product_offer (product_id, offer_title, original_price, offer_price, discount_percent, status)
                    VALUES (?, ?, ?, ?, ?, 'active')
                ");
                $offerStmt->execute([
                    $newId,
                    'Special Offer: ' . $input['product_name'],
                    $originalPrice ?: $finalPrice,
                    $offerPrice,
                    $discountPercent
                ]);
            } catch (Exception $oe) {
                error_log('[D-TEL Offer Insert] ' . $oe->getMessage());
            }
        }

        echo json_encode([
            "status" => "success", 
            "message" => "Product created successfully", 
            "product_id" => $newId,
            "data" => [
                "product_id" => $newId,
                "category_id" => intval($input['category_id']),
                "product_name" => $input['product_name'],
                "price" => $finalPrice,
                "is_offer" => $isOffer,
                "offer_price" => $offerPrice,
                "original_price" => $originalPrice,
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

        $stockVal = intval($input['stock'] ?? 0);
        // Auto-determine status: if stock=0 => out_of_stock, else active (unless manually inactive)
        $incomingStatus = $input['status'] ?? 'active';
        if ($incomingStatus === 'inactive') {
            $autoStatus = 'inactive';
        } elseif ($stockVal <= 0) {
            $autoStatus = 'out_of_stock';
        } else {
            $autoStatus = 'active';
        }

        $isOffer = !empty($input['is_offer']) ? 1 : 0;
        $offerPrice = (isset($input['offer_price']) && is_numeric($input['offer_price']) && floatval($input['offer_price']) > 0)
            ? floatval($input['offer_price'])
            : null;
        $originalPrice = (isset($input['original_price']) && is_numeric($input['original_price']) && floatval($input['original_price']) > 0)
            ? floatval($input['original_price'])
            : (isset($input['oldPrice']) && is_numeric($input['oldPrice']) ? floatval($input['oldPrice']) : null);

        $basePrice = floatval($input['price']);
        $finalPrice = $basePrice;
        if ($isOffer && $offerPrice !== null) {
            $finalPrice = $offerPrice;
            if (!$originalPrice || $originalPrice <= $offerPrice) {
                $originalPrice = $basePrice;
            }
        }

        $qualityGrade = !empty($input['quality_grade']) ? $input['quality_grade'] : (!empty($input['qualityGrade']) ? $input['qualityGrade'] : (intval($input['category_id'] ?? 1) === 1 ? 'Original' : 'High Grade'));
        $wattage = !empty($input['wattage']) ? $input['wattage'] : null;
        $connector = !empty($input['connector']) ? $input['connector'] : 'USB-C';
        $qualityTier = !empty($input['quality_tier']) ? $input['quality_tier'] : (!empty($input['qualityTier']) ? $input['qualityTier'] : null);
        $tierRank = !empty($input['tier_rank']) ? intval($input['tier_rank']) : (!empty($input['tierRank']) ? intval($input['tierRank']) : 99);
        $rating = !empty($input['rating']) ? floatval($input['rating']) : 4.8;
        $reviewsCount = !empty($input['reviews_count']) ? intval($input['reviews_count']) : (!empty($input['reviewsCount']) ? intval($input['reviewsCount']) : 25);

        $stmt = $conn->prepare("
            UPDATE product 
            SET category_id = ?, product_name = ?, brand = ?, model = ?, quality_grade = ?, wattage = ?, connector = ?, quality_tier = ?, tier_rank = ?, price = ?, is_offer = ?, offer_price = ?, original_price = ?, stock = ?, description = ?, specs = ?, image = ?, image_2 = ?, image_3 = ?, status = ?, rating = ?, reviews_count = ?
            WHERE product_id = ?
        ");
        $stmt->execute([
            intval($input['category_id'] ?? 1),
            $input['product_name'] ?? $input['name'],
            $brand,
            $model,
            $qualityGrade,
            $wattage,
            $connector,
            $qualityTier,
            $tierRank,
            $finalPrice,
            $isOffer,
            $offerPrice,
            $originalPrice,
            $stockVal,
            $input['description'] ?? '',
            $specs,
            $image,
            $image_2,
            $image_3,
            $autoStatus,
            $rating,
            $reviewsCount,
            $prodId
        ]);

        // Sync product_offer table
        try {
            $conn->prepare("DELETE FROM product_offer WHERE product_id = ?")->execute([$prodId]);
            if ($isOffer) {
                $discountPercent = ($originalPrice && $originalPrice > $offerPrice)
                    ? round((($originalPrice - $offerPrice) / $originalPrice) * 100)
                    : 0;
                $offerStmt = $conn->prepare("
                    INSERT INTO product_offer (product_id, offer_title, original_price, offer_price, discount_percent, status)
                    VALUES (?, ?, ?, ?, ?, 'active')
                ");
                $offerStmt->execute([
                    $prodId,
                    'Special Offer: ' . ($input['product_name'] ?? $input['name']),
                    $originalPrice ?: $finalPrice,
                    $offerPrice,
                    $discountPercent
                ]);
            }
        } catch (Exception $oe) {
            error_log('[D-TEL Offer Sync] ' . $oe->getMessage());
        }

        echo json_encode(["status" => "success", "message" => "Product updated successfully", "product_status" => $autoStatus]);
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

        try {
            $conn->prepare("DELETE FROM product_offer WHERE product_id = ?")->execute([$id]);
        } catch (Exception $de) {}

        echo json_encode(["status" => "success", "message" => "Product deleted successfully"]);
        break;

    default:
        http_response_code(405);
        echo json_encode(["status" => "error", "message" => "Method not allowed"]);
        break;
}
