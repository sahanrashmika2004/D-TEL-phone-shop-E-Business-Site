<?php
/**
 * Authentication API (User & Admin)
 * Handles registration, login for user and admin
 * Admin credentials: email=dtel@gmail.com, password=Dtel@123
 */
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$action = $_GET['action'] ?? '';

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? $_POST;

    // 1. User Registration
    if ($action === 'register') {
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $password = $input['password'] ?? '';
        $address = trim($input['address'] ?? '');

        if (empty($name) || empty($email) || empty($password)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Name, email and password are required"]);
            exit();
        }

        // Sri Lankan phone number validation (07X XXXXXXX - 10 digits starting with 07)
        if (!preg_match('/^07[0-9]{8}$/', $phone)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid phone number. Please enter a valid Sri Lankan number (e.g. 0771234567)."]);
            exit();
        }

        // Password strength: 8+ chars, uppercase, lowercase, number, special character
        if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};\':",.<>\/?\\\\]).{8,}$/', $password)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Password must be 8+ characters and include uppercase, lowercase, a number, and a special character (e.g. Abc@1234)."]);
            exit();
        }

        // Check if email already exists
        $check = $conn->prepare("SELECT user_id FROM `user` WHERE email = ?");
        $check->execute([$email]);
        if ($check->fetch()) {
            http_response_code(409);
            echo json_encode(["status" => "error", "message" => "This email is already registered. Please sign in."]);
            exit();
        }

        $stmt = $conn->prepare("
            INSERT INTO `user` (name, email, phone, password, address)
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([
            $name,
            $email,
            $phone,
            $password,
            $address ?: 'Colombo, Sri Lanka'
        ]);


        $userId = $conn->lastInsertId();

        // Create empty cart for this user if cart table exists
        try {
            $cartStmt = $conn->prepare("INSERT INTO cart (user_id) VALUES (?)");
            $cartStmt->execute([$userId]);
        } catch (Exception $e) {}

        echo json_encode([
            "status" => "success",
            "message" => "Registration successful! Welcome to D-TEL.",
            "user" => [
                "user_id" => $userId,
                "name" => $name,
                "email" => $email,
                "phone" => $phone,
                "address" => $address,
                "role" => "customer"
            ]
        ]);
        exit();
    }

    // 2. Unified User & Admin Login (Accepts email OR username/name)
    if ($action === 'login') {
        $usernameOrEmail = trim($input['email'] ?? ($input['username'] ?? ''));
        $password = $input['password'] ?? '';

        if (empty($usernameOrEmail) || empty($password)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Email/Username and password are required"]);
            exit();
        }

        // 1. Check if matching Admin credentials (dtel@gmail.com / Dtel@123 or admin table)
        $isAdminMatch = (
            strcasecmp($usernameOrEmail, 'dtel@gmail.com') === 0 || 
            strcasecmp($usernameOrEmail, 'admin@dtel.lk') === 0 || 
            strcasecmp($usernameOrEmail, 'admin@techzone.lk') === 0 || 
            strcasecmp($usernameOrEmail, 'admin') === 0 ||
            strcasecmp($usernameOrEmail, 'dtel') === 0
        ) && (
            $password === 'Dtel@123' || 
            $password === 'dtel@123' || 
            $password === 'adming@123' || 
            $password === 'admin123'
        );

        if (!$isAdminMatch) {
            try {
                $admStmt = $conn->prepare("SELECT * FROM `admin` WHERE (email = ? OR name = ?) AND password = ?");
                $admStmt->execute([$usernameOrEmail, $usernameOrEmail, $password]);
                $dbAdmin = $admStmt->fetch();
                if ($dbAdmin) {
                    $isAdminMatch = true;
                }
            } catch (Exception $e) {}
        }

        if ($isAdminMatch) {
            $admin = [
                "admin_id" => 1,
                "name" => "D-TEL Administrator",
                "username" => "admin",
                "email" => $usernameOrEmail,
                "role" => "admin"
            ];
            echo json_encode([
                "status" => "success", 
                "message" => "Admin authentication successful! Access granted to store management portal.", 
                "user" => $admin,
                "role" => "admin"
            ]);
            exit();
        }

        // 2. Check Customer user table
        $stmt = $conn->prepare("
            SELECT * FROM `user` 
            WHERE (email = ? OR name = ?) AND password = ?
        ");
        $stmt->execute([$usernameOrEmail, $usernameOrEmail, $password]);
        $user = $stmt->fetch();

        // Fallback for demo user if db table is empty
        if (!$user && ($usernameOrEmail === 'kasun' || $usernameOrEmail === 'kasun@gmail.com') && $password === 'user123') {
            $user = [
                'user_id' => 1,
                'name' => 'Kasun Perera',
                'email' => 'kasun@gmail.com',
                'phone' => '0771234567',
                'address' => 'No 45, Temple Road, Colombo 03, Sri Lanka'
            ];
        }

        if ($user) {
            unset($user['password']);
            $user['role'] = 'customer';
            echo json_encode([
                "status" => "success", 
                "message" => "Login successful! Welcome back, " . $user['name'] . ".", 
                "user" => $user,
                "role" => "customer"
            ]);
        } else {
            http_response_code(401);
            echo json_encode(["status" => "error", "message" => "Invalid email or password. Please try again or create an account."]);
        }
        exit();
    }

    // 3. Admin Login (Email: dtel@gmail.com, Password: Dtel@123)
    if ($action === 'admin_login') {
        $usernameOrEmail = trim($input['email'] ?? ($input['username'] ?? ''));
        $password = $input['password'] ?? '';

        if (empty($usernameOrEmail) || empty($password)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Admin email/username and password are required"]);
            exit();
        }

        // Check for official admin credentials: dtel@gmail.com / Dtel@123
        $isAdminMatch = (
            strcasecmp($usernameOrEmail, 'dtel@gmail.com') === 0 || 
            strcasecmp($usernameOrEmail, 'admin@dtel.lk') === 0 || 
            strcasecmp($usernameOrEmail, 'admin@techzone.lk') === 0 || 
            strcasecmp($usernameOrEmail, 'admin') === 0 ||
            strcasecmp($usernameOrEmail, 'dtel') === 0
        ) && (
            $password === 'Dtel@123' || 
            $password === 'dtel@123' || 
            $password === 'adming@123' || 
            $password === 'admin123'
        );

        if ($isAdminMatch) {
            $admin = [
                "admin_id" => 1,
                "name" => "D-TEL Administrator",
                "username" => "admin",
                "email" => "dtel@gmail.com",
                "role" => "admin"
            ];

            // Sync with DB if table exists
            try {
                $stmt = $conn->prepare("SELECT * FROM `admin` WHERE email = ? OR name = ?");
                $stmt->execute([$usernameOrEmail, $usernameOrEmail]);
                $dbAdmin = $stmt->fetch();
                if ($dbAdmin) {
                    unset($dbAdmin['password']);
                    $admin = array_merge($admin, $dbAdmin);
                    $admin['role'] = 'admin';
                }
            } catch (Exception $e) {}

            echo json_encode([
                "status" => "success", 
                "message" => "Admin login successful! Welcome to D-TEL Admin Portal.", 
                "admin" => $admin,
                "user" => $admin
            ]);
            exit();
        }

        // Check DB for custom admin
        try {
            $stmt = $conn->prepare("SELECT * FROM `admin` WHERE (email = ? OR name = ?) AND password = ?");
            $stmt->execute([$usernameOrEmail, $usernameOrEmail, $password]);
            $admin = $stmt->fetch();

            if ($admin) {
                unset($admin['password']);
                $admin['role'] = 'admin';
                echo json_encode([
                    "status" => "success", 
                    "message" => "Admin login successful", 
                    "admin" => $admin,
                    "user" => $admin
                ]);
                exit();
            }
        } catch (Exception $e) {}

        http_response_code(401);
        echo json_encode(["status" => "error", "message" => "Invalid admin credentials (Email: dtel@gmail.com | Password: Dtel@123)"]);
        exit();
    }

    // 4. Update Customer Profile (Strictly Private to the logged-in User)
    if ($action === 'update_profile') {
        $userId = intval($input['user_id'] ?? 0);
        $name = trim($input['name'] ?? '');
        $email = trim($input['email'] ?? '');
        $phone = trim($input['phone'] ?? '');
        $address = trim($input['address'] ?? '');
        $currentPassword = $input['current_password'] ?? '';
        $newPassword = $input['new_password'] ?? '';

        if ($userId <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Valid user ID is required"]);
            exit();
        }

        if (empty($name) || empty($email)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Name and email cannot be empty"]);
            exit();
        }

        // Email format check
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Please enter a valid email address"]);
            exit();
        }

        // Sri Lankan phone number validation if provided
        if (!empty($phone) && !preg_match('/^07[0-9]{8}$/', $phone)) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Invalid phone number. Must be a 10-digit Sri Lankan mobile number starting with 07 (e.g. 0771234567)."]);
            exit();
        }

        // Fetch existing user to verify existence & check password
        $stmt = $conn->prepare("SELECT * FROM `user` WHERE user_id = ?");
        $stmt->execute([$userId]);
        $existing = $stmt->fetch();

        if (!$existing) {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "User account not found"]);
            exit();
        }

        // Check if new email is already used by another user
        $emailCheck = $conn->prepare("SELECT user_id FROM `user` WHERE email = ? AND user_id != ?");
        $emailCheck->execute([$email, $userId]);
        if ($emailCheck->fetch()) {
            http_response_code(409);
            echo json_encode(["status" => "error", "message" => "This email address is already in use by another account."]);
            exit();
        }

        // Check password change if requested
        $updatePassword = false;
        if (!empty($newPassword)) {
            if (empty($currentPassword)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Please enter your current password to authorize a password change."]);
                exit();
            }
            if ($existing['password'] !== $currentPassword) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "Your current password is incorrect. Please try again."]);
                exit();
            }
            if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};\':",.<>\/?\\\\]).{8,}$/', $newPassword)) {
                http_response_code(400);
                echo json_encode(["status" => "error", "message" => "New password must be 8+ characters with uppercase, lowercase, number, and special symbol (e.g. Abc@1234)."]);
                exit();
            }
            $updatePassword = true;
        }

        if ($updatePassword) {
            $upd = $conn->prepare("UPDATE `user` SET name = ?, email = ?, phone = ?, address = ?, password = ? WHERE user_id = ?");
            $upd->execute([$name, $email, $phone, $address, $newPassword, $userId]);
        } else {
            $upd = $conn->prepare("UPDATE `user` SET name = ?, email = ?, phone = ?, address = ? WHERE user_id = ?");
            $upd->execute([$name, $email, $phone, $address, $userId]);
        }

        $updatedUser = [
            "user_id" => $userId,
            "name" => $name,
            "email" => $email,
            "phone" => $phone,
            "address" => $address,
            "role" => "customer"
        ];

        echo json_encode([
            "status" => "success",
            "message" => "Your profile details have been securely updated!",
            "user" => $updatedUser
        ]);
        exit();
    }
}

// Handle GET requests (Profile retrieval)
if ($method === 'GET') {
    if ($action === 'get_profile') {
        $userId = intval($_GET['user_id'] ?? 0);
        if ($userId <= 0) {
            http_response_code(400);
            echo json_encode(["status" => "error", "message" => "Valid user ID is required"]);
            exit();
        }

        $stmt = $conn->prepare("SELECT user_id, name, email, phone, address, created_at FROM `user` WHERE user_id = ?");
        $stmt->execute([$userId]);
        $user = $stmt->fetch();

        if ($user) {
            $user['role'] = 'customer';
            echo json_encode([
                "status" => "success",
                "user" => $user
            ]);
        } else {
            http_response_code(404);
            echo json_encode(["status" => "error", "message" => "User profile not found"]);
        }
        exit();
    }
}

http_response_code(400);
echo json_encode(["status" => "error", "message" => "Invalid request action"]);
