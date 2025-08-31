import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Calendar,
  Clock,
  Users,
  Filter,
  Search,
  Heart,
  Share2,
  Bell,
  Map,
  List,
  Star,
  Tag,
  Navigation,
  ArrowLeft,
} from "lucide-react";
import { Link } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  coordinates: { lat: number; lng: number };
  startTime: string;
  endTime: string;
  date: string;
  category: string;
  organizer: string;
  attendees: number;
  maxAttendees?: number;
  image: string;
  tags: string[];
  isRegistered: boolean;
  isFeatured: boolean;
}

const mockEvents: Event[] = [
  {
    id: "1",
    title: "Tech Fest 2024",
    description: "Annual technology festival featuring competitions, workshops, and tech talks",
    location: "Main Auditorium",
    coordinates: { lat: 13.3559, lng: 74.7844 },
    startTime: "2:00 PM",
    endTime: "8:00 PM",
    date: "2024-12-18",
    category: "Technology",
    organizer: "Tech Club",
    attendees: 245,
    maxAttendees: 500,
    image: "/placeholder.svg",
    tags: ["coding", "innovation", "networking"],
    isRegistered: false,
    isFeatured: true,
  },
  {
    id: "2",
    title: "Cultural Night",
    description: "Celebrate diversity with performances from various cultural groups",
    location: "Open Air Theatre",
    coordinates: { lat: 13.3565, lng: 74.7850 },
    startTime: "6:00 PM",
    endTime: "10:00 PM",
    date: "2024-12-19",
    category: "Cultural",
    organizer: "Cultural Committee",
    attendees: 180,
    maxAttendees: 300,
    image: "/placeholder.svg",
    tags: ["dance", "music", "cultural"],
    isRegistered: true,
    isFeatured: false,
  },
  {
    id: "3",
    title: "Career Fair 2024",
    description: "Meet with top companies and explore career opportunities",
    location: "Student Center",
    coordinates: { lat: 13.3548, lng: 74.7855 },
    startTime: "10:00 AM",
    endTime: "4:00 PM",
    date: "2024-12-20",
    category: "Career",
    organizer: "Placement Cell",
    attendees: 120,
    maxAttendees: 400,
    image: "/placeholder.svg",
    tags: ["jobs", "networking", "career"],
    isRegistered: false,
    isFeatured: true,
  },
  {
    id: "4",
    title: "Sports Tournament",
    description: "Inter-college sports championship with multiple events",
    location: "Sports Complex",
    coordinates: { lat: 13.3572, lng: 74.7835 },
    startTime: "8:00 AM",
    endTime: "6:00 PM",
    date: "2024-12-21",
    category: "Sports",
    organizer: "Sports Committee",
    attendees: 95,
    maxAttendees: 200,
    image: "/placeholder.svg",
    tags: ["football", "basketball", "athletics"],
    isRegistered: false,
    isFeatured: false,
  },
  {
    id: "5",
    title: "Workshop: AI & ML",
    description: "Hands-on workshop on Artificial Intelligence and Machine Learning",
    location: "Computer Lab 3",
    coordinates: { lat: 13.3555, lng: 74.7862 },
    startTime: "2:00 PM",
    endTime: "5:00 PM",
    date: "2024-12-22",
    category: "Workshop",
    organizer: "CS Department",
    attendees: 45,
    maxAttendees: 50,
    image: "/placeholder.svg",
    tags: ["AI", "ML", "coding"],
    isRegistered: true,
    isFeatured: false,
  },
];

const categories = ["All", "Technology", "Cultural", "Career", "Sports", "Workshop", "Academic"];

