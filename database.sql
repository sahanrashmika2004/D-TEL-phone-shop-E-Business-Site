-- ====================================================================
-- Database Schema for E-Business System (ICT2142)
-- Generated strictly according to the ER Diagram
-- Compatible with MySQL / MariaDB (XAMPP / WAMP / phpMyAdmin)
-- ====================================================================

CREATE DATABASE IF NOT EXISTS `techzone_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `techzone_db`;

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
    `price` DECIMAL(12,2) NOT NULL,
    `stock` INT NOT NULL DEFAULT 0,
    `description` TEXT DEFAULT NULL,
    `image` VARCHAR(255) DEFAULT 'images/cat-chargers.svg',
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
    CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- ====================================================================
-- SEED INITIAL SAMPLE DATA
-- ====================================================================

-- 1. Default Admin Account (password: admin123)
INSERT INTO `admin` (`admin_id`, `name`, `email`, `password`, `unit_price`) VALUES
(1, 'System Administrator', 'admin@techzone.lk', 'admin123', 0.00);

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

-- 4. Products (At least 5-7 full detailed products per category = 35 total)
INSERT INTO `product` (`product_id`, `category_id`, `admin_id`, `product_name`, `price`, `stock`, `description`, `image`, `status`) VALUES
-- Category 1: Smartphones (6 products)
(1, 1, 1, 'iPhone 15 Pro Max (256GB Natural Titanium)', 420000.00, 8, 'A17 Pro 3nm chip, Grade 5 Titanium Body, 48MP Main Camera, Action Button, USB-C 3.0', 'images/iphone_15_pro.png', 'active'),
(2, 1, 1, 'Samsung Galaxy S27 Ultra 5G (512GB Titanium)', 465000.00, 6, 'Snapdragon 8 Gen 5, Built-in AI S-Pen, 200MP Quad Camera with Next-Gen Galaxy AI', 'images/samsung_s27_ultra.jpg', 'active'),
(3, 1, 1, 'Xiaomi 14 Ultra (512GB Leica Quad Edition)', 310000.00, 4, 'Leica Quad 50MP 1-inch Sensor, Snapdragon 8 Gen 3, 90W HyperCharge, Ceramic Back', 'images/xiaomi_14_ultra.svg', 'active'),
(4, 1, 1, 'Google Pixel 9 Pro XL 5G (256GB Obsidian)', 385000.00, 5, 'Google Tensor G4, Built-in Gemini AI Pro, 50MP Triple Camera with 30X Super Res Zoom', 'images/hero_slide_1.jpg', 'active'),
(5, 1, 1, 'Samsung Galaxy S24 Ultra 5G (256GB Titanium)', 395000.00, 7, 'Galaxy AI Circle to Search, Titanium Frame, 200MP Quad Camera, S-Pen Included', 'images/hero_slide_2.jpg', 'active'),
(6, 1, 1, 'iPhone 15 Plus (128GB Blue Dynamic Island)', 295000.00, 9, 'A16 Bionic Chip, Dynamic Island, 48MP Main Camera with 2X Telephoto, 26h Video Battery', 'images/hero_slide_3.jpg', 'active'),

-- Category 2: Chargers (7 products)
(7, 2, 1, 'Anker 65W GaN Dual-Port Fast Charger', 12500.00, 25, '65W Max Output, GaN III Fast Tech, Dual USB-C + USB-A Ports, Compact Folding Plug', 'images/chargers.jpeg', 'active'),
(8, 2, 1, 'Baseus 30W Super Si Fast Power Adapter', 6800.00, 30, '30W Fast Charging, Super Si Thermal Control, PD 3.0 & QC 3.0 Compatible', 'images/cat-chargers.svg', 'active'),
(9, 2, 1, 'Apple Original 20W USB-C Power Adapter', 9500.00, 18, 'Original Apple 20W Power Delivery, Fast 50% Charge in 30 Mins for iPhone 15 / 16', 'images/cat-chargers.svg', 'active'),
(10, 2, 1, 'Samsung 25W Super Fast Type-C Adapter', 7900.00, 22, '25W Super Fast Charging, PD 3.0 PPS, Type-C Output for Galaxy A & S Series', 'images/cat-chargers.svg', 'active'),
(11, 2, 1, 'Samsung 45W Super Fast Charger 2.0 (with 5A Cable)', 13500.00, 14, '45W Super Fast Charging 2.0, GaN Tech, Includes 5A 1.8m C-to-C Cable', 'images/cat-chargers.svg', 'active'),
(12, 2, 1, 'Anker PowerLine II Lightning to USB-C Cable (1m)', 4200.00, 40, 'MFi Certified, 20W Fast Charging Support for iPhone 14/13/12/11, Ultra-Durable', 'images/chargers.jpeg', 'active'),
(13, 2, 1, 'Baseus Cafule Micro USB Braided Fast Cable (2m)', 2200.00, 35, '2.4A Fast Charge, High-Density Nylon Braided, Reinforced Aluminum Shell, Micro-USB', 'images/cat-chargers.svg', 'active'),

-- Category 3: Covers & Tempered Glass (6 products)
(14, 3, 1, 'Super D 9H Privacy & Curved Edge Tempered Glass', 4500.00, 50, 'Top Tier: 9H Diamond Strength, 28° Spy Privacy Angle, Anti-Static Dust Proof, 3D Curved Edge', 'images/tempered_glass.svg', 'active'),
(15, 3, 1, 'HD+ Ultra-Clear 9H Tempered Glass Shield', 3200.00, 45, 'High Quality Tier: 99.9% Optical Clarity, 9H Anti-Scratch, Oleophobic Anti-Fingerprint', 'images/cat-tempered.svg', 'active'),
(16, 3, 1, 'MTB Matte Anti-Glare Tough Glass Protector', 2400.00, 35, 'Standard Tier: Matte Anti-Glare Finish, Smooth Gaming Touch, Anti-Oil Smudge Coating', 'images/tempered_glass.svg', 'active'),
(17, 3, 1, 'MagSafe Armor Leather Case for iPhone 15 / 16', 9800.00, 15, 'Genuine European Leather, Built-in MagSafe Magnet Array, Raised Camera Lip', 'images/magsafe_case.jpg', 'active'),
(18, 3, 1, 'Spigen Ultra Hybrid MagFit Clear Shockproof Case', 8500.00, 20, 'Air Cushion Technology, Anti-Yellowing Clear Back, Strong MagSafe Magnetic Connection', 'images/magsafe_case.svg', 'active'),
(19, 3, 1, 'ESR HaloLock Kickstand Shockproof Armor Case', 7200.00, 16, 'Built-in Zinc-Alloy Camera Guard Kickstand, Strong 1500g Magnetic Lock', 'images/magsafe_case.svg', 'active'),

-- Category 4: Audio (6 products)
(20, 4, 1, 'Apple AirPods Pro (2nd Gen) with USB-C Case', 78000.00, 12, 'H2 Chip, 2X Active Noise Cancellation, Personalized Spatial Audio, MagSafe Charging', 'images/airpods_pro.png', 'active'),
(21, 4, 1, 'JBL Flip 6 Waterproof Bluetooth Speaker', 36500.00, 9, '2-Way Speaker System, Deep Bass, IP67 Waterproof & Dustproof, 12-Hour Playtime', 'images/hero_slide_4.jpg', 'active'),
(22, 4, 1, 'Sony WH-1000XM5 Wireless Noise-Cancelling Headphones', 115000.00, 6, 'Industry Leading ANC with 8 Microphones, Auto NC Optimizer, 30-Hour Battery, LDAC', 'images/sony_wh1000xm5.svg', 'active'),
(23, 4, 1, 'Samsung Galaxy Buds 2 Pro (360 Audio / ANC)', 48000.00, 14, '24-bit Hi-Fi Studio Sound, Intelligent ANC with 3 High SNR Mics, 360 Audio Dolby Atmos', 'images/galaxy_buds2_pro.svg', 'active'),
(24, 4, 1, 'Anker Soundcore Life Q30 Hybrid ANC Headphones', 24500.00, 18, 'Advanced Hybrid Active Noise Cancelling (3 Modes), Hi-Res Audio Certified, 40-Hour ANC Battery', 'images/sony_wh1000xm5.svg', 'active'),
(25, 4, 1, 'JBL Clip 4 Ultra-Portable Waterproof Speaker', 18500.00, 15, 'Integrated Carabiner Clip, Rich JBL Original Pro Sound, IP67 Waterproof, 10-Hour Playtime', 'images/hero_slide_4.jpg', 'active'),

-- Category 5: Power Banks (5 products)
(26, 5, 1, 'Baseus 20000mAh 22.5W Fast Power Bank with LED', 14200.00, 15, '20000mAh Capacity, Digital LED Battery % Display, Dual USB Output, PD 3.0 & SCP 22.5W', 'images/power_bank.jpeg', 'active'),
(27, 5, 1, 'Anker 10000mAh Magnetic MagGo Power Bank', 21500.00, 11, '10000mAh Wireless Charging, Strong Magnet Snap, Built-in Foldable Kickstand, 20W PD Wired', 'images/power_bank.svg', 'active'),
(28, 5, 1, 'Baseus Blade 100W Ultra-Slim Laptop Power Bank', 26500.00, 8, '100W High Power Output, 20000mAh Capacity, Ultra-Thin 18mm Body, Smart Status Display', 'images/baseus_blade.svg', 'active'),
(29, 5, 1, 'Xiaomi 20000mAh 50W HyperCharge Power Bank 3 Pro', 16800.00, 12, '50W MAX Fast Charge, 3-Port Output, Low-Current Charging for Earbuds', 'images/power_bank.jpeg', 'active'),
(30, 5, 1, 'Anker PowerCore 737 24000mAh 140W GaN Power Bank', 38500.00, 6, '140W Ultra-Powerful Two-Way Fast Charge, Smart Color Digital Display, GaNPrime 24,000mAh Battery', 'images/power_bank.svg', 'active'),

-- Category 6: Accessories (5 products)
(31, 6, 1, 'ESR HaloLock Magnetic Wireless Car Charger Mount', 8900.00, 20, 'Strong Magnetic Lock (2,300g force), Fast 15W Wireless Charging, 360° Air Vent & Dash Mount', 'images/esr_car_mount.svg', 'active'),
(32, 6, 1, 'Anker 7-in-1 USB-C Multi-Port Hub Adapter', 14500.00, 14, '4K@30Hz HDMI, 100W Power Delivery In, SD & microSD Card Slots, 3x High-Speed USB-A Ports', 'images/anker_hub.svg', 'active'),
(33, 6, 1, 'Baseus MagSafe 360° Rotating Ring Stand & Grip Holder', 3500.00, 30, 'Double Ring Dual Angle Kickstand, Strong N52 Magnets, Premium Zinc Alloy', 'images/cat-other.svg', 'active'),
(34, 6, 1, 'Spigen Optik Pro Camera Lens Protector (2-Pack)', 4800.00, 25, '9H Hardness Tempered Glass, Aluminum Alloy Metal Ring, Anti-Reflective Night Flash Coating', 'images/cat-other.svg', 'active'),
(35, 6, 1, 'Apple AirTag 4-Pack Precision Finding Tracker', 34000.00, 10, 'Ultra Wideband Precision Finding, Apple Find My Network, IP67 Water & Dust Resistance', 'images/airtag_pack.svg', 'active');

-- 5. User Cart & Initial Cart Item
INSERT INTO `cart` (`cart_id`, `user_id`) VALUES (1, 1);
INSERT INTO `cart_item` (`cart_item_id`, `cart_id`, `product_id`, `quantity`, `subtotal`) VALUES 
(1, 1, 7, 1, 12500.00);

-- 6. Sample Order
INSERT INTO `order` (`order_id`, `user_id`, `order_date`, `total_amount`, `status`, `phone`, `delivery_address`) VALUES
(1001, 1, NOW() - INTERVAL 1 DAY, 78000.00, 'Processing', '0771234567', 'No 45, Temple Road, Colombo 03, Sri Lanka');

-- 7. Sample Order Items
INSERT INTO `order_item` (`order_item_id`, `order_id`, `product_id`, `quantity`, `unit_price`, `subtotal`) VALUES
(1, 1001, 20, 1, 78000.00, 78000.00);

-- 8. Sample Payment
INSERT INTO `payment` (`payment_id`, `order_id`, `payment_method`, `payment_status`) VALUES
(1, 1001, 'Cash on Delivery', 'Pending');
