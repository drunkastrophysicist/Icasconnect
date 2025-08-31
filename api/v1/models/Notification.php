<?php
require_once __DIR__ . '/../config/database.php';

class Notification {
    private $db;

    public function __construct() {
        $this->db = getDB();
    }

    public function getAll($userId, $filters = []) {
        $query = "SELECT * FROM notifications WHERE recipient_id = ? OR recipient_id IS NULL";
        $params = [$userId];
        if (!empty($filters['priority'])) {
            $query .= " AND priority = ?";
            $params[] = $filters['priority'];
        }
        if (!empty($filters['status'])) {
            $query .= " AND status = ?";
            $params[] = $filters['status'];
        }
        if (!empty($filters['notification_type'])) {
            $query .= " AND notification_type = ?";
            $params[] = $filters['notification_type'];
        }
        $query .= " ORDER BY created_at DESC LIMIT 100"; // Limit for performance
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function findById($id, $userId) {
        $stmt = $this->db->prepare(
            "SELECT * FROM notifications WHERE notification_id = ? AND (recipient_id = ? OR recipient_id IS NULL)"
        );
        $stmt->execute([$id, $userId]);
        return $stmt->fetch();
    }

    public function create($data) {
        $notificationId = uniqid('notif_');
        $stmt = $this->db->prepare(
            "INSERT INTO notifications (notification_id, title, message, recipient_id, sender_id, priority, status, created_at, notification_type, related_entity_type, related_entity_id) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $notificationId,
            $data['title'],
            $data['message'] ?? null,
            $data['recipient_id'] ?? null,
            $data['sender_id'],
            $data['priority'] ?? 'normal',
            $data['status'] ?? 'unread',
            date('Y-m-d H:i:s'),
            $data['notification_type'] ?? 'general',
            $data['related_entity_type'] ?? null,
            $data['related_entity_id'] ?? null
        ]);
        return $notificationId;
    }

    public function update($id, $data, $userId) {
        $query = "UPDATE notifications SET ";
        $params = [];
        $updates = [];
        if (isset($data['status'])) {
            $updates[] = "status = ?";
            $params[] = $data['status'];
        }
        if (empty($updates)) {
            return false;
        }
        $query .= implode(', ', $updates) . " WHERE notification_id = ? AND (recipient_id = ? OR recipient_id IS NULL)";
        $params[] = $id;
        $params[] = $userId;
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }

    public function delete($id, $userId, $isAdmin) {
        $query = $isAdmin 
            ? "DELETE FROM notifications WHERE notification_id = ?"
            : "DELETE FROM notifications WHERE notification_id = ? AND (recipient_id = ? OR recipient_id IS NULL)";
        $params = $isAdmin ? [$id] : [$id, $userId];
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->rowCount() > 0;
    }
}
?>