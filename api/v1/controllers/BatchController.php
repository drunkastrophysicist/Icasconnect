<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/Batch.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class BatchController {
    private $batch;

    public function __construct() {
        $this->batch = new Batch();
    }

    public function getById($id) {
        AuthMiddleware::handle();
        $batch = $this->batch->findById($id);
        if (!$batch) {
            Response::error('Batch not found', 404);
        }
        Response::success($batch);
    }

    public function update($id) {
        RoleMiddleware::restrictTo(['admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'batch_name' => ['type' => 'required'],
            'start_date' => ['type' => 'date'],
            'end_date' => ['type' => 'date'],
            'max_capacity' => ['type' => 'numeric']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if ($this->batch->findById($id)) {
            try {
                $this->batch->update($id, $data);
                Response::success(['message' => 'Batch updated']);
            } catch (Exception $e) {
                Response::error('Update failed: ' . $e->getMessage(), 500);
            }
        } else {
            Response::error('Batch not found', 404);
        }
    }

    public function delete($id) {
        RoleMiddleware::restrictTo(['admin']);
        if ($this->batch->findById($id)) {
            try {
                $this->batch->delete($id);
                Response::success(['message' => 'Batch deleted']);
            } catch (Exception $e) {
                Response::error('Delete failed: ' . $e->getMessage(), 500);
            }
        } else {
            Response::error('Batch not found', 404);
        }
    }

    public function addMember($id) {
        RoleMiddleware::restrictTo(['admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['user_id'])) {
            Response::error('User ID is required', 400);
        }

        if (!$this->batch->findById($id)) {
            Response::error('Batch not found', 404);
        }

        if (!Validator::exists('users', 'id', $data['user_id'])) {
            Response::error('User not found', 404);
        }

        $stmt = $this->batch->db->prepare(
            "SELECT COUNT(*) FROM batch_members WHERE batch_id = ? AND user_id = ?"
        );
        $stmt->execute([$id, $data['user_id']]);
        if ($stmt->fetchColumn() > 0) {
            Response::error('User already in batch', 400);
        }

        try {
            $this->batch->addMember($id, $data['user_id']);
            Response::success(['message' => 'User added to batch'], 201);
        } catch (Exception $e) {
            Response::error('Add member failed: ' . $e->getMessage(), 500);
        }
    }

    public function getMembers($id) {
        AuthMiddleware::handle();
        if (!$this->batch->findById($id)) {
            Response::error('Batch not found', 404);
        }
        $members = $this->batch->getMembers($id);
        Response::success($members);
    }
}
?>