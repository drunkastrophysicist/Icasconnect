<?php
require_once __DIR__ . '/../config/directry_database.php';

class Teacher {
    private $db;

    public function __construct() {
        $this->db = getDirectoryDB();
    }

    /**
     * Find teacher info by email from the directory database.
     */
    public function findByEmail($email) {
        $stmt = $this->db->prepare(
            "SELECT 
                teacher_id,
                email,
                first_name,
                last_name,
                department,
                designation,
                qualification,
                year_joined,
                date_of_birth,
                gender,
                joining_date,
                retirement_date,
                specialization,
                research_interests,
                experience_years,
                employment_type,
                status
             FROM teachers
             WHERE email = ?"
        );
        $stmt->execute([$email]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    /**
     * Import teachers from a CSV file into the directory database.
     * Expected CSV columns:
     * teacher_id,email,first_name,last_name,department,year_joined,
     * phone,employee_id,designation,qualification,date_of_birth,gender,
     * joining_date,retirement_date,specialization,research_interests,
     * experience_years,employment_type,status
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
                "INSERT INTO teachers (
                    teacher_id, email, first_name, last_name, department, year_joined,
                    phone, employee_id, designation, qualification, date_of_birth, gender,
                    joining_date, retirement_date, specialization, research_interests,
                    experience_years, employment_type, status
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON DUPLICATE KEY UPDATE
                    email = VALUES(email),
                    first_name = VALUES(first_name),
                    last_name = VALUES(last_name),
                    department = VALUES(department),
                    year_joined = VALUES(year_joined),
                    phone = VALUES(phone),
                    employee_id = VALUES(employee_id),
                    designation = VALUES(designation),
                    qualification = VALUES(qualification),
                    date_of_birth = VALUES(date_of_birth),
                    gender = VALUES(gender),
                    joining_date = VALUES(joining_date),
                    retirement_date = VALUES(retirement_date),
                    specialization = VALUES(specialization),
                    research_interests = VALUES(research_interests),
                    experience_years = VALUES(experience_years),
                    employment_type = VALUES(employment_type),
                    status = VALUES(status)"
            );

            $stmt->execute([
                $data['teacher_id'] ?? null,
                $data['email'] ?? null,
                $data['first_name'] ?? '',
                $data['last_name'] ?? '',
                $data['department'] ?? '',
                $data['year_joined'] ?? null,
                $data['phone'] ?? '',
                $data['employee_id'] ?? '',
                $data['designation'] ?? '',
                $data['qualification'] ?? '',
                $data['date_of_birth'] ?? null,
                $data['gender'] ?? '',
                $data['joining_date'] ?? null,
                $data['retirement_date'] ?? null,
                $data['specialization'] ?? '',
                $data['research_interests'] ?? '',
                $data['experience_years'] ?? null,
                $data['employment_type'] ?? '',
                $data['status'] ?? ''
            ]);
        }
        fclose($handle);
    }
}
