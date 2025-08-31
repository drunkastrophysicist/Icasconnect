import React, { useState } from "react";

export default function ICAS_TeacherDashboard() {
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [announcements, setAnnouncements] = useState<string[]>([]);

  function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    setUploadSuccess(true);
    setTimeout(() => setUploadSuccess(false), 2000);
  }

  function handleAnnouncement(e: React.FormEvent) {
    e.preventDefault();
    if (announcement.trim()) {
      setAnnouncements([announcement, ...announcements]);
      setAnnouncement("");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 p-4">
      <div className="w-full max-w-xl space-y-8">
        <div className="bg-white rounded-2xl shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Upload Files</h2>
          <form className="flex flex-col gap-3" onSubmit={handleUpload}>
            <input type="text" placeholder="Title (e.g. DBMS Notes)" className="px-3 py-2 rounded border focus:outline-none" required />
            <input type="text" placeholder="Subject Code (e.g. CS201)" className="px-3 py-2 rounded border focus:outline-none" required />
            <input type="file" className="px-3 py-2 rounded border focus:outline-none" required />
            <button type="submit" className="px-3 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80 transition">Upload</button>
            {uploadSuccess && (
              <span className="text-green-600 font-semibold mt-2">File uploaded successfully!</span>
            )}
          </form>
        </div>
        <div className="bg-white rounded-2xl shadow p-8">
          <h2 className="text-2xl font-bold mb-4 text-primary">Announcements</h2>
          <form className="flex gap-2 mb-4" onSubmit={handleAnnouncement}>
            <input
              type="text"
              value={announcement}
              onChange={e => setAnnouncement(e.target.value)}
              placeholder="Type your announcement..."
              className="flex-1 px-3 py-2 rounded border focus:outline-none"
              required
            />
            <button type="submit" className="px-4 py-2 rounded bg-primary text-white font-semibold hover:bg-primary/80 transition">Post</button>
          </form>
          <ul className="space-y-2">
            {announcements.length === 0 ? (
              <li className="text-muted-foreground">No announcements yet.</li>
            ) : (
              announcements.map((a, idx) => (
                <li key={idx} className="bg-primary/10 rounded px-4 py-2 text-primary font-medium">{a}</li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
