<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/Club.php';
require_once __DIR__ . '/../middleware/RoleMiddleware.php';

class ClubController {
    private $club;

    public function __construct() {
        $this->club = new Club();
    }

    public function getAll() {
        AuthMiddleware::handle();
        $filters = [];
        if (isset($_GET['category'])) {
            $filters['category'] = $_GET['category'];
        }
        $clubs = $this->club->getAll($filters);
        Response::success($clubs);
    }

    public function getById($id) {
        AuthMiddleware::handle();
        $club = $this->club->findById($id);
        if (!$club) {
            Response::error('Club not found', 404);
        }
        Response::success($club);
    }

    public function create() {
        $decoded = RoleMiddleware::restrictTo(['admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'club_name' => ['type' => 'required'],
            'category' => ['type' => 'enum', 'values' => ['technical', 'cultural', 'sports', 'academic', 'social']],
            'max_members' => ['type' => 'numeric']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        $data['created_by'] = $decoded['sub'];

        try {
            $clubId = $this->club->create($data);
            Response::success(['message' => 'Club created', 'club_id' => $clubId], 201);
        } catch (Exception $e) {
            Response::error('Creation failed: ' . $e->getMessage(), 500);
        }
    }

    public function update($id) {
        RoleMiddleware::restrictTo(['admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'club_name' => ['type' => 'required'],
            'category' => ['type' => 'enum', 'values' => ['technical', 'cultural', 'sports', 'academic', 'social']],
            'max_members' => ['type' => 'numeric']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!$this->club->findById($id)) {
            Response::error('Club not found', 404);
        }

        try {
            $this->club->update($id, $data);
            Response::success(['message' => 'Club updated']);
        } catch (Exception $e) {
            Response::error('Update failed: ' . $e->getMessage(), 500);
        }
    }

    public function delete($id) {
        RoleMiddleware::restrictTo(['admin']);
        if (!$this->club->findById($id)) {
            Response::error('Club not found', 404);
        }
        try {
            $this->club->delete($id);
            Response::success(['message' => 'Club deleted']);
        } catch (Exception $e) {
            Response::error('Delete failed: ' . $e->getMessage(), 500);
        }
    }

    public function join($clubId) {
        $decoded = AuthMiddleware::handle();
        if (!$this->club->findById($clubId)) {
            Response::error('Club not found', 404);
        }

        $stmt = $this->club->db->prepare(
            "SELECT COUNT(*) FROM club_members WHERE club_id = ? AND user_id = ?"
        );
        $stmt->execute([$clubId, $decoded['sub']]);
        if ($stmt->fetchColumn() > 0) {
            Response::error('Already a member of this club', 400);
        }

        try {
            $memberId = $this->club->join($clubId, $decoded['sub']);
            Response::success(['message' => 'Joined club', 'member_id' => $memberId], 201);
        } catch (Exception $e) {
            Response::error('Join failed: ' . $e->getMessage(), 500);
        }
    }

    public function addMember($clubId) {
        $decoded = RoleMiddleware::restrictTo(['admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'user_id' => ['type' => 'required'],
            'role' => ['type' => 'enum', 'values' => ['member', 'leader']]
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!$this->club->findById($clubId)) {
            Response::error('Club not found', 404);
        }

        if (!Validator::exists('users', 'id', $data['user_id'])) {
            Response::error('User not found', 404);
        }

        $stmt = $this->club->db->prepare(
            "SELECT COUNT(*) FROM club_members WHERE club_id = ? AND user_id = ?"
        );
        $stmt->execute([$clubId, $data['user_id']]);
        if ($stmt->fetchColumn() > 0) {
            Response::error('User already in club', 400);
        }

        try {
            $memberId = $this->club->join($clubId, $data['user_id'], $data['role'] ?? 'member');
            Response::success(['message' => 'Member added', 'member_id' => $memberId], 201);
        } catch (Exception $e) {
            Response::error('Add member failed: ' . $e->getMessage(), 500);
        }
    }

    public function getMembers($clubId) {
        AuthMiddleware::handle();
        if (!$this->club->findById($clubId)) {
            Response::error('Club not found', 404);
        }
        $members = $this->club->getMembers($clubId);
        Response::success($members);
    }

    public function createRegistrationRequest() {
        $decoded = AuthMiddleware::handle();
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'club_id' => ['type' => 'required']
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        if (!Validator::exists('clubs', 'club_id', $data['club_id'])) {
            Response::error('Club not found', 404);
        }

        $stmt = $this->club->db->prepare(
            "SELECT COUNT(*) FROM club_registration_requests WHERE club_id = ? AND user_id = ? AND status = 'pending'"
        );
        $stmt->execute([$data['club_id'], $decoded['sub']]);
        if ($stmt->fetchColumn() > 0) {
            Response::error('Registration request already pending', 400);
        }

        try {
            $requestId = $this->club->createRegistrationRequest($data['club_id'], $decoded['sub']);
            Response::success(['message' => 'Registration request created', 'request_id' => $requestId], 201);
        } catch (Exception $e) {
            Response::error('Request creation failed: ' . $e->getMessage(), 500);
        }
    }

    public function updateRegistrationRequest($id) {
        RoleMiddleware::restrictTo(['admin']);
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'status' => ['type' => 'enum', 'values' => ['pending', 'approved', 'rejected']]
        ];
        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        $request = $this->club->findRegistrationRequest($id);
        if (!$request) {
            Response::error('Registration request not found', 404);
        }

        try {
            $this->club->updateRegistrationRequest($id, $data['status']);
            if ($data['status'] === 'approved') {
                $this->club->join($request['club_id'], $request['user_id']);
            }
            Response::success(['message' => 'Registration request updated']);
        } catch (Exception $e) {
            Response::error('Update failed: ' . $e->getMessage(), 500);
        }
    }
}
?>