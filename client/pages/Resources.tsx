import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  FileText,
  Presentation,
  BookOpen,
  Monitor,
  ScrollText,
  GraduationCap,
  Search,
  Files
} from "lucide-react";

export default function Resources() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const resources = [
    { 
      name: "PPTs", 
      displayName: "Presentations",
      icon: Monitor,
      path: "/resources/ppts",
      description: "Interactive presentation slides and comprehensive lecture materials designed to enhance your learning experience",
      count: 24,
      countLabel: "Files",
      status: "Updated",
      statusColor: "bg-emerald-500/90",
      iconGradient: "from-blue-400 to-purple-500"
    },
    { 
      name: "Handouts", 
      displayName: "Study Guides",
      icon: FileText,
      path: "/resources/handouts", 
      description: "Carefully curated study guides, reference materials, and supplementary documents to support your academic journey",
      count: 18,
      countLabel: "Documents",
      status: "New",
      statusColor: "bg-cyan-500/90",
      iconGradient: "from-emerald-400 to-teal-500"
    },
    { 
      name: "Slides", 
      displayName: "Lecture Slides",
      icon: Presentation,
      path: "/resources/slides",
      description: "Essential lecture slides and visual learning materials structured for optimal knowledge retention",
      count: 31,
      countLabel: "Slide Sets",
      status: "Updated",
      statusColor: "bg-emerald-500/90",
      iconGradient: "from-purple-400 to-pink-500"
    },
    { 
      name: "Notes", 
      displayName: "Course Notes",
      icon: BookOpen,
      path: "/resources/notes",
      description: "Comprehensive course notes and detailed study materials crafted by expert educators and students",
      count: 12,
      countLabel: "Note Sets",
      status: null,
      statusColor: null,
      iconGradient: "from-amber-400 to-orange-500"
    },
    { 
      name: "PQYS", 
      displayName: "Past Papers",
      icon: ScrollText,
      path: "/resources/pqys",
      description: "Previous question year solutions and exam preparation materials to boost your academic performance",
      count: 8,
      countLabel: "Papers",
      status: "New",
      statusColor: "bg-cyan-500/90",
      iconGradient: "from-red-400 to-pink-500"
    },
    { 
      name: "Subject Files", 
      displayName: "Subject Resources",
      icon: GraduationCap,
      path: "/resources/subject-files",
      description: "Specialized subject-specific resources, assignments, and advanced materials tailored to your curriculum",
      count: 45,
      countLabel: "Resources",
      status: null,
      statusColor: null,
      iconGradient: "from-indigo-400 to-blue-500"
    }
  ];

  // Filter resources based on search query
  const filteredResources = resources.filter(resource =>
    resource.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resource.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        
        {/* Page Header & Introduction */}
        <div className="text-center space-y-6 mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent tracking-tight">
            Learning Resources
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
            Dive into your personalized collection of academic content, expertly organized and always up-to-date
          </p>
          
          {/* Enhanced Search Bar */}
          <div className="max-w-lg mx-auto mt-8">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-white" />
              <Input
                placeholder="Search for any file, topic, or course material..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 bg-gray-800/60 border-2 border-gray-700/50 rounded-xl text-white placeholder:text-gray-400 focus:border-white/20 focus:ring-4 focus:ring-white/10 focus:bg-gray-800/80 transition-all duration-300 text-base backdrop-blur-sm"
              />
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-400 mt-3 text-center font-medium">
                {filteredResources.length} result{filteredResources.length !== 1 ? 's' : ''} found for "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        {/* Visually Rich Resource Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredResources.map((resource) => {
            const IconComponent = resource.icon;
            return (
              <Card 
                key={resource.name} 
                className="group relative overflow-hidden bg-gradient-radial from-gray-800/80 via-gray-900/90 to-gray-900 border-2 border-gray-700/30 hover:border-gray-600/50 transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 rounded-2xl backdrop-blur-sm"
                onClick={() => navigate(resource.path)}
              >
                {/* Subtle glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl" />
                
                <CardHeader className="pb-4 pt-8">
                  {/* Top-Area Visuals */}
                  <div className="flex flex-col items-center text-center space-y-4 mb-4">
                    {/* Artistic Icon with Gradient */}
                    <div className={`relative p-4 rounded-2xl bg-gradient-to-br ${resource.iconGradient} shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110`}>
                      <IconComponent className="h-10 w-10 text-white drop-shadow-sm" />
                      <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    {/* Resource Type */}
                    <h3 className="text-2xl font-bold text-white group-hover:text-gray-100 transition-colors duration-200">
                      {resource.displayName}
                    </h3>
                    
                    {/* Metadata & Status Pills */}
                    <div className="flex items-center justify-center space-x-3">
                      <div className="flex items-center space-x-1 text-gray-400">
                        <Files className="h-4 w-4" />
                        <span className="text-sm font-medium">{resource.count} {resource.countLabel}</span>
                      </div>
                      
                      {resource.status && (
                        <Badge 
                          className={`${resource.statusColor} text-white border-0 text-xs px-3 py-1 shadow-md rounded-full font-semibold`}
                        >
                          {resource.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-6 pb-8">
                  {/* Enhanced Description */}
                  <p className="text-gray-300 leading-relaxed text-base font-light text-center px-2">
                    {resource.description}
                  </p>
                  
                  {/* Refined Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 font-semibold py-3 rounded-xl text-base"
                    style={{
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 1px 3px rgba(0,0,0,0.2)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(resource.path);
                    }}
                  >
                    Access {resource.displayName}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Enhanced No Results State */}
        {filteredResources.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-6 font-light">
              No resources found matching "{searchQuery}"
            </div>
            <p className="text-gray-500 mb-6">
              Try searching with different keywords or explore all available resources
            </p>
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
