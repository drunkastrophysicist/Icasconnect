import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  FileText, 
  Presentation, 
  BookOpen, 
  Clock, 
  User,
  ExternalLink
} from "lucide-react";
import { ResourceFile, formatFileSize, getFileIcon } from "@/lib/resources";

interface ResourceCardProps {
  resource: ResourceFile;
  onDownload?: (resource: ResourceFile) => void;
}

export function ResourceCard({ resource, onDownload }: ResourceCardProps) {
  const handleDownload = () => {
    if (onDownload) {
      onDownload(resource);
    } else {
      // Default behavior: open in new tab
      window.open(resource.fileUrl, '_blank');
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'slides':
      case 'presentation':
        return Presentation;
      case 'handout':
      case 'notes':
        return FileText;
      case 'assignment':
      case 'project':
        return BookOpen;
      default:
        return FileText;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'slides':
      case 'presentation':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'handout':
      case 'notes':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'assignment':
      case 'project':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'pqys':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (timestamp: any) => {
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Recently';
    }
  };

  const CategoryIcon = getCategoryIcon(resource.category);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-slate-200 dark:border-slate-700 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
              <CategoryIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {resource.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className={getCategoryColor(resource.category)}>
                  {resource.category}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {resource.subject}
                </Badge>
              </div>
            </div>
          </div>
          <div className="text-2xl">
            {getFileIcon(resource.fileType)}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {resource.description && (
          <CardDescription className="text-sm text-slate-600 dark:text-slate-300">
            {resource.description}
          </CardDescription>
        )}
        
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <User className="h-3 w-3" />
              <span>{resource.uploaderName}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDate(resource.uploadedAt)}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>{formatFileSize(resource.fileSize)}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <Button 
            onClick={handleDownload}
            className="flex-1 group-hover:bg-blue-600 group-hover:border-blue-600 transition-colors"
            size="sm"
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.open(resource.fileUrl, '_blank')}
            className="group-hover:border-blue-300 group-hover:text-blue-600 dark:group-hover:border-blue-600 dark:group-hover:text-blue-400 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
