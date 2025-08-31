import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getEvents, getSchedules } from "../../shared/api";

const months = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDaysInMonth(month: number, year: number) {
	return new Date(year, month + 1, 0).getDate();
}

function isToday(day: number, month: number, year: number) {
	const today = new Date();
	return day === today.getDate() && 
		   month === today.getMonth() && 
		   year === today.getFullYear();
}

// Enhanced events data with multiple events per day
const events = {
	0: { // January
		1: [{ type: "holiday", label: "New Year's Day", time: "All Day" }],
		14: [{ type: "festival", label: "Pongal", time: "All Day" }],
		26: [{ type: "holiday", label: "Republic Day", time: "All Day" }],
	},
	2: { // March
		17: [{ type: "festival", label: "Holi", time: "All Day" }],
	},
	3: { // April
		14: [{ type: "holiday", label: "Ambedkar Jayanti", time: "All Day" }],
		18: [
			{ type: "exam", label: "Midterm Exam - Physics", time: "9:00 AM" },
			{ type: "exam", label: "Midterm Exam - Math", time: "2:00 PM" }
		],
	},
	4: { // May
		1: [{ type: "holiday", label: "Labour Day", time: "All Day" }],
		23: [{ type: "exam", label: "Final Exam", time: "10:00 AM" }],
	},
	7: { // August
		15: [{ type: "holiday", label: "Independence Day", time: "All Day" }],
		31: [
			{ type: "exam", label: "Project Presentation", time: "10:00 AM" },
			{ type: "festival", label: "College Fest", time: "3:00 PM" }
		],
	},
	9: { // October
		2: [{ type: "holiday", label: "Gandhi Jayanti", time: "All Day" }],
		22: [{ type: "festival", label: "Dussehra", time: "All Day" }],
	},
	10: { // November
		1: [{ type: "festival", label: "Diwali", time: "All Day" }],
	},
	11: { // December
		25: [{ type: "holiday", label: "Christmas", time: "All Day" }],
	},
};

