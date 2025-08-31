<?php
require_once __DIR__ . '/../config/database.php';

class Batch {
    private $db;

    public function __construct() {
        $this->db = getDB();
    }

    public function getAll($courseId) {
        $stmt = $this->db->prepare("SELECT * FROM batches WHERE course_id = ?");
        $stmt->execute([$courseId]);
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM batches WHERE batch_id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $batchId = uniqid('batch_');
        $stmt = $this->db->prepare(
            "INSERT INTO batches (batch_id, course_id, batch_name, start_date, end_date, created_by, max_capacity, current_enrollment) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $batchId,
            $data['course_id'],
            $data['batch_name'],
            $data['start_date'],
            $data['end_date'] ?? null,
            $data['created_by'],
            $data['max_capacity'] ?? null,
            0
        ]);
        return $batchId;
    }

    public function update($id, $data) {
        $query = "UPDATE batches SET ";
        $params = [];
        $updates = [];
        if (isset($data['batch_name'])) {
            $updates[] = "batch_name = ?";
            $params[] = $data['batch_name'];
        }
        if (isset($data['start_date'])) {
            $updates[] = "start_date = ?";
            $params[] = $data['start_date'];
        }
        if (isset($data['end_date'])) {
            $updates[] = "end_date = ?";
            $params[] = $data['end_date'];
        }
        if (isset($data['max_capacity'])) {
            $updates[] = "max_capacity = ?";
            $params[] = $data['max_capacity'];
        }
        if (empty($updates)) {
            return false;
        }
        $query .= implode(', ', $updates) . " WHERE batch_id = ?";
        $params[] = $id;
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return true;
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM batches WHERE batch_id = ?");
        $stmt->execute([$id]);
        return true;
    }

    public function addMember($batchId, $userId) {
        $stmt = $this->db->prepare(
            "INSERT INTO batch_members (batch_id, user_id, role) VALUES (?, ?, ?)"
        );
        $stmt->execute([$batchId, $userId, 'student']);

        $stmt = $this->db->prepare(
            "UPDATE batches SET current_enrollment = current_enrollment + 1 WHERE batch_id = ?"
        );
        $stmt->execute([$batchId]);
    }

    public function getMembers($batchId) {
        $stmt = $this->db->prepare(
            "SELECT u.* FROM batch_members bm JOIN users u ON bm.user_id = u.id WHERE bm.batch_id = ?"
        );
        $stmt->execute([$batchId]);
        return $stmt->fetchAll();
    }
}
?>