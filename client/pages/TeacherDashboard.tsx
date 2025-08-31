import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { addAnnouncement } from "@/lib/announcements";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { ResourceUploadDialog } from "@/components/ResourceUploadDialog";
import { Megaphone, Calendar, Clock, Send, Loader2, Upload, FileText, Presentation, BookOpen } from "lucide-react";

function daysLeft(due) {
	const now = new Date();
	const dueDate = new Date(due);
	const diff = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
	if (diff === 0) return "Due Today";
	if (diff < 0) return "Past Due";
	return `${diff} days left`;
}

function ProgressCircle({ value }) {
	const radius = 20;
	const stroke = 4;
	const normalizedRadius = radius - stroke * 0.5;
	const circumference = normalizedRadius * 2 * Math.PI;
	const percent = Math.min(Math.max(value, 0), 100);
	const strokeDashoffset = circumference - percent / 100 * circumference;
	
	return (
		<div className="relative mr-3">
			<svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
				{/* Background track - faint full circle */}
				<circle
					stroke="rgba(148, 163, 184, 0.2)"
					fill="none"
					strokeWidth={stroke}
					r={normalizedRadius}
					cx={radius}
					cy={radius}
				/>
				{/* Progress fill - vibrant gradient */}
				<circle
					stroke="url(#vibrantGradient)"
					fill="none"
					strokeWidth={stroke}
					strokeLinecap="round"
					strokeDasharray={circumference + ' ' + circumference}
					style={{ 
						strokeDashoffset, 
						transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
						filter: 'drop-shadow(0 0 4px rgba(139, 92, 246, 0.3))'
					}}
					r={normalizedRadius}
					cx={radius}
					cy={radius}
				/>
				<defs>
					<linearGradient id="vibrantGradient" x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="#8B5CF6" />
						<stop offset="50%" stopColor="#3B82F6" />
						<stop offset="100%" stopColor="#06B6D4" />
					</linearGradient>
				</defs>
			</svg>
			{/* Percentage text in center */}
			<div className="absolute inset-0 flex items-center justify-center">
				<span className="text-xs font-bold text-slate-200">{percent}%</span>
			</div>
		</div>
	);
}

