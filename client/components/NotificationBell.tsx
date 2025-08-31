import { useState } from "react";
import { Bell, Check, CheckCheck, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { 
    notifications,
    unreadCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead
  } = useNotifications();
  
  const [isOpen, setIsOpen] = useState(false);
  
  // Debug logging
  console.log("NotificationBell render:", {
    notificationsCount: notifications.length,
    unreadCount,
    notifications: notifications.slice(0, 3) // Log first 3 for debugging
  });
  
  // Get recent notifications (sorted by creation time)
  const recentNotifications = notifications
    .sort((a, b) => {
      const aTime = a.createdAt.toDate ? a.createdAt.toDate().getTime() : a.createdAt.toMillis();
      const bTime = b.createdAt.toDate ? b.createdAt.toDate().getTime() : b.createdAt.toMillis();
      return bTime - aTime;
    })
    .slice(0, 10);

  const handleNotificationClick = (notificationId: string, isRead: boolean) => {
    if (!isRead) {
      markNotificationAsRead(notificationId);
    }
  };

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead();
  };

  // Simple time formatting function to avoid date-fns dependency
  const simpleFormatTime = (timestamp: any) => {
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return "Just now";
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch (error) {
      return "Just now";
    }
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs min-w-[20px]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-80 max-h-96" align="end">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleMarkAllAsRead}
              className="h-auto p-1 text-xs text-muted-foreground hover:text-foreground"
            >
              <CheckCheck className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator />
        
        {recentNotifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          <ScrollArea className="max-h-64">
            {recentNotifications.map((notification) => (
              <DropdownMenuItem
                key={notification.id}
                className={cn(
                  "flex flex-col items-start p-3 cursor-pointer transition-colors",
                  !notification.isRead && "bg-muted/50"
                )}
                onClick={() => handleNotificationClick(notification.id, notification.isRead)}
              >
                <div className="flex items-start justify-between w-full">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!notification.isRead && (
                        <div className="h-2 w-2 rounded-full bg-blue-500 flex-shrink-0" />
                      )}
                      <h4 className="text-sm font-medium truncate">
                        {notification.title}
                      </h4>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{simpleFormatTime(notification.createdAt)}</span>
                      <span>•</span>
                      <span>by {notification.authorName}</span>
                      {notification.isRead && (
                        <>
                          <span>•</span>
                          <Check className="h-3 w-3" />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </DropdownMenuItem>
            ))}
          </ScrollArea>
        )}
        
        {recentNotifications.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-muted-foreground justify-center">
              {recentNotifications.length >= 10 && "Showing latest 10 notifications"}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
