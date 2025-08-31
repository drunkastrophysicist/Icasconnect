<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/Schedule.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class ScheduleController {
    private $schedule;

    public function __construct() {
        $this->schedule = new Schedule();
    }

    public function getAll() {
        AuthMiddleware::handle();
        $filters = [];
        if (isset($_GET['schedule_type'])) {
            $filters['schedule_type'] = $_GET['schedule_type'];
        }
        if (isset($_GET['batch_id'])) {
            $filters['batch_id'] = $_GET['batch_id'];
        }
        $schedules = $this->schedule->getAll($filters);
        Response::success($schedules);
    }

    public function getById($id) {
        AuthMiddleware::handle();
        $schedule = $this->schedule->findById($id);
        if (!$schedule) {
            Response::error('Schedule not found', 404);
        }
        Response::success($schedule);
    }

    public function create() {
        $decoded = RoleMiddleware::restrictTo(['admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'batch_id' => ['type' => 'required'],
            'schedule_type' => ['type' => 'enum', 'values' => ['weekly', 'monthly', 'semester']]
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!Validator::exists('batches', 'batch_id', $data['batch_id'])) {
            Response::error('Batch not found', 404);
        }

        $data['created_by'] = $decoded['sub'];

        try {
            $scheduleId = $this->schedule->create($data);
            Response::success(['message' => 'Schedule created', 'schedule_id' => $scheduleId], 201);
        } catch (Exception $e) {
            Response::error('Creation failed: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        RoleMiddleware::restrictTo(['admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'batch_id' => ['type' => 'required'],
            'schedule_type' => ['type' => 'enum', 'values' => ['weekly', 'monthly', 'semester']]
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!Validator::exists('batches', 'batch_id', $data['batch_id'])) {
            Response::error('Batch not found', 404);
        }

        if (!$this->schedule->findById($id)) {
            Response::error('Schedule not found', 404);
        }

        try {
            $this->schedule->update($id, $data);
            Response::success(['message' => 'Schedule updated']);
        } catch (Exception $e) {
            Response::error('Update failed: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id) {
        RoleMiddleware::restrictTo(['admin']);
        if (!$this->schedule->findById($id)) {
            Response::error('Schedule not found', 404);
        }
        try {
            $this->schedule->delete($id);
            Response::success(['message' => 'Schedule deleted']);
        } catch (Exception $e) {
            Response::error('Delete failed: ' . $e->getMessage(), 500);
        }
    }

    public function getEvents($id) {
        AuthMiddleware::handle();
        if (!$this->schedule->findById($id)) {
            Response::error('Schedule not found', 404);
        }
        $events = $this->schedule->getEvents($id);
        Response::success($events);
    }

    public function addEvent($id) {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $data['schedule_id'] = $id;
        $rules = [
            'day_of_week' => ['type' => 'day_of_week'],
            'start_time' => ['type' => 'time'],
            'end_time' => ['type' => 'time'],
            'event_type' => ['type' => 'enum', 'values' => ['class', 'exam', 'workshop', 'seminar']]
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!$this->schedule->findById($id)) {
            Response::error('Schedule not found', 404);
        }

        if (isset($data['subject_id']) && !Validator::exists('subjects', 'subject_id', $data['subject_id'])) {
            Response::error('Subject not found', 404);
        }

        if (isset($data['teacher_id']) && !Validator::exists('teachers', 'teacher_id', $data['teacher_id'])) {
            Response::error('Teacher not found', 404);
        }

        if (isset($data['location_id']) && !Validator::exists('locations', 'location_id', $data['location_id'])) {
            Response::error('Location not found', 404);
        }

        try {
            $eventId = $this->schedule->addEvent($data);
            Response::success(['message' => 'Schedule event added', 'schedule_event_id' => $eventId], 201);
        } catch (Exception $e) {
            Response::error('Creation failed: ' . $e->getMessage(), 500);
        }
    }

    public function updateEvent($eventId) {
        RoleMiddleware::restrictTo(['teacher', 'admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'day_of_week' => ['type' => 'day_of_week'],
            'start_time' => ['type' => 'time'],
            'end_time' => ['type' => 'time'],
            'event_type' => ['type' => 'enum', 'values' => ['class', 'exam', 'workshop', 'seminar']]
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!$this->schedule->findEventById($eventId)) {
            Response::error('Schedule event not found', 404);
        }

        if (isset($data['subject_id']) && !Validator::exists('subjects', 'subject_id', $data['subject_id'])) {
            Response::error('Subject not found', 404);
        }

        if (isset($data['teacher_id']) && !Validator::exists('teachers', 'teacher_id', $data['teacher_id'])) {
            Response::error('Teacher not found', 404);
        }

        if (isset($data['location_id']) && !Validator::exists('locations', 'location_id', $data['location_id'])) {
            Response::error('Location not found', 404);
        }

        try {
            $this->schedule->updateEvent($eventId, $data);
            Response::success(['message' => 'Schedule event updated']);
        } catch (Exception $e) {
            Response::error('Update failed: ' . $e->getMessage(), 500);
        }
    }
}
?>