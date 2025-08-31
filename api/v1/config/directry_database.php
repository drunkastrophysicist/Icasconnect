<?php
require_once __DIR__ . '/../vendor/autoload.php';

use Dotenv\Dotenv;

// Only load .env if not already loaded (to avoid reloading in the same request)
if (!isset($_ENV['DIRECTRY_DB_HOST'])) {
    $dotenv = Dotenv::createImmutable(__DIR__ . '/..');
    $dotenv->load();
}

function getDirectoryDB() {
    static $db = null;
    if ($db === null) {
        try {
            $dsn = "mysql:host={$_ENV['DIRECTRY_DB_HOST']};dbname={$_ENV['DIRECTRY_DB_NAME']};charset=utf8mb4";
            $db = new PDO($dsn, $_ENV['DIRECTRY_DB_USER'], $_ENV['DIRECTRY_DB_PASS']);
            $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            die(json_encode(['error' => 'Directory DB connection failed: ' . $e->getMessage()]));
        }
    }
    return $db;
}
?>