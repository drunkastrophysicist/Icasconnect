<?php
require_once __DIR__ . '/../utils/Response.php';

class RoleMiddleware {
    public static function restrictTo($allowedRoles) {
        $decoded = AuthMiddleware::handle();
        if (!in_array($decoded['role'], $allowedRoles)) {
            Response::error('Forbidden: Insufficient permissions', 403);
        }
        return $decoded;
    }
}
?>