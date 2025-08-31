import React from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Users,
  Calendar,
  MapPin,
  Mail,
  Globe,
  QrCode,
  Share2,
  Heart,
  UserPlus,
  Activity,
  Bot,
  Atom,
  Palette,
  BookOpen,
  Code,
  Music,
  Camera,
  Gamepad2
} from "lucide-react";

const clubData = {
  "robotics-club": {
    name: "Robotics Club",
    description: "Design, build, and program cutting-edge robots. Compete in national robotics competitions and explore AI integration.",
    category: "Technical",
    members: 42,
    status: "Recruiting",
    icon: Bot,
    gradient: "from-blue-500 to-purple-600",
    statusColor: "bg-green-500/20 text-green-400",
    bio: "The Robotics Club is where innovation meets engineering excellence. Founded in 2018, we've grown into one of the most dynamic technical clubs on campus. Our members work on everything from autonomous drones to humanoid robots, pushing the boundaries of what's possible in robotics and AI. We participate in national competitions like RoboCup and FIRST Robotics, where our teams have consistently placed in the top rankings. Whether you're a beginner eager to learn or an experienced builder ready to tackle complex challenges, our club offers workshops, mentorship, and hands-on projects that will expand your skills and ignite your passion for robotics.",
    president: "Alex Chen",
    email: "robotics@icasconnect.online",
    meetingTime: "Wednesdays 6:00 PM",
    location: "Engineering Lab 3",
    website: "robotics.icasconnect.online",
    upcomingEvents: [
      { title: "Robot Building Workshop", date: "Sept 5", time: "2:00 PM" },
      { title: "AI Integration Seminar", date: "Sept 12", time: "4:00 PM" },
      { title: "Competition Prep Meeting", date: "Sept 19", time: "6:00 PM" }
    ]
  },
  "research-society": {
    name: "Research Society",
    description: "Dive deep into academic research across multiple disciplines. Collaborate with faculty on groundbreaking projects.",
    category: "Academic",
    members: 38,
    status: "Active",
    icon: Atom,
    gradient: "from-purple-500 to-pink-600",
    statusColor: "bg-blue-500/20 text-blue-400",
    bio: "The Research Society bridges the gap between undergraduate curiosity and graduate-level research excellence. Our members work alongside faculty mentors on cutting-edge research projects spanning physics, chemistry, biology, computer science, and interdisciplinary studies. We've published over 25 papers in peer-reviewed journals and presented research at international conferences. The society provides funding for research materials, conference travel, and publication fees. Join us to develop critical thinking skills, contribute to scientific knowledge, and build a strong foundation for graduate studies or research careers.",
    president: "Dr. Sarah Williams",
    email: "research@icasconnect.online",
    meetingTime: "Fridays 3:00 PM",
    location: "Research Center",
    website: "research.icasconnect.online",
    upcomingEvents: [
      { title: "Research Methodology Workshop", date: "Sept 8", time: "3:00 PM" },
      { title: "Grant Writing Session", date: "Sept 15", time: "2:00 PM" },
      { title: "Research Presentation Day", date: "Sept 22", time: "1:00 PM" }
    ]
  },
  "development-club": {
    name: "Development Club",
    description: "Build innovative apps, websites, and software solutions. Participate in hackathons and open-source contributions.",
    category: "Technical",
    members: 67,
    status: "Recruiting",
    icon: Code,
    gradient: "from-green-500 to-blue-600",
    statusColor: "bg-green-500/20 text-green-400",
    bio: "The Development Club is the heartbeat of software innovation on campus. We're a community of passionate developers who believe in the power of code to solve real-world problems. Our members work on diverse projects from mobile apps and web platforms to machine learning algorithms and blockchain solutions. We organize weekly coding sessions, monthly hackathons, and contribute to open-source projects. Many of our alumni have gone on to work at top tech companies like Google, Microsoft, and innovative startups. Whether you're just starting your coding journey or you're already building complex systems, you'll find your tribe here.",
    president: "Maya Patel",
    email: "dev@icasconnect.online",
    meetingTime: "Tuesdays 7:00 PM",
    location: "Computer Lab 2",
    website: "dev.icasconnect.online",
    upcomingEvents: [
      { title: "React Workshop Series", date: "Sept 6", time: "7:00 PM" },
      { title: "Hackathon Planning", date: "Sept 13", time: "6:00 PM" },
      { title: "Open Source Contribution Day", date: "Sept 20", time: "5:00 PM" }
    ]
  }
  // Add more clubs as needed
};

