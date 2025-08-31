<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/Course.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class CourseController {
    private $course;

    public function __construct() {
        $this->course = new Course();
    }

    public function getAll() {
        $decoded = AuthMiddleware::handle(); // Auth required, but any role
        $courses = $this->course->getAll();
        Response::success($courses);
    }

    public function getById($id) {
        $decoded = AuthMiddleware::handle();
        $course = $this->course->findById($id);
        if (!$course) {
            Response::error('Course not found', 404);
        }
        Response::success($course);
    }

    public function create() {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'course_code' => ['type' => 'required'],
            'course_name' => ['type' => 'required'],
            'department' => ['type' => 'required'],
            'credits' => ['type' => 'numeric'],
            'duration_weeks' => ['type' => 'numeric'],
            'start_date' => ['type' => 'date'],
            'end_date' => ['type' => 'date']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        try {
            $courseId = $this->course->create($data);
            Response::success(['message' => 'Course created', 'course_id' => $courseId], 201);
        } catch (Exception $e) {
            Response::error('Creation failed: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'course_code' => ['type' => 'required'],
            'course_name' => ['type' => 'required'],
            'department' => ['type' => 'required'],
            'credits' => ['type' => 'numeric'],
            'duration_weeks' => ['type' => 'numeric'],
            'start_date' => ['type' => 'date'],
            'end_date' => ['type' => 'date']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!$this->course->findById($id)) {
            Response::error('Course not found', 404);
        }

        try {
            $this->course->update($id, $data);
            Response::success(['message' => 'Course updated']);
        } catch (Exception $e) {
            Response::error('Update failed: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id) {
        RoleMiddleware::restrictTo(['admin']);
        if (!$this->course->findById($id)) {
            Response::error('Course not found', 404);
        }

        try {
            $this->course->delete($id);
            Response::success(['message' => 'Course deleted']);
        } catch (Exception $e) {
            Response::error('Delete failed: ' . $e->getMessage(), 500);
        }
    }

    public function getBatches($id) {
        $decoded = AuthMiddleware::handle();
        if (!$this->course->findById($id)) {
            Response::error('Course not found', 404);
        }
        $batches = $this->course->getBatches($id);
        Response::success($batches);
    }

    public function createBatch($courseId) {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $data['course_id'] = $courseId;
        $rules = [
            'batch_code' => ['type' => 'required'],
            'batch_name' => ['type' => 'required'],
            'start_date' => ['type' => 'date'],
            'end_date' => ['type' => 'date'],
            'total_capacity' => ['type' => 'numeric'],
            'is_active' => ['type' => 'boolean']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!$this->course->findById($courseId)) {
            Response::error('Course not found', 404);
        }

        if (isset($data['subject_id']) && !Validator::exists('subjects', 'subject_id', $data['subject_id'])) {
            Response::error('Subject not found', 404);
        }

        $batch = new Batch();
        try {
            $batchId = $batch->create($data);
            Response::success(['message' => 'Batch created', 'batch_id' => $batchId], 201);
        } catch (Exception $e) {
            Response::error('Creation failed: ' . $e->getMessage(), 500);
        }
    }
}
?>