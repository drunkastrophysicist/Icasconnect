<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthMiddleware {
    public static function handle() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? '';
        
        if (!$authHeader || !preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
            Response::error('Unauthorized: Missing or invalid token', 401);
        }

        try {
            $decoded = JWT::decode($matches[1], new Key($_ENV['JWT_SECRET'], 'HS256'));
            return (array) $decoded;
        } catch (Exception $e) {
            Response::error('Unauthorized: Invalid token', 401);
        }
    }
}
?>