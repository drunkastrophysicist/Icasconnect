# ICASConnect Backend API 🚀

A robust REST API backend for ICASConnect - The Digital Campus Management System for ICAS, Manipal.

## 🌟 Features

- **Authentication & Authorization** 
  - JWT-based secure authentication
  - Role-based access control (Student/Teacher/Admin)
  - Protected routes and middleware

- **Resource Management**
  - Course materials upload/download
  - Multiple file type support (PDF, DOCX, PPT, etc.)
  - External resource linking (YouTube, Drive)

- **Academic Management**
  - Course management
  - Batch handling
  - Subject organization
  - Assignment tracking

- **Campus Life**
  - Club activities
  - Event management
  - Location tracking
  - Real-time notifications

## 🛠️ Tech Stack

- PHP 7.4+
- MySQL/MariaDB
- JWT Authentication
- RESTful Architecture

## 📦 Dependencies

- `firebase/php-jwt`: JWT token handling
- `vlucas/phpdotenv`: Environment configuration
- Other utilities in `composer.json`

## 🚀 Quick Start

1. **Clone & Install**
```bash
git clone <repository-url>
cd v1
composer install
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env with your database credentials
```

3. **Database Setup**
```bash
# Import schema
mysql -u your_user -p your_database < database.sql
```

4. **Run Server**
```bash
php -S localhost:8000
```

## 📚 API Documentation

### Authentication
```http
POST /auth/register
POST /auth/login
GET /auth/me
POST /auth/logout
```

### Resources
```http
GET /resources
POST /resources
GET /resources/{id}
GET /resources/{id}/download
```

### Academic
```http
GET /courses
GET /subjects
GET /batches
POST /assignments
```

### Campus
```http
GET /clubs
GET /events
GET /locations
GET /notifications
```

## 🔒 Security

- CORS Protection
- JWT Authentication
- Input Validation
- File Upload Restrictions
- SQL Injection Prevention

## 📁 Project Structure

```
v1/
├── config/          # Configuration files
├── controllers/     # Request handlers
├── middleware/      # Auth & role middleware
├── models/          # Database models
├── utils/          # Utility classes
└── uploads/        # File storage
```

## 💻 Development

1. **Error Reporting**
```php
error_reporting(E_ALL);
ini_set('display_errors', 1);
```

2. **API Testing**
```bash
curl -X POST https://api.icasconnect.online/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is proprietary and confidential. All rights reserved.

## 👥 Team

- Development Team @ ICAS Manipal
- Project Lead: [Your Name]
- Contact: [Your Email]

## 🔧 Support

For support, email [support@icasconnect.online](mailto:support@icasconnect.online)

---

Made with ❤️ for ICAS Manipal
