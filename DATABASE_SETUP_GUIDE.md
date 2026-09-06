# 🗄️ TechZone E-Business System - MySQL Database Setup Guide

ඔබ ලබා දුන් **ER Diagram** එකට අනුව **MySQL Database Schema (`database.sql`)** සහ **PHP Backend API** සාදා අවසන් කර ඇත.

---

## 📊 1. ER Diagram Table Mapping (වගු සම්බන්ධතා)

| Entity / Table | Primary Key | Foreign Keys | Relationship / Details |
| :--- | :--- | :--- | :--- |
| **`user`** | `user_id` | - | Customer profile, login details |
| **`admin`** | `admin_id` | - | Admin account, manage products & orders |
| **`category`** | `category_id` | - | Categories (Smartphones, Chargers, etc.) |
| **`product`** | `product_id` | `category_id`, `admin_id` | Products catalog with stock, price, image |
| **`cart`** | `cart_id` | `user_id` (1:1) | User's active shopping cart |
| **`cart_item`** | `cart_item_id` | `cart_id`, `product_id` (M:1) | Items in user cart with qty & subtotal |
| **`order`** | `order_id` | `user_id` (1:M) | Customer orders with total, status, delivery |
| **`order_item`** | `order_item_id` | `order_id`, `product_id` (M:1) | Ordered product items, unit price & subtotal |
| **`payment`** | `payment_id` | `order_id` (1:1 / 1:M) | Payment record (Method, Payment Status) |

---

## 🚀 2. How to Setup & Import Database in XAMPP / MySQL (පියවරෙන් පියවර)

### පියවර 1: XAMPP Start කරන්න
1. **XAMPP Control Panel** open කරන්න.
2. **Apache** සහ **MySQL** දෙකම **Start** කරන්න.

### පියවර 2: phpMyAdmin වෙත යන්න
1. Browser එකේ `http://localhost/phpmyadmin` වෙත යන්න.
2. උඩ Menu එකෙන් **Import** tab එක click කරන්න.
3. **Choose File** click කර ඔබගේ project folder එකේ ඇති `database.sql` file එක select කරන්න.
4. පහල ඇති **Import / Go** button එක click කරන්න.
5. සාර්ථකව `techzone_db` database එක සහ tables 9 ම නිර්මාණය වේ!

---

## 🔌 3. Backend API Endpoints (`api/`)

| File / Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `api/db.php` | - | PDO MySQL connection setup (`localhost`, `root`, `techzone_db`) |
| `api/products.php` | `GET`, `POST`, `PUT`, `DELETE` | Product CRUD & filtering |
| `api/categories.php`| `GET` | Categories list |
| `api/auth.php` | `POST` | `?action=login`, `?action=register`, `?action=admin_login` |
| `api/cart.php` | `GET`, `POST`, `PUT`, `DELETE` | Cart management (add, update qty, clear) |
| `api/orders.php` | `GET`, `POST`, `PUT` | Place order (with items & payment), update status |
| `api/admin.php` | `GET` | Dashboard statistics (revenue, total orders, stock) |

---

## 🔑 4. Default Login Credentials (පරීක්ෂා කිරීමට)

- **Admin Login:**
  - Email: `admin@techzone.lk`
  - Password: `admin123`
- **Customer Login:**
  - Email: `kasun@gmail.com`
  - Password: `user123`
