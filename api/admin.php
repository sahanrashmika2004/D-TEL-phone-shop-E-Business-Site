<?php
/**
 * Admin API Endpoint
 * Handles: Dashboard metrics, statistics, product & order overview
 */
require_once __DIR__ . '/db.php';

$action = $_GET['action'] ?? 'dashboard';

switch ($action) {
    case 'dashboard':
        // Total revenue
        $revStmt = $conn->query("SELECT COALESCE(SUM(total_amount), 0) as total_revenue FROM `order` WHERE status != 'Cancelled'");
        $totalRevenue = $revStmt->fetch()['total_revenue'];

        // Total orders count
        $orderCountStmt = $conn->query("SELECT COUNT(*) as total_orders FROM `order`");
        $totalOrders = $orderCountStmt->fetch()['total_orders'];

        // Total products count
        $prodCountStmt = $conn->query("SELECT COUNT(*) as total_products FROM `product`");
        $totalProducts = $prodCountStmt->fetch()['total_products'];

        // Out of stock count
        $outStockStmt = $conn->query("SELECT COUNT(*) as out_of_stock FROM `product` WHERE stock <= 0");
        $outOfStock = $outStockStmt->fetch()['out_of_stock'];

        // Total users count
        $userCountStmt = $conn->query("SELECT COUNT(*) as total_users FROM `user`");
        $totalUsers = $userCountStmt->fetch()['total_users'];

        // Recent orders
        $recentOrdersStmt = $conn->query("
            SELECT o.*, 
                   COALESCE(u.name, 'Customer') as customer_name, 
                   u.email as customer_email, 
                   COALESCE(o.phone, u.phone) as customer_phone,
                   p.payment_method, p.payment_status 
            FROM `order` o
            LEFT JOIN user u ON o.user_id = u.user_id
            LEFT JOIN payment p ON o.order_id = p.order_id
            ORDER BY o.order_id DESC 
            LIMIT 10
        ");
        $recentOrders = $recentOrdersStmt->fetchAll();

        echo json_encode([
            "status" => "success",
            "metrics" => [
                "revenue" => floatval($totalRevenue),
                "orders" => intval($totalOrders),
                "products" => intval($totalProducts),
                "out_of_stock" => intval($outOfStock),
                "users" => intval($totalUsers)
            ],
            "recent_orders" => $recentOrders
        ]);
        break;


    case 'customers':
        // Read-only customer directory for the authenticated Admin Dashboard.
        // Passwords are NEVER returned to the browser.
        $stmt = $conn->query("
            SELECT u.user_id, u.name, u.email, u.phone, u.address, u.created_at,
                   COUNT(DISTINCT o.order_id) AS order_count,
                   COALESCE(SUM(CASE WHEN o.status <> 'Cancelled' THEN o.total_amount ELSE 0 END), 0) AS total_spent
            FROM `user` u
            LEFT JOIN `order` o ON o.user_id = u.user_id
            GROUP BY u.user_id, u.name, u.email, u.phone, u.address, u.created_at
            ORDER BY u.user_id DESC
        ");
        $customers = $stmt->fetchAll();
        echo json_encode([
            "status" => "success",
            "count" => count($customers),
            "data" => $customers
        ]);
        break;

    default:
        http_response_code(400);
        echo json_encode(["status" => "error", "message" => "Invalid admin action"]);
        break;
}
