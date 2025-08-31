import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";

export default function Settings() {
	const [remindersEnabled, setRemindersEnabled] = useState(true);
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background">
			<div className="max-w-lg w-full px-2 py-6 flex flex-col gap-6">
				<div className="rounded-xl shadow-lg p-4 bg-[#181e29]/90">
					<div className="text-2xl font-bold text-gray-200 mb-3 text-center">
						Settings
					</div>
					<div className="flex items-center justify-between mb-1">
						<span className="font-medium text-gray-300">Reminders</span>
						<Switch
							checked={remindersEnabled}
							onCheckedChange={setRemindersEnabled}
						/>
					</div>
				</div>
				<div className="grid gap-6">
					<div className="rounded-xl shadow-lg p-4 bg-[#181e29]/90">
						<div className="text-lg font-semibold text-gray-200 mb-2">
							Update Email
						</div>
						<input
							type="email"
							placeholder="Enter new email"
							className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#2a2f3c] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						/>
						<button className="mt-2 w-full px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
							Update Email
						</button>
					</div>
					<div className="rounded-xl shadow-lg p-4 bg-[#181e29]/90">
						<div className="text-lg font-semibold text-gray-200 mb-2">
							Update Phone Number
						</div>
						<input
							type="tel"
							placeholder="Enter new phone number"
							className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#2a2f3c] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						/>
						<button className="mt-2 w-full px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
							Update Phone
						</button>
					</div>
					<div className="rounded-xl shadow-lg p-4 bg-[#181e29]/90">
						<div className="text-lg font-semibold text-gray-200 mb-2">
							Change Password
						</div>
						<input
							type="password"
							placeholder="Current password"
							className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#2a2f3c] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mb-1"
						/>
						<input
							type="password"
							placeholder="New password"
							className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#2a2f3c] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mb-1"
						/>
						<input
							type="password"
							placeholder="Confirm new password"
							className="w-full px-3 py-2 rounded-lg border border-gray-700 bg-[#2a2f3c] text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
						/>
						<button className="mt-2 w-full px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow hover:shadow-lg hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all">
							Change Password
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
