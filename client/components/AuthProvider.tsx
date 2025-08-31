import { createContext, useContext, useEffect, useState } from "react";
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
  login: (provider: "google" | "school" | "faculty") => Promise<void>;
  logout: () => void;
  loginAsGuest: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const savedUser = localStorage.getItem("campus-connect-user");
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        localStorage.removeItem("campus-connect-user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (provider: "google" | "school" | "faculty") => {
    setIsLoading(true);
    try {
      // Simulate authentication - in a real app, this would call your auth service
      await new Promise(resolve => setTimeout(resolve, 1000));

      let mockUser: User;

      if (provider === "google") {
        // In a real app, you'd get this from Google OAuth response
        const googleEmail = "john.doe@gmail.com"; // This would come from actual Google auth
        const extractedName = extractNameFromEmail(googleEmail);
        
        mockUser = {
          id: "google_123",
          name: extractedName,
          email: googleEmail,
          avatar: "/placeholder.svg",
          role: "student",
          department: "Computer Science",
          year: "3rd Year",
          authProvider: "google",
          roll: "CS23045",
          course: "B.Tech Computer Science",
          section: "A",
          phone: "+91-9876543210",
          initials: getInitials(extractedName, googleEmail)
        };
      } else if (provider === "faculty") {
        const facultyEmail = "alan.turing@manipal.edu";
        const extractedName = extractNameFromEmail(facultyEmail);
        
        mockUser = {
          id: "faculty_001",
          name: extractedName,
          email: facultyEmail,
          avatar: "/placeholder.svg",
          role: "faculty",
          department: "Computer Science",
          year: "N/A",
          authProvider: "school",
          roll: "FAC1001",
          course: "Faculty",
          section: "N/A",
          phone: "+91-9000000000",
          initials: getInitials(extractedName, facultyEmail)
        };
      } else {
        const schoolEmail = "jane.smith@manipal.edu";
        const extractedName = extractNameFromEmail(schoolEmail);
        
        mockUser = {
          id: "school_456",
          name: extractedName,
          email: schoolEmail,
          avatar: "/placeholder.svg",
          role: "student",
          department: "Information Technology",
          year: "2nd Year",
          authProvider: "school",
          roll: "IT22012",
          course: "B.Tech Information Technology",
          section: "B",
          phone: "+91-9123456780",
          initials: getInitials(extractedName, schoolEmail)
        };
      }

      setUser(mockUser);
      localStorage.setItem("campus-connect-user", JSON.stringify(mockUser));
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    } finally {
      setIsLoading(false);
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

  const logout = () => {
    setUser(null);
    localStorage.removeItem("campus-connect-user");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
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
