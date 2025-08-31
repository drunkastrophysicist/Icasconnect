import React, { useMemo, useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getEvents, getNotifications, getSchedules, getCourses, getMe } from "../../shared/api";
import {
  CalendarIcon,
  BookOpenIcon,
  ClipboardListIcon,
  CheckCircleIcon,
  AlertCircleIcon,
  ClockIcon,
  CalendarPlusIcon,
  AlarmClockIcon,
  BellIcon,
  InfoIcon,
  FileWarningIcon,
  CircleIcon,
  XIcon,
  BotIcon,
  MicIcon,
  CodeIcon,
  TrophyIcon
} from "lucide-react";

export default function StudentDashboard() {
  const { user } = useAuth();
  
  // State for API data
  const [events, setEvents] = useState([
    { id: 1, name: "Robotics Club Workshop", date: "Today", location: "NLH 5", category: "Tech", icon: <BotIcon size={20} /> },
    { id: 2, name: "Sports Fest", date: "Tomorrow", location: "Main Ground", category: "Sports", icon: <TrophyIcon size={20} /> },
    { id: 3, name: "Coding Hackathon", date: "This Week", location: "Lab 2", category: "Tech", icon: <CodeIcon size={20} /> },
    { id: 4, name: "Music Night", date: "This Week", location: "Auditorium", category: "Cultural", icon: <MicIcon size={20} /> },
  ]);
  const [notifications, setNotifications] = useState([
    { type: "exam", message: "Exam rescheduled: Physics Midsem now on 5th Sept.", icon: <FileWarningIcon size={16} /> },
    { type: "class", message: "Class cancelled: Math at 2 PM today.", icon: <BellIcon size={16} /> },
    { type: "general", message: "Prof. Rao: Quiz postponed to Friday.", icon: <InfoIcon size={16} /> },
  ]);
  const [schedules, setSchedules] = useState([]);
  const [nextClass, setNextClass] = useState({
    name: "Engg Mechanics",
    time: "10:00 AM",
    location: "NLH 3",
  });
  const [assignments, setAssignments] = useState([
    { title: "Math Assignment 2", due: "Today, 5:00 PM", status: "pending" },
    { title: "Physics Lab Report", due: "Yesterday, 11:59 PM", status: "overdue" },
    { title: "DSA Project", due: "Completed", status: "completed" },
  ]);
  const [exam, setExam] = useState({ name: "Midsem Physics", date: "2025-09-05" });
  const [loading, setLoading] = useState(false);

  // Load data from API
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        // Load events
        const eventsResult = await getEvents();
        if (eventsResult.success && eventsResult.data) {
          const apiEvents = eventsResult.data.slice(0, 4).map((event: any, index: number) => ({
            id: event.id || index + 10,
            name: event.title || event.name || "Event",
            date: "This Week",
            location: event.location || "TBD",
            category: event.category || "Academic",
            icon: <CalendarIcon size={20} />
          }));
          setEvents(prev => [...prev, ...apiEvents]);
        }

        // Load notifications
        const notificationsResult = await getNotifications();
        if (notificationsResult.success && notificationsResult.data) {
          const apiNotifications = notificationsResult.data.slice(0, 3).map((notif: any) => ({
            type: notif.type || "general",
            message: notif.message || notif.title || "New notification",
            icon: <InfoIcon size={16} />
          }));
          setNotifications(prev => [...prev, ...apiNotifications]);
        }

        // Load schedules
        const schedulesResult = await getSchedules();
        if (schedulesResult.success && schedulesResult.data) {
          setSchedules(schedulesResult.data);
          
          // Extract next class from schedules
          const now = new Date();
          const todaySchedules = schedulesResult.data.filter((schedule: any) => {
            // Filter for today's classes that haven't started yet
            return schedule.date === now.toISOString().split('T')[0];
          });
          
          if (todaySchedules.length > 0) {
            const next = todaySchedules[0];
            setNextClass({
              name: next.subject || next.name || "Next Class",
              time: next.startTime || "TBD",
              location: next.room || next.location || "TBD"
            });
          }
        }

        // Load courses for assignments (mock assignments based on courses)
        const coursesResult = await getCourses();
        if (coursesResult.success && coursesResult.data) {
          const courseAssignments = coursesResult.data.slice(0, 3).map((course: any, index: number) => ({
            title: `${course.title || course.name} Assignment`,
            due: index === 0 ? "Today, 5:00 PM" : index === 1 ? "Tomorrow, 11:59 PM" : "Next Week",
            status: index === 2 ? "completed" : index === 1 ? "overdue" : "pending"
          }));
          setAssignments(courseAssignments);
        }
      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);
  const today = new Date();
  const examDate = new Date(exam.date);
  const daysToExam = Math.ceil((examDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const [eventFilter, setEventFilter] = useState("All");
  const [eventCategory, setEventCategory] = useState("All");
  const filteredEvents = useMemo(() => {
    let filtered = events;
    if (eventFilter === "Today") filtered = filtered.filter(e => e.date === "Today");
    if (eventFilter === "This Week") filtered = filtered.filter(e => e.date === "This Week" || e.date === "Tomorrow");
    if (eventCategory !== "All") filtered = filtered.filter(e => e.category === eventCategory);
    return filtered;
  }, [eventFilter, eventCategory, events]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background p-0 flex flex-col items-center justify-start font-sans">
      <div className="w-full max-w-6xl flex flex-col gap-8 px-2 md:px-4 lg:px-6 py-6 items-center">
        {/* Enhanced Welcome */}
        <div className="w-full flex justify-center items-center">
          <div className="w-full max-w-2xl mx-auto bg-card rounded-2xl border border-border shadow-lg p-8 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="text-3xl font-bold text-foreground flex items-center gap-3">
                <span className="animate-bounce text-4xl">👋</span>
                Welcome back, {user?.name || "Jane"}!
              </div>
              <div className="text-lg text-muted-foreground font-medium">Ready for a productive day?</div>
            </div>
          </div>
        </div>

        {/* Enhanced Today's Essentials */}
        <div className="w-full flex flex-col gap-8 items-center justify-center">
          <div className="w-full max-w-3xl bg-card rounded-2xl border border-border shadow-lg p-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
              <CalendarIcon size={24} className="text-primary" />
              Today's Essentials
            </h2>
            
            {/* Next Class Container */}
            <div className="bg-muted rounded-xl p-6 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-muted-foreground font-medium mb-1">Next class:</span>
                  <span className="text-2xl font-bold text-primary">{nextClass.name}</span>
                  <span className="text-foreground mt-1">{nextClass.time} • {nextClass.location}</span>
                </div>
                <div className="text-4xl">📚</div>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Assignments Container */}
            <div className="bg-muted rounded-xl p-6 mb-6">
              <div className="flex items-center gap-2 mb-4">
                <ClipboardListIcon size={20} className="text-primary" />
                <span className="font-bold text-foreground">Assignments/Deadlines</span>
              </div>
              <div className="flex flex-col gap-3">
                {assignments.filter(a => a.status !== "completed").map((a, i) => {
                  let statusColor = "text-muted-foreground";
                  let bgColor = "bg-muted";
                  let icon = <CircleIcon size={16} />;
                  if (a.status === "overdue") { 
                    statusColor = "text-red-400"; 
                    bgColor = "bg-red-900/20"; 
                    icon = <AlertCircleIcon size={16} className="text-red-400" />; 
                  } else if (a.status === "pending" && a.due.includes("Today")) { 
                    statusColor = "text-orange-400"; 
                    bgColor = "bg-orange-900/20"; 
                    icon = <ClockIcon size={16} className="text-orange-400" />; 
                  }
                  return (
                    <div key={i} className={`flex items-center justify-between px-4 py-3 rounded-lg ${bgColor} transition-all duration-200`}>
                      <div className="flex items-center gap-3">
                        {icon}
                        <span className={`font-medium ${statusColor}`}>{a.title}</span>
                        <span className="text-xs text-muted-foreground">({a.due})</span>
                      </div>
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-400 text-white hover:scale-105 transition-all duration-200">
                        <CalendarPlusIcon size={16} className="mr-1" /> Add
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Enhanced Exam Countdown */}
            {daysToExam <= 7 && (
              <div className="bg-gradient-to-r from-primary/20 to-primary/10 rounded-xl p-6 border border-primary/20">
                <div className="flex items-center gap-2 mb-4">
                  <AlarmClockIcon size={20} className="text-primary" />
                  <span className="font-bold text-foreground">Exam Countdown</span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold text-primary">{exam.name}</div>
                    <div className="text-xl text-foreground mt-1">in <span className="text-primary font-bold">{daysToExam} day{daysToExam !== 1 ? "s" : ""}</span>!</div>
                  </div>
                  <div className="relative w-24 h-24">
                    <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-muted" strokeWidth="8" fill="none" />
                      <circle 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        stroke="currentColor"
                        className="text-primary"
                        strokeWidth="8" 
                        fill="none"
                        strokeDasharray={`${Math.max(0, 251 - daysToExam * 35)} 251`}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-lg font-bold text-primary">{daysToExam}d</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Notifications */}
          <div className="w-full max-w-3xl bg-card rounded-2xl border border-border shadow-lg p-8">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2 mb-6">
              <BellIcon size={24} className="text-primary" />
              Notifications & Announcements
            </h2>
            <div className="flex flex-col gap-4">
              {notifications.map((n, i) => {
                let tagColor = "bg-muted text-muted-foreground";
                let tagText = "General";
                if (n.type === "exam") { 
                  tagColor = "bg-blue-500 text-white"; 
                  tagText = "Exam"; 
                } else if (n.type === "class") { 
                  tagColor = "bg-orange-500 text-white"; 
                  tagText = "Class Update"; 
                }
                return (
                  <div key={i} className="group flex items-center justify-between bg-muted rounded-xl px-5 py-4 hover:bg-accent transition-all duration-200">
                    <div className="flex items-center gap-4">
                      <div className="text-primary">{n.icon}</div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${tagColor}`}>
                        {tagText}
                      </span>
                      <span className="text-foreground font-medium">{n.message}</span>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-foreground transition-all duration-200">
                      <XIcon size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Enhanced icasconnect Events */}
        <div className="w-full flex flex-col gap-8 items-center justify-center">
          <div className="w-full max-w-3xl bg-card rounded-2xl border border-border shadow-lg p-8">
            <h2 className="text-2xl font-bold text-foreground mb-6">icasconnect Events</h2>
            <div className="flex flex-wrap gap-4 mb-6 justify-between">
              <div className="flex gap-3">
                {['All', 'Tech', 'Cultural', 'Sports'].map(cat => (
                  <Button 
                    key={cat} 
                    variant={eventCategory === cat ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setEventCategory(cat)}
                    className={eventCategory === cat ? 
                      "bg-primary text-primary-foreground shadow-lg" : 
                      "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                  >
                    {cat}
                  </Button>
                ))}
              </div>
              <div className="flex gap-3">
                {['Today', 'This Week', 'All'].map(f => (
                  <Button 
                    key={f} 
                    variant={eventFilter === f ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setEventFilter(f)}
                    className={eventFilter === f ? 
                      "bg-primary text-primary-foreground shadow-lg" : 
                      "border-border text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    }
                  >
                    {f}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-4">
              {filteredEvents.map(e => (
                <div key={e.id} className="flex items-center justify-between bg-muted rounded-xl px-6 py-4 hover:bg-accent transition-all duration-200">
                  <div className="flex items-center gap-4">
                    <div className="text-primary">{e.icon}</div>
                    <div className="flex flex-col">
                      <span className="font-bold text-foreground">{e.name}</span>
                      <span className="text-sm text-muted-foreground">{e.date} • {e.location}</span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      e.category === 'Tech' ? 'bg-blue-500 text-white' :
                      e.category === 'Cultural' ? 'bg-purple-500 text-white' :
                      e.category === 'Sports' ? 'bg-green-500 text-white' :
                      'bg-muted text-muted-foreground'
                    }`}>
                      {e.category}
                    </span>
                  </div>
                  <Button 
                    size="sm" 
                    className="bg-primary text-primary-foreground hover:scale-105 transition-all duration-200"
                  >
                    <CalendarPlusIcon size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