export default function TeacherDashboard() {
	const { user } = useAuth();
	const { toast } = useToast();
	
	// Firebase announcements state
	const [announcementTitle, setAnnouncementTitle] = useState("");
	const [announcementMessage, setAnnouncementMessage] = useState("");
	const [scheduledDate, setScheduledDate] = useState("");
	const [scheduledTime, setScheduledTime] = useState("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	
	// Legacy local announcements (keeping for backwards compatibility)
	const [announcements, setAnnouncements] = useState([
		{ text: "Staff meeting at 4pm.", date: "2025-08-30" },
		{ text: "Submit grades by Friday.", date: "2025-08-28" },
	]);
	const [todayClass, setTodayClass] = useState({
		subject: "Mathematics",
		time: "10:00 AM - 11:30 AM",
		room: "Room 204",
	});
	const [assignments, setAssignments] = useState([
		{ subject: "Math", title: "Algebra HW", due: "2025-09-02", submissions: 12, total: 20 },
		{ subject: "Physics", title: "Lab Report", due: "2025-09-01", submissions: 18, total: 20 },
		{ subject: "English", title: "Essay", due: "2025-08-31", submissions: 20, total: 20 },
	]);
	const [announcementText, setAnnouncementText] = useState("");
	const [loading, setLoading] = useState(false);

	// Static data initialization - no API calls
	useEffect(() => {
		// Static data is already initialized in useState above
		setLoading(false);
	}, []);

	// Firebase announcement posting function
	const postAnnouncement = async (e) => {
		e.preventDefault();
		if (!announcementTitle.trim() || !announcementMessage.trim()) {
			toast({
				title: "Error",
				description: "Please fill in both title and message",
				variant: "destructive",
			});
			return;
		}

		setIsSubmitting(true);
		try {
			const scheduledFor = scheduledDate && scheduledTime 
				? new Date(`${scheduledDate}T${scheduledTime}`)
				: undefined;

			console.log("Submitting announcement with user:", user);
			const result = await addAnnouncement({
				title: announcementTitle,
				message: announcementMessage,
				createdBy: user?.id || "unknown",
				authorName: user?.name || "Teacher",
				scheduledFor,
			});

			console.log("Announcement result:", result);
			if (result.success) {
				toast({
					title: "Success",
					description: "Announcement posted successfully!",
				});
				// Reset form
				setAnnouncementTitle("");
				setAnnouncementMessage("");
				setScheduledDate("");
				setScheduledTime("");
			} else {
				console.error("Failed to post announcement:", result.error);
				throw new Error(`Failed to post announcement: ${(result.error as any)?.message || 'Unknown error'}`);
			}
		} catch (error) {
			console.error("Full error details:", error);
			toast({
				title: "Error",
				description: `Failed to post announcement: ${(error as any)?.message || 'Please check Firebase setup'}`,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 font-sans">
			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
				{/* Announcements */}
				<div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)] p-8 flex flex-col mb-4 relative overflow-hidden">
					{/* Subtle background glow */}
					<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
					
					<div className="flex items-center gap-3 mb-6 relative z-10">
						<Megaphone className="h-6 w-6 text-purple-400" />
						<h2 className="text-[20pt] font-extrabold text-slate-100 tracking-tight">Create Announcement</h2>
					</div>
					
					<form onSubmit={postAnnouncement} className="space-y-4 mb-6 relative z-10">
						<div className="space-y-2">
							<Label htmlFor="title" className="text-slate-200 font-semibold">Title</Label>
							<Input
								id="title"
								value={announcementTitle}
								onChange={(e) => setAnnouncementTitle(e.target.value)}
								placeholder="Enter announcement title..."
								className="bg-slate-700/80 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:ring-purple-500/50 focus:border-purple-400/50"
								disabled={isSubmitting}
							/>
						</div>
						
						<div className="space-y-2">
							<Label htmlFor="message" className="text-slate-200 font-semibold">Message</Label>
							<Textarea
								id="message"
								rows={3}
								value={announcementMessage}
								onChange={(e) => setAnnouncementMessage(e.target.value)}
								placeholder="Type your announcement message..."
								className="bg-slate-700/80 border-slate-600/50 text-slate-100 placeholder:text-slate-400 focus:ring-purple-500/50 focus:border-purple-400/50 resize-none"
								disabled={isSubmitting}
							/>
						</div>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div className="space-y-2">
								<Label htmlFor="date" className="text-slate-200 font-semibold flex items-center gap-2">
									<Calendar className="h-4 w-4" />
									Schedule Date (Optional)
								</Label>
								<Input
									id="date"
									type="date"
									value={scheduledDate}
									onChange={(e) => setScheduledDate(e.target.value)}
									className="bg-slate-700/80 border-slate-600/50 text-slate-100 focus:ring-purple-500/50 focus:border-purple-400/50"
									disabled={isSubmitting}
								/>
							</div>
							
							<div className="space-y-2">
								<Label htmlFor="time" className="text-slate-200 font-semibold flex items-center gap-2">
									<Clock className="h-4 w-4" />
									Schedule Time (Optional)
								</Label>
								<Input
									id="time"
									type="time"
									value={scheduledTime}
									onChange={(e) => setScheduledTime(e.target.value)}
									className="bg-slate-700/80 border-slate-600/50 text-slate-100 focus:ring-purple-500/50 focus:border-purple-400/50"
									disabled={isSubmitting}
								/>
							</div>
						</div>
						
						<Button
							type="submit"
							disabled={isSubmitting || !announcementTitle.trim() || !announcementMessage.trim()}
							className="w-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 text-white font-bold shadow-[0_8px_24px_0_rgba(139,92,246,0.3)] hover:shadow-[0_12px_32px_0_rgba(139,92,246,0.4)] transition-all duration-300"
						>
							{isSubmitting ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Posting...
								</>
							) : (
								<>
									<Send className="h-4 w-4 mr-2" />
									Post Announcement
								</>
							)}
						</Button>
					</form>
					
					{/* Legacy announcements display (will be replaced by Firebase data in student dashboard) */}
					<div className="space-y-3 relative z-10">
						<h3 className="text-lg font-semibold text-slate-200">Recent Local Announcements</h3>
						{announcements.map((a, i) => (
							<div key={i} className="flex items-center justify-between bg-slate-700/60 backdrop-blur-sm rounded-xl px-5 py-3 leading-relaxed tracking-wide border border-slate-600/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]">
								<span className="text-[14pt] text-slate-100 font-medium">{a.text}</span>
								<span className="text-[12pt] text-purple-300 font-semibold">{new Date(a.date).toLocaleDateString()}</span>
							</div>
						))}
					</div>
				</div>

				{/* Class Schedule */}
				<div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)] p-8 flex flex-col mb-4 relative overflow-hidden">
					{/* Subtle background glow */}
					<div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 pointer-events-none"></div>
					
					<h2 className="text-[20pt] font-extrabold mb-6 text-slate-100 tracking-tight relative z-10">Today's Class</h2>
					<div className="flex flex-col gap-3 text-[14pt] mb-6 relative z-10">
						<div className="font-extrabold text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-[18pt]">{todayClass.subject}</div>
						<div className="text-slate-200 font-semibold">{todayClass.time}</div>
						<div className="text-slate-300">{todayClass.room}</div>
					</div>
					<button className="self-end px-5 py-2 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold shadow-[0_6px_20px_0_rgba(139,92,246,0.3),inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:scale-105 hover:shadow-[0_8px_24px_0_rgba(139,92,246,0.4),0_0_16px_0_rgba(59,130,246,0.2)] transition-all duration-300 text-[12pt] relative z-10">Edit / Reschedule</button>
				</div>

				{/* Assignments & Tests */}
				<div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)] p-8 flex flex-col mb-4 relative overflow-hidden">
					{/* Subtle background glow */}
					<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
					
					<h2 className="text-[20pt] font-extrabold mb-6 text-slate-100 tracking-tight relative z-10">Assignments & Tests</h2>
					<div className="flex flex-col gap-6 relative z-10">
						{assignments.map((a, i) => {
							const percent = Math.round((a.submissions / a.total) * 100);
							return (
								<div key={i} className="flex items-center justify-between bg-slate-700/60 backdrop-blur-sm rounded-xl px-5 py-4 leading-relaxed tracking-wide border border-slate-600/30 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)] hover:bg-slate-600/60 transition-all duration-200">
									<div className="flex items-center gap-4">
										<ProgressCircle value={percent} />
										<div>
											<div className="font-extrabold text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-[14pt]">{a.subject}: {a.title}</div>
											<div className="text-[12pt] text-slate-300">Due: {new Date(a.due).toLocaleDateString()}</div>
											<div className="text-[11pt] text-slate-400">{a.submissions}/{a.total} submissions</div>
										</div>
									</div>
									<div className="flex flex-col items-end gap-2">
										<span className={`px-4 py-1 rounded-full text-[12pt] font-bold shadow-[0_4px_12px_0_rgba(139,92,246,0.3),inset_0_1px_0_0_rgba(255,255,255,0.1)] transition-all duration-200 ${
											daysLeft(a.due) === 'Due Today' 
												? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-[0_6px_16px_0_rgba(239,68,68,0.4)]' 
												: daysLeft(a.due) === 'Past Due'
												? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:shadow-[0_6px_16px_0_rgba(249,115,22,0.4)]'
												: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-[0_6px_16px_0_rgba(139,92,246,0.4)]'
										}`}>{daysLeft(a.due)}</span>
									</div>
								</div>
							);
						})}
					</div>
				</div>

				{/* Quick Upload */}
				<div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)] p-8 flex flex-col mb-4 relative overflow-hidden">
					{/* Subtle background glow */}
					<div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none"></div>
					
					<h2 className="text-[20pt] font-extrabold mb-6 text-slate-100 tracking-tight relative z-10">Quick Upload</h2>
					<div className="flex flex-col gap-4 relative z-10">
						{[
							{ type: 'Handout', icon: FileText, description: 'Study materials and handouts' },
							{ type: 'Assignment', icon: BookOpen, description: 'Assignments and homework' },
							{ type: 'Slides', icon: Presentation, description: 'Presentation slides' }
						].map(({ type, icon: Icon, description }) => (
							<ResourceUploadDialog key={type} defaultCategory={type}>
								<Button
									variant="outline"
									className="w-full justify-start h-auto p-4 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-cyan-500/10 border-purple-500/20 hover:border-purple-400/40 hover:bg-gradient-to-r hover:from-purple-600/20 hover:via-blue-600/20 hover:to-cyan-500/20 transition-all duration-300"
								>
									<div className="flex items-center gap-3">
										<Icon className="h-5 w-5 text-purple-400" />
										<div className="text-left">
											<div className="font-semibold text-slate-100">Upload {type}</div>
											<div className="text-xs text-slate-400">{description}</div>
										</div>
									</div>
									<Upload className="h-4 w-4 ml-auto text-purple-400" />
								</Button>
							</ResourceUploadDialog>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
