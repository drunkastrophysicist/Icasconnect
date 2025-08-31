<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/controllers/AuthController.php';
require_once __DIR__ . '/controllers/UserController.php';
require_once __DIR__ . '/controllers/CourseController.php';
require_once __DIR__ . '/controllers/BatchController.php';
require_once __DIR__ . '/controllers/SubjectController.php';
require_once __DIR__ . '/controllers/ResourceController.php';
require_once __DIR__ . '/controllers/EventController.php';
require_once __DIR__ . '/controllers/LocationController.php';
require_once __DIR__ . '/controllers/ScheduleController.php';
require_once __DIR__ . '/controllers/ClubController.php';
require_once __DIR__ . '/controllers/NotificationController.php';
require_once __DIR__ . '/utils/Response.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, PATCH, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit;
}

$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

if (isset($uri[2])) {
    if ($uri[2] === 'auth') {
        $controller = new AuthController();
        if (isset($uri[3]) && $uri[3] === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->register();
        } elseif (isset($uri[3]) && $uri[3] === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->login();
        } elseif (isset($uri[3]) && $uri[3] === 'microsoft-login-url' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->microsoftLoginUrl();
        } elseif (isset($uri[3]) && $uri[3] === 'microsoft-callback' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->microsoftCallback();
        } elseif (isset($uri[3]) && $uri[3] === 'me' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->me();
        } else {
            Response::error('Not Found', 404);
        }
    } elseif ($uri[2] === 'users') {
        $controller = new UserController();
        if (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getAll();
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET' && !isset($uri[4])) {
            $controller->getById($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'PATCH' && !isset($uri[4])) {
            $controller->update($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'DELETE' && !isset($uri[4])) {
            $controller->delete($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'profile-image' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
            $controller->updateProfileImage($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'schedule' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getSchedule($uri[3]);
        } else {
            Response::error('Not Found', 404);
        }
    } elseif ($uri[2] === 'courses') {
        $controller = new CourseController();
        if (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getAll();
        } elseif (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->create();
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET' && !isset($uri[4])) {
            $controller->getById($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'PUT' && !isset($uri[4])) {
            $controller->update($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'DELETE' && !isset($uri[4])) {
            $controller->delete($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'batches' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getBatches($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'batches' && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->createBatch($uri[3]);
        } else {
            Response::error('Not Found', 404);
        }
    } elseif ($uri[2] === 'batches') {
        $controller = new BatchController();
        if (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET' && !isset($uri[4])) {
            $controller->getById($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'PUT' && !isset($uri[4])) {
            $controller->update($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'DELETE' && !isset($uri[4])) {
            $controller->delete($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'members' && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->addMember($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'members' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getMembers($uri[3]);
        } else {
            Response::error('Not Found', 404);
        }
    } elseif ($uri[2] === 'subjects') {
        $controller = new SubjectController();
        if (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getAll();
        } elseif (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->create();
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getById($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'PUT') {
            $controller->update($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $controller->delete($uri[3]);
        } else {
            Response::error('Not Found', 404);
        }
    } elseif ($uri[2] === 'resources') {
        $controller = new ResourceController();
        if (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getAll();
        } elseif (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->create();
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET' && !isset($uri[4])) {
            $controller->getById($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'PUT' && !isset($uri[4])) {
            $controller->update($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'DELETE' && !isset($uri[4])) {
            $controller->delete($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'access' && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->addAccessLog($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[3] === 'course' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getByCourse($uri[4]);
        } else {
            Response::error('Not Found', 404);
        }
    } elseif ($uri[2] === 'events') {
        $controller = new EventController();
        if (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getAll();
        } elseif (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->create();
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET' && !isset($uri[4])) {
            $controller->getById($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'PUT' && !isset($uri[4])) {
            $controller->update($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'DELETE' && !isset($uri[4])) {
            $controller->delete($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'register' && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->register($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'registrations' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getRegistrations($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'attendance' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
            $controller->updateAttendance($uri[3]);
        } else {
            Response::error('Not Found', 404);
        }
    } elseif ($uri[2] === 'locations') {
        $controller = new LocationController();
        if (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getAll();
        } elseif (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->create();
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getById($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'PUT') {
            $controller->update($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $controller->delete($uri[3]);
        } else {
            Response::error('Not Found', 404);
        }
    } elseif ($uri[2] === 'schedules') {
        $controller = new ScheduleController();
        if (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getAll();
        } elseif (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->create();
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET' && !isset($uri[4])) {
            $controller->getById($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'PUT' && !isset($uri[4])) {
            $controller->update($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'DELETE' && !isset($uri[4])) {
            $controller->delete($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'events' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getEvents($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'events' && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->addEvent($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'events' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
            $controller->updateEvent($uri[3]);
        } else {
            Response::error('Not Found', 404);
        }
    } elseif ($uri[2] === 'clubs') {
        $controller = new ClubController();
        if (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getAll();
        } elseif (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->create();
        } elseif (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'POST' && isset($_GET['registration_request'])) {
            $controller->createRegistrationRequest();
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET' && !isset($uri[4])) {
            $controller->getById($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'PUT' && !isset($uri[4])) {
            $controller->update($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'DELETE' && !isset($uri[4])) {
            $controller->delete($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'join' && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->join($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'members' && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getMembers($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'members' && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->addMember($uri[3]);
        } elseif (isset($uri[3]) && isset($uri[4]) && $uri[4] === 'registration-requests' && $_SERVER['REQUEST_METHOD'] === 'PUT') {
            $controller->updateRegistrationRequest($uri[3]);
        } else {
            Response::error('Not Found', 404);
        }
    } elseif ($uri[2] === 'notifications') {
        $controller = new NotificationController();
        if (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getAll();
        } elseif (!isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'POST') {
            $controller->create();
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'GET') {
            $controller->getById($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'PUT') {
            $controller->update($uri[3]);
        } elseif (isset($uri[3]) && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
            $controller->delete($uri[3]);
        } else {
            Response::error('Not Found', 404);
        }
    } else {
        Response::error('Not Found', 404);
    }
} else {
    Response::error('Not Found', 404);
}
?>