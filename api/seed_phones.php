<?php
require_once __DIR__ . '/db.php';

try {
    // 1. Ensure Categories 1 to 6 exist
    $conn->exec("
        INSERT IGNORE INTO `category` (`category_id`, `category_name`, `description`) VALUES
        (1, 'Smartphones', 'Flagship & budget 5G smartphones with official warranty and TRCSL approval'),
        (2, 'Chargers', 'Fast GaN chargers, wireless charging pads, and heavy-duty MFi cables'),
        (3, 'Covers', 'Military grade shockproof cases and ranked 9H tempered protectors (Super D, HD+, MTB)'),
        (4, 'Audio', 'Wireless ANC earbuds, studio headphones, and IP67 waterproof speakers'),
        (5, 'Power', 'High capacity fast charging and MagSafe wireless power banks'),
        (6, 'Accessories', 'High-speed multi-port hubs, magnetic car mounts, AirTags, and lens protectors')
    ");

    // 2. Ensure product_id 1 (iPhone 15 Pro Max) and 2 (Galaxy S24 Ultra) exist
    $stmt1 = $conn->prepare("
        INSERT INTO `product` (`product_id`, `category_id`, `admin_id`, `product_name`, `brand`, `model`, `price`, `stock`, `description`, `specs`, `image`, `status`, `is_offer`, `offer_price`, `original_price`) 
        VALUES (1, 1, 1, 'Apple iPhone 15 Pro Max (256GB Natural Titanium)', 'Apple', 'iPhone 15 Pro Max', 385000.00, 8, 'A17 Pro 3nm chip, Grade 5 Titanium Body, 48MP Main Camera, Action Button, USB-C 3.0', 'A17 Pro 3nm Chip, Grade 5 Titanium Body, 48MP Main Camera, Action Button, USB 3.0', 'images/iphone_15_pro.png', 'active', 1, 385000.00, 415000.00)
        ON DUPLICATE KEY UPDATE 
            product_name = VALUES(product_name),
            category_id = VALUES(category_id),
            brand = VALUES(brand),
            model = VALUES(model),
            price = VALUES(price),
            stock = VALUES(stock),
            status = 'active',
            image = VALUES(image),
            is_offer = VALUES(is_offer),
            offer_price = VALUES(offer_price),
            original_price = VALUES(original_price)
    ");
    $stmt1->execute();

    $stmt2 = $conn->prepare("
        INSERT INTO `product` (`product_id`, `category_id`, `admin_id`, `product_name`, `brand`, `model`, `price`, `stock`, `description`, `specs`, `image`, `status`, `is_offer`, `offer_price`, `original_price`) 
        VALUES (2, 1, 1, 'Samsung Galaxy S24 Ultra 5G (256GB Titanium)', 'Samsung', 'Galaxy S24 Ultra', 315000.00, 7, 'Galaxy AI Circle to Search, Titanium Frame, 200MP Quad Camera, S-Pen Included', 'Galaxy AI Circle to Search, Titanium Frame, 200MP Quad Camera, S-Pen Included', 'images/hero_slide_2.jpg', 'active', 1, 315000.00, 340000.00)
        ON DUPLICATE KEY UPDATE 
            product_name = VALUES(product_name),
            category_id = VALUES(category_id),
            brand = VALUES(brand),
            model = VALUES(model),
            price = VALUES(price),
            stock = VALUES(stock),
            status = 'active',
            image = VALUES(image),
            is_offer = VALUES(is_offer),
            offer_price = VALUES(offer_price),
            original_price = VALUES(original_price)
    ");
    $stmt2->execute();

    // 3. Sync product_offer table
    $conn->exec("
        INSERT INTO `product_offer` (`product_id`, `offer_title`, `original_price`, `offer_price`, `discount_percent`, `status`)
        VALUES 
        (1, 'Special Offer: Apple iPhone 15 Pro Max', 415000.00, 385000.00, 7, 'active'),
        (2, 'Special Offer: Samsung Galaxy S24 Ultra 5G', 340000.00, 315000.00, 7, 'active')
        ON DUPLICATE KEY UPDATE offer_price=VALUES(offer_price), status='active'
    ");

    $count = $conn->query("SELECT COUNT(*) FROM product WHERE category_id = 1")->fetchColumn();
    $allCount = $conn->query("SELECT COUNT(*) FROM product")->fetchColumn();

    echo json_encode([
        'status' => 'success',
        'smartphones_count' => intval($count),
        'total_products_count' => intval($allCount)
    ]);
} catch (Exception $e) {
    echo json_encode([
        'status' => 'error',
        'message' => $e->getMessage()
    ]);
}
