-- Users Table
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255),
  role ENUM('student', 'teacher', 'admin') NOT NULL,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  department VARCHAR(100),
  year_joined INT,
  phone VARCHAR(15),
  profile_image VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  ms_oid VARCHAR(100) NULL,
  login_provider VARCHAR(50) DEFAULT 'local',
  last_login_at DATETIME NULL
);

-- Students Table (Additional Info)
CREATE TABLE students (
  student_id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  registration_number VARCHAR(20) UNIQUE,
  batch_year INT,
  course_id VARCHAR(50) REFERENCES courses(course_id),
  batch_id VARCHAR(50) REFERENCES batches(batch_id),
  cgpa DECIMAL(3,2) DEFAULT 0.00
);

-- Teachers Table (Additional Info)
CREATE TABLE teachers (
  teacher_id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) REFERENCES users(id),
  employee_id VARCHAR(20) UNIQUE,
  designation VARCHAR(100),
  qualification VARCHAR(200)
);




CREATE TABLE courses (
  course_id VARCHAR(50) PRIMARY KEY,
  course_code VARCHAR(20) UNIQUE NOT NULL,
  course_name VARCHAR(200) NOT NULL,
  description TEXT,
  department VARCHAR(100),
  duration_weeks INT,
  credits INT,
  start_date DATE,
  end_date DATE,
  syllabus_url VARCHAR(500)
);

-- Batches Table: Each course can have multiple batches (sections)
CREATE TABLE batches (
  batch_id VARCHAR(50) PRIMARY KEY,
  course_id VARCHAR(50) REFERENCES courses(course_id),
  subject_id VARCHAR(50) REFERENCES subjects(subject_id),
  batch_code VARCHAR(20) NOT NULL,
  batch_name VARCHAR(100) NOT NULL,
  start_date DATE,
  end_date DATE,
  total_capacity INT,
  schedule_id VARCHAR(50) REFERENCES schedules(schedule_id),
  is_active BOOLEAN DEFAULT TRUE
);

-- Batch Membership Table: Links USERS to specific batches (with their role)
CREATE TABLE batch_members (
  batch_member_id VARCHAR(50) PRIMARY KEY,
  batch_id VARCHAR(50) REFERENCES batches(batch_id),
  user_id VARCHAR(50) REFERENCES users(user_id),
  role ENUM('student','teacher','ta','mentor') DEFAULT 'student',
  join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active','completed','left','pending') DEFAULT 'active'
);

-- Subjects Table (Each subject is part of a course)
CREATE TABLE subjects (
  subject_id VARCHAR(50) PRIMARY KEY,
  course_id VARCHAR(50) REFERENCES courses(course_id),
  subject_code VARCHAR(20) NOT NULL,
  subject_name VARCHAR(150) NOT NULL,
  description TEXT,
  semester INT,
  credits INT,
  is_core BOOLEAN DEFAULT TRUE
);

-- Study Resources Table
CREATE TABLE resources (
  resource_id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  resource_type ENUM('pdf', 'video', 'link', 'document', 'presentation') NOT NULL,
  file_url VARCHAR(500),
  file_size BIGINT,
  subject_id VARCHAR(50) REFERENCES subjects(subject_id),
  course_id VARCHAR(50) REFERENCES courses(course_id),
  semester INT,
  department VARCHAR(100),
  uploaded_by VARCHAR(50) REFERENCES teachers(teacher_id),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  download_count INT DEFAULT 0,
  is_public BOOLEAN DEFAULT TRUE,
  tags JSON
);

-- Resource Access Logs Table
CREATE TABLE resource_access_logs (
  log_id VARCHAR(50) PRIMARY KEY,
  resource_id VARCHAR(50) REFERENCES resources(resource_id),
  user_id VARCHAR(50) REFERENCES users(id),
  access_type ENUM('view', 'download') NOT NULL,
  accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45)
);

-- Course Content Table
CREATE TABLE course_contents (
  content_id VARCHAR(50) PRIMARY KEY,
  course_id VARCHAR(50) REFERENCES courses(course_id),
  subject_id VARCHAR(50) REFERENCES subjects(subject_id),
  title VARCHAR(200),
  content_type ENUM('pdf', 'video', 'slide', 'assignment', 'reading', 'link'),
  file_url VARCHAR(500),
  created_by VARCHAR(50) REFERENCES teachers(teacher_id),
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_public BOOLEAN DEFAULT TRUE
);

