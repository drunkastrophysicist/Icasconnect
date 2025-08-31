<?php
require_once __DIR__ . '/../config/database.php';

class Event {
    private $db;

    public function __construct() {
        $this->db = getDB();
    }

    public function getAll($filters = []) {
        $query = "SELECT * FROM events WHERE 1=1";
        $params = [];
        if (!empty($filters['event_type'])) {
            $query .= " AND event_type = ?";
            $params[] = $filters['event_type'];
        }
        if (!empty($filters['status'])) {
            $query .= " AND status = ?";
            $params[] = $filters['status'];
        }
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM events WHERE event_id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $eventId = uniqid('event_');
        $stmt = $this->db->prepare(
            "INSERT INTO events (event_id, title, description, start_time, end_time, location_id, max_capacity, event_type, created_by, club_id, image_url, registration_required, registration_deadline, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $eventId,
            $data['title'],
            $data['description'] ?? null,
            $data['start_time'],
            $data['end_time'],
            $data['location_id'] ?? null,
            $data['max_capacity'] ?? null,
            $data['event_type'],
            $data['created_by'],
            $data['club_id'] ?? null,
            $data['image_url'] ?? null,
            $data['registration_required'] ?? true,
            $data['registration_deadline'] ?? null,
            $data['status'] ?? 'upcoming'
        ]);
        return $eventId;
    }

    public function update($id, $data) {
        $query = "UPDATE events SET ";
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
        if (isset($data['start_time'])) {
            $updates[] = "start_time = ?";
            $params[] = $data['start_time'];
        }
        if (isset($data['end_time'])) {
            $updates[] = "end_time = ?";
            $params[] = $data['end_time'];
        }
        if (isset($data['location_id'])) {
            $updates[] = "location_id = ?";
            $params[] = $data['location_id'];
        }
        if (isset($data['max_capacity'])) {
            $updates[] = "max_capacity = ?";
            $params[] = $data['max_capacity'];
        }
        if (isset($data['event_type'])) {
            $updates[] = "event_type = ?";
            $params[] = $data['event_type'];
        }
        if (isset($data['club_id'])) {
            $updates[] = "club_id = ?";
            $params[] = $data['club_id'];
        }
        if (isset($data['image_url'])) {
            $updates[] = "image_url = ?";
            $params[] = $data['image_url'];
        }
        if (isset($data['registration_required'])) {
            $updates[] = "registration_required = ?";
            $params[] = $data['registration_required'];
        }
        if (isset($data['registration_deadline'])) {
            $updates[] = "registration_deadline = ?";
            $params[] = $data['registration_deadline'];
        }
        if (isset($data['status'])) {
            $updates[] = "status = ?";
            $params[] = $data['status'];
        }
        if (empty($updates)) {
            return false;
        }
        $query .= implode(', ', $updates) . " WHERE event_id = ?";
        $params[] = $id;
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return true;
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM events WHERE event_id = ?");
        $stmt->execute([$id]);
        return true;
    }

    public function register($eventId, $userId) {
        $registrationId = uniqid('reg_');
        $stmt = $this->db->prepare(
            "INSERT INTO event_registrations (registration_id, event_id, user_id) 
            VALUES (?, ?, ?)"
        );
        $stmt->execute([$registrationId, $eventId, $userId]);

        $stmt = $this->db->prepare(
            "UPDATE events SET current_registrations = current_registrations + 1 
            WHERE event_id = ?"
        );
        $stmt->execute([$eventId]);
        return $registrationId;
    }

    public function getRegistrations($eventId) {
        $stmt = $this->db->prepare(
            "SELECT u.* FROM event_registrations er JOIN users u ON er.user_id = u.id WHERE er.event_id = ?"
        );
        $stmt->execute([$eventId]);
        return $stmt->fetchAll();
    }

    public function updateAttendance($eventId, $userId, $status) {
        $stmt = $this->db->prepare(
            "SELECT attendance_id FROM event_attendance WHERE event_id = ? AND user_id = ?"
        );
        $stmt->execute([$eventId, $userId]);
        $attendanceId = $stmt->fetchColumn();

        if ($attendanceId) {
            $stmt = $this->db->prepare(
                "UPDATE event_attendance SET status = ? WHERE attendance_id = ?"
            );
            $stmt->execute([$status, $attendanceId]);
        } else {
            $attendanceId = uniqid('attend_');
            $stmt = $this->db->prepare(
                "INSERT INTO event_attendance (attendance_id, event_id, user_id, status) 
                VALUES (?, ?, ?, ?)"
            );
            $stmt->execute([$attendanceId, $eventId, $userId, $status]);
        }
        return $attendanceId;
    }
}
?>