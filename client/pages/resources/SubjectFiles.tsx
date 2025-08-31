import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { FileText, FileSpreadsheet, UploadCloud } from "lucide-react";

// Dummy files for demonstration
const files = {
  Math: [
    { name: "math-chapter1.pdf", date: "2025-08-01" },
    { name: "math-chapter2.pdf", date: "2025-08-05" },
    { name: "math-formulas.docx", date: "2025-08-10" }
  ],
  Physics: [
    { name: "physics-notes.pdf", date: "2025-08-03" },
    { name: "experiment-data.xlsx", date: "2025-08-07" }
  ],
  English: [
    { name: "english-essay.docx", date: "2025-08-02" },
    { name: "poems.pdf", date: "2025-08-09" }
  ],
  Psychology: [
    { name: "psychology-intro.pdf", date: "2025-08-04" },
    { name: "case-study.docx", date: "2025-08-08" }
  ]
};

function getFileTypeIcon(filename: string) {
  if (filename.endsWith(".pdf")) return <FileText className="h-8 w-8 text-red-400" />;
  if (filename.endsWith(".docx")) return <FileSpreadsheet className="h-8 w-8 text-blue-400" />;
  if (filename.endsWith(".xlsx")) return <FileSpreadsheet className="h-8 w-8 text-green-400" />;
  return <FileText className="h-8 w-8 text-muted-foreground" />;
}

function getFileBorder(filename: string) {
  if (filename.endsWith(".pdf")) return "border-red-500/30";
  if (filename.endsWith(".docx")) return "border-blue-500/30";
  if (filename.endsWith(".xlsx")) return "border-green-500/30";
  return "border-border";
}

function getFileBackground(filename: string) {
  if (filename.endsWith(".pdf")) return "bg-red-500/10";
  if (filename.endsWith(".docx")) return "bg-blue-500/10";
  if (filename.endsWith(".xlsx")) return "bg-green-500/10";
  return "bg-card/50";
}

function formatDate(date: string) {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function SubjectFiles() {
  const { subject } = useParams();
  const subjectName = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "";
  const subjectFiles = files[subjectName] || [];
  const [showUpload, setShowUpload] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-background py-10 px-4">
      <div className="w-full max-w-4xl relative">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-4xl font-bold text-primary">{subjectName} Files</h1>
          <button
            className="flex items-center gap-2 px-5 py-3 bg-primary text-primary-foreground font-bold rounded-full shadow hover:scale-105 transition-transform text-base"
            onClick={() => setShowUpload(v => !v)}
          >
            <UploadCloud className="h-6 w-6" /> Upload
          </button>
        </div>
        {showUpload && (
          <div className="mb-10">
            <form className="flex flex-col items-center gap-6 bg-card/80 rounded-2xl shadow-2xl border border-border p-10 w-full max-w-xl mx-auto">
              <label htmlFor="file-upload" className="w-full flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-primary/50 rounded-xl bg-muted/60 p-8 transition hover:border-primary">
                <UploadCloud className="h-12 w-12 text-primary mb-4" />
                <span className="text-lg text-muted-foreground mb-2">Drag & drop files here or click to select</span>
                <input id="file-upload" type="file" multiple className="hidden" required />
              </label>
              <input type="text" placeholder="Title (e.g. DBMS Notes)" className="px-5 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-lg w-full transition" required />
              <button type="submit" className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-bold text-lg shadow hover:scale-105 transition">Upload</button>
            </form>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 w-full">
          {subjectFiles.length === 0 ? (
            <div className="text-xl text-muted-foreground text-center col-span-full">No files found for {subjectName}.</div>
          ) : (
            subjectFiles.map((fileObj, idx) => (
              <div
                key={fileObj.name}
                className={`flex flex-col ${getFileBackground(fileObj.name)} rounded-2xl shadow-lg border-2 ${getFileBorder(fileObj.name)} px-8 py-8 transition-transform hover:scale-[1.03] hover:shadow-xl relative overflow-hidden min-h-[140px]`}
              >
                <div className="flex items-center gap-5 mb-4">
                  {getFileTypeIcon(fileObj.name)}
                  <span className="block text-xl font-semibold text-foreground break-all" title={fileObj.name}>{fileObj.name}</span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-base text-muted-foreground">Uploaded: {formatDate(fileObj.date)}</span>
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
