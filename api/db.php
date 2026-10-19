<?php
/**
 * D-TEL MySQL connection.
 * Optional local overrides: create api/config.local.php (never commit it).
 */
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Content-Type: application/json; charset=UTF-8");

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$config = [
    'host' => getenv('DTEL_DB_HOST') ?: '127.0.0.1',
    'port' => getenv('DTEL_DB_PORT') ?: '4307',
    'name' => getenv('DTEL_DB_NAME') ?: 'dtel_mobile_shop',
    'user' => getenv('DTEL_DB_USER') ?: 'root',
    'pass' => getenv('DTEL_DB_PASS'),
];

// XAMPP commonly uses an empty root password. config.local.php can override it.
if ($config['pass'] === false || $config['pass'] === null) {
    $config['pass'] = '';
}
$localConfig = __DIR__ . '/config.local.php';
if (is_file($localConfig)) {
    $local = require $localConfig;
    if (is_array($local)) $config = array_merge($config, $local);
}

try {
    $conn = new PDO(
        "mysql:host={$config['host']};port={$config['port']};dbname={$config['name']};charset=utf8mb4",
        $config['user'],
        $config['pass'],
        [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
            PDO::ATTR_TIMEOUT            => 3,
            1001                         => 3,    // MYSQL_ATTR_CONNECT_TIMEOUT - prevents hang
            2006                         => 'SET NAMES utf8mb4', // MYSQL_ATTR_INIT_COMMAND
        ]
    );
} catch (PDOException $exception) {
    http_response_code(500);
    echo json_encode([
        'status'  => 'error',
        'message' => 'Database connection failed. Check MySQL is running on port 4307.',
        'detail'  => $exception->getMessage()
    ]);
    exit();

}

function parseNumericId($id) {
    if (is_numeric($id)) return intval($id);
    $digits = preg_replace('/[^0-9]/', '', (string)$id);
    return $digits !== '' ? intval($digits) : 0;
}
?>
