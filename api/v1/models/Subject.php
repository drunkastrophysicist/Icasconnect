<?php
require_once __DIR__ . '/../config/database.php';

class Subject {
    private $db;

    public function __construct() {
        $this->db = getDB();
    }

    public function getAll() {
        $stmt = $this->db->prepare("SELECT * FROM subjects");
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function findById($id) {
        $stmt = $this->db->prepare("SELECT * FROM subjects WHERE subject_id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $subjectId = uniqid('subject_');
        $stmt = $this->db->prepare(
            "INSERT INTO subjects (subject_id, course_id, subject_code, subject_name, description, semester, credits, is_core) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $subjectId,
            $data['course_id'],
            $data['subject_code'],
            $data['subject_name'],
            $data['description'] ?? null,
            $data['semester'] ?? null,
            $data['credits'] ?? null,
            $data['is_core'] ?? true
        ]);
        return $subjectId;
    }

    public function update($id, $data) {
        $stmt = $this->db->prepare(
            "UPDATE subjects SET course_id = ?, subject_code = ?, subject_name = ?, description = ?, semester = ?, credits = ?, is_core = ? 
            WHERE subject_id = ?"
        );
        $stmt->execute([
            $data['course_id'],
            $data['subject_code'],
            $data['subject_name'],
            $data['description'] ?? null,
            $data['semester'] ?? null,
            $data['credits'] ?? null,
            $data['is_core'] ?? true,
            $id
        ]);
        return true;
    }

    public function delete($id) {
        $stmt = $this->db->prepare("DELETE FROM subjects WHERE subject_id = ?");
        $stmt->execute([$id]);
        return true;
    }
}
?>