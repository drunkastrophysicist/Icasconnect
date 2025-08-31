import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Search,
  Users,
  Activity,
  Bot,
  Atom,
  Palette,
  BookOpen,
  Code,
  Music,
  Camera,
  Gamepad2,
  Heart,
  ArrowLeft
} from "lucide-react";

const clubs = [
  {
    id: "robotics-club",
    name: "Robotics Club",
    description: "Design, build, and program cutting-edge robots. Compete in national robotics competitions and explore AI integration.",
    category: "Technical",
    members: 42,
    status: "Recruiting",
    icon: Bot,
    gradient: "from-blue-500 to-purple-600",
    statusColor: "bg-green-500/20 text-green-400"
  },
  {
    id: "research-society",
    name: "Research Society",
    description: "Dive deep into academic research across multiple disciplines. Collaborate with faculty on groundbreaking projects.",
    category: "Academic", 
    members: 38,
    status: "Active",
    icon: Atom,
    gradient: "from-purple-500 to-pink-600",
    statusColor: "bg-blue-500/20 text-blue-400"
  },
  {
    id: "development-club",
    name: "Development Club",
    description: "Build innovative apps, websites, and software solutions. Participate in hackathons and open-source contributions.",
    category: "Technical",
    members: 67,
    status: "Recruiting",
    icon: Code,
    gradient: "from-green-500 to-blue-600",
    statusColor: "bg-green-500/20 text-green-400"
  },
  {
    id: "art-design",
    name: "Art & Design",
    description: "Express creativity through digital art, graphic design, and visual storytelling. Showcase work in campus exhibitions.",
    category: "Cultural",
    members: 29,
    status: "Active",
    icon: Palette,
    gradient: "from-pink-500 to-orange-600",
    statusColor: "bg-blue-500/20 text-blue-400"
  },
  {
    id: "literature-society",
    name: "Literature Society",
    description: "Explore the world of words through poetry, creative writing, and literary discussions. Publish the campus magazine.",
    category: "Cultural",
    members: 34,
    status: "Active",
    icon: BookOpen,
    gradient: "from-amber-500 to-red-600",
    statusColor: "bg-blue-500/20 text-blue-400"
  },
  {
    name: "Music Collective",
    description: "Create, perform, and share music across genres. From classical to contemporary, find your musical community.",
    category: "Cultural",
    members: 51,
    status: "Recruiting",
    icon: Music,
    gradient: "from-violet-500 to-purple-600",
    statusColor: "bg-green-500/20 text-green-400"
  },
  {
    name: "Photography Club",
    description: "Capture moments and tell stories through the lens. Learn advanced techniques and organize photo walks.",
    category: "Cultural",
    members: 45,
    status: "Active",
    icon: Camera,
    gradient: "from-cyan-500 to-blue-600",
    statusColor: "bg-blue-500/20 text-blue-400"
  },
  {
    name: "Gaming Society",
    description: "Compete in esports tournaments, explore game development, and connect with fellow gaming enthusiasts.",
    category: "Technical",
    members: 73,
    status: "Active",
    icon: Gamepad2,
    gradient: "from-red-500 to-pink-600",
    statusColor: "bg-blue-500/20 text-blue-400"
  },
  {
    name: "Wellness Club",
    description: "Promote mental health awareness, organize mindfulness sessions, and create a supportive campus community.",
    category: "Academic",
    members: 56,
    status: "Recruiting",
    icon: Heart,
    gradient: "from-emerald-500 to-teal-600",
    statusColor: "bg-green-500/20 text-green-400"
  }
];

const categories = ["All", "Technical", "Academic", "Cultural"];

export default function Clubs() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [clubsData, setClubsData] = useState(clubs);
  const [loading, setLoading] = useState(false);

  const filteredClubs = clubsData.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "All" || club.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-background via-primary/5 to-background border-b border-border">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-blue-500/10 to-pink-500/10"></div>
        <div className="relative container mx-auto px-6 py-12">
          <Button variant="ghost" asChild className="mb-6 text-muted-foreground hover:text-foreground">
            <Link to="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
          
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Discover Your Community
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join clubs that match your passions, build lasting connections, and create unforgettable experiences
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-6 items-center justify-center max-w-4xl mx-auto">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search clubs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 bg-card border-border text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 rounded-xl h-12"
              />
            </div>
            
            <div className="flex gap-3">
              {categories.map(category => (
                <Badge
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  className={`cursor-pointer px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white border-0 shadow-lg hover:shadow-purple-500/25"
                      : "border-border text-muted-foreground hover:border-primary hover:text-foreground hover:bg-primary/10"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Clubs Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClubs.map(club => {
            const IconComponent = club.icon;
            return (
              <Card key={club.name} className="group bg-card border-border hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/10 backdrop-blur-sm">
                <CardHeader className="pb-4">
                  {/* Icon Header with Gradient */}
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${club.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className="h-8 w-8 text-white" />
                  </div>
                  
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-200">
                      {club.name}
                    </h3>
                    <Badge className={`${club.statusColor} border-0 font-medium`}>
                      {club.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {club.description}
                  </p>
                  
                  {/* Member Count and Category */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{club.members} Members</span>
                    </div>
                    <Badge variant="outline" className="border-border text-muted-foreground">
                      {club.category}
                    </Badge>
                  </div>
                  
                  {/* Dashboard Button */}
                  <Button 
                    asChild
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                  >
                    <Link to={`/clubs/${club.id || 'default'}`}>
                      <Activity className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        {filteredClubs.length === 0 && (
          <div className="text-center py-16">
            <div className="text-muted-foreground text-lg mb-4">No clubs found matching your criteria</div>
            <Button 
              variant="outline" 
              onClick={() => {setSearchTerm(""); setSelectedCategory("All");}}
              className="border-border text-muted-foreground hover:bg-accent"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
