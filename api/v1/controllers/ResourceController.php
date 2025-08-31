<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/Resource.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class ResourceController {
    private $resource;

    public function __construct() {
        $this->resource = new Resource();
    }

    public function getAll() {
        AuthMiddleware::handle();
        $filters = [];
        if (isset($_GET['resource_type'])) {
            $filters['resource_type'] = $_GET['resource_type'];
        }
        $resources = $this->resource->getAll($filters);
        Response::success($resources);
    }

    public function getById($id) {
        AuthMiddleware::handle();
        $resource = $this->resource->findById($id);
        if (!$resource) {
            Response::error('Resource not found', 404);
        }
        Response::success($resource);
    }

    public function getByCourse($courseId) {
        AuthMiddleware::handle();
        $resources = $this->resource->getByCourse($courseId);
        Response::success($resources);
    }

    public function create() {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'title' => ['type' => 'required'],
            'resource_type' => ['type' => 'enum', 'values' => ['document', 'video', 'link', 'quiz']],
            'course_id' => ['type' => 'required']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!Validator::exists('courses', 'course_id', $data['course_id'])) {
            Response::error('Course not found', 404);
        }

        $data['created_by'] = AuthMiddleware::handle()['sub'];

        try {
            $resourceId = $this->resource->create($data);
            Response::success(['message' => 'Resource created', 'resource_id' => $resourceId], 201);
        } catch (Exception $e) {
            Response::error('Creation failed: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'title' => ['type' => 'required'],
            'resource_type' => ['type' => 'enum', 'values' => ['document', 'video', 'link', 'quiz']],
            'course_id' => ['type' => 'required']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!Validator::exists('courses', 'course_id', $data['course_id'])) {
            Response::error('Course not found', 404);
        }

        if (!$this->resource->findById($id)) {
            Response::error('Resource not found', 404);
        }

        try {
            $this->resource->update($id, $data);
            Response::success(['message' => 'Resource updated']);
        } catch (Exception $e) {
            Response::error('Update failed: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id) {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        if (!$this->resource->findById($id)) {
            Response::error('Resource not found', 404);
        }
        try {
            $this->resource->delete($id);
            Response::success(['message' => 'Resource deleted']);
        } catch (Exception $e) {
            Response::error('Delete failed: ' . $e->getMessage(), 500);
        }
    }

    public function addAccessLog($id) {
        $decoded = AuthMiddleware::handle();
        if (!$this->resource->findById($id)) {
            Response::error('Resource not found', 404);
        }
        try {
            $logId = $this->resource->addAccessLog($id, $decoded['sub']);
            Response::success(['message' => 'Resource access logged', 'log_id' => $logId], 201);
        } catch (Exception $e) {
            Response::error('Logging failed: ' . $e->getMessage(), 500);
        }
    }
}
?>