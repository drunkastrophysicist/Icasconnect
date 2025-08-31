import React, { useState, useEffect } from "react";
import { getNotifications, getSchedules, getCourses, createNotification } from "../../shared/api";

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

	// Load data from APIs
	useEffect(() => {
		const loadTeacherData = async () => {
			setLoading(true);
			try {
				// Load notifications as announcements
				const notificationsResult = await getNotifications();
				if (notificationsResult.success && notificationsResult.data) {
					const apiAnnouncements = notificationsResult.data.slice(0, 5).map((notif: any) => ({
						text: notif.message || notif.content || "New notification",
						date: notif.date || notif.createdAt || new Date().toISOString().slice(0, 10)
					}));
					setAnnouncements(prev => [...apiAnnouncements, ...prev]);
				}

				// Load today's schedule
				const schedulesResult = await getSchedules();
				if (schedulesResult.success && schedulesResult.data) {
					const today = new Date().toISOString().split('T')[0];
					const todaySchedule = schedulesResult.data.find((schedule: any) => 
						schedule.date === today
					);
					if (todaySchedule) {
						setTodayClass({
							subject: todaySchedule.subject || "Next Class",
							time: `${todaySchedule.startTime || "TBD"} - ${todaySchedule.endTime || "TBD"}`,
							room: todaySchedule.room || todaySchedule.location || "TBD"
						});
					}
				}

				// Load courses for assignments
				const coursesResult = await getCourses();
				if (coursesResult.success && coursesResult.data) {
					const courseAssignments = coursesResult.data.slice(0, 3).map((course: any, index: number) => ({
						subject: course.title || course.name || "Subject",
						title: `${course.title || "Assignment"} - Task ${index + 1}`,
						due: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
						submissions: Math.floor(Math.random() * 20) + 5,
						total: 25
					}));
					setAssignments(prev => [...courseAssignments, ...prev.slice(0, 2)]);
				}
			} catch (error) {
				console.error("Failed to load teacher dashboard data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadTeacherData();
	}, []);

	function postAnnouncement(e) {
		e.preventDefault();
		if (!announcementText.trim()) return;
		setAnnouncements([
			{ text: announcementText, date: new Date().toISOString().slice(0, 10) },
			...announcements
		]);
		setAnnouncementText("");
	}

	function handleUpload(type) {
		return (e) => {
			const file = e.target.files[0];
			if (file) {
				console.log(`${type} file selected:`, file);
			}
		};
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 py-12 px-4 font-sans">
			<div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
				{/* Announcements */}
				<div className="bg-gradient-to-br from-slate-800/90 to-slate-700/90 backdrop-blur-sm rounded-2xl border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.05)] p-8 flex flex-col mb-4 relative overflow-hidden">
					{/* Subtle background glow */}
					<div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-blue-500/5 pointer-events-none"></div>
					
					<h2 className="text-[20pt] font-extrabold mb-6 text-slate-100 tracking-tight relative z-10">Announcements</h2>
					<form onSubmit={postAnnouncement} className="flex flex-col gap-3 mb-6 relative z-10">
						<textarea
							className="rounded-xl border border-slate-600/50 p-4 text-[14pt] focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 bg-slate-700/80 text-slate-100 leading-relaxed tracking-wide shadow-[inset_0_2px_4px_0_rgba(0,0,0,0.3)] transition-all duration-200"
							rows={2}
							value={announcementText}
							onChange={e => setAnnouncementText(e.target.value)}
							placeholder="Type your announcement..."
						/>
						<button
							type="submit"
							className="self-end px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-[14pt] shadow-[0_8px_24px_0_rgba(139,92,246,0.3),inset_0_1px_0_0_rgba(255,255,255,0.1)] hover:scale-105 hover:shadow-[0_12px_32px_0_rgba(139,92,246,0.4),0_0_20px_0_rgba(59,130,246,0.2)] transition-all duration-300"
						>
							Post Announcement
						</button>
					</form>
					<div className="flex flex-col gap-4 relative z-10">
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
					<div className="flex flex-col gap-5 relative z-10">
						{['Handout', 'Assignment', 'Slides'].map(type => (
							<label key={type} className="w-full">
								<input
									type="file"
									className="hidden"
									onChange={handleUpload(type)}
								/>
								<span className="block w-full px-6 py-3 rounded-full bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 text-white font-bold text-[14pt] shadow-[0_8px_24px_0_rgba(139,92,246,0.3),inset_0_1px_0_0_rgba(255,255,255,0.1),inset_0_-1px_0_0_rgba(0,0,0,0.1)] hover:scale-[1.02] hover:shadow-[0_12px_32px_0_rgba(139,92,246,0.4),0_0_20px_0_rgba(59,130,246,0.2)] transition-all duration-300 cursor-pointer text-center">
									Upload {type}
								</span>
							</label>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
