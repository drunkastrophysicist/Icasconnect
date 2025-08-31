# 🎓 icasconnect

A modern, feature-rich campus management platform built for students, faculty, and administrators. Connect, learn, and grow together in your academic journey.

![icasconnect](https://img.shields.io/badge/icasconnect-Campus_Platform-blue)
![React](https://img.shields.io/badge/React-18+-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue)
![Vite](https://img.shields.io/badge/Vite-Latest-purple)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3+-cyan)

## 🌟 Features

### 🎯 **Core Functionality**
- **Multi-role Authentication** - Student, Faculty, and Guest access
- **Interactive Dashboard** - Personalized experience for each user type
- **Real-time Timetable** - Smart schedule management with visual calendar
- **Campus Events** - Interactive map with event locations and registration
- **Resource Hub** - Comprehensive learning materials with multi-level navigation
- **Club Management** - Discover and join campus clubs and activities
- **Profile Management** - Smart email-based name extraction and customization

### 🎨 **User Experience**
- **Premium Dark Theme** - Modern gradient backgrounds and animations
- **Responsive Design** - Seamless experience across all devices
- **Interactive Components** - Rich UI with hover effects and transitions
- **Smart Search** - Intelligent filtering across all content types
- **Offline Mode** - Complete functionality without internet connection

### 🗺️ **Campus Integration**
- **Interactive Campus Map** - Visual building locations and navigation
- **Event Location Mapping** - Real-time event positioning on campus
- **Resource Organization** - Subject-wise categorization (Math, English, Psychology, Physics, MOS)
- **Smart Notifications** - Context-aware updates and reminders

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18+ 
- **pnpm** (recommended) or npm
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd hack
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start development server**
   ```bash
   pnpm run dev
   ```

4. **Open in browser**
   ```
   http://localhost:8082
   ```

### 🔐 **Login Credentials (Offline Mode)**

**Student Access:**
- Email: `any-email@learner.manipal.edu`
- Password: `password123`

**Faculty Access:**
- Email: `any-email@manipal.edu` 
- Password: `password123`

**Guest Access:**
- Click "Continue as Guest" (no credentials needed)

## 📁 Project Structure

```
icasconnect/
├── client/                    # Frontend React application
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Shadcn/ui components
│   │   ├── AuthProvider.tsx # Authentication context
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   └── ThemeProvider.tsx# Dark/light theme management
│   ├── pages/               # Application pages
│   │   ├── StudentDashboard.tsx
│   │   ├── TeacherDashboard.tsx
│   │   ├── Events.tsx       # Interactive campus events
│   │   ├── Timetable.tsx    # Smart schedule management
│   │   ├── Resources.tsx    # Learning resources hub
│   │   ├── Clubs.tsx        # Campus clubs and activities
│   │   └── Profile.tsx      # User profile management
│   ├── hooks/               # Custom React hooks
│   └── lib/                 # Utilities and helpers
├── server/                   # Backend Express server
├── shared/                   # Shared utilities and API
│   └── api.ts              # Centralized API with offline mode
├── public/                   # Static assets
└── netlify/                 # Netlify deployment functions
```

## 🛠️ Technology Stack

### **Frontend**
- **React 18+** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Lightning-fast build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible component library
- **Radix UI** - Headless UI primitives
- **Lucide React** - Modern icon library
- **React Router** - Client-side routing

### **Backend**
- **Express.js** - Web application framework
- **Zod** - TypeScript-first schema validation
- **Netlify Functions** - Serverless deployment

### **Development Tools**
- **Prettier** - Code formatting
- **ESLint** - Code linting
- **Vitest** - Unit testing framework
- **PostCSS** - CSS processing

## 🎨 UI/UX Highlights

### **Design System**
- **Premium Gradients** - Modern visual aesthetics
- **Consistent Spacing** - Following design tokens
- **Accessibility First** - WCAG compliant components
- **Animation System** - Smooth transitions and micro-interactions

### **User Flows**
- **Intuitive Navigation** - Clear information architecture
- **Smart Defaults** - Reduced cognitive load
- **Progressive Disclosure** - Information when needed
- **Responsive Layouts** - Mobile-first design approach

## ⚡ Key Features Deep Dive

### 🗓️ **Smart Timetable**
- Visual weekly calendar with color-coded subjects
- 25+ comprehensive class schedules
- Real-time current time indicator
- Interactive class details with professor info
- Subject filtering and search functionality

### 🎪 **Campus Events**
- Interactive campus map with building locations
- Event markers with real-time positioning
- Event registration and management
- Category-based filtering (Technology, Cultural, Sports, etc.)
- Real-time attendee tracking

### 📚 **Learning Resources**
- Multi-level navigation (Resources → Subjects → Files)
- Subject categorization (Math, English, Psychology, Physics, MOS)
- File type organization (Presentations, Study Guides, Assignments, Past Papers, Handouts)
- Advanced search and filtering
- Download and preview functionality

### 👥 **Club Management**
- Comprehensive club directory
- Member management system
- Activity tracking and announcements
- Join/leave functionality
- Club-specific resources and events

### 🔧 **Profile System**
- Smart email-based name extraction
- Editable profile information
- Avatar with initials generation
- Authentication provider indicators
- Role-based customization

## 🌐 Offline Mode

icasconnect features a **complete offline mode** that provides full functionality without internet connection:

- **Mock Authentication** - Local user management
- **Comprehensive Data** - Rich dummy data for all features
- **Realistic Behavior** - Network delay simulation
- **Seamless Experience** - Identical UI/UX to online mode
- **Easy Toggle** - Switch between online/offline modes

## 🚀 Deployment

### **Netlify (Recommended)**
```bash
# Build for production
pnpm run build

# Deploy to Netlify
# Push to GitHub and connect to Netlify
```

### **Custom Server**
```bash
# Build application
pnpm run build

# Start production server
pnpm start
```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit changes** (`git commit -m 'Add amazing feature'`)
4. **Push to branch** (`git push origin feature/amazing-feature`)
5. **Open Pull Request**

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 Roadmap

- [ ] **Real-time Notifications** - WebSocket integration
- [ ] **Mobile App** - React Native version
- [ ] **Advanced Analytics** - Usage insights and reporting
- [ ] **Integration APIs** - LMS and external platform connections
- [ ] **AI-Powered Features** - Smart recommendations and insights
- [ ] **Video Conferencing** - Integrated virtual classrooms
- [ ] **Advanced File Management** - Version control and collaboration

## 🐛 Known Issues

- Map zoom controls are visual-only (functionality planned)
- Some animations may vary on different browsers
- Offline mode data resets on page refresh

## 📞 Support

For support, please create an issue in the repository or contact the development team.

---

**Built with ❤️ for the campus community**

*icasconnect - Connecting minds, building futures*