const eventColors = {
	holiday: { dot: "bg-red-500", bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
	festival: { dot: "bg-green-500", bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
	exam: { dot: "bg-purple-500", bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
};

export default function Calendar() {
	const currentDate = new Date();
	const [view, setView] = useState<"year" | "month">("month");
	const [currentMonth, setCurrentMonth] = useState<number>(currentDate.getMonth());
	const [currentYear, setCurrentYear] = useState<number>(currentDate.getFullYear());
	const [hoveredDay, setHoveredDay] = useState<{ day: number; events: any[]; x: number; y: number } | null>(null);
	const [selectedDay, setSelectedDay] = useState<{ day: number; month: number; year: number; events: any[] } | null>(null);
	const [calendarEvents, setCalendarEvents] = useState(events);
	const [loading, setLoading] = useState(false);

	// Load events and schedules from API
	useEffect(() => {
		const loadCalendarData = async () => {
			setLoading(true);
			try {
				// Load events
				const eventsResult = await getEvents();
				const schedulesResult = await getSchedules();
				
				const apiEvents = {};
				
				// Process events from API
				if (eventsResult.success && eventsResult.data) {
					eventsResult.data.forEach((event: any) => {
						const eventDate = new Date(event.date || event.startDate);
						const month = eventDate.getMonth();
						const day = eventDate.getDate();
						
						if (!apiEvents[month]) apiEvents[month] = {};
						if (!apiEvents[month][day]) apiEvents[month][day] = [];
						
						apiEvents[month][day].push({
							type: event.category?.toLowerCase() || "event",
							label: event.title || event.name || "Event",
							time: event.startTime || "All Day"
						});
					});
				}
				
				// Process schedules from API
				if (schedulesResult.success && schedulesResult.data) {
					schedulesResult.data.forEach((schedule: any) => {
						const scheduleDate = new Date(schedule.date);
						const month = scheduleDate.getMonth();
						const day = scheduleDate.getDate();
						
						if (!apiEvents[month]) apiEvents[month] = {};
						if (!apiEvents[month][day]) apiEvents[month][day] = [];
						
						apiEvents[month][day].push({
							type: "class",
							label: `${schedule.subject || "Class"} - ${schedule.room || "Room TBD"}`,
							time: schedule.startTime || "TBD"
						});
					});
				}
				
				// Merge with existing static events
				const mergedEvents = { ...events };
				Object.keys(apiEvents).forEach(monthKey => {
					const month = parseInt(monthKey);
					if (!mergedEvents[month]) mergedEvents[month] = {};
					Object.keys(apiEvents[month]).forEach(dayKey => {
						const day = parseInt(dayKey);
						if (!mergedEvents[month][day]) {
							mergedEvents[month][day] = apiEvents[month][day];
						} else {
							mergedEvents[month][day] = [...mergedEvents[month][day], ...apiEvents[month][day]];
						}
					});
				});
				
				setCalendarEvents(mergedEvents);
			} catch (error) {
				console.error("Failed to load calendar data:", error);
			} finally {
				setLoading(false);
			}
		};

		loadCalendarData();
	}, []);

	const navigateMonth = (direction: 'prev' | 'next') => {
		if (direction === 'next') {
			if (currentMonth === 11) {
				setCurrentMonth(0);
				setCurrentYear(currentYear + 1);
			} else {
				setCurrentMonth(currentMonth + 1);
			}
		} else {
			if (currentMonth === 0) {
				setCurrentMonth(11);
				setCurrentYear(currentYear - 1);
			} else {
				setCurrentMonth(currentMonth - 1);
			}
		}
	};

	const goToToday = () => {
		const today = new Date();
		setCurrentMonth(today.getMonth());
		setCurrentYear(today.getFullYear());
		setView("month");
	};

	const renderCalendarGrid = (month: number, year: number, isYearView = false) => {
		const days = getDaysInMonth(month, year);
		const firstDay = new Date(year, month, 1).getDay();
		const rows = [];
		let cells = [];

		// Empty cells for days before month starts
		for (let i = 0; i < firstDay; i++) {
			cells.push(
				<td key={`empty-${i}`} className="p-1 w-1/7 h-12 md:h-16"></td>
			);
		}

		// Days of the month
		for (let day = 1; day <= days; day++) {
			const dayEvents = calendarEvents[month]?.[day] || [];
			const isCurrentDay = isToday(day, month, year);
			const hasEvents = dayEvents.length > 0;

			cells.push(
				<td
					key={day}
					className="p-1 w-1/7 h-12 md:h-16 text-center align-top relative cursor-pointer hover:bg-muted/50 transition-colors"
					onMouseEnter={(e) => {
						if (hasEvents && !isYearView) {
							const rect = e.currentTarget.getBoundingClientRect();
							setHoveredDay({ 
								day, 
								events: dayEvents, 
								x: rect.left + rect.width / 2, 
								y: rect.top - 10 
							});
						}
					}}
					onMouseLeave={() => setHoveredDay(null)}
					onClick={() => hasEvents && setSelectedDay({ day, month, year, events: dayEvents })}
				>
					{/* Day number */}
					<div className="relative inline-block">
						<span
							className={`
								${isYearView ? 'w-6 h-6 text-xs' : 'w-8 h-8 text-sm'} 
								flex items-center justify-center rounded-full font-medium transition-all
								${isCurrentDay 
									? 'bg-primary text-primary-foreground font-bold ring-2 ring-primary/30' 
									: hasEvents 
										? 'hover:bg-accent hover:text-accent-foreground' 
										: 'hover:bg-accent/50'
								}
							`}
						>
							{day}
						</span>
						
						{/* Event indicators - colored dots */}
						{hasEvents && (
							<div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex gap-1">
								{dayEvents.slice(0, 3).map((event, index) => (
									<div
										key={index}
										className={`w-1.5 h-1.5 rounded-full ${eventColors[event.type].dot}`}
									/>
								))}
								{dayEvents.length > 3 && (
									<div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
								)}
							</div>
						)}
					</div>
				</td>
			);

			if (cells.length % 7 === 0 || day === days) {
				rows.push(<tr key={`row-${day}`}>{cells}</tr>);
				cells = [];
			}
		}

		return rows;
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-6">
			<div className="max-w-6xl mx-auto space-y-6">
				{/* Dynamic Header */}
				<div className="flex flex-col gap-4">
					<div className="flex items-center justify-between">
						<h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
							<CalendarIcon className="w-8 h-8 text-primary" />
							{view === "month" ? `${months[currentMonth]} ${currentYear}` : `${currentYear} Calendar`}
						</h1>
						
						<div className="flex items-center gap-2">
							<Button
								variant="outline"
								size="sm"
								onClick={goToToday}
								className="hidden md:flex"
							>
								Today
							</Button>
							
							{view === "month" && (
								<div className="flex items-center gap-1">
									<Button
										variant="outline"
										size="sm"
										onClick={() => navigateMonth('prev')}
										className="h-9 w-9 p-0"
									>
										<ChevronLeft className="w-4 h-4" />
									</Button>
									
									<Button
										variant="outline"
										size="sm"
										onClick={() => navigateMonth('next')}
										className="h-9 w-9 p-0"
									>
										<ChevronRight className="w-4 h-4" />
									</Button>
								</div>
							)}
						</div>
					</div>

					{/* View Toggle */}
					<div className="flex gap-2">
						<Button
							variant={view === "month" ? "default" : "outline"}
							size="sm"
							onClick={() => setView("month")}
						>
							Month View
						</Button>
						<Button
							variant={view === "year" ? "default" : "outline"}
							size="sm"
							onClick={() => setView("year")}
						>
							Year View
						</Button>
					</div>
				</div>

				{/* Calendar Content */}
				{view === "month" ? (
					<div className="bg-card rounded-2xl border border-border shadow-lg overflow-hidden">
						<div className="p-6">
							{/* Month Calendar */}
							<table className="w-full border-collapse">
								<thead>
									<tr>
										{dayNames.map((day) => (
											<th key={day} className="p-3 text-center text-sm font-semibold text-muted-foreground border-b border-border">
												{day}
											</th>
										))}
									</tr>
								</thead>
								<tbody>
									{renderCalendarGrid(currentMonth, currentYear)}
								</tbody>
							</table>
						</div>
					</div>
				) : (
					/* Year View */
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{months.map((month, idx) => (
							<div key={month} className="bg-card rounded-xl border border-border shadow-sm hover:shadow-md transition-shadow">
								<div className="p-4">
									<h3 className="text-lg font-semibold text-center mb-3 text-foreground">{month}</h3>
									<table className="w-full text-xs border-collapse">
										<thead>
											<tr>
												{dayNames.map((day) => (
													<th key={day} className="p-1 text-center text-muted-foreground font-medium">
														{day.slice(0, 1)}
													</th>
												))}
											</tr>
										</thead>
										<tbody>
											{renderCalendarGrid(idx, currentYear, true)}
										</tbody>
									</table>
								</div>
							</div>
						))}
					</div>
				)}

				{/* Hover Tooltip */}
				{hoveredDay && (
					<div className="fixed z-50 bg-popover border border-border rounded-lg shadow-lg p-3 pointer-events-none max-w-xs"
						 style={{
							 left: hoveredDay.x,
							 top: hoveredDay.y,
							 transform: 'translate(-50%, -100%)'
						 }}>
						<div className="space-y-2">
							<h4 className="font-semibold text-sm text-foreground">
								{months[currentMonth]} {hoveredDay.day}, {currentYear}
							</h4>
							{hoveredDay.events.map((event, index) => (
								<div key={index} className="flex items-center gap-2 text-xs">
									<div className={`w-2 h-2 rounded-full ${eventColors[event.type].dot}`} />
									<span className="text-foreground">{event.label}</span>
									<span className="text-muted-foreground">({event.time})</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Day View Dialog */}
				{selectedDay && (
					<Dialog open={!!selectedDay} onOpenChange={() => setSelectedDay(null)}>
						<DialogContent className="max-w-md">
							<DialogHeader>
								<DialogTitle className="flex items-center gap-2">
									<CalendarIcon className="w-5 h-5 text-primary" />
									{months[selectedDay.month]} {selectedDay.day}, {selectedDay.year}
								</DialogTitle>
							</DialogHeader>
							
							<div className="space-y-4">
								<div className="text-sm text-muted-foreground">
									{selectedDay.events.length} event{selectedDay.events.length !== 1 ? 's' : ''} scheduled
								</div>
								
								<div className="space-y-3">
									{selectedDay.events.map((event, index) => (
										<div key={index} className={`p-3 rounded-lg border ${eventColors[event.type].bg} ${eventColors[event.type].border}`}>
											<div className="flex items-start justify-between">
												<div className="space-y-1">
													<h4 className={`font-semibold ${eventColors[event.type].text}`}>
														{event.label}
													</h4>
													<div className="flex items-center gap-2 text-sm text-muted-foreground">
														<Clock className="w-3 h-3" />
														{event.time}
													</div>
												</div>
												<Badge variant="secondary" className="text-xs">
													{event.type.charAt(0).toUpperCase() + event.type.slice(1)}
												</Badge>
											</div>
										</div>
									))}
								</div>
								
								<Button className="w-full" size="sm">
									<Eye className="w-4 h-4 mr-2" />
									View All Events
								</Button>
							</div>
						</DialogContent>
					</Dialog>
				)}
			</div>
		</div>
	);
}
