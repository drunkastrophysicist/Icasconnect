import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FileText } from "lucide-react";

export default function Handouts() {
  const subjects = [
    { name: "Mathematics", files: 12 },
    { name: "Physics", files: 8 },
    { name: "Chemistry", files: 15 },
    { name: "English", files: 6 },
    { name: "History", files: 9 },
    { name: "Biology", files: 11 }
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Handouts</h1>
        <p className="text-muted-foreground">
          Access study guides and reference materials by subject
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => (
          <Card key={subject.name} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle>{subject.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription className="mb-4">
                <Badge variant="secondary">{subject.files} handouts available</Badge>
              </CardDescription>
              <Button className="w-full">
                <FileText className="h-4 w-4 mr-2" />
                View Handouts
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
