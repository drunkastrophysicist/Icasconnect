<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/Subject.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class SubjectController {
    private $subject;

    public function __construct() {
        $this->subject = new Subject();
    }

    public function getAll() {
        AuthMiddleware::handle();
        $subjects = $this->subject->getAll();
        Response::success($subjects);
    }

    public function getById($id) {
        AuthMiddleware::handle();
        $subject = $this->subject->findById($id);
        if (!$subject) {
            Response::error('Subject not found', 404);
        }
        Response::success($subject);
    }

    public function create() {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'course_id' => ['type' => 'required'],
            'subject_code' => ['type' => 'required'],
            'subject_name' => ['type' => 'required'],
            'semester' => ['type' => 'numeric'],
            'credits' => ['type' => 'numeric'],
            'is_core' => ['type' => 'boolean']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!Validator::exists('courses', 'course_id', $data['course_id'])) {
            Response::error('Course not found', 404);
        }

        try {
            $subjectId = $this->subject->create($data);
            Response::success(['message' => 'Subject created', 'subject_id' => $subjectId], 201);
        } catch (Exception $e) {
            Response::error('Creation failed: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'course_id' => ['type' => 'required'],
            'subject_code' => ['type' => 'required'],
            'subject_name' => ['type' => 'required'],
            'semester' => ['type' => 'numeric'],
            'credits' => ['type' => 'numeric'],
            'is_core' => ['type' => 'boolean']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!$this->subject->findById($id)) {
            Response::error('Subject not found', 404);
        }

        if (!Validator::exists('courses', 'course_id', $data['course_id'])) {
            Response::error('Course not found', 404);
        }

        try {
            $this->subject->update($id, $data);
            Response::success(['message' => 'Subject updated']);
        } catch (Exception $e) {
            Response::error('Update failed: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id) {
        RoleMiddleware::restrictTo(['admin']);
        if (!$this->subject->findById($id)) {
            Response::error('Subject not found', 404);
        }

        try {
            $this->subject->delete($id);
            Response::success(['message' => 'Subject deleted']);
        } catch (Exception $e) {
            Response::error('Delete failed: ' . $e->getMessage(), 500);
        }
    }
}
?>