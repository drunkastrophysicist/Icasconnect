CREATE TABLE students (
  student_id          INT AUTO_INCREMENT PRIMARY KEY,
  email               VARCHAR(100) UNIQUE NOT NULL,
  first_name          VARCHAR(50) NOT NULL,
  last_name           VARCHAR(50),
  department          VARCHAR(100),
  year_joined         INT,
  phone               VARCHAR(20),
  registration_number VARCHAR(30) UNIQUE,
  batch_year          VARCHAR(10),
  date_of_birth       DATE,
  gender              ENUM('male','female','other'),
  admission_date      DATE,
  admission_category  ENUM('regular','lateral','management','scholarship'),
  status              ENUM('active','graduated','suspended','dropout') DEFAULT 'active'
);

CREATE TABLE teachers (
  teacher_id       INT AUTO_INCREMENT PRIMARY KEY,
  email            VARCHAR(100) UNIQUE NOT NULL,
  first_name       VARCHAR(50) NOT NULL,
  last_name        VARCHAR(50),
  department       VARCHAR(100),
  year_joined      INT,
  phone            VARCHAR(20),
  employee_id      VARCHAR(30) UNIQUE,
  designation      VARCHAR(100),
  qualification    VARCHAR(200),
  date_of_birth    DATE,
  gender           ENUM('male','female','other'),
  joining_date     DATE,
  retirement_date  DATE,
  specialization   VARCHAR(200),
  research_interests TEXT,
  experience_years INT,
  employment_type  ENUM('permanent','contract','visiting'),
  status           ENUM('active','retired','resigned','sabbatical') DEFAULT 'active'
);
