<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../utils/Validator.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../middleware/AuthMiddleware.php';

use Firebase\JWT\JWT;

class AuthController {
    private $user;

    public function __construct() {
        $this->user = new User();
    }

    public function register() {
        $data = json_decode(file_get_contents('php://input'), true);
        $rules = [
            'email' => 'email',
            'password' => 'required',
            'role' => 'enum',
            'first_name' => 'required',
            'last_name' => 'required'
        ];

        $errors = Validator::validate($data, $rules);
        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        $userModel = new User();
        if ($userModel->findByEmail($data['email'])) {
            Response::error('Email already exists', 400);
        }

        // Fetch extra info from directory DB
        $extraData = [];
        if ($data['role'] === 'student') {
            require_once __DIR__ . '/../models/Student.php';
            $studentModel = new Student();
            $studentInfo = $studentModel->findByEmail($data['email']);
            if (!$studentInfo) {
                Response::error('Student data not found in admin pool. Contact administration.', 403);
            }
            $extraData = [
                'department' => $studentInfo['department'] ?? null,
                'year_joined' => $studentInfo['year_joined'] ?? null,
                'registration_number' => $studentInfo['registration_number'] ?? null,
                'batch_year' => $studentInfo['batch_year'] ?? null,
                'course_id' => $studentInfo['course_id'] ?? null,
                'batch_id' => $studentInfo['batch_id'] ?? null,
                'cgpa' => $studentInfo['cgpa'] ?? null
            ];
        } elseif ($data['role'] === 'teacher') {
            require_once __DIR__ . '/../models/Teacher.php';
            $teacherModel = new Teacher();
            $teacherInfo = $teacherModel->findByEmail($data['email']);
            if (!$teacherInfo) {
                Response::error('Teacher data not found in admin pool. Contact administration.', 403);
            }
            $extraData = [
                'department' => $teacherInfo['department'] ?? null,
                'year_joined' => $teacherInfo['year_joined'] ?? null,
                'employee_id' => $teacherInfo['employee_id'] ?? null,
                'designation' => $teacherInfo['designation'] ?? null,
                'qualification' => $teacherInfo['qualification'] ?? null
            ];
        }

        try {
            $userId = $userModel->create(array_merge($data, $extraData));
            Response::success(['message' => 'User registered successfully', 'user_id' => $userId], 201);
        } catch (Exception $e) {
            Response::error('Registration failed: ' . $e->getMessage(), 500);
        }
    }

    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);
        if (!$data) {
            Response::error('Invalid or missing JSON body', 400);
        }
        
        $errors = Validator::validate($data, [
            'email' => 'email',
            'password' => 'required'
        ]);

        if (!empty($errors)) {
            Response::error(implode(', ', $errors), 400);
        }

        $user = $this->user->findByEmail($data['email']);
        if (!$user || !password_verify($data['password'], $user['password_hash'])) {
            Response::error('Invalid credentials', 401);
        }

        $payload = [
            'sub' => $user['id'],
            'role' => $user['role'],
            'iat' => time(),
            'exp' => time() + (60 * 60 * 24) // 1 day expiry
        ];
        $token = JWT::encode($payload, $_ENV['JWT_SECRET'], 'HS256');
        Response::success(['token' => $token, 'user' => [
            'id' => $user['id'],
            'email' => $user['email'],
            'role' => $user['role'],
            'first_name' => $user['first_name'],
            'last_name' => $user['last_name']
        ]]);
    }

    public function microsoftLoginUrl() {
        $clientId = getenv('MS_CLIENT_ID');
        $redirectUri = urlencode(getenv('MS_REDIRECT_URI'));
        $scope = urlencode('openid email profile');
        $state = bin2hex(random_bytes(8));
        $url = "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=$clientId&response_type=code&redirect_uri=$redirectUri&response_mode=query&scope=$scope&state=$state";
        Response::success(['url' => $url]);
    }

    public function microsoftCallback() {
        $code = $_GET['code'] ?? null;
        if (!$code) {
            Response::error('Missing code', 400);
        }
        $clientId = getenv('MS_CLIENT_ID');
        $clientSecret = getenv('MS_CLIENT_SECRET');
        $redirectUri = getenv('MS_REDIRECT_URI');

        // Exchange code for tokens
        $tokenUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/token';
        $data = [
            'client_id' => $clientId,
            'scope' => 'openid email profile',
            'code' => $code,
            'redirect_uri' => $redirectUri,
            'grant_type' => 'authorization_code',
            'client_secret' => $clientSecret
        ];
        $options = [
            'http' => [
                'header'  => "Content-type: application/x-www-form-urlencoded",
                'method'  => 'POST',
                'content' => http_build_query($data),
            ]
        ];
        $context  = stream_context_create($options);
        $result = file_get_contents($tokenUrl, false, $context);
        if ($result === FALSE) {
            Response::error('Token exchange failed', 500);
        }
        $tokens = json_decode($result, true);
        $idToken = $tokens['id_token'] ?? null;
        if (!$idToken) {
            Response::error('No id_token received', 500);
        }

        // Decode JWT (id_token) to get user info
        $parts = explode('.', $idToken);
        $payload = json_decode(base64_decode(strtr($parts[1], '-_', '+/')), true);
        $email = $payload['preferred_username'] ?? $payload['email'] ?? null;
        if (!$email) {
            Response::error('No email in token', 500);
        }

        // Role assignment based on email domain
        $role = null;
        if (str_ends_with($email, '@learners.manipal.edu')) {
            $role = 'student';
        } elseif (str_ends_with($email, '@manipal.edu')) {
            $role = 'teacher';
        } else {
            Response::error('Unauthorized domain', 403);
        }

        $msOid = $payload['oid'] ?? $payload['sub'] ?? null;

        // Check if user exists, else create
        $userModel = new User();
        $user = $userModel->findByEmail($email);
        if (!$user) {
            // Extract extra info from the data pool (students/teachers table)
            $extraData = [];
            if ($role === 'student') {
                require_once __DIR__ . '/../models/Student.php';
                $studentModel = new Student();
                $studentInfo = $studentModel->findByEmail($email);
                if (!$studentInfo) {
                    Response::error('Student data not found in admin pool. Contact administration.', 403);
                }
                $extraData = [
                    'department' => $studentInfo['department'] ?? null,
                    'year_joined' => $studentInfo['year_joined'] ?? null,
                    'registration_number' => $studentInfo['registration_number'] ?? null,
                    'batch_year' => $studentInfo['batch_year'] ?? null,
                    'course_id' => $studentInfo['course_id'] ?? null,
                    'batch_id' => $studentInfo['batch_id'] ?? null,
                    'cgpa' => $studentInfo['cgpa'] ?? null
                ];
            } elseif ($role === 'teacher') {
                require_once __DIR__ . '/../models/Teacher.php';
                $teacherModel = new Teacher();
                $teacherInfo = $teacherModel->findByEmail($email);
                if (!$teacherInfo) {
                    Response::error('Teacher data not found in admin pool. Contact administration.', 403);
                }
                $extraData = [
                    'department' => $teacherInfo['department'] ?? null,
                    'year_joined' => $teacherInfo['year_joined'] ?? null,
                    'employee_id' => $teacherInfo['employee_id'] ?? null,
                    'designation' => $teacherInfo['designation'] ?? null,
                    'qualification' => $teacherInfo['qualification'] ?? null
                ];
            }

            // Create user with all info
            $userId = $userModel->create(array_merge([
                'email' => $email,
                'first_name' => $payload['given_name'] ?? '',
                'last_name' => $payload['family_name'] ?? '',
                'role' => $role,
                'is_verified' => true,
                'ms_oid' => $msOid,
                'login_provider' => 'microsoft',
                'last_login_at' => date('Y-m-d H:i:s')
            ], $extraData));

            $user = $userModel->findById($userId);
        }

        // Generate your own JWT for the session
        $jwt = AuthMiddleware::generateToken($user['id'], [$user['role']]);
        Response::success([
            'token' => $jwt,
            'user' => $user
        ]);
    }

    public function me() {
        $decoded = AuthMiddleware::handle();
        $user = $this->user->findById($decoded['sub']);
        if (!$user) {
            Response::error('User not found', 404);
        }
        Response::success($user);
    }
}
?>