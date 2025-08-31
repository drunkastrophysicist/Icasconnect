<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Schedule.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class UserController {
    private $user;
    private $schedule;

    public function __construct() {
        $this->user = new User();
        $this->schedule = new Schedule();
    }

    public function getAll() {
        RoleMiddleware::restrictTo(['admin']);
        $users = $this->user->getAll();
        Response::success($users);
    }

    public function getById($id) {
        $decoded = AuthMiddleware::handle();
        if ($decoded['sub'] !== $id && !in_array('admin', $decoded['roles'] ?? [])) {
            Response::error('Unauthorized', 403);
        }
        $user = $this->user->findById($id);
        if (!$user) {
            Response::error('User not found', 404);
        }
        Response::success($user);
    }

    public function update($id) {
        $decoded = AuthMiddleware::handle();
        if ($decoded['sub'] !== $id && !in_array('admin', $decoded['roles'] ?? [])) {
            Response::error('Unauthorized', 403);
        }
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'username' => ['type' => 'required'],
            'email' => ['type' => 'email'],
            'role' => ['type' => 'enum', 'values' => ['student', 'teacher', 'admin']],
            'first_name' => ['type' => 'required'],
            'last_name' => ['type' => 'required'],
            'profile_image' => ['type' => 'required']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if ($this->user->findById($id)) {
            try {
                $this->user->update($id, $data);
                Response::success(['message' => 'User updated']);
            } catch (Exception $e) {
                Response::error('Update failed: ' . $e->getMessage(), 500);
            }
        } else {
            Response::error('User not found', 404);
        }
    }

    public function updateProfileImage($id) {
        $decoded = AuthMiddleware::handle();
        if ($decoded['sub'] !== $id && !in_array('admin', $decoded['roles'] ?? [])) {
            Response::error('Unauthorized', 403);
        }
        $data = json_decode(file_get_contents('php://input'), true);
        if (empty($data['profile_image'])) {
            Response::error('Profile image URL is required', 400);
        }
        if ($this->user->findById($id)) {
            try {
                $this->user->updateProfileImage($id, $data['profile_image']);
                Response::success(['message' => 'Profile image updated']);
            } catch (Exception $e) {
                Response::error('Update failed: ' . $e->getMessage(), 500);
            }
        } else {
            Response::error('User not found', 404);
        }
    }

    public function delete($id) {
        RoleMiddleware::restrictTo(['admin']);
        if (!$this->user->findById($id)) {
            Response::error('User not found', 404);
        }
        try {
            $stmt = $this->user->db->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);
            Response::success(['message' => 'User deleted']);
        } catch (Exception $e) {
            Response::error('Delete failed: ' . $e->getMessage(), 500);
        }
    }

    public function getSchedule($id) {
        $decoded = AuthMiddleware::handle();
        if ($decoded['sub'] !== $id && !in_array('admin', $decoded['roles'] ?? [])) {
            Response::error('Unauthorized', 403);
        }
        if (!$this->user->findById($id)) {
            Response::error('User not found', 404);
        }
        $stmt = $this->schedule->db->prepare(
            "SELECT s.* FROM schedules s 
            JOIN batch_members bm ON s.batch_id = bm.batch_id 
            WHERE bm.user_id = ?"
        );
        $stmt->execute([$id]);
        $schedules = $stmt->fetchAll();
        Response::success($schedules);
    }
}
?>