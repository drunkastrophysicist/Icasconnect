<?php
require_once __DIR__ . '/../config/database.php';

class User {
    private $db;

    public function __construct() {
        $this->db = getDB();
    }

    public function findByEmail($email) {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        return $stmt->fetch();
    }

    public function findById($id) {
        $stmt = $this->db->prepare(
            "SELECT u.*, s.registration_number, s.batch_year, s.cgpa, t.employee_id, t.designation, t.qualification 
            FROM users u 
            LEFT JOIN students s ON u.id = s.user_id 
            LEFT JOIN teachers t ON u.id = t.user_id 
            WHERE u.id = ?"
        );
        $stmt->execute([$id]);
        return $stmt->fetch();
    }

    public function create($data) {
        $this->db->beginTransaction();
        try {
            $userId = uniqid('user_');

            $passwordHash = isset($data['password']) ? password_hash($data['password'], PASSWORD_DEFAULT) : null;

            $stmt = $this->db->prepare(
                "INSERT INTO users (id, email, password_hash, role, first_name, last_name, department, year_joined, phone, profile_image, is_verified) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
            );
            $stmt->execute([
                $userId,
                $data['email'],
                $passwordHash,
                $data['role'],
                $data['first_name'],
                $data['last_name'],
                $data['department'] ?? null,
                $data['year_joined'] ?? null,
                $data['phone'] ?? null,
                $data['profile_image'] ?? null,
                false
            ]);

            if ($data['role'] === 'student') {
                $stmt = $this->db->prepare(
                    "INSERT INTO students (student_id, user_id, registration_number, batch_year) 
                    VALUES (?, ?, ?, ?)"
                );
                $stmt->execute([uniqid('student_'), $userId, $data['registration_number'] ?? null, $data['batch_year'] ?? null]);
            } elseif ($data['role'] === 'teacher') {
                $stmt = $this->db->prepare(
                    "INSERT INTO teachers (teacher_id, user_id, employee_id, designation, qualification) 
                    VALUES (?, ?, ?, ?, ?)"
                );
                $stmt->execute([
                    uniqid('teacher_'),
                    $userId,
                    $data['employee_id'] ?? null,
                    $data['designation'] ?? null,
                    $data['qualification'] ?? null
                ]);
            }

            $this->db->commit();
            return $userId;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function getAll() {
        $stmt = $this->db->prepare(
            "SELECT u.*, s.registration_number, s.batch_year, s.cgpa, t.employee_id, t.designation, t.qualification 
            FROM users u 
            LEFT JOIN students s ON u.id = s.user_id 
            LEFT JOIN teachers t ON u.id = t.user_id"
        );
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function update($id, $data) {
        $this->db->beginTransaction();
        try {
            $stmt = $this->db->prepare(
                "UPDATE users SET email = ?, first_name = ?, last_name = ?, department = ?, year_joined = ?, phone = ? 
                WHERE id = ?"
            );
            $stmt->execute([
                $data['email'],
                $data['first_name'],
                $data['last_name'],
                $data['department'] ?? null,
                $data['year_joined'] ?? null,
                $data['phone'] ?? null,
                $id
            ]);

            if (isset($data['role']) && $data['role'] === 'student') {
                $stmt = $this->db->prepare(
                    "UPDATE students SET registration_number = ?, batch_year = ?, cgpa = ? WHERE user_id = ?"
                );
                $stmt->execute([
                    $data['registration_number'] ?? null,
                    $data['batch_year'] ?? null,
                    $data['cgpa'] ?? null,
                    $id
                ]);
            } elseif (isset($data['role']) && $data['role'] === 'teacher') {
                $stmt = $this->db->prepare(
                    "UPDATE teachers SET employee_id = ?, designation = ?, qualification = ? WHERE user_id = ?"
                );
                $stmt->execute([
                    $data['employee_id'] ?? null,
                    $data['designation'] ?? null,
                    $data['qualification'] ?? null,
                    $id
                ]);
            }

            $this->db->commit();
            return true;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    public function updateProfileImage($id, $profileImage) {
        $stmt = $this->db->prepare("UPDATE users SET profile_image = ? WHERE id = ?");
        $stmt->execute([$profileImage, $id]);
        return true;
    }
}
?>