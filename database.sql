-- ====================================================================
-- Database Schema for E-Business System (ICT2142)
-- Generated strictly according to the ER Diagram
-- Compatible with MySQL / MariaDB (XAMPP / WAMP / phpMyAdmin)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `dtel_mobile_shop` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `dtel_mobile_shop`;

-- Drop existing tables in reverse dependency order
SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS `payment`;
DROP TABLE IF EXISTS `order_item`;
DROP TABLE IF EXISTS `order`;
DROP TABLE IF EXISTS `cart_item`;
DROP TABLE IF EXISTS `cart`;
DROP TABLE IF EXISTS `product`;
DROP TABLE IF EXISTS `category`;
DROP TABLE IF EXISTS `admin`;
DROP TABLE IF EXISTS `user`;
SET FOREIGN_KEY_CHECKS = 1;

-- --------------------------------------------------------------------
-- 1. Table: user
-- Attributes: user_id (PK), name, email, phone, password, address
-- --------------------------------------------------------------------
CREATE TABLE `user` (
    `user_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `phone` VARCHAR(25) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 2. Table: admin
-- Attributes: admin_id (PK), name, email, password, unit_price/phone
-- --------------------------------------------------------------------
CREATE TABLE `admin` (
    `admin_id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(120) NOT NULL UNIQUE,
    `password` VARCHAR(255) NOT NULL,
    `unit_price` DECIMAL(10,2) DEFAULT 0.00,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 3. Table: category
-- Attributes: category_id (PK), category_name, description
-- --------------------------------------------------------------------
CREATE TABLE `category` (
    `category_id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_name` VARCHAR(100) NOT NULL UNIQUE,
    `description` TEXT DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 4. Table: product
-- Attributes: product_id (PK), category_id (FK), admin_id (FK),
--             product_name, price, stock, description, image, status
-- --------------------------------------------------------------------
CREATE TABLE `product` (
    `product_id` INT AUTO_INCREMENT PRIMARY KEY,
    `category_id` INT NOT NULL,
    `admin_id` INT DEFAULT 1,
    `product_name` VARCHAR(255) NOT NULL,
    `brand` VARCHAR(100) DEFAULT 'Generic',
    `model` VARCHAR(100) DEFAULT NULL,
    `price` DECIMAL(12,2) NOT NULL,
    `stock` INT NOT NULL DEFAULT 0,
    `description` TEXT DEFAULT NULL,
    `specs` TEXT DEFAULT NULL,
    `image` VARCHAR(255) DEFAULT 'images/cat-chargers.svg',
    `image_2` VARCHAR(255) DEFAULT NULL,
    `image_3` VARCHAR(255) DEFAULT NULL,
    `status` ENUM('active', 'inactive', 'out_of_stock') DEFAULT 'active',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_product_category` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_product_admin` FOREIGN KEY (`admin_id`) REFERENCES `admin` (`admin_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 5. Table: cart
-- Attributes: cart_id (PK), user_id (FK)
-- --------------------------------------------------------------------
CREATE TABLE `cart` (
    `cart_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL UNIQUE,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_cart_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 6. Table: cart_item
-- Attributes: cart_item_id (PK), cart_id (FK), product_id (FK), quantity, subtotal
-- --------------------------------------------------------------------
CREATE TABLE `cart_item` (
    `cart_item_id` INT AUTO_INCREMENT PRIMARY KEY,
    `cart_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `subtotal` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    CONSTRAINT `fk_cart_item_cart` FOREIGN KEY (`cart_id`) REFERENCES `cart` (`cart_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_cart_item_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 7. Table: order (reserved keyword escaped with backticks)
-- Attributes: order_id (PK), user_id (FK), order_date, total_amount,
--             status, phone, delivery_address
-- --------------------------------------------------------------------
CREATE TABLE `order` (
    `order_id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT NOT NULL,
    `order_date` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `total_amount` DECIMAL(12,2) NOT NULL,
    `status` ENUM('Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled') DEFAULT 'Pending',
    `phone` VARCHAR(25) NOT NULL,
    `delivery_address` TEXT NOT NULL,
    `stock_restored` TINYINT(1) NOT NULL DEFAULT 0,
    CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 8. Table: order_item
-- Attributes: order_item_id (PK), order_id (FK), product_id (FK),
--             quantity, unit_price, subtotal
-- --------------------------------------------------------------------
CREATE TABLE `order_item` (
    `order_item_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `unit_price` DECIMAL(12,2) NOT NULL,
    `subtotal` DECIMAL(12,2) NOT NULL,
    CONSTRAINT `fk_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT `fk_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `product` (`product_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------------------
-- 9. Table: payment
-- Attributes: payment_id (PK), order_id (FK), payment_method, payment_status
-- --------------------------------------------------------------------
CREATE TABLE `payment` (
    `payment_id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` ENUM('Pending', 'Paid', 'Failed', 'Refunded') DEFAULT 'Pending',
    `payment_date` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `payhere_payment_id` VARCHAR(100) DEFAULT NULL,
    CONSTRAINT `uq_payment_payhere_id` UNIQUE (`payhere_payment_id`),
    CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ====================================================================
-- SEED INITIAL SAMPLE DATA
-- ====================================================================

-- 1. Default Admin Account (Email: dtel@gmail.com, Password: Dtel@123)
INSERT INTO `admin` (`admin_id`, `name`, `email`, `password`, `unit_price`) VALUES
(1, 'D-TEL Admin', 'dtel@gmail.com', 'Dtel@123', 0.00);

-- 2. Default Demo User (password: user123)
INSERT INTO `user` (`user_id`, `name`, `email`, `phone`, `password`, `address`) VALUES
(1, 'Kasun Perera', 'kasun@gmail.com', '0771234567', 'user123', 'No 45, Temple Road, Colombo 03, Sri Lanka');

-- 3. Categories (All 6 Standard E-Business Categories)
INSERT INTO `category` (`category_id`, `category_name`, `description`) VALUES
(1, 'Smartphones', 'Flagship & budget 5G smartphones with official warranty and TRCSL approval'),
(2, 'Chargers', 'Fast GaN chargers, wireless charging pads, and heavy-duty MFi cables'),
(3, 'Covers', 'Military grade shockproof cases and ranked 9H tempered protectors (Super D, HD+, MTB)'),
(4, 'Audio', 'Wireless ANC earbuds, studio headphones, and IP67 waterproof speakers'),
(5, 'Power', 'High capacity fast charging and MagSafe wireless power banks'),
(6, 'Accessories', 'High-speed multi-port hubs, magnetic car mounts, AirTags, and lens protectors');

-- 4. Products (Authentic Brand Items + Verified Budget Options in LKR)
INSERT INTO `product` (`product_id`, `category_id`, `admin_id`, `product_name`, `price`, `stock`, `description`, `image`, `status`) VALUES
-- Category 1: Smartphones
(1, 1, 1, 'Apple iPhone 15 Pro Max (256GB Natural Titanium)', 385000.00, 8, 'A17 Pro 3nm chip, Grade 5 Titanium Body, 48MP Main Camera, Action Button, USB-C 3.0', 'images/iphone_15_pro.png', 'active'),
(2, 1, 1, 'Samsung Galaxy S24 Ultra 5G (256GB Titanium)', 315000.00, 7, 'Galaxy AI Circle to Search, Titanium Frame, 200MP Quad Camera, S-Pen Included', 'images/hero_slide_2.jpg', 'active'),
(3, 1, 1, 'Xiaomi 14 Ultra (512GB Leica Quad Edition)', 265000.00, 4, 'Leica Quad 50MP 1-inch Sensor, Snapdragon 8 Gen 3, 90W HyperCharge, Ceramic Back', 'images/xiaomi_14_ultra.svg', 'active'),
(4, 1, 1, 'Google Pixel 9 Pro XL 5G (256GB Obsidian)', 285000.00, 5, 'Google Tensor G4, Built-in Gemini AI Pro, 50MP Triple Camera with 30X Super Res Zoom', 'images/hero_slide_1.jpg', 'active'),
(5, 1, 1, 'Apple iPhone 15 Plus (128GB Blue Dynamic Island)', 245000.00, 9, 'A16 Bionic Chip, Dynamic Island, 48MP Main Camera with 2X Telephoto, 26h Video Battery', 'images/hero_slide_3.jpg', 'active'),
(6, 1, 1, 'Samsung Galaxy A05s (128GB / 6GB RAM - Budget Edition)', 42500.00, 14, '50MP Triple Camera, Snapdragon 680, 5000mAh Battery, 25W Fast Charge, 90Hz FHD+', 'images/samsung_s27_ultra.jpg', 'active'),
(7, 1, 1, 'Xiaomi Redmi 13C (128GB / 6GB RAM - Budget Value Phone)', 36900.00, 16, '50MP AI Dual Camera, MediaTek Helio G85, 5000mAh Battery, 18W Fast Charging', 'images/xiaomi_14_ultra.svg', 'active'),

-- Category 2: Chargers
(8, 2, 1, 'Apple Original 20W USB-C Fast Power Adapter', 5800.00, 35, 'Original Apple 20W Power Delivery, Fast 50% Charge in 30 Mins for iPhone 15 / 16', 'images/apple_20w_adapter.jpg', 'active'),
(9, 2, 1, 'Samsung 25W Super Fast Type-C Wall Adapter (Original)', 4800.00, 28, '25W Super Fast Charging, PD 3.0 PPS, Type-C Output for Galaxy A & S Series', 'images/samsung_45w_charger.jpg', 'active'),
(10, 2, 1, 'Samsung 45W Super Fast Charger 2.0 (with 5A Cable)', 8500.00, 18, '45W Super Fast Charging 2.0, GaN Tech, Includes 5A 1.8m C-to-C Cable', 'images/samsung_45w_charger.jpg', 'active'),
(11, 2, 1, 'Anker 65W GaNPrime 3-Port Fast Wall Charger', 9500.00, 25, '65W Max Output, GaN III Fast Tech, Dual USB-C + USB-A Ports, Compact Folding Plug', 'images/anker_65w_gan.jpg', 'active'),
(12, 2, 1, 'Apple Compatible 20W Fast Charger Adapter (Budget Grade)', 1650.00, 50, 'Standard Foxconn grade 20W USB-C PD power adapter. Pocket-friendly budget replacement charger.', 'images/apple_20w_adapter.jpg', 'active'),
(13, 2, 1, 'Samsung Fast 25W Type-C Travel Adapter (Budget Grade)', 1450.00, 40, 'Economical standard grade 25W fast charger adapter compatible with Galaxy devices.', 'images/samsung_45w_charger.jpg', 'active'),
(14, 2, 1, 'Standard 1m USB-C Fast Charging Data Cable (Budget Grade)', 450.00, 120, '3A Fast Charging, 480Mbps Data Sync, Flexible PVC Jacket, Universal USB-C', 'images/cat-chargers.svg', 'active'),
(15, 2, 1, 'Standard 1m Lightning to USB Cable for iPhone (Budget Grade)', 550.00, 90, '2.4A Fast Charge, Data Sync, Compatible with iPhone 6 to 14 Series', 'images/cat-chargers.svg', 'active'),

-- Category 3: Covers & Tempered Glass
(16, 3, 1, 'Super D 9H Privacy & Curved Edge Tempered Glass (Best Quality)', 1650.00, 50, 'Top Tier: 9H Diamond Strength, 28° Spy Privacy Angle, Anti-Static Dust Proof, 3D Curved Edge', 'images/tempered_glass.svg', 'active'),
(17, 3, 1, 'HD+ Ultra-Clear 9H Tempered Glass Shield (High Quality)', 850.00, 45, 'High Quality Tier: 99.9% Optical Clarity, 9H Anti-Scratch, Oleophobic Anti-Fingerprint', 'images/cat-tempered.svg', 'active'),
(18, 3, 1, 'MTB Matte Anti-Glare Tough Glass Protector (Budget Friendly)', 550.00, 65, 'Standard Tier: Matte Anti-Glare Finish, Smooth Gaming Touch, Anti-Oil Smudge Coating', 'images/tempered_glass.svg', 'active'),
(19, 3, 1, 'Spigen Ultra Hybrid MagFit Clear Shockproof Case', 4500.00, 20, 'Air Cushion Technology, Anti-Yellowing Clear Back, Strong MagSafe Magnetic Connection', 'images/magsafe_case.svg', 'active'),
(20, 3, 1, 'Ultra-Clear Slim TPU Flexible Gel Case (Budget Protection)', 380.00, 150, '0.8mm Ultra-Thin Shock Gel, Non-Slip Grip, Raised Lip Screen & Camera Guard', 'images/magsafe_case.svg', 'active'),

-- Category 4: Audio
(21, 4, 1, 'Apple AirPods Pro (2nd Gen) with USB-C Case', 64500.00, 12, 'H2 Chip, 2X Active Noise Cancellation, Personalized Spatial Audio, MagSafe Charging', 'images/airpods_pro.png', 'active'),
(22, 4, 1, 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones', 88000.00, 6, 'Industry Leading ANC with 8 Microphones, Auto NC Optimizer, 30-Hour Battery, LDAC', 'images/sony_wh1000xm5.svg', 'active'),
(23, 4, 1, 'JBL Flip 6 Waterproof Bluetooth Speaker', 28500.00, 9, '2-Way Speaker System, Deep Bass, IP67 Waterproof & Dustproof, 12-Hour Playtime', 'images/hero_slide_4.jpg', 'active'),
(24, 4, 1, 'Pro Wireless TWS Bluetooth Earbuds (Budget Edition / Air-Pods Style)', 2250.00, 80, 'True Wireless Bluetooth 5.3, Touch Sensor Controls, Charging Case, Mic for Calls', 'images/airpods_pro.png', 'active'),
(25, 4, 1, 'Mini Portable Wireless Bluetooth Speaker (Budget Edition)', 1950.00, 45, 'Punchy Bass, Compact Pocket Size, FM Radio + TF Card Support, 5-Hour Battery', 'images/hero_slide_4.jpg', 'active'),

-- Category 5: Power Banks
(26, 5, 1, 'Anker 10000mAh Magnetic MagGo Power Bank (Kickstand)', 12500.00, 11, '10000mAh Wireless Charging, Strong Magnet Snap, Built-in Foldable Kickstand, 20W PD Wired', 'images/power_bank.svg', 'active'),
(27, 5, 1, 'Xiaomi 20000mAh 50W HyperCharge Power Bank 3 Pro', 8200.00, 12, '50W MAX Fast Charge, 3-Port Output, Low-Current Charging for Earbuds', 'images/power_bank.jpeg', 'active'),
(28, 5, 1, 'Baseus 20000mAh 22.5W Fast Power Bank with LED', 6800.00, 15, '20000mAh Capacity, Digital LED Battery % Display, Dual USB Output, PD 3.0 & SCP 22.5W', 'images/power_bank.jpeg', 'active'),
(29, 5, 1, 'Xiaomi Redmi 10000mAh Dual-USB Fast Power Bank (Budget Edition)', 3450.00, 35, '10,000mAh Li-Po, Dual USB-A Output (2.6A), 12-Layer Advanced Circuit Protection', 'images/power_bank.jpeg', 'active'),
(30, 5, 1, 'Baseus 10000mAh Mini Pocket Power Bank (Budget Series)', 3850.00, 25, '10000mAh Palm-Sized Body, 15W Rapid Charging, 4-Stage LED Battery Level Indicator', 'images/baseus_blade.svg', 'active'),

-- Category 6: Accessories
(31, 6, 1, 'Apple AirTag 4-Pack Precision Finding Tracker', 24500.00, 10, 'Ultra Wideband Precision Finding, Apple Find My Network, IP67 Water & Dust Resistance', 'images/airtag_pack.svg', 'active'),
(32, 6, 1, 'ESR HaloLock Magnetic Wireless Car Charger Mount', 5800.00, 20, 'Strong Magnetic Lock (2,300g force), Fast 15W Wireless Charging, 360° Air Vent & Dash Mount', 'images/esr_car_mount.svg', 'active'),
(33, 6, 1, 'Anker 7-in-1 USB-C Multi-Port Hub Adapter', 8900.00, 14, '4K@30Hz HDMI, 100W Power Delivery In, SD & microSD Card Slots, 3x High-Speed USB-A Ports', 'images/anker_hub.svg', 'active'),
(34, 6, 1, '360° Rotating Magnetic Ring Kickstand & Phone Grip (Budget Grade)', 450.00, 85, 'Zinc Alloy Metal Ring, 360° Free Rotation + 180° Fold, Desktop Kickstand Mode', 'images/cat-other.svg', 'active'),
(35, 6, 1, 'Car Air Vent Gravity Phone Mount Holder (Budget Grade)', 850.00, 60, 'Auto-Clamp Gravity Linkage, One-Hand Drop & Lock, Anti-Scratch Silicone Padding', 'images/esr_car_mount.svg', 'active');

-- 5. User Cart & Initial Cart Item
INSERT INTO `cart` (`cart_id`, `user_id`) VALUES (1, 1);
INSERT INTO `cart_item` (`cart_item_id`, `cart_id`, `product_id`, `quantity`, `subtotal`) VALUES 
(1, 1, 8, 1, 5800.00);

-- 6. Sample Order
INSERT INTO `order` (`order_id`, `user_id`, `order_date`, `total_amount`, `status`, `phone`, `delivery_address`) VALUES
(1001, 1, NOW() - INTERVAL 1 DAY, 64500.00, 'Processing', '0771234567', 'No 45, Temple Road, Colombo 03, Sri Lanka');

-- 7. Sample Order Items
INSERT INTO `order_item` (`order_item_id`, `order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`) VALUES
(1, 1001, 21, 1, 64500.00, 64500.00);

-- 8. Sample Payment
INSERT INTO `payment` (`payment_id`, `order_id`, `payment_method`, `payment_status`) VALUES
(1, 1001, 'Cash on Delivery', 'Pending');
