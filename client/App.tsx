import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeProvider";
import { AuthProvider } from "./components/AuthProvider";
import { NotificationProvider } from "./hooks/use-notifications";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Events from "./pages/Events";
import Login from "./pages/Login";
import TeacherDashboard from "./pages/TeacherDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import Alumni from "./pages/Alumni";
import Register from "./pages/Register";
import PlaceholderPage from "./pages/PlaceholderPage";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Timetable from "./pages/Timetable";
import Calendar2025 from "./pages/Calendar";
import Clubs from "./pages/Clubs";
import ClubDashboard from "./pages/ClubDashboard";
import Resources from "./pages/Resources";
import ResourceSubjects from "./pages/ResourceSubjects";
import SubjectFiles from "./pages/SubjectFiles";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="system" storageKey="icasconnect-theme">
      <AuthProvider>
        <NotificationProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout><Index /></Layout>} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/student-dashboard" element={<Layout><StudentDashboard /></Layout>} />
                <Route path="/alumni" element={<Layout><Alumni /></Layout>} />
                <Route
                  path="/events"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Events />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clubs"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Clubs />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/clubs/:clubId"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ClubDashboard />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resources"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <Resources />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resources/:subjectId"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <ResourceSubjects />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/resources/:subjectId/:category"
                  element={
                    <ProtectedRoute>
                      <Layout>
                        <SubjectFiles />
                      </Layout>
                    </ProtectedRoute>
                  }
                />
                <Route path="/teacher-dashboard" element={<Layout><TeacherDashboard /></Layout>} />
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/settings" element={<Layout><Settings /></Layout>} />
                <Route path="/timetable" element={<Layout><Timetable /></Layout>} />
                <Route path="/calendar" element={<Layout><Calendar2025 /></Layout>} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<Layout><NotFound /></Layout>} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

createRoot(document.getElementById("root")!).render(<App />);
