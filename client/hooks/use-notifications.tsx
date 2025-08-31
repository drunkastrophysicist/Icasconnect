import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";
import { subscribeToAnnouncements } from "@/lib/announcements";
import { 
  NotificationData, 
  NotificationState, 
  getStoredNotifications, 
  addNotification, 
  markAsRead, 
  markAllAsRead,
  cleanupOldNotifications,
  getRecentNotifications
} from "@/lib/notifications";

interface NotificationContextType {
  notifications: NotificationData[];
  unreadCount: number;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  getRecentNotifications: (limit?: number) => NotificationData[];
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notificationState, setNotificationState] = useState<NotificationState>(() => {
    const initial = getStoredNotifications();
    console.log("NotificationProvider initial state:", initial);
    return initial;
  });

  // Subscribe to new announcements and create notifications
  useEffect(() => {
    if (!user || user.role !== "student") return;

    console.log("Setting up notification listener for student:", user.email);

    try {
      const unsubscribe = subscribeToAnnouncements((announcements) => {
        console.log("Received announcements update:", announcements.length);
        
        const currentState = getStoredNotifications();
        const existingAnnouncementIds = new Set(
          currentState.notifications.map(n => n.announcementId)
        );

        let newNotificationsAdded = false;

        // Check for new announcements
        announcements.forEach((announcement) => {
          if (!existingAnnouncementIds.has(announcement.id)) {
            console.log("New announcement detected, creating notification:", announcement.title);
            addNotification(announcement);
            newNotificationsAdded = true;
          }
        });

        if (newNotificationsAdded) {
          // Update state with new notifications
          const updatedState = getStoredNotifications();
          setNotificationState(updatedState);
          
          // Show browser notification if permission granted
          if (typeof Notification !== "undefined" && Notification.permission === "granted") {
            const latestAnnouncement = announcements[0];
            if (latestAnnouncement && !existingAnnouncementIds.has(latestAnnouncement.id)) {
              new Notification(`New Announcement: ${latestAnnouncement.title}`, {
                body: latestAnnouncement.message.substring(0, 100) + "...",
                icon: "/favicon.ico",
                tag: latestAnnouncement.id
              });
            }
          }
        }
      });

      return unsubscribe;
    } catch (error) {
      console.error("Error setting up notifications:", error);
    }
  }, [user]);

  // Request notification permission on mount
  useEffect(() => {
    if (user?.role === "student" && typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission().then((permission) => {
        console.log("Notification permission:", permission);
      }).catch((error) => {
        console.log("Error requesting notification permission:", error);
      });
    }
  }, [user]);

  // Cleanup old notifications periodically
  useEffect(() => {
    const interval = setInterval(() => {
      try {
        const cleanedState = cleanupOldNotifications();
        setNotificationState(cleanedState);
      } catch (error) {
        console.error("Error cleaning up notifications:", error);
      }
    }, 5 * 60 * 1000); // Every 5 minutes

    return () => clearInterval(interval);
  }, []);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    try {
      const newState = markAsRead(notificationId);
      setNotificationState(newState);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    try {
      const newState = markAllAsRead();
      setNotificationState(newState);
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
    }
  }, []);

  const getRecentNotificationsCallback = useCallback((limit?: number) => {
    try {
      return getRecentNotifications(limit);
    } catch (error) {
      console.error("Error getting recent notifications:", error);
      return [];
    }
  }, []);

  const value = {
    notifications: notificationState.notifications || [],
    unreadCount: notificationState.unreadCount || 0,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    getRecentNotifications: getRecentNotificationsCallback,
  };

  console.log("NotificationProvider value:", value);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
}