export default function ClubDashboard() {
  const { clubId } = useParams();
  const club = clubData[clubId as keyof typeof clubData];

  // If club doesn't have detailed data, show a coming soon message
  if (!club) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <div className="container mx-auto px-6 py-8">
          <Button variant="ghost" asChild className="mb-6 text-muted-foreground hover:text-foreground">
            <Link to="/clubs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clubs
            </Link>
          </Button>
          
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center">
              <QrCode className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Club Dashboard Coming Soon</h1>
            <p className="text-muted-foreground text-lg mb-8">
              The detailed dashboard for this club is being prepared. Check back soon!
            </p>
            <Button asChild className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
              <Link to="/clubs">Browse Other Clubs</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const IconComponent = club.icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10"></div>
        <div className="relative container mx-auto px-6 py-8">
          <Button variant="ghost" asChild className="mb-6 text-muted-foreground hover:text-foreground">
            <Link to="/clubs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Clubs
            </Link>
          </Button>
          
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${club.gradient} flex items-center justify-center`}>
              <IconComponent className="h-10 w-10 text-white" />
            </div>
            
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="text-4xl font-bold">{club.name}</h1>
                <Badge className={`${club.statusColor} border-0 font-medium`}>
                  {club.status}
                </Badge>
                <Badge variant="outline" className="border-border text-muted-foreground">
                  {club.category}
                </Badge>
              </div>
              <p className="text-xl text-muted-foreground mb-4">{club.description}</p>
              <div className="flex items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{club.members} Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{club.meetingTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span>{club.location}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Bio and Events */}
          <div className="lg:col-span-2 space-y-8">
            {/* Club Bio */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  About {club.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-white/70 leading-relaxed">{club.bio}</p>
              </CardContent>
            </Card>

            {/* Upcoming Events */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Upcoming Events
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {club.upcomingEvents.map((event, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-semibold text-white">{event.title}</h4>
                      <p className="text-white/60 text-sm">{event.date} at {event.time}</p>
                    </div>
                    <Button size="sm" className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      Add to Calendar
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Contact & Leadership
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-white mb-2">President</h4>
                    <p className="text-white/70">{club.president}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Email</h4>
                    <a href={`mailto:${club.email}`} className="text-purple-400 hover:text-purple-300 transition-colors">
                      {club.email}
                    </a>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Meeting Time</h4>
                    <p className="text-white/70">{club.meetingTime}</p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white mb-2">Location</h4>
                    <p className="text-white/70">{club.location}</p>
                  </div>
                </div>
                {club.website && (
                  <div className="pt-4 border-t border-white/10">
                    <Button variant="outline" className="border-white/20 text-white/70 hover:bg-white/10">
                      <Globe className="h-4 w-4 mr-2" />
                      Visit Website
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - QR Code and Actions */}
          <div className="space-y-6">
            {/* QR Code for Joining */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader className="text-center">
                <CardTitle className="text-white flex items-center justify-center gap-2">
                  <QrCode className="h-5 w-5" />
                  Join {club.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                {/* QR Code Placeholder */}
                <div className="w-48 h-48 mx-auto bg-white rounded-lg flex items-center justify-center">
                  <div className="w-40 h-40 bg-black rounded-lg flex items-center justify-center">
                    <QrCode className="h-20 w-20 text-white" />
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  Scan this QR code with your phone to join {club.name}
                </p>
                <Separator className="bg-white/10" />
                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Join Club
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white/70 hover:bg-white/10">
                    <Heart className="h-4 w-4 mr-2" />
                    Add to Favorites
                  </Button>
                  <Button variant="outline" className="w-full border-white/20 text-white/70 hover:bg-white/10">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Club
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Club Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Total Members</span>
                  <span className="font-bold text-white">{club.members}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Founded</span>
                  <span className="font-bold text-white">2018</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Active Projects</span>
                  <span className="font-bold text-white">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white/70">Events This Month</span>
                  <span className="font-bold text-white">{club.upcomingEvents.length}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
