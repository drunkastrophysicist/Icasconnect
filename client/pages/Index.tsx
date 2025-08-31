import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  BookOpen,
  Users,
  GraduationCap,
  Clock,
  TrendingUp,
  Bell,
  Star,
  ArrowRight,
  Map,
  Filter,
  Download,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/components/AuthProvider";

export default function Index() {
  const { user } = useAuth();

  const features = [
    {
      icon: MapPin,
      title: "Interactive Events Map",
      description: "Discover events happening around campus with our interactive map and smart filters",
      href: "/events",
      color: "bg-blue-50 text-blue-600 border-blue-200",
      iconColor: "text-blue-600",
      highlights: ["Real-time updates", "Location-based discovery", "Smart filtering"],
    },
    {
      icon: GraduationCap,
      title: "Academic Hub",
      description: "Stay on top of your academic schedule with calendars and timetables",
      href: "/academic",
      color: "bg-green-50 text-green-600 border-green-200",
      iconColor: "text-green-600",
      highlights: ["Academic calendar", "Personal timetable", "Exam schedules"],
    },
    {
      icon: Users,
      title: "icasconnect Clubs",
      description: "Join clubs, view announcements, and connect with like-minded students",
      href: "/clubs",
      color: "bg-purple-50 text-purple-600 border-purple-200",
      iconColor: "text-purple-600",
      highlights: ["Club discovery", "Event announcements", "Member networking"],
    },
    {
      icon: BookOpen,
      title: "Resource Hub",
      description: "Access study materials, notes, and academic resources shared by the community",
      href: "/resources",
      color: "bg-orange-50 text-orange-600 border-orange-200",
      iconColor: "text-orange-600",
      highlights: ["Study notes", "Past papers", "Study groups"],
    },
    {
      icon: Clock,
      title: "Faculty Connect",
      description: "Stay updated with faculty announcements and important academic notices",
      href: "/teachers",
      color: "bg-red-50 text-red-600 border-red-200",
      iconColor: "text-red-600",
      highlights: ["Faculty announcements", "Office hours", "Important notices"],
    },
  ];

  const stats = [
    { label: "Active Events", value: "45+", icon: Calendar },
    { label: "Registered Clubs", value: "120+", icon: Users },
    { label: "Study Resources", value: "500+", icon: BookOpen },
    { label: "Faculty Members", value: "200+", icon: GraduationCap },
  ];

  const recentEvents = [
    {
      title: "Tech Fest 2024",
      location: "Main Auditorium",
      time: "2:00 PM",
      date: "Today",
      category: "Technology",
    },
    {
      title: "Cultural Night",
      location: "Open Air Theatre",
      time: "6:00 PM",
      date: "Tomorrow",
      category: "Cultural",
    },
    {
      title: "Career Fair",
      location: "Student Center",
      time: "10:00 AM",
      date: "Dec 20",
      category: "Career",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary/5 to-accent/10 border-b">
        <div className="container mx-auto px-4 py-16 lg:py-24">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <TrendingUp className="h-4 w-4 mr-2" />
              Connecting Campus Life
            </Badge>
            
            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6">
              {user ? (
                <>
                  Welcome back,
                  <span className="text-primary block">{user.name.split(' ')[0]}!</span>
                </>
              ) : (
                <>
                  Your Complete
                  <span className="text-primary block">icasconnect Platform</span>
                </>
              )}
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {user ? (
                user.authProvider === "guest" ? 
                  "You're browsing as a guest. Sign in for full access to all icasconnect features." :
                  `Ready to explore what's happening around campus? Check out the latest events and updates for ${user.department || "your community"}.`
              ) : (
                "icasconnect brings together events, academics, clubs, and resources in one unified platform. Discover, connect, and thrive in your campus community."
              )}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {user ? (
                user.authProvider === "guest" ? (
                  <>
                    <Button size="lg" asChild>
                      <Link to="/login">
                        <UserPlus className="h-5 w-5 mr-2" />
                        Sign In for Full Access
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/events">
                        <Map className="h-5 w-5 mr-2" />
                        Explore Events Map
                      </Link>
                    </Button>
                  </>
                ) : (
                  <>
                    <Button size="lg" asChild>
                      <Link to="/events">
                        <Map className="h-5 w-5 mr-2" />
                        Explore Events Map
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="/academic">
                        <GraduationCap className="h-5 w-5 mr-2" />
                        My Academic Hub
                      </Link>
                    </Button>
                  </>
                )
              ) : (
                <>
                  <Button size="lg" asChild>
                    <Link to="/login">
                      <UserPlus className="h-5 w-5 mr-2" />
                      Get Started
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link to="/events">
                      <Map className="h-5 w-5 mr-2" />
                      Explore Events Map
                    </Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              Everything You Need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Comprehensive tools and features designed specifically for campus life at Manipal
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <Link key={index} to={feature.href} className="block h-full">
                <Card className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 h-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${feature.color}`}>
                        <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors">
                      {feature.title}
                    </CardTitle>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {feature.highlights.map((highlight, i) => (
                        <div key={i} className="flex items-center text-sm">
                          <div className="w-2 h-2 rounded-full bg-primary mr-3" />
                          {highlight}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Events & Quick Actions */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Recent Events */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">Happening Now</h3>
                <Button variant="ghost" asChild>
                  <Link to="/events">
                    View All <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
              <div className="space-y-4">
                {recentEvents.map((event, index) => (
                  <Card key={index} className="p-4 cursor-pointer hover:shadow-md transition-all duration-300">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {event.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{event.date}</span>
                        </div>
                        <h4 className="font-semibold mb-1">{event.title}</h4>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="h-4 w-4 mr-1" />
                          {event.location}
                          <span className="mx-2">•</span>
                          <Clock className="h-4 w-4 mr-1" />
                          {event.time}
                        </div>
                      </div>
                      <Button size="sm" variant="ghost">
                        <Bell className="h-4 w-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div>
              <h3 className="text-2xl font-bold mb-6">Quick Actions</h3>
              <div className="grid gap-4">
                <Link to="/events" className="block">
                  <Card className="p-4 cursor-pointer hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                        <Filter className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold">Find Events Near You</div>
                        <div className="text-sm text-muted-foreground">
                          Use our smart filters to discover relevant events
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link to="/clubs" className="block">
                  <Card className="p-4 cursor-pointer hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-purple-600" />
                      </div>
                      <div>
                        <div className="font-semibold">Join Club Discussions</div>
                        <div className="text-sm text-muted-foreground">
                          Connect with clubs and view their latest updates
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link to="/resources" className="block">
                  <Card className="p-4 cursor-pointer hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                        <Download className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                        <div className="font-semibold">Access Study Materials</div>
                        <div className="text-sm text-muted-foreground">
                          Download notes and resources shared by peers
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>

                <Link to="/academic" className="block">
                  <Card className="p-4 cursor-pointer hover:shadow-md transition-all duration-300">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                        <Star className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-semibold">Check Your Schedule</div>
                        <div className="text-sm text-muted-foreground">
                          View your personalized academic timetable
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Connect?
          </h2>
          <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
            Join the icasconnect community and make the most of your campus experience.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/events">
              Get Started
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
