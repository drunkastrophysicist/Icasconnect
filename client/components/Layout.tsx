import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MapPin,
  Calendar,
  BookOpen,
  Users,
  GraduationCap,
  Clock,
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/AuthProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { NotificationBell } from "@/components/NotificationBell";
import { extractNameFromEmail, getInitials } from "@/lib/nameUtils";

interface LayoutProps {
  children: React.ReactNode;
}

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  children?: NavigationItem[];
}

const navigation: NavigationItem[] = [
  {
    name: "Events",
    href: "/events",
    icon: MapPin,
    description: "Interactive map and event discovery",
    color: "text-blue-600",
  },
  {
    name: "Resources",
    href: "/resources",
    icon: BookOpen,
    description: "Study materials and learning resources",
    color: "text-orange-600",
  },
  {
    name: "Clubs",
    href: "/clubs",
    icon: Users,
    description: "Join clubs and view announcements",
    color: "text-purple-600",
  },
  {
    name: "Timetable",
    href: "/timetable",
    icon: Clock,
    description: "View your class timetable",
    color: "text-green-600",
  },
  {
    name: "Calendar",
    href: "/calendar",
    icon: Calendar,
    description: "Academic calendar and events",
    color: "text-cyan-600",
  },
  {
    name: "Alumni",
    href: "/alumni",
    icon: UserCircle,
    description: "Connect with alumni",
    color: "text-red-600",
  },
];

export default function Layout({ children }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  // Extract display name from email if needed
  const displayName = user?.name && user.name !== "User" && user.name !== "Guest User" 
    ? user.name 
    : user?.email ? extractNameFromEmail(user.email) : "User";

  const userInitials = user?.initials || getInitials(displayName, user?.email);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl">
              icas<span className="text-primary">connect</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden md:flex mx-6">
            <NavigationMenuList>
              {navigation.map((item) => (
                <NavigationMenuItem key={item.name}>
                  {item.children ? (
                    <>
                      <NavigationMenuTrigger
                        className={cn(
                          "h-9",
                          isActive(item.href) && "bg-accent text-accent-foreground"
                        )}
                      >
                        <item.icon className={cn("h-4 w-4 mr-2", item.color)} />
                        {item.name}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                          {item.children.map((child) => (
                            <li key={child.name}>
                              <NavigationMenuLink asChild>
                                <Link
                                  to={child.href}
                                  className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                >
                                  <div className="text-sm font-medium leading-none">
                                    {child.name}
                                  </div>
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link to={item.href}>
                        <div
                          className={cn(
                            "group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50",
                            isActive(item.href) && "bg-accent text-accent-foreground"
                          )}
                        >
                          <item.icon className={cn("h-4 w-4 mr-2", item.color)} />
                          {item.name}
                        </div>
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Right side */}
          <div className="ml-auto flex items-center space-x-2">
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Dashboard Button for logged-in users */}
            {user && (
              <Button
                asChild
                variant="outline"
                className="hidden md:inline-flex"
              >
                <Link to={user.role === "faculty" ? "/teacher-dashboard" : "/student-dashboard"}>
                  Dashboard
                </Link>
              </Button>
            )}

            <div className="w-full flex items-center justify-end gap-2">
              {/* Notifications & Profile for logged-in users */}
              {user ? (
                <div className="flex items-center gap-2 relative">
                  {/* Notification Bell - Only for students */}
                  {user.role === "student" && (
                    <NotificationBell />
                  )}
                  
                  {/* User Menu */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={user.avatar} alt={displayName} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {userInitials}
                          </AvatarFallback>
                        </Avatar>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end" forceMount>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{displayName}</p>
                          <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                          </p>
                          {user.department && (
                            <p className="text-xs leading-none text-muted-foreground">
                              {user.department} • {user.year}
                            </p>
                          )}
                        </div>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="flex items-center">
                          <UserCircle className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/settings" className="flex items-center">
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={logout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ) : (
                <Button asChild variant="outline" className="ml-2">
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <SheetHeader>
                  <SheetTitle>Navigation</SheetTitle>
                  <SheetDescription>
                    Access all icasconnect features
                  </SheetDescription>
                </SheetHeader>

                {/* User info in mobile menu */}
                {user && (
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} alt={displayName} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {userInitials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{displayName}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                        {user.department && (
                          <p className="text-xs text-muted-foreground">
                            {user.department} • {user.year}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-6 space-y-1">
                  {/* Dashboard Button for mobile menu */}
                  {user && (
                    <Button
                      asChild
                      variant="outline"
                      className="w-full mb-2"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Link to={user.role === "faculty" ? "/teacher-dashboard" : "/student-dashboard"}>
                        Dashboard
                      </Link>
                    </Button>
                  )}
                  {navigation.map((item) => (
                    <div key={item.name}>
                      <Link
                        to={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                          isActive(item.href) && "bg-accent text-accent-foreground"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5", item.color)} />
                        <span>{item.name}</span>
                      </Link>
                      {item.children && (
                        <div className="ml-8 mt-1 space-y-1">
                          {item.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className="block rounded-lg px-3 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Mobile actions */}
                  <div className="mt-6 pt-4 border-t space-y-1">
                    {user ? (
                      <>
                        {user.role === "student" && (
                          <div className="relative">
                            <Button
                              variant="ghost"
                              className="w-full justify-start"
                              onClick={() => setIsMobileMenuOpen(false)}
                            >
                              <Bell className="mr-2 h-4 w-4" />
                              Notifications
                            </Button>
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => {
                            logout();
                            setIsMobileMenuOpen(false);
                          }}
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Sign Out
                        </Button>
                      </>
                    ) : (
                      <Button
                        className="w-full"
                        asChild
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <Link to="/login">Sign In</Link>
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}
