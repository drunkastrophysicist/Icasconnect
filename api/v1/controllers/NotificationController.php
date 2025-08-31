<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/Notification.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class NotificationController {
    private $notification;

    public function __construct() {
        $this->notification = new Notification();
    }

    public function getAll() {
        $decoded = AuthMiddleware::handle();
        $filters = [];
        if (isset($_GET['priority'])) {
            $filters['priority'] = $_GET['priority'];
        }
        if (isset($_GET['status'])) {
            $filters['status'] = $_GET['status'];
        }
        if (isset($_GET['notification_type'])) {
            $filters['notification_type'] = $_GET['notification_type'];
        }
        $notifications = $this->notification->getAll($decoded['sub'], $filters);
        Response::success($notifications);
    }

    public function getById($id) {
        $decoded = AuthMiddleware::handle();
        $notification = $this->notification->findById($id, $decoded['sub']);
        if (!$notification) {
            Response::error('Notification not found or unauthorized', 404);
        }
        Response::success($notification);
    }

    public function create() {
        $decoded = RoleMiddleware::restrictTo(['admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'title' => ['type' => 'required'],
            'priority' => ['type' => 'enum', 'values' => ['low', 'normal', 'high']],
            'notification_type' => ['type' => 'enum', 'values' => ['general', 'event', 'schedule', 'resource', 'club']],
            'related_entity_type' => ['type' => 'enum', 'values' => ['event', 'schedule', 'resource', 'club', null]]
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (isset($data['recipient_id']) && !Validator::exists('users', 'id', $data['recipient_id'])) {
            Response::error('Recipient not found', 404);
        }

        if (isset($data['related_entity_type']) && isset($data['related_entity_id'])) {
            $tableMap = [
                'event' => 'events',
                'schedule' => 'schedules',
                'resource' => 'resources',
                'club' => 'clubs'
            ];
            $table = $tableMap[$data['related_entity_type']] ?? '';
            if ($table && !Validator::exists($table, $data['related_entity_type'] === 'event' ? 'event_id' : 'id', $data['related_entity_id'])) {
                Response::error('Related entity not found', 404);
            }
        }

        // Prevent duplicate notifications
        if (isset($data['recipient_id']) && isset($data['title'])) {
            $stmt = $this->notification->db->prepare(
                "SELECT COUNT(*) FROM notifications WHERE recipient_id = ? AND title = ? AND created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR)"
            );
            $stmt->execute([$data['recipient_id'], $data['title']]);
            if ($stmt->fetchColumn() > 0) {
                Response::error('Duplicate notification within the last hour', 400);
            }
        }

        $data['sender_id'] = $decoded['sub'];

        try {
            $notificationId = $this->notification->create($data);
            // Send to Telegram if recipient_id is set
            if (isset($data['recipient_id'])) {
                TelegramBot::send($data['recipient_id'], $data['title'], $data['message'] ?? '');
            }
            Response::success(['message' => 'Notification created', 'notification_id' => $notificationId], 201);
        } catch (Exception $e) {
            Response::error('Creation failed: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        $decoded = AuthMiddleware::handle();
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'status' => ['type' => 'enum', 'values' => ['unread', 'read']]
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!$this->notification->findById($id, $decoded['sub'])) {
            Response::error('Notification not found or unauthorized', 404);
        }

        try {
            if ($this->notification->update($id, $data, $decoded['sub'])) {
                Response::success(['message' => 'Notification updated']);
            } else {
                Response::error('Update failed: No changes made', 400);
            }
        } catch (Exception $e) {
            Response::error('Update failed: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id) {
        $decoded = AuthMiddleware::handle();
        $isAdmin = in_array('admin', $decoded['roles'] ?? []);
        if (!$this->notification->findById($id, $decoded['sub'])) {
            Response::error('Notification not found or unauthorized', 404);
        }

        try {
            if ($this->notification->delete($id, $decoded['sub'], $isAdmin)) {
                Response::success(['message' => 'Notification deleted']);
            } else {
                Response::error('Delete failed', 400);
            }
        } catch (Exception $e) {
            Response::error('Delete failed: ' . $e->getMessage(), 500);
        }
    }
}
?>