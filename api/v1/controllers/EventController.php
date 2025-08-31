<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/Event.php';
require_once __DIR__ . '/../models/Location.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class EventController {
    private $event;

    public function __construct() {
        $this->event = new Event();
    }

    public function getAll() {
        AuthMiddleware::handle();
        $filters = [];
        if (isset($_GET['event_type'])) {
            $filters['event_type'] = $_GET['event_type'];
        }
        if (isset($_GET['status'])) {
            $filters['status'] = $_GET['status'];
        }
        $events = $this->event->getAll($filters);
        Response::success($events);
    }

    public function getById($id) {
        AuthMiddleware::handle();
        $event = $this->event->findById($id);
        if (!$event) {
            Response::error('Event not found', 404);
        }
        Response::success($event);
    }

    public function create() {
        $decoded = RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'title' => ['type' => 'required'],
            'event_type' => ['type' => 'enum', 'values' => ['academic', 'cultural', 'sports', 'technical', 'social']],
            'start_time' => ['type' => 'time'],
            'end_time' => ['type' => 'time'],
            'max_capacity' => ['type' => 'numeric'],
            'registration_required' => ['type' => 'boolean'],
            'registration_deadline' => ['type' => 'date']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (isset($data['location_id']) && !Validator::exists('locations', 'location_id', $data['location_id'])) {
            Response::error('Location not found', 404);
        }

        if (isset($data['club_id']) && !Validator::exists('clubs', 'club_id', $data['club_id'])) {
            Response::error('Club not found', 404);
        }

        $data['created_by'] = $decoded['sub'];

        try {
            $eventId = $this->event->create($data);
            Response::success(['message' => 'Event created', 'event_id' => $eventId], 201);
        } catch (Exception $e) {
            Response::error('Creation failed: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'title' => ['type' => 'required'],
            'event_type' => ['type' => 'enum', 'values' => ['academic', 'cultural', 'sports', 'technical', 'social']],
            'start_time' => ['type' => 'time'],
            'end_time' => ['type' => 'time'],
            'max_capacity' => ['type' => 'numeric'],
            'registration_required' => ['type' => 'boolean'],
            'registration_deadline' => ['type' => 'date'],
            'status' => ['type' => 'enum', 'values' => ['upcoming', 'ongoing', 'completed', 'cancelled']]
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (isset($data['location_id']) && !Validator::exists('locations', 'location_id', $data['location_id'])) {
            Response::error('Location not found', 404);
        }

        if (isset($data['club_id']) && !Validator::exists('clubs', 'club_id', $data['club_id'])) {
            Response::error('Club not found', 404);
        }

        if (!$this->event->findById($id)) {
            Response::error('Event not found', 404);
        }

        try {
            $this->event->update($id, $data);
            Response::success(['message' => 'Event updated']);
        } catch (Exception $e) {
            Response::error('Update failed: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id) {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        if (!$this->event->findById($id)) {
            Response::error('Event not found', 404);
        }
        try {
            $this->event->delete($id);
            Response::success(['message' => 'Event deleted']);
        } catch (Exception $e) {
            Response::error('Delete failed: ' . $e->getMessage(), 500);
        }
    }

    public function register($eventId) {
        $decoded = AuthMiddleware::handle();
        if (!$this->event->findById($eventId)) {
            Response::error('Event not found', 404);
        }

        $stmt = $this->event->db->prepare(
            "SELECT COUNT(*) FROM event_registrations WHERE event_id = ? AND user_id = ?"
        );
        $stmt->execute([$eventId, $decoded['sub']]);
        if ($stmt->fetchColumn() > 0) {
            Response::error('Already registered for this event', 400);
        }

        try {
            $registrationId = $this->event->register($eventId, $decoded['sub']);
            Response::success(['message' => 'Registered for event', 'registration_id' => $registrationId], 201);
        } catch (Exception $e) {
            Response::error('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    public function getRegistrations($id) {
        AuthMiddleware::handle();
        if (!$this->event->findById($id)) {
            Response::error('Event not found', 404);
        }
        $registrations = $this->event->getRegistrations($id);
        Response::success($registrations);
    }

    public function updateAttendance($id) {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'user_id' => ['type' => 'required'],
            'status' => ['type' => 'enum', 'values' => ['present', 'absent', 'excused']]
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!$this->event->findById($id)) {
            Response::error('Event not found', 404);
        }

        if (!Validator::exists('users', 'id', $data['user_id'])) {
            Response::error('User not found', 404);
        }

        try {
            $attendanceId = $this->event->updateAttendance($id, $data['user_id'], $data['status']);
            Response::success(['message' => 'Attendance updated', 'attendance_id' => $attendanceId]);
        } catch (Exception $e) {
            Response::error('Attendance update failed: ' . $e->getMessage(), 500);
        }
    }
}
?>