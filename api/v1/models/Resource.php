<?php
require_once __DIR__ . '/../config/database.php';

class Resource {
    private $db;

    public function __construct() {
        $this->db = getDB();
    }

    public function getAll($filters = []) {
        $query = "SELECT * FROM resources WHERE 1=1";
        $params = [];
        if (!empty($filters['resource_type'])) {
            $query .= " AND resource_type = ?";
            $params[] = $filters['resource_type'];
        }
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM resources WHERE resource_id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function getByCourse($courseId) {
        $stmt = $this->db->prepare("SELECT * FROM resources WHERE course_id = ?");
        $stmt->execute([$courseId]);
        return $stmt->fetchAll();
    }

    public function create($data) {
        $resourceId = uniqid('resource_');
        $stmt = $this->db->prepare(
            "INSERT INTO resources (resource_id, title, description, resource_type, file_url, course_id, created_by, created_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $resourceId,
            $data['title'],
            $data['description'] ?? null,
            $data['resource_type'],
            $data['file_url'] ?? null,
            $data['course_id'],
            $data['created_by'],
            date('Y-m-d H:i:s')
        ]);
        return $resourceId;
    }

    public function update($id, $data) {
        $query = "UPDATE resources SET ";
        $params = [];
        $updates = [];
        if (isset($data['title'])) {
            $updates[] = "title = ?";
            $params[] = $data['title'];
        }
        if (isset($data['description'])) {
            $updates[] = "description = ?";
            $params[] = $data['description'];
        }
        if (isset($data['resource_type'])) {
            $updates[] = "resource_type = ?";
            $params[] = $data['resource_type'];
        }
        if (isset($data['file_url'])) {
            $updates[] = "file_url = ?";
            $params[] = $data['file_url'];
        }
        if (isset($data['course_id'])) {
            $updates[] = "course_id = ?";
            $params[] = $data['course_id'];
        }
        if (empty($updates)) {
            return false;
        }
        $query .= implode(', ', $updates) . " WHERE resource_id = ?";
        $params[] = $id;
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return true;
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM resources WHERE resource_id = ?");
        $stmt->execute([$id]);
        return true;
    }

    public function addAccessLog($resourceId, $userId) {
        $logId = uniqid('log_');
        $stmt = $this->db->prepare(
            "INSERT INTO resource_access_logs (log_id, resource_id, user_id, access_time) 
            VALUES (?, ?, ?, ?)"
        );
        $stmt->execute([$logId, $resourceId, $userId, date('Y-m-d H:i:s')]);
        return $logId;
    }
}
?>