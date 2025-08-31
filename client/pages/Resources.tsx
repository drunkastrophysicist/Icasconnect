import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Search,
  BookOpen,
  Calculator,
  Atom,
  Globe,
  Users,
  Palette,
  Activity,
  Music,
  Code,
  Brain,
  Languages
} from "lucide-react";

// Mock data for subjects
const subjects = [
  {
    id: "mathematics",
    name: "Mathematics",
    icon: Calculator,
    color: "bg-blue-500",
    resourceCount: 45,
    categories: ["Textbooks", "Handouts", "Videos", "Practice Tests"]
  },
  {
    id: "physics",
    name: "Physics",
    icon: Atom,
    color: "bg-purple-500",
    resourceCount: 38,
    categories: ["Textbooks", "Lab Manuals", "Videos", "Simulations"]
  },
  {
    id: "chemistry",
    name: "Chemistry",
    icon: Activity,
    color: "bg-green-500",
    resourceCount: 42,
    categories: ["Textbooks", "Lab Manuals", "Videos", "Reference Sheets"]
  },
  {
    id: "biology",
    name: "Biology",
    icon: Brain,
    color: "bg-emerald-500",
    resourceCount: 51,
    categories: ["Textbooks", "Diagrams", "Videos", "Study Guides"]
  },
  {
    id: "english",
    name: "English Literature",
    icon: BookOpen,
    color: "bg-red-500",
    resourceCount: 33,
    categories: ["Novels", "Poetry", "Essays", "Study Guides"]
  },
  {
    id: "history",
    name: "History",
    icon: Globe,
    color: "bg-amber-500",
    resourceCount: 29,
    categories: ["Textbooks", "Documents", "Maps", "Timelines"]
  },
  {
    id: "geography",
    name: "Geography",
    icon: Globe,
    color: "bg-teal-500",
    resourceCount: 27,
    categories: ["Maps", "Atlases", "Case Studies", "Videos"]
  },
  {
    id: "computer-science",
    name: "Computer Science",
    icon: Code,
    color: "bg-indigo-500",
    resourceCount: 56,
    categories: ["Programming", "Algorithms", "Projects", "References"]
  },
  {
    id: "art",
    name: "Art & Design",
    icon: Palette,
    color: "bg-pink-500",
    resourceCount: 24,
    categories: ["Tutorials", "Galleries", "Techniques", "Projects"]
  },
  {
    id: "music",
    name: "Music",
    icon: Music,
    color: "bg-violet-500",
    resourceCount: 18,
    categories: ["Sheet Music", "Audio", "Theory", "Instruments"]
  },
  {
    id: "languages",
    name: "Modern Languages",
    icon: Languages,
    color: "bg-orange-500",
    resourceCount: 35,
    categories: ["Textbooks", "Audio", "Exercises", "Culture"]
  },
  {
    id: "psychology",
    name: "Psychology",
    icon: Brain,
    color: "bg-rose-500",
    resourceCount: 22,
    categories: ["Textbooks", "Case Studies", "Research", "Videos"]
  }
];

export default function Resources() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubjects = subjects.filter(subject =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubjectClick = (subjectId: string) => {
    navigate(`/resources/${subjectId}`);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Learning Resources</h1>
            <p className="text-muted-foreground">
              Access study materials, textbooks, and resources organized by subject
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search subjects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Subject Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredSubjects.map((subject) => {
          const IconComponent = subject.icon;
          return (
            <Card
              key={subject.id}
              className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
              onClick={() => handleSubjectClick(subject.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${subject.color}`}>
                    <IconComponent className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg truncate">{subject.name}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Resources</span>
                  <Badge variant="secondary">{subject.resourceCount}</Badge>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {subject.categories.slice(0, 3).map((category, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                  {subject.categories.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{subject.categories.length - 3}
                    </Badge>
                  )}
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full justify-start"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSubjectClick(subject.id);
                  }}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Resources
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredSubjects.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No subjects found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search term to find the subject you're looking for.
          </p>
        </div>
      )}
    </div>
  );
}