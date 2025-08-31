import { createContext, useContext, useEffect, useState } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { extractNameFromEmail, getInitials } from "@/lib/nameUtils";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: "student" | "faculty" | "admin";
  department?: string;
  year?: string;
  authProvider: "google" | "school" | "guest";
  roll?: string;
  course?: string;
  section?: string;
  phone?: string;
  initials?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: "student" | "faculty") => Promise<void>;
  register: (email: string, password: string, role?: "student" | "faculty") => Promise<void>;
  logout: () => Promise<void>;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // Convert Firebase user to our User interface
        const extractedName = extractNameFromEmail(firebaseUser.email || "");
        const userRole = getUserRole(firebaseUser.email || "");
        
        const campusUser: User = {
          id: firebaseUser.uid,
          name: extractedName,
          email: firebaseUser.email || "",
          avatar: firebaseUser.photoURL || undefined,
          role: userRole,
          department: getDepartmentFromEmail(firebaseUser.email || ""),
          authProvider: "school",
          initials: getInitials(extractedName, firebaseUser.email || "")
        };
        
        setUser(campusUser);
        localStorage.setItem("campus-connect-user", JSON.stringify(campusUser));
      } else {
        setUser(null);
        localStorage.removeItem("campus-connect-user");
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Helper function to determine user role from email domain
  const getUserRole = (email: string): "student" | "faculty" | "admin" => {
    if (email.includes("@manipal.edu") || email.includes("@faculty.")) {
      return "faculty";
    }
    if (email.includes("@admin.")) {
      return "admin";
    }
    return "student";
  };

  // Helper function to extract department from email
  const getDepartmentFromEmail = (email: string): string => {
    if (email.includes("cs") || email.includes("computer")) return "Computer Science";
    if (email.includes("ee") || email.includes("electrical")) return "Electrical Engineering";
    if (email.includes("me") || email.includes("mechanical")) return "Mechanical Engineering";
    return "General";
  };

  const login = async (email: string, password: string, role?: "student" | "faculty") => {
    setIsLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // User state will be updated automatically by onAuthStateChanged
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || "Login failed");
    }
  };

  const register = async (email: string, password: string, role?: "student" | "faculty") => {
    setIsLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      // User state will be updated automatically by onAuthStateChanged
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || "Registration failed");
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await signOut(auth);
      // User state will be updated automatically by onAuthStateChanged
    } catch (error: any) {
      setIsLoading(false);
      throw new Error(error.message || "Logout failed");
    }
  };

  const loginAsGuest = () => {
    const guestUser: User = {
      id: "guest_789",
      name: "Guest User",
      email: "guest@campus-connect.com",
      role: "student",
      authProvider: "guest",
      roll: "N/A",
      course: "N/A",
      section: "N/A",
      phone: "N/A",
      initials: "GU"
    };

    setUser(guestUser);
    localStorage.setItem("campus-connect-user", JSON.stringify(guestUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        loginAsGuest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
