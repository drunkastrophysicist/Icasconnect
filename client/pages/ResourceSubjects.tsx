import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Search,
  BookOpen,
  Calculator,
  Globe,
  Brain,
  Atom,
  Monitor,
  Files
} from "lucide-react";

export default function ResourceSubjects() {
  const navigate = useNavigate();
  const { resourceType } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Map resource types to display information
  const resourceInfo = {
    ppts: {
      displayName: "Presentations",
      description: "Interactive presentation slides and lecture materials",
      icon: Monitor
    },
    handouts: {
      displayName: "Study Guides", 
      description: "Curated study guides and reference materials",
      icon: BookOpen
    },
    slides: {
      displayName: "Lecture Slides",
      description: "Essential lecture slides and visual materials", 
      icon: Monitor
    },
    notes: {
      displayName: "Course Notes",
      description: "Comprehensive course notes and study materials",
      icon: BookOpen
    },
    pqys: {
      displayName: "Past Papers",
      description: "Previous question papers and exam materials",
      icon: Files
    },
    "subject-files": {
      displayName: "Subject Resources",
      description: "Specialized subject-specific materials",
      icon: Files
    }
  };

  const subjects = [
    {
      name: "Mathematics",
      code: "MATH",
      icon: Calculator,
      description: "Calculus, Algebra, Statistics, and Mathematical Analysis",
      fileCount: 45,
      gradient: "from-blue-500 to-indigo-600",
      status: "Updated"
    },
    {
      name: "English",
      code: "ENG", 
      icon: BookOpen,
      description: "Literature, Writing, Grammar, and Communication Skills",
      fileCount: 32,
      gradient: "from-green-500 to-emerald-600",
      status: "New"
    },
    {
      name: "Psychology",
      code: "PSY",
      icon: Brain,
      description: "Cognitive Psychology, Behavioral Studies, and Research Methods",
      fileCount: 28,
      gradient: "from-purple-500 to-violet-600",
      status: "Updated"
    },
    {
      name: "Physics",
      code: "PHY",
      icon: Atom,
      description: "Classical Mechanics, Quantum Physics, and Thermodynamics",
      fileCount: 38,
      gradient: "from-red-500 to-rose-600",
      status: null
    },
    {
      name: "MOS (Microsoft Office)",
      code: "MOS",
      icon: Monitor,
      description: "Microsoft Office Suite, Excel, Word, PowerPoint, and Access",
      fileCount: 22,
      gradient: "from-cyan-500 to-blue-600",
      status: "New"
    }
  ];

  const currentResource = resourceInfo[resourceType as keyof typeof resourceInfo];
  
  if (!currentResource) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Resource not found</h1>
          <Button onClick={() => navigate("/resources")} className="bg-gradient-to-r from-purple-600 to-blue-600">
            Back to Resources
          </Button>
        </div>
      </div>
    );
  }

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    subject.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        
        {/* Navigation & Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/resources")}
            className="mb-6 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Resources
          </Button>
          
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-2xl bg-gradient-to-br ${subjects[0].gradient} shadow-lg`}>
                <currentResource.icon className="h-12 w-12 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              {currentResource.displayName}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              {currentResource.description}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto mt-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-white" />
                <Input
                  placeholder="Search subjects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-gray-800/60 border-2 border-gray-700/50 rounded-xl text-white placeholder:text-gray-400 focus:border-white/20 focus:ring-4 focus:ring-white/10 focus:bg-gray-800/80 transition-all duration-300 text-base backdrop-blur-sm"
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-3 text-center">
                  {filteredSubjects.length} subject{filteredSubjects.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Subjects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSubjects.map((subject) => {
            const IconComponent = subject.icon;
            return (
              <Card 
                key={subject.code}
                className="group relative overflow-hidden bg-gradient-radial from-gray-800/80 via-gray-900/90 to-gray-900 border-2 border-gray-700/30 hover:border-gray-600/50 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 rounded-2xl backdrop-blur-sm"
                onClick={() => navigate(`/resources/${resourceType}/${subject.code.toLowerCase()}`)}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl" />
                
                <CardHeader className="pb-4 pt-8">
                  <div className="flex flex-col items-center text-center space-y-4 mb-4">
                    {/* Subject Icon */}
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${subject.gradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <IconComponent className="h-10 w-10 text-white drop-shadow-sm" />
                    </div>
                    
                    {/* Subject Name & Code */}
                    <div>
                      <h3 className="text-2xl font-bold text-white group-hover:text-gray-100 transition-colors duration-200">
                        {subject.name}
                      </h3>
                      <p className="text-gray-400 font-mono text-sm">{subject.code}</p>
                    </div>
                    
                    {/* File Count & Status */}
                    <div className="flex items-center justify-center space-x-3">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Files className="h-4 w-4" />
                        <span className="text-sm font-medium">{subject.fileCount} files</span>
                      </div>
                      
                      {subject.status && (
                        <Badge className={`${subject.status === 'New' ? 'bg-cyan-500/90' : 'bg-emerald-500/90'} text-white border-0 text-xs px-3 py-1 shadow-md rounded-full font-semibold`}>
                          {subject.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 pb-8">
                  <p className="text-gray-300 leading-relaxed text-base font-light text-center px-2">
                    {subject.description}
                  </p>
                  
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 font-semibold py-3 rounded-xl text-base"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/resources/${resourceType}/${subject.code.toLowerCase()}`);
                    }}
                  >
                    Browse {subject.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* No Results State */}
        {filteredSubjects.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-6">
              No subjects found matching "{searchQuery}"
            </div>
            <Button 
              variant="outline" 
              onClick={() => setSearchQuery("")}
              className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300 rounded-xl px-6 py-2"
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
