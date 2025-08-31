<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once __DIR__ . '/../models/Student.php';
require_once __DIR__ . '/../models/Teacher.php';

$studentCsv = __DIR__ . '/students.csv';
$teacherCsv = __DIR__ . '/teachers.csv';

$studentModel = new Student();
$teacherModel = new Teacher();

try {
    $studentModel->importFromCSV($studentCsv);
    echo "Students imported successfully.\n";
} catch (Exception $e) {
    echo "Student import failed: " . $e->getMessage() . "\n";
}

try {
    $teacherModel->importFromCSV($teacherCsv);
    echo "Teachers imported successfully.\n";
} catch (Exception $e) {
    echo "Teacher import failed: " . $e->getMessage() . "\n";
}