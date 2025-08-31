import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, FileText, Loader2, CheckCircle, XCircle, TestTube } from "lucide-react";
import { uploadResource, testFirebaseConnection } from "@/lib/resources";
import { useAuth } from "@/components/AuthProvider";
import { useToast } from "@/hooks/use-toast";

interface ResourceUploadDialogProps {
  children: React.ReactNode;
  defaultCategory?: string;
}

export function ResourceUploadDialog({ children, defaultCategory }: ResourceUploadDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    subject: "",
    category: defaultCategory || "",
    file: null as File | null,
  });

  const subjects = [
    "Mathematics",
    "Physics", 
    "Chemistry",
    "Computer Science",
    "Engineering",
    "Biology",
    "English",
    "History",
    "Economics",
    "Other"
  ];

  const categories = [
    "Handout",
    "Assignment", 
    "Slides",
    "Notes",
    "PQYS",
    "Reference",
    "Lab Manual",
    "Project"
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData(prev => ({ 
        ...prev, 
        file,
        title: prev.title || file.name.split('.')[0] // Auto-fill title from filename
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.file || !formData.title || !formData.subject || !formData.category) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to upload resources.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const result = await uploadResource({
        title: formData.title,
        description: formData.description,
        subject: formData.subject,
        category: formData.category,
        uploadedBy: user.id,
        uploaderName: user.name,
        file: formData.file,
      });

      if (result.success) {
        toast({
          title: "Upload Successful",
          description: `${formData.title} has been uploaded successfully.`,
        });
        
        // Reset form
        setFormData({
          title: "",
          description: "",
          subject: "",
          category: defaultCategory || "",
          file: null,
        });
        
        setOpen(false);
      } else {
        throw new Error(result.error?.message || "Upload failed");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      subject: "",
      category: defaultCategory || "",
      file: null,
    });
  };

  const testConnection = async () => {
    console.log("Testing Firebase connection...");
    toast({
      title: "Testing Connection",
      description: "Checking Firebase connectivity...",
    });

    const result = await testFirebaseConnection();
    
    if (result.success) {
      toast({
        title: "Connection Successful",
        description: "Firebase is working correctly!",
      });
    } else {
      toast({
        title: "Connection Failed",
        description: `Firebase error: ${result.error?.message || "Unknown error"}`,
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Resource
          </DialogTitle>
          <DialogDescription>
            Share educational materials with students. All uploaded files will be available in the Resources section.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="space-y-2">
            <Label htmlFor="file">File *</Label>
            <div className="flex items-center gap-4">
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                disabled={uploading}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.jpg,.png"
                className="flex-1"
              />
              {formData.file && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span className="truncate max-w-32">{formData.file.name}</span>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter resource title..."
              disabled={uploading}
            />
          </div>

          {/* Category */}
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              disabled={uploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">Subject *</Label>
            <Select
              value={formData.subject}
              onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}
              disabled={uploading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select subject..." />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subject) => (
                  <SelectItem key={subject} value={subject}>
                    {subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Optional description or notes about this resource..."
              disabled={uploading}
              className="min-h-[80px]"
            />
          </div>

          <DialogFooter className="flex-col space-y-2">
            {/* Test Connection Button */}
            <Button
              type="button"
              variant="secondary"
              onClick={testConnection}
              disabled={uploading}
              className="w-full"
            >
              <TestTube className="mr-2 h-4 w-4" />
              Test Firebase Connection
            </Button>
            
            <div className="flex space-x-2 w-full">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={uploading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={uploading || !formData.file || !formData.title}
                className="flex-1"
              >
                {uploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resource
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
