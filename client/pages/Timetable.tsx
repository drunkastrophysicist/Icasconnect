import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Search, Clock, MapPin, BookOpen, User } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ClassBlock {
  subject: string;
  room: string;
  professor: string;
  fullName: string;
  startTime: string;
  endTime: string;
  color: string;
  day: number;
  duration: number; // in hours
}

// Sample schedule data with colored blocks
const scheduleData: ClassBlock[] = [
  // MONDAY
  {
    subject: "Physics",
    room: "Lab 101",
    professor: "Dr. Smith",
    fullName: "Advanced Physics Laboratory",
    startTime: "9:00 AM",
    endTime: "11:00 AM",
    color: "from-blue-500 to-blue-600",
    day: 0,
    duration: 2
  },
  {
    subject: "Mathematics",
    room: "Room 205",
    professor: "Prof. Johnson",
    fullName: "Calculus and Linear Algebra",
    startTime: "11:00 AM",
    endTime: "12:00 PM",
    color: "from-green-500 to-green-600",
    day: 0,
    duration: 1
  },
  {
    subject: "Computer Science",
    room: "Lab 404",
    professor: "Prof. Davis",
    fullName: "Object Oriented Programming",
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    color: "from-orange-500 to-orange-600",
    day: 0,
    duration: 2
  },
  {
    subject: "English",
    room: "Room 105",
    professor: "Ms. Brown",
    fullName: "Technical Communication",
    startTime: "4:00 PM",
    endTime: "5:00 PM",
    color: "from-pink-500 to-pink-600",
    day: 0,
    duration: 1
  },

  // TUESDAY
  {
    subject: "Chemistry",
    room: "Lab 302",
    professor: "Dr. Wilson",
    fullName: "Organic Chemistry",
    startTime: "8:00 AM",
    endTime: "10:00 AM",
    color: "from-purple-500 to-purple-600",
    day: 1,
    duration: 2
  },
  {
    subject: "Mathematics",
    room: "Room 205",
    professor: "Prof. Johnson",
    fullName: "Differential Equations",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    color: "from-green-500 to-green-600",
    day: 1,
    duration: 1
  },
  {
    subject: "Physics",
    room: "Room 301",
    professor: "Dr. Smith",
    fullName: "Quantum Mechanics",
    startTime: "1:00 PM",
    endTime: "2:00 PM",
    color: "from-blue-500 to-blue-600",
    day: 1,
    duration: 1
  },
  {
    subject: "Psychology",
    room: "Room 202",
    professor: "Dr. Garcia",
    fullName: "Cognitive Psychology",
    startTime: "3:00 PM",
    endTime: "4:00 PM",
    color: "from-indigo-500 to-indigo-600",
    day: 1,
    duration: 1
  },

  // WEDNESDAY
  {
    subject: "Computer Science",
    room: "Lab 404",
    professor: "Prof. Davis",
    fullName: "Data Structures and Algorithms",
    startTime: "9:00 AM",
    endTime: "11:00 AM",
    color: "from-orange-500 to-orange-600",
    day: 2,
    duration: 2
  },
  {
    subject: "Chemistry",
    room: "Lab 302",
    professor: "Dr. Wilson",
    fullName: "Physical Chemistry Lab",
    startTime: "11:00 AM",
    endTime: "1:00 PM",
    color: "from-purple-500 to-purple-600",
    day: 2,
    duration: 2
  },
  {
    subject: "English",
    room: "Room 105",
    professor: "Ms. Brown",
    fullName: "Literary Analysis",
    startTime: "2:00 PM",
    endTime: "3:00 PM",
    color: "from-pink-500 to-pink-600",
    day: 2,
    duration: 1
  },
  {
    subject: "MOS",
    room: "Computer Lab 1",
    professor: "Prof. Kumar",
    fullName: "Microsoft Office Specialist",
    startTime: "4:00 PM",
    endTime: "5:00 PM",
    color: "from-cyan-500 to-cyan-600",
    day: 2,
    duration: 1
  },

  // THURSDAY
  {
    subject: "Physics",
    room: "Lab 101",
    professor: "Dr. Smith",
    fullName: "Electromagnetic Theory",
    startTime: "8:00 AM",
    endTime: "9:00 AM",
    color: "from-blue-500 to-blue-600",
    day: 3,
    duration: 1
  },
  {
    subject: "Psychology",
    room: "Room 202",
    professor: "Dr. Garcia",
    fullName: "Social Psychology",
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    color: "from-indigo-500 to-indigo-600",
    day: 3,
    duration: 2
  },
  {
    subject: "Mathematics",
    room: "Room 205",
    professor: "Prof. Johnson",
    fullName: "Statistics and Probability",
    startTime: "1:00 PM",
    endTime: "2:00 PM",
    color: "from-green-500 to-green-600",
    day: 3,
    duration: 1
  },
  {
    subject: "Computer Science",
    room: "Lab 404",
    professor: "Prof. Davis",
    fullName: "Database Management Systems",
    startTime: "3:00 PM",
    endTime: "5:00 PM",
    color: "from-orange-500 to-orange-600",
    day: 3,
    duration: 2
  },

  // FRIDAY
  {
    subject: "English",
    room: "Room 105",
    professor: "Ms. Brown",
    fullName: "Professional Writing",
    startTime: "9:00 AM",
    endTime: "10:00 AM",
    color: "from-pink-500 to-pink-600",
    day: 4,
    duration: 1
  },
  {
    subject: "Chemistry",
    room: "Room 302",
    professor: "Dr. Wilson",
    fullName: "Analytical Chemistry",
    startTime: "10:00 AM",
    endTime: "11:00 AM",
    color: "from-purple-500 to-purple-600",
    day: 4,
    duration: 1
  },
  {
    subject: "MOS",
    room: "Computer Lab 1",
    professor: "Prof. Kumar",
    fullName: "Advanced Excel and PowerBI",
    startTime: "11:00 AM",
    endTime: "1:00 PM",
    color: "from-cyan-500 to-cyan-600",
    day: 4,
    duration: 2
  },
  {
    subject: "Psychology",
    room: "Room 202",
    professor: "Dr. Garcia",
    fullName: "Research Methods in Psychology",
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    color: "from-indigo-500 to-indigo-600",
    day: 4,
    duration: 2
  },
  {
    subject: "Physics",
    room: "Seminar Hall",
    professor: "Dr. Smith",
    fullName: "Physics Seminar",
    startTime: "4:00 PM",
    endTime: "5:00 PM",
    color: "from-blue-500 to-blue-600",
    day: 4,
    duration: 1
  }
];

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = [
  "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", 
  "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
];

