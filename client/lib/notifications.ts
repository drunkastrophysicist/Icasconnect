import { Timestamp } from "firebase/firestore";

export interface NotificationData {
  id: string;
  announcementId: string;
  title: string;
  message: string;
  createdAt: Timestamp;
  authorName: string;
  isRead: boolean;
  readAt?: Date;
}

export interface NotificationState {
  notifications: NotificationData[];
  unreadCount: number;
}

const STORAGE_KEY = "campus-connect-notifications";

// Get notifications from localStorage
export const getStoredNotifications = (): NotificationState => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Convert stored timestamp objects back to Firestore-like objects
      const notifications = (parsed.notifications || []).map((notification: any) => ({
        ...notification,
        createdAt: notification.createdAt.seconds ? {
          seconds: notification.createdAt.seconds,
          nanoseconds: notification.createdAt.nanoseconds,
          toDate: () => new Date(notification.createdAt.seconds * 1000),
          toMillis: () => notification.createdAt.seconds * 1000
        } : notification.createdAt
      }));
      
      return {
        notifications,
        unreadCount: parsed.unreadCount || 0
      };
    }
  } catch (error) {
    console.error("Error reading notifications from storage:", error);
  }
  return { notifications: [], unreadCount: 0 };
};

// Save notifications to localStorage
export const saveNotifications = (state: NotificationState) => {
  try {
    // Convert Firestore Timestamps to plain objects for storage
    const serializableState = {
      ...state,
      notifications: state.notifications.map(notification => ({
        ...notification,
        createdAt: notification.createdAt.toDate ? {
          seconds: notification.createdAt.seconds,
          nanoseconds: notification.createdAt.nanoseconds
        } : notification.createdAt
      }))
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serializableState));
  } catch (error) {
    console.error("Error saving notifications to storage:", error);
  }
};

// Add a new notification
export const addNotification = (announcement: {
  id: string;
  title: string;
  message: string;
  createdAt: Timestamp;
  authorName: string;
}): NotificationData => {
  const notification: NotificationData = {
    id: `notif_${announcement.id}_${Date.now()}`,
    announcementId: announcement.id,
    title: announcement.title,
    message: announcement.message,
    createdAt: announcement.createdAt,
    authorName: announcement.authorName,
    isRead: false,
  };

  const currentState = getStoredNotifications();
  
  // Check if notification already exists
  const exists = currentState.notifications.some(
    n => n.announcementId === announcement.id
  );
  
  if (!exists) {
    const newState = {
      notifications: [notification, ...currentState.notifications],
      unreadCount: currentState.unreadCount + 1
    };
    saveNotifications(newState);
  }
  
  return notification;
};

// Mark notification as read
export const markAsRead = (notificationId: string) => {
  const currentState = getStoredNotifications();
  const updatedNotifications = currentState.notifications.map(notification => {
    if (notification.id === notificationId && !notification.isRead) {
      return {
        ...notification,
        isRead: true,
        readAt: new Date()
      };
    }
    return notification;
  });

  const unreadCount = updatedNotifications.filter(n => !n.isRead).length;
  
  const newState = {
    notifications: updatedNotifications,
    unreadCount
  };
  
  saveNotifications(newState);
  return newState;
};

// Mark all notifications as read
export const markAllAsRead = () => {
  const currentState = getStoredNotifications();
  const updatedNotifications = currentState.notifications.map(notification => ({
    ...notification,
    isRead: true,
    readAt: new Date()
  }));

  const newState = {
    notifications: updatedNotifications,
    unreadCount: 0
  };
  
  saveNotifications(newState);
  return newState;
};

// Clear old notifications (keep last 50)
export const cleanupOldNotifications = () => {
  const currentState = getStoredNotifications();
  if (currentState.notifications.length > 50) {
    const sortedNotifications = currentState.notifications
      .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
      .slice(0, 50);
    
    const unreadCount = sortedNotifications.filter(n => !n.isRead).length;
    
    const newState = {
      notifications: sortedNotifications,
      unreadCount
    };
    
    saveNotifications(newState);
    return newState;
  }
  return currentState;
};

// Get recent notifications (last 10)
export const getRecentNotifications = (limit: number = 10): NotificationData[] => {
  const currentState = getStoredNotifications();
  return currentState.notifications
    .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
    .slice(0, limit);
};