export default function Events() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [viewMode, setViewMode] = useState<"map" | "list">("map");
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Load mock events
  useEffect(() => {
    setEvents(mockEvents);
    setLoading(false);
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "All" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Technology: "bg-blue-50 text-blue-700 border-blue-200",
      Cultural: "bg-purple-50 text-purple-700 border-purple-200",
      Career: "bg-green-50 text-green-700 border-green-200",
      Sports: "bg-orange-50 text-orange-700 border-orange-200",
      Workshop: "bg-red-50 text-red-700 border-red-200",
      Academic: "bg-gray-50 text-gray-700 border-gray-200",
    };
    return colors[category] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Button variant="ghost" asChild className="mb-2">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-3xl font-bold">
                icasconnect Events
              </h1>
              <p className="text-muted-foreground">
                Discover and join events happening around campus
              </p>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4 mr-2" />
                Favorites
              </Button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search events, tags, or locations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                <Map className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6">
        {viewMode === "map" ? (
          <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-300px)]">
            {/* Map Area */}
            <div className="lg:col-span-2">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">Interactive icasconnect Map</CardTitle>
                    <Button variant="outline" size="sm">
                      <Navigation className="h-4 w-4 mr-2" />
                      Current Location
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="relative h-full min-h-[400px] bg-gradient-to-br from-green-100 via-blue-50 to-green-50 rounded-lg overflow-hidden">
                    {/* Dummy Campus Map */}
                    <div className="absolute inset-0 p-4">
                      {/* Map Background with Campus Features */}
                      <div className="relative w-full h-full">
                        {/* Campus Buildings */}
                        <div className="absolute top-6 left-8 w-16 h-12 bg-gray-300 rounded shadow-sm border border-gray-400">
                          <div className="text-xs text-center mt-3 font-medium">Main Hall</div>
                        </div>
                        
                        <div className="absolute top-6 right-12 w-14 h-10 bg-blue-200 rounded shadow-sm border border-blue-400">
                          <div className="text-xs text-center mt-2 font-medium">Library</div>
                        </div>
                        
                        <div className="absolute top-24 left-16 w-12 h-10 bg-purple-200 rounded shadow-sm border border-purple-400">
                          <div className="text-xs text-center mt-2 font-medium">Lab</div>
                        </div>
                        
                        <div className="absolute bottom-16 left-6 w-18 h-14 bg-orange-200 rounded shadow-sm border border-orange-400">
                          <div className="text-xs text-center mt-4 font-medium">Sports Complex</div>
                        </div>
                        
                        <div className="absolute bottom-20 right-8 w-16 h-12 bg-green-200 rounded shadow-sm border border-green-400">
                          <div className="text-xs text-center mt-3 font-medium">Auditorium</div>
                        </div>

                        {/* Campus Paths */}
                        <div className="absolute top-12 left-24 w-32 h-1 bg-gray-400 opacity-50"></div>
                        <div className="absolute top-20 left-28 w-1 h-16 bg-gray-400 opacity-50"></div>
                        <div className="absolute bottom-28 left-4 w-40 h-1 bg-gray-400 opacity-50"></div>
                        
                        {/* Event Markers */}
                        {filteredEvents.slice(0, 5).map((event, index) => {
                          const positions = [
                            { top: '15%', left: '20%' }, // Main Hall area
                            { top: '25%', left: '65%' }, // Library area  
                            { top: '45%', left: '30%' }, // Lab area
                            { top: '70%', left: '15%' }, // Sports Complex
                            { top: '75%', right: '20%' }, // Auditorium
                          ];
                          const pos = positions[index] || positions[0];
                          
                          return (
                            <div
                              key={event.id}
                              className="absolute cursor-pointer transform hover:scale-110 transition-transform"
                              style={pos}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="relative group">
                                <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg animate-pulse"></div>
                                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                  {event.title}
                                </div>
                              </div>
                            </div>
                          );
                        })}

                        {/* Current Location Marker */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                          <div className="w-3 h-3 bg-blue-600 rounded-full border-2 border-white shadow-lg">
                            <div className="absolute inset-0 bg-blue-600 rounded-full animate-ping opacity-75"></div>
                          </div>
                          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-blue-600">
                            You
                          </div>
                        </div>

                        {/* Map Legend */}
                        <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm rounded p-2 text-xs">
                          <div className="flex items-center gap-1 mb-1">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            <span>Events</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                            <span>Your Location</span>
                          </div>
                        </div>

                        {/* Zoom Controls */}
                        <div className="absolute top-4 right-4 flex flex-col gap-1">
                          <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white/90">
                            +
                          </Button>
                          <Button size="sm" variant="outline" className="w-8 h-8 p-0 bg-white/90">
                            -
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Event Details Sidebar */}
            <div className="space-y-4 overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {filteredEvents.length} Events Found
                </h3>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>

              {selectedEvent && (
                <Card className="border-primary shadow-lg">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <Badge className={getCategoryColor(selectedEvent.category)}>
                        {selectedEvent.category}
                      </Badge>
                      {selectedEvent.isFeatured && (
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{selectedEvent.title}</CardTitle>
                    <CardDescription>{selectedEvent.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {selectedEvent.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(selectedEvent.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {selectedEvent.startTime} - {selectedEvent.endTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {selectedEvent.attendees}{selectedEvent.maxAttendees && `/${selectedEvent.maxAttendees}`} attendees
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-wrap gap-1">
                      {selectedEvent.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        variant={selectedEvent.isRegistered ? "outline" : "default"}
                      >
                        {selectedEvent.isRegistered ? "Registered" : "Register"}
                      </Button>
                      <Button variant="outline" size="icon">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="space-y-3">
                {filteredEvents.map((event) => (
                  <Card 
                    key={event.id}
                    className={`cursor-pointer transition-all hover:shadow-lg ${
                      selectedEvent?.id === event.id ? "ring-2 ring-primary shadow-lg" : ""
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <Badge className={getCategoryColor(event.category)} variant="outline">
                          {event.category}
                        </Badge>
                        {event.isFeatured && (
                          <Star className="h-4 w-4 text-yellow-500" />
                        )}
                      </div>
                      <h4 className="font-semibold mb-1">{event.title}</h4>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3" />
                          {event.startTime}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="h-3 w-3" />
                          {event.attendees} attending
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* List View */
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">
                {filteredEvents.length} Events Found
              </h3>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-xl transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(event.category)} variant="outline">
                        {event.category}
                      </Badge>
                      {event.isFeatured && (
                        <Badge variant="secondary">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{event.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {event.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {event.startTime} - {event.endTime}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        {event.attendees}{event.maxAttendees && `/${event.maxAttendees}`} attendees
                      </div>
                    </div>
                    <Separator />
                    <div className="flex flex-wrap gap-1">
                      {event.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        className="flex-1" 
                        variant={event.isRegistered ? "outline" : "default"}
                        size="sm"
                      >
                        {event.isRegistered ? "Registered" : "Register"}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
