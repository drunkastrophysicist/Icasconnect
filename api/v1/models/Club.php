<?php
require_once __DIR__ . '/../config/database.php';

class Club {
    private $db;

    public function __construct() {
        $this->db = getDB();
    }

    public function getAll($filters = []) {
        $query = "SELECT * FROM clubs WHERE 1=1";
        $params = [];
        if (!empty($filters['category'])) {
            $query .= " AND category = ?";
            $params[] = $filters['category'];
        }
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM clubs WHERE club_id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $clubId = uniqid('club_');
        $stmt = $this->db->prepare(
            "INSERT INTO clubs (club_id, club_name, description, category, created_by, created_at, max_members, current_members, image_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $clubId,
            $data['club_name'],
            $data['description'] ?? null,
            $data['category'],
            $data['created_by'],
            date('Y-m-d H:i:s'),
            $data['max_members'] ?? null,
            0,
            $data['image_url'] ?? null
        ]);
        return $clubId;
    }

    public function update($id, $data) {
        $query = "UPDATE clubs SET ";
        $params = [];
        $updates = [];
        if (isset($data['club_name'])) {
            $updates[] = "club_name = ?";
            $params[] = $data['club_name'];
        }
        if (isset($data['description'])) {
            $updates[] = "description = ?";
            $params[] = $data['description'];
        }
        if (isset($data['category'])) {
            $updates[] = "category = ?";
            $params[] = $data['category'];
        }
        if (isset($data['max_members'])) {
            $updates[] = "max_members = ?";
            $params[] = $data['max_members'];
        }
        if (isset($data['image_url'])) {
            $updates[] = "image_url = ?";
            $params[] = $data['image_url'];
        }
        if (empty($updates)) {
            return false;
        }
        $query .= implode(', ', $updates) . " WHERE club_id = ?";
        $params[] = $id;
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return true;
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM clubs WHERE club_id = ?");
        $stmt->execute([$id]);
        return true;
    }

    public function join($clubId, $userId, $role = 'member') {
        $memberId = uniqid('cmember_');
        $stmt = $this->db->prepare(
            "INSERT INTO club_members (club_member_id, club_id, user_id, role, status) 
            VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([$memberId, $clubId, $userId, $role, 'active']);

        $stmt = $this->db->prepare(
            "UPDATE clubs SET current_members = current_members + 1 
            WHERE club_id = ?"
        );
        $stmt->execute([$clubId]);
        return $memberId;
    }

    public function getMembers($clubId) {
        $stmt = $this->db->prepare(
            "SELECT u.* FROM club_members cm JOIN users u ON cm.user_id = u.id WHERE cm.club_id = ?"
        );
        $stmt->execute([$clubId]);
        return $stmt->fetchAll();
    }

    public function createRegistrationRequest($clubId, $userId) {
        $requestId = uniqid('req_');
        $stmt = $this->db->prepare(
            "INSERT INTO club_registration_requests (request_id, club_id, user_id, status, created_at) 
            VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([$requestId, $clubId, $userId, 'pending', date('Y-m-d H:i:s')]);
        return $requestId;
    }

    public function findRegistrationRequest($id) {
        $stmt = $this->db->prepare("SELECT * FROM club_registration_requests WHERE request_id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function updateRegistrationRequest($id, $status) {
        $stmt = $this->db->prepare(
            "UPDATE club_registration_requests SET status = ? WHERE request_id = ?"
        );
        $stmt->execute([$status, $id]);
        return true;
    }
}
?>