<?php
require_once __DIR__ . '/../config/directry_database.php';

class Student {
    private $db;

    public function __construct() {
        $this->db = getDirectoryDB();
    }

    /**
     * Find student info by email from the directory database.
     */
    public function findByEmail($email) {
        $stmt = $this->db->prepare(
            "SELECT 
                student_id,
                email,
                first_name,
                last_name,
                department,
                year_joined,
                registration_number,
                batch_year,
                course_id,
                batch_id,
                cgpa,
                date_of_birth,
                gender,
                admission_date,
                admission_category,
                status
             FROM students
             WHERE email = ?"
        );
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    /**
     * Import students from a CSV file into the directory database.
     * Expected CSV columns:
     * student_id,email,first_name,last_name,department,year_joined,
     * registration_number,batch_year,course_id,batch_id,cgpa,
     * date_of_birth,gender,admission_date,admission_category,status
     */
    public function importFromCSV($csvPath) {
        if (!file_exists($csvPath)) {
            throw new Exception("CSV file not found: $csvPath");
        }

        $handle = fopen($csvPath, 'r');
        $header = fgetcsv($handle);

        while (($row = fgetcsv($handle)) !== false) {
            $data = array_combine($header, $row);

            $stmt = $this->db->prepare(
                "INSERT INTO students (
                    student_id, email, first_name, last_name, department, year_joined,
                    registration_number, batch_year, course_id, batch_id, cgpa,
                    date_of_birth, gender, admission_date, admission_category, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    email = VALUES(email),
                    first_name = VALUES(first_name),
                    last_name = VALUES(last_name),
                    department = VALUES(department),
                    year_joined = VALUES(year_joined),
                    registration_number = VALUES(registration_number),
                    batch_year = VALUES(batch_year),
                    course_id = VALUES(course_id),
                    batch_id = VALUES(batch_id),
                    cgpa = VALUES(cgpa),
                    date_of_birth = VALUES(date_of_birth),
                    gender = VALUES(gender),
                    admission_date = VALUES(admission_date),
                    admission_category = VALUES(admission_category),
                    status = VALUES(status)"
            );

            $stmt->execute([
                $data['student_id'] ?? null,
                $data['email'] ?? null,
                $data['first_name'] ?? '',
                $data['last_name'] ?? '',
                $data['department'] ?? '',
                $data['year_joined'] ?? null,
                $data['registration_number'] ?? '',
                $data['batch_year'] ?? null,
                $data['course_id'] ?? null,
                $data['batch_id'] ?? null,
                $data['cgpa'] ?? null,
                $data['date_of_birth'] ?? null,
                $data['gender'] ?? '',
                $data['admission_date'] ?? null,
                $data['admission_category'] ?? '',
                $data['status'] ?? ''
            ]);
        }

        fclose($handle);
    }
}
