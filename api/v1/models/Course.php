<?php
require_once __DIR__ . '/../config/database.php';

class Course {
    private $db;

    public function __construct() {
        $this->db = getDB();
    }

    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM courses");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM courses WHERE course_id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $courseId = uniqid('course_');
        $stmt = $this->db->prepare(
            "INSERT INTO courses (course_id, course_code, course_name, description, department, duration_weeks, credits, start_date, end_date, syllabus_url) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $courseId,
            $data['course_code'],
            $data['course_name'],
            $data['description'] ?? null,
            $data['department'] ?? null,
            $data['duration_weeks'] ?? null,
            $data['credits'] ?? null,
            $data['start_date'] ?? null,
            $data['end_date'] ?? null,
            $data['syllabus_url'] ?? null
        ]);
        return $courseId;
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare(
            "UPDATE courses SET course_code = ?, course_name = ?, description = ?, department = ?, duration_weeks = ?, credits = ?, start_date = ?, end_date = ?, syllabus_url = ? 
            WHERE course_id = ?"
        );
        $stmt->execute([
            $data['course_code'],
            $data['course_name'],
            $data['description'] ?? null,
            $data['department'] ?? null,
            $data['duration_weeks'] ?? null,
            $data['credits'] ?? null,
            $data['start_date'] ?? null,
            $data['end_date'] ?? null,
            $data['syllabus_url'] ?? null,
            $id
        ]);
        return true;
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM courses WHERE course_id = ?");
        $stmt->execute([$id]);
        return true;
    }

    public function getBatches($courseId) {
        $stmt = $this->db->prepare("SELECT * FROM batches WHERE course_id = ?");
        $stmt->execute([$courseId]);
        return $stmt->fetchAll();
    }
}
?>