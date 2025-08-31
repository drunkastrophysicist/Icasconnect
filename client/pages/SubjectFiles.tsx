import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import {
  ArrowLeft,
  Search,
  Download,
  Eye,
  Calendar,
  FileText,
  Clock,
  User
} from "lucide-react";

export default function SubjectFiles() {
  const navigate = useNavigate();
  const { resourceType, subjectCode } = useParams();
  const [searchQuery, setSearchQuery] = useState("");

  // Sample files data - this would come from your API
  const files = [
    {
      id: 1,
      name: "Chapter 1: Introduction to Calculus",
      type: "PDF",
      size: "2.4 MB",
      uploadedAt: "2024-08-30",
      uploadedBy: "Dr. Smith",
      downloads: 245,
      isNew: true
    },
    {
      id: 2,
      name: "Derivatives and Applications",
      type: "PPT", 
      size: "5.1 MB",
      uploadedAt: "2024-08-28",
      uploadedBy: "Prof. Johnson",
      downloads: 189,
      isNew: false
    },
    {
      id: 3,
      name: "Integration Techniques",
      type: "PDF",
      size: "3.2 MB", 
      uploadedAt: "2024-08-25",
      uploadedBy: "Dr. Smith",
      downloads: 156,
      isNew: false
    },
    {
      id: 4,
      name: "Practice Problems Set 1",
      type: "DOCX",
      size: "1.8 MB",
      uploadedAt: "2024-08-29",
      uploadedBy: "Teaching Assistant",
      downloads: 98,
      isNew: true
    },
    {
      id: 5,
      name: "Midterm Exam Solutions",
      type: "PDF",
      size: "4.7 MB",
      uploadedAt: "2024-08-27",
      uploadedBy: "Dr. Smith", 
      downloads: 312,
      isNew: false
    }
  ];

  const subjectNames = {
    math: "Mathematics",
    eng: "English", 
    psy: "Psychology",
    phy: "Physics",
    mos: "MOS (Microsoft Office)"
  };

  const resourceNames = {
    ppts: "Presentations",
    handouts: "Study Guides",
    slides: "Lecture Slides", 
    notes: "Course Notes",
    pqys: "Past Papers",
    "subject-files": "Subject Resources"
  };

  const currentSubject = subjectNames[subjectCode as keyof typeof subjectNames];
  const currentResource = resourceNames[resourceType as keyof typeof resourceNames];

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getFileTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'PPT': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'DOCX': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'XLSX': return 'bg-green-500/20 text-green-400 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 text-white">
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        
        {/* Navigation & Header */}
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/resources/${resourceType}`)}
            className="mb-6 text-gray-300 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to {currentResource}
          </Button>
          
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
              {currentSubject} - {currentResource}
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Browse and download {currentResource.toLowerCase()} for {currentSubject}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-lg mx-auto mt-8">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5 transition-colors group-focus-within:text-white" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-gray-800/60 border-2 border-gray-700/50 rounded-xl text-white placeholder:text-gray-400 focus:border-white/20 focus:ring-4 focus:ring-white/10 focus:bg-gray-800/80 transition-all duration-300 text-base backdrop-blur-sm"
                />
              </div>
              {searchQuery && (
                <p className="text-sm text-gray-400 mt-3 text-center">
                  {filteredFiles.length} file{filteredFiles.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Files List */}
        <div className="space-y-4">
          {filteredFiles.map((file) => (
            <Card 
              key={file.id}
              className="group bg-gradient-radial from-gray-800/80 via-gray-900/90 to-gray-900 border-2 border-gray-700/30 hover:border-gray-600/50 transition-all duration-300 rounded-xl backdrop-blur-sm hover:shadow-lg"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex-shrink-0">
                      <FileText className="h-8 w-8 text-gray-400" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-white truncate">
                          {file.name}
                        </h3>
                        {file.isNew && (
                          <Badge className="bg-cyan-500/90 text-white border-0 text-xs px-2 py-1 rounded-full">
                            New
                          </Badge>
                        )}
                        <Badge className={`border ${getFileTypeColor(file.type)} text-xs px-2 py-1 rounded-full`}>
                          {file.type}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <User className="h-3 w-3" />
                          <span>{file.uploadedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(file.uploadedAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Download className="h-3 w-3" />
                          <span>{file.downloads} downloads</span>
                        </div>
                        <span>{file.size}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button 
                      variant="outline"
                      size="sm"
                      className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-300"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button 
                      size="sm"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0 transition-all duration-300"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results State */}
        {filteredFiles.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <div className="text-gray-400 text-xl mb-6">
              No files found matching "{searchQuery}"
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

        {/* Empty State */}
        {files.length === 0 && !searchQuery && (
          <div className="text-center py-16">
            <FileText className="h-16 w-16 text-gray-500 mx-auto mb-4" />
            <div className="text-gray-400 text-xl mb-4">
              No files available yet
            </div>
            <p className="text-gray-500 mb-6">
              Check back later for new {currentResource.toLowerCase()} in {currentSubject}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