-- Course Assignments Table
CREATE TABLE assignments (
  assignment_id VARCHAR(50) PRIMARY KEY,
  course_id VARCHAR(50) REFERENCES courses(course_id),
  subject_id VARCHAR(50) REFERENCES subjects(subject_id),
  title VARCHAR(200),
  description TEXT,
  due_date DATE,
  max_marks INT,
  created_by VARCHAR(50) REFERENCES teachers(teacher_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Campus Locations Table
CREATE TABLE locations (
  location_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  building_name VARCHAR(100),
  description TEXT,
--   floor_number INT,
--   room_number VARCHAR(20),
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  location_type ENUM('classroom', 'lab', 'auditorium', 'library', 'cafeteria', 'hostel', 'admin', 'sports', 'parking') NOT NULL,
--   capacity INT,
  facilities JSON,
  image_url VARCHAR(255),
  is_active BOOLEAN DEFAULT TRUE,
  is_pin BOOLEAN DEFAULT FALSE
);


-- Timetable / Calendar Table (per course, department, or user)
CREATE TABLE schedules (
  schedule_id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  owner_type ENUM('course', 'user', 'department'),
  owner_id VARCHAR(50),
  created_by VARCHAR(50) REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Schedule Events Table (classes, exams, custom calendar events)
CREATE TABLE schedule_events (
  event_id VARCHAR(50) PRIMARY KEY,
  schedule_id VARCHAR(50) REFERENCES schedules(schedule_id),
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_type ENUM('class', 'exam', 'holiday', 'meeting', 'reminder', 'change', 'assignment_due'),
  location_id VARCHAR(50) REFERENCES locations(location_id),
  start_datetime DATETIME NOT NULL,
  end_datetime DATETIME NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_rule VARCHAR(255),
  status ENUM('scheduled', 'cancelled', 'completed', 'changed') DEFAULT 'scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Personalized schedule membership (who sees what schedule/event)
CREATE TABLE schedule_members (
  id VARCHAR(50) PRIMARY KEY,
  schedule_id VARCHAR(50) REFERENCES schedules(schedule_id),
  user_id VARCHAR(50) REFERENCES users(id),
  role ENUM('viewer', 'editor', 'owner') DEFAULT 'viewer',
  notification_opt_in BOOLEAN DEFAULT TRUE
);



-- Events Table
CREATE TABLE events (
  event_id VARCHAR(50) PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
--   event_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  location_id VARCHAR(50) REFERENCES locations(location_id),
  max_capacity INT,
  current_registrations INT DEFAULT 0,
  event_type ENUM('academic', 'cultural', 'sports', 'technical', 'social') NOT NULL,
  created_by VARCHAR(50) REFERENCES users(id),
  club_id VARCHAR(50) REFERENCES clubs(club_id),
  image_url VARCHAR(255),
  registration_required BOOLEAN DEFAULT TRUE,
  registration_deadline DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('upcoming', 'ongoing', 'completed', 'cancelled') DEFAULT 'upcoming'
);

-- Event Registrations Table
CREATE TABLE event_registrations (
  registration_id VARCHAR(50) PRIMARY KEY,
  event_id VARCHAR(50) REFERENCES events(event_id),
  user_id VARCHAR(50) REFERENCES users(id),
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  attendance_status ENUM('registered', 'attended', 'absent') DEFAULT 'registered'
);


-- Clubs Table
CREATE TABLE clubs (
  club_id VARCHAR(50) PRIMARY KEY,
  club_name VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  club_bio TEXT,
  category ENUM('technical', 'cultural', 'sports', 'academic', 'social', 'volunteer') NOT NULL,
  founded_date DATE,
  club_image VARCHAR(255),
  status ENUM('pending', 'approved', 'rejected', 'suspended') DEFAULT 'pending',
  created_by VARCHAR(50) REFERENCES users(id),
  faculty_coordinator VARCHAR(50) REFERENCES teachers(teacher_id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  member_count INT DEFAULT 0
);

-- Club Members Table
CREATE TABLE club_members (
  membership_id VARCHAR(50) PRIMARY KEY,
  club_id VARCHAR(50) REFERENCES clubs(club_id),
  user_id VARCHAR(50) REFERENCES users(id),
  role ENUM('member', 'coordinator', 'president', 'vice_president') DEFAULT 'member',
  join_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('active', 'inactive') DEFAULT 'active'
);

-- Club Registration Requests Table
CREATE TABLE club_registration_requests (
  request_id VARCHAR(50) PRIMARY KEY,
  club_name VARCHAR(100) NOT NULL,
  description TEXT,
  club_bio TEXT,
  category VARCHAR(50),
  requested_by VARCHAR(50) REFERENCES users(id),
  faculty_coordinator VARCHAR(50),
  supporting_documents JSON,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  admin_comments TEXT,
  submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP
);


-- Notifications Table
CREATE TABLE notifications (
  notification_id VARCHAR(50) PRIMARY KEY,
  recipient_id VARCHAR(50) REFERENCES users(id),
  sender_id VARCHAR(50) REFERENCES users(id),
  context_type ENUM('course','batch','event','assignment','system','club','resource'),
  context_id VARCHAR(50), -- id from corresponding table
  title VARCHAR(200),
  message TEXT,
  notification_type ENUM('info','warning','error','reminder','success','alert','update') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  read_at TIMESTAMP
);