function getCurrentTimePosition(): number {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Calculate position between 8 AM (start) and 6 PM (end)
  const startHour = 8;
  const currentTimeInHours = hours + minutes / 60;
  const relativeTime = currentTimeInHours - startHour;
  
  // Return exact pixel position based on 60px per hour
  const hourHeight = 60;
  const position = Math.max(0, Math.min(600, relativeTime * hourHeight)); // Max 600px (10 hours * 60px)
  
  return position;
}

function getClassPosition(startTime: string, duration: number) {
  const timeMap: { [key: string]: number } = {
    "8:00 AM": 0, "9:00 AM": 1, "10:00 AM": 2, "11:00 AM": 3, "12:00 PM": 4,
    "1:00 PM": 5, "2:00 PM": 6, "3:00 PM": 7, "4:00 PM": 8, "5:00 PM": 9
  };
  
  const startIndex = timeMap[startTime] || 0;
  
  // Calculate precise positioning based on 60px per hour grid
  const hourHeight = 60; // Fixed height per hour in pixels
  const top = startIndex * hourHeight;
  const height = duration * hourHeight;
  
  return { 
    top: `${top}px`, 
    height: `${height}px`,
    minHeight: `${height}px` // Ensure exact height
  };
}

export default function Timetable() {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTimePosition, setCurrentTimePosition] = useState(getCurrentTimePosition());
  const [selectedClass, setSelectedClass] = useState<ClassBlock | null>(null);
  const [scheduleBlocks, setScheduleBlocks] = useState<ClassBlock[]>(scheduleData);
  const [loading, setLoading] = useState(false);

  // Use comprehensive dummy data - no API calls needed
  useEffect(() => {
    setLoading(true);
    // Always use our comprehensive dummy data
    setScheduleBlocks(scheduleData);
    setLoading(false);
  }, []);

  // Helper function to assign colors based on subject
  const getSubjectColor = (subject: string) => {
    const colorMap: Record<string, string> = {
      'Physics': "from-blue-500 to-blue-600",
      'Mathematics': "from-green-500 to-green-600", 
      'Chemistry': "from-purple-500 to-purple-600",
      'English': "from-orange-500 to-orange-600",
      'Computer Science': "from-cyan-500 to-cyan-600",
      'Biology': "from-emerald-500 to-emerald-600",
      'History': "from-amber-500 to-amber-600",
      'default': "from-gray-500 to-gray-600"
    };
    return colorMap[subject] || colorMap['default'];
  };

  // Update live time indicator every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTimePosition(getCurrentTimePosition());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  const getWeekRange = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    
    const end = new Date(start);
    end.setDate(start.getDate() + 4);
    
    return {
      start: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      end: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    };
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const filteredSchedule = scheduleBlocks.filter(classItem =>
    classItem.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.professor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    classItem.room.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const weekRange = getWeekRange(currentWeek);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Weekly Timetable</h1>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search classes, professors, or rooms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-card border-border focus:border-primary/50"
              />
            </div>
          </div>

          {/* Navigation Header */}
          <div className="flex items-center justify-center gap-8 bg-card rounded-xl p-4 border border-border shadow-sm">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('prev')}
              className="h-10 w-10 p-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Week of</p>
              <p className="text-xl font-bold text-foreground">
                {weekRange.start} - {weekRange.end}
              </p>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateWeek('next')}
              className="h-10 w-10 p-0"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Timetable Grid */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-lg">
          <div className="relative">
            {/* Grid Header */}
            <div className="grid grid-cols-6 border-b border-border bg-muted/30">
              <div className="p-4 border-r border-border/40">
                <p className="text-sm font-semibold text-muted-foreground">Time</p>
              </div>
              {days.map((day, index) => (
                <div key={day} className={`p-4 text-center ${index < days.length - 1 ? 'border-r border-border/40' : ''}`}>
                  <p className="text-sm font-semibold text-foreground">{day}</p>
                </div>
              ))}
            </div>

            {/* Grid Body with Fixed Height */}
            <div className="relative" style={{ height: '600px' }}>
              {/* Time Labels Column */}
              <div className="absolute left-0 top-0 w-[16.666%] h-full border-r border-border/40 bg-muted/10">
                {timeSlots.map((time, index) => (
                  <div
                    key={time}
                    className="absolute left-0 w-full px-4 py-2 border-b border-border/30"
                    style={{ 
                      top: `${index * 60}px`, 
                      height: '60px',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    <span className="text-xs text-muted-foreground font-semibold">{time}</span>
                  </div>
                ))}
              </div>

              {/* Day Columns with Precise Grid */}
              {days.map((day, dayIndex) => (
                <div
                  key={day}
                  className="absolute top-0 h-full bg-background/50"
                  style={{
                    left: `${16.666 + (dayIndex * 16.666)}%`,
                    width: '16.666%',
                    borderRight: dayIndex < days.length - 1 ? '1px solid rgba(var(--border), 0.4)' : 'none'
                  }}
                >
                  {/* Horizontal Grid Lines */}
                  {timeSlots.map((_, index) => (
                    <div
                      key={index}
                      className="absolute w-full border-b border-border/20"
                      style={{ 
                        top: `${index * 60}px`,
                        height: '1px'
                      }}
                    />
                  ))}

                  {/* Class Blocks with Perfect Alignment */}
                  {filteredSchedule
                    .filter(classItem => classItem.day === dayIndex)
                    .map((classItem, index) => {
                      const position = getClassPosition(classItem.startTime, classItem.duration);
                      return (
                        <Dialog key={index}>
                          <DialogTrigger asChild>
                            <div
                              className={`absolute bg-gradient-to-r ${classItem.color} rounded-lg cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:z-10 border-l-4 border-white/60 overflow-hidden`}
                              style={{
                                ...position,
                                left: '4px',
                                right: '4px',
                                zIndex: 5
                              }}
                              onClick={() => setSelectedClass(classItem)}
                            >
                              <div className="h-full p-2 flex flex-col justify-center items-start text-white relative overflow-hidden">
                                {/* Subject Name - Bold and Most Prominent */}
                                <h3 className="font-bold text-sm leading-tight mb-1 text-white drop-shadow-sm truncate w-full">
                                  {classItem.subject}
                                </h3>
                                
                                {/* Time - Regular weight and smallest */}
                                <p className="text-xs font-normal opacity-80 leading-tight truncate w-full">
                                  {classItem.startTime} - {classItem.endTime}
                                </p>
                                
                                {/* Duration Indicator for longer classes */}
                                {classItem.duration > 1 && (
                                  <div className="absolute top-1 right-1">
                                    <Badge variant="secondary" className="text-xs px-1 py-0 bg-white/20 text-white border-white/30">
                                      {classItem.duration}h
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </div>
                          </DialogTrigger>
                          
                          <DialogContent className="max-w-md">
                            <DialogHeader>
                              <DialogTitle className="flex items-center gap-2">
                                <div className={`w-4 h-4 rounded bg-gradient-to-r ${classItem.color}`} />
                                {classItem.subject}
                              </DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-4">
                              <div>
                                <p className="text-lg font-semibold text-foreground">{classItem.fullName}</p>
                              </div>
                              
                              <div className="space-y-3">
                                <div className="flex items-center gap-3">
                                  <User className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{classItem.professor}</span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <MapPin className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{classItem.room}</span>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <Clock className="w-4 h-4 text-muted-foreground" />
                                  <span className="text-sm">{classItem.startTime} - {classItem.endTime}</span>
                                </div>
                              </div>
                              
                              <div className="flex gap-2">
                                <Badge variant="secondary" className="text-xs">
                                  {days[classItem.day]}
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {classItem.duration}h duration
                                </Badge>
                              </div>
                              
                              <Button className="w-full mt-4" size="sm">
                                <BookOpen className="w-4 h-4 mr-2" />
                                View Resources
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      );
                    })}
                </div>
              ))}

              {/* Live Time Indicator - Full Width with Precise Positioning */}
              <div
                className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-lg z-20 transition-all duration-1000"
                style={{ 
                  top: `${currentTimePosition}px`,
                  width: '100%'
                }}
              >
                {/* Red dot on the left edge */}
                <div className="absolute -left-1 -top-1.5 w-3 h-3 bg-red-500 rounded-full shadow-lg animate-pulse border border-red-400" />
                
                {/* LIVE indicator on the right */}
                <div className="absolute -right-12 -top-3 px-2 py-1 bg-red-500 text-white text-xs rounded-md font-bold shadow-md">
                  LIVE
                </div>
              </div>
              
              {/* Current Time Display */}
              <div
                className="absolute left-4 z-20"
                style={{ top: `${Math.max(0, currentTimePosition - 10)}px` }}
              >
                <span className="text-xs font-bold text-red-500 bg-background/90 px-2 py-1 rounded-md shadow-sm border border-red-200">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: 'numeric', 
                    minute: '2-digit',
                    hour12: true 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Classes</p>
                <p className="text-xl font-bold text-foreground">{scheduleBlocks.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hours This Week</p>
                <p className="text-xl font-bold text-foreground">
                  {scheduleBlocks.reduce((acc, curr) => acc + curr.duration, 0)}h
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-card rounded-xl p-4 border border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Professors</p>
                <p className="text-xl font-bold text-foreground">
                  {new Set(scheduleBlocks.map(item => item.professor)).size}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
