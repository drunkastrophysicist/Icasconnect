# 🔥 Firebase Authentication Setup Guide

## 🚀 Firebase Authentication Implementation

Your application now has **Firebase Authentication** integrated! Here's how to complete the setup:

## 📋 What's Already Done

✅ **Firebase SDK installed** (`firebase` package)  
✅ **Authentication logic implemented** in `AuthProvider.tsx`  
✅ **Login/Register components updated** to use Firebase  
✅ **Email/password authentication** configured  
✅ **Real-time auth state** listening  
✅ **Role-based authentication** (student/faculty detection)  

## 🛠️ Firebase Project Setup (Required)

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `icasconnect` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Click **Email/Password** 
3. Toggle **Enable** and click **Save**

### 3. Get Firebase Configuration
1. Go to **Project Settings** > **General**
2. Scroll down to "Your apps" section
3. Click **Web app** icon (`</> `)
4. Register your app with nickname: `icasconnect-web`
5. Copy the `firebaseConfig` object

### 4. Update Configuration
Replace the demo config in `client/lib/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456789"
};
```

## 🎯 How It Works

### **Login Process**
- Users enter email/password in login form
- Firebase validates credentials
- On success: User object created with role detection
- Role determined by email domain:
  - `@learner.manipal.edu` → Student
  - `@manipal.edu` → Faculty
  - Others → Student (default)

### **Registration Process**
- New users create account with email/password
- Firebase creates authentication record
- User automatically logged in after registration
- Profile data stored locally

### **Role Detection**
```typescript
// Automatic role assignment based on email
getUserRole = (email: string) => {
  if (email.includes("@manipal.edu")) return "faculty";
  if (email.includes("@admin.")) return "admin";
  return "student";
}
```

## 🔐 Authentication Features

| Feature | Status | Description |
|---------|--------|-------------|
| **Email/Password** | ✅ Ready | Standard login/register |
| **Role-based Access** | ✅ Ready | Auto-detect student/faculty |
| **Guest Access** | ✅ Ready | Offline mode available |
| **Password Reset** | 🔲 Available | Can be added easily |
| **Social Login** | 🔲 Available | Google/Facebook/etc |
| **Email Verification** | 🔲 Available | Optional security layer |

## 🧪 Testing

### Current Demo Mode
The app currently uses demo Firebase config, so authentication calls will fail. This is expected!

### After Firebase Setup
1. Start dev server: `npm run dev`
2. Go to `/register` and create account
3. Use created credentials to login
4. Check browser console for auth state changes

### Test Credentials (After Setup)
Create test accounts with these email patterns:
- **Student**: `john.doe@learner.manipal.edu`
- **Faculty**: `professor@manipal.edu` 
- **Admin**: `admin@admin.manipal.edu`

## 🚀 Optional Enhancements

### 1. Password Reset
```typescript
import { sendPasswordResetEmail } from 'firebase/auth';

const resetPassword = async (email: string) => {
  await sendPasswordResetEmail(auth, email);
};
```

### 2. Social Login (Google)
```typescript
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';

const loginWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  await signInWithPopup(auth, provider);
};
```

### 3. Email Verification
```typescript
import { sendEmailVerification } from 'firebase/auth';

const verifyEmail = async (user: FirebaseUser) => {
  await sendEmailVerification(user);
};
```

## 📱 Mobile Support
Firebase Auth works seamlessly on mobile browsers and can be easily integrated with React Native if you build a mobile app later.

## 🛡️ Security Features
- ✅ **Secure token management** (automatic)
- ✅ **Session persistence** (automatic)  
- ✅ **Real-time auth state** (automatic)
- ✅ **Password encryption** (Firebase handles)
- ✅ **Cross-device sync** (Firebase handles)

## 🎉 Ready to Use!

Once you add your Firebase config, your authentication system will be fully functional with:
- User registration and login
- Role-based access control  
- Secure session management
- Real-time authentication state
- Professional error handling

**Need help?** Check Firebase documentation at [firebase.google.com/docs/auth](https://firebase.google.com/docs/auth)
