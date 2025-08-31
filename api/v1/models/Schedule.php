<?php
require_once __DIR__ . '/../config/database.php';

class Schedule {
    private $db;

    public function __construct() {
        $this->db = getDB();
    }

    public function getAll($filters = []) {
        $query = "SELECT * FROM schedules WHERE 1=1";
        $params = [];
        if (!empty($filters['schedule_type'])) {
            $query .= " AND schedule_type = ?";
            $params[] = $filters['schedule_type'];
        }
        if (!empty($filters['batch_id'])) {
            $query .= " AND batch_id = ?";
            $params[] = $filters['batch_id'];
        }
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM schedules WHERE schedule_id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $scheduleId = uniqid('sched_');
        $stmt = $this->db->prepare(
            "INSERT INTO schedules (schedule_id, batch_id, schedule_type, created_by, created_at) 
            VALUES (?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $scheduleId,
            $data['batch_id'],
            $data['schedule_type'],
            $data['created_by'],
            date('Y-m-d H:i:s')
        ]);
        return $scheduleId;
    }

    public function update($id, $data) {
        $query = "UPDATE schedules SET ";
        $params = [];
        $updates = [];
        if (isset($data['batch_id'])) {
            $updates[] = "batch_id = ?";
            $params[] = $data['batch_id'];
        }
        if (isset($data['schedule_type'])) {
            $updates[] = "schedule_type = ?";
            $params[] = $data['schedule_type'];
        }
        if (empty($updates)) {
            return false;
        }
        $query .= implode(', ', $updates) . " WHERE schedule_id = ?";
        $params[] = $id;
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return true;
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM schedules WHERE schedule_id = ?");
        $stmt->execute([$id]);
        return true;
    }

    public function getEvents($scheduleId) {
        $stmt = $this->db->prepare(
            "SELECT * FROM schedule_events WHERE schedule_id = ?"
        );
        $stmt->execute([$scheduleId]);
        return $stmt->fetchAll();
    }

    public function addEvent($data) {
        $eventId = uniqid('sevent_');
        $stmt = $this->db->prepare(
            "INSERT INTO schedule_events (schedule_event_id, schedule_id, subject_id, teacher_id, day_of_week, start_time, end_time, location_id, event_type) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $eventId,
            $data['schedule_id'],
            $data['subject_id'] ?? null,
            $data['teacher_id'] ?? null,
            $data['day_of_week'],
            $data['start_time'],
            $data['end_time'],
            $data['location_id'] ?? null,
            $data['event_type'] ?? 'class'
        ]);
        return $eventId;
    }

    public function findEventById($eventId) {
        $stmt = $this->db->prepare("SELECT * FROM schedule_events WHERE schedule_event_id = ?");
        $stmt->execute([$eventId]);
        return $stmt->fetch();
    }

    public function updateEvent($eventId, $data) {
        $query = "UPDATE schedule_events SET ";
        $params = [];
        $updates = [];
        if (isset($data['subject_id'])) {
            $updates[] = "subject_id = ?";
            $params[] = $data['subject_id'];
        }
        if (isset($data['teacher_id'])) {
            $updates[] = "teacher_id = ?";
            $params[] = $data['teacher_id'];
        }
        if (isset($data['day_of_week'])) {
            $updates[] = "day_of_week = ?";
            $params[] = $data['day_of_week'];
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
        if (isset($data['event_type'])) {
            $updates[] = "event_type = ?";
            $params[] = $data['event_type'];
        }
        if (empty($updates)) {
            return false;
        }
        $query .= implode(', ', $updates) . " WHERE schedule_event_id = ?";
        $params[] = $eventId;
        $stmt = $this->db->prepare($query);
        $stmt->execute($params);
        return true;
    }
}
?>