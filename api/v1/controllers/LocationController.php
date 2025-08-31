<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/Location.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class LocationController {
    private $location;

    public function __construct() {
        $this->location = new Location();
    }

    public function getAll() {
        AuthMiddleware::handle();
        $locations = $this->location->getAll();
        Response::success($locations);
    }

    public function getById($id) {
        AuthMiddleware::handle();
        $location = $this->location->findById($id);
        if (!$location) {
            Response::error('Location not found', 404);
        }
        Response::success($location);
    }

    public function create() {
        RoleMiddleware::restrictTo(['admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'name' => ['type' => 'required'],
            'latitude' => ['type' => 'numeric'],
            'longitude' => ['type' => 'numeric'],
            'location_type' => ['type' => 'enum', 'values' => ['classroom', 'auditorium', 'lab', 'other']],
            'capacity' => ['type' => 'numeric']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        try {
            $locationId = $this->location->create($data);
            Response::success(['message' => 'Location created', 'location_id' => $locationId], 201);
        } catch (Exception $e) {
            Response::error('Creation failed: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        RoleMiddleware::restrictTo(['admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'name' => ['type' => 'required'],
            'latitude' => ['type' => 'numeric'],
            'longitude' => ['type' => 'numeric'],
            'location_type' => ['type' => 'enum', 'values' => ['classroom', 'auditorium', 'lab', 'other']],
            'capacity' => ['type' => 'numeric']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!$this->location->findById($id)) {
            Response::error('Location not found', 404);
        }

        try {
            $this->location->update($id, $data);
            Response::success(['message' => 'Location updated']);
        } catch (Exception $e) {
            Response::error('Update failed: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id) {
        RoleMiddleware::restrictTo(['admin']);
        if (!$this->location->findById($id)) {
            Response::error('Location not found', 404);
        }

        try {
            $this->location->delete($id);
            Response::success(['message' => 'Location deleted']);
        } catch (Exception $e) {
            Response::error('Delete failed: ' . $e->getMessage(), 500);
        }
    }
}
?>