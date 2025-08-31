import React, { useRef, useState } from "react";
import { FileText, FileSpreadsheet, UploadCloud } from "lucide-react";

const fontClass = "font-sans"; // Inter or Rubik via Tailwind

function getFileTypeIcon(filename: string) {
  if (filename.endsWith(".pdf")) return <FileText className="h-8 w-8 text-red-400" />;
  if (filename.endsWith(".docx")) return <FileSpreadsheet className="h-8 w-8 text-blue-400" />;
  return <FileText className="h-8 w-8 text-muted-foreground" />;
}

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function EnglishFiles() {
  const [files, setFiles] = useState<Array<{ name: string; date: string }>>([]);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }

  function handleFiles(fileList: FileList) {
    const now = new Date().toISOString();
    const newFiles = Array.from(fileList).map(f => ({ name: f.name, date: now }));
    setFiles(prev => [...newFiles, ...prev]);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (fileInputRef.current && fileInputRef.current.files && fileInputRef.current.files.length > 0) {
      setUploading(true);
      
      try {
        // Simulate upload delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        handleFiles(fileInputRef.current.files);
        setTitle("");
        fileInputRef.current.value = "";
      } catch (error) {
        console.error('Upload failed:', error);
      } finally {
        setUploading(false);
      }
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-background via-background to-background py-12 px-4 ${fontClass}`}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-10 tracking-tight">English Files</h1>
        {/* Upload Area */}
        <form onSubmit={handleUpload} className="mb-10">
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-2xl bg-muted/60 p-8 transition hover:border-primary cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={e => e.preventDefault()}
          >
            <UploadCloud className="h-12 w-12 text-primary mb-4" />
            <span className="text-lg text-muted-foreground mb-2">Drag & drop files here or click to upload</span>
            <input
              type="file"
              multiple
              ref={fileInputRef}
              className="hidden"
              onChange={e => handleFiles(e.target.files!)}
            />
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="File Title (optional)"
              className="mt-4 px-4 py-2 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-md"
            />
          </div>
          <button
            type="submit"
            disabled={uploading}
            className="mt-6 px-8 py-3 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Uploading...
              </div>
            ) : (
              "Upload"
            )}
          </button>
        </form>
        {/* File Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {files.length === 0 ? (
            <div className="text-muted-foreground text-center col-span-full">No files uploaded yet.</div>
          ) : (
            files.map((file, idx) => (
              <div
                key={file.name + file.date + idx}
                className="flex flex-col bg-card rounded-xl shadow-lg border border-border px-8 py-8 min-h-[140px] transition-transform hover:scale-[1.03] hover:shadow-xl relative overflow-hidden"
              >
                <div className="flex items-center gap-5 mb-4">
                  {getFileTypeIcon(file.name)}
                  <span className="block text-lg font-medium text-foreground break-all" title={file.name}>{file.name}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-base text-muted-foreground">Uploaded: {formatDate(file.date)}</span>
                  <button className="ml-4 px-6 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow hover:scale-105 transition-transform text-base">Download</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
