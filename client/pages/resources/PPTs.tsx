import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects } from "../../../shared/api";

const defaultSubjects = [
	{ name: "Math", color: "bg-blue-100 text-blue-800" },
	{ name: "Physics", color: "bg-green-100 text-green-800" },
	{ name: "English", color: "bg-yellow-100 text-yellow-800" },
	{ name: "Psychology", color: "bg-purple-100 text-purple-800" }
];

export default function PPTs() {
	const navigate = useNavigate();
	const [subjects, setSubjects] = useState(defaultSubjects);
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		const loadSubjects = async () => {
			setLoading(true);
			try {
				const result = await getSubjects();
				if (result.success && result.data) {
					const apiSubjects = result.data.map((subject: any, index: number) => ({
						name: subject.name || subject.title || `Subject ${index + 1}`,
						color: getSubjectColor(index)
					}));
					setSubjects([...defaultSubjects, ...apiSubjects]);
				}
			} catch (error) {
				console.error("Failed to load subjects:", error);
			} finally {
				setLoading(false);
			}
		};

		loadSubjects();
	}, []);

	const getSubjectColor = (index: number) => {
		const colors = [
			"bg-red-100 text-red-800",
			"bg-orange-100 text-orange-800", 
			"bg-indigo-100 text-indigo-800",
			"bg-pink-100 text-pink-800",
			"bg-cyan-100 text-cyan-800"
		];
		return colors[index % colors.length];
	};
	return (
		<div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-background">
			<h1 className="text-3xl font-bold text-blue-700 mb-8">PPTs - Subjects</h1>
			{loading && (
				<div className="text-muted-foreground mb-4">Loading subjects...</div>
			)}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
				{subjects.map((sub) => (
					<button
						key={sub.name}
						className={`px-10 py-16 rounded-2xl shadow-lg font-bold text-2xl flex items-center justify-center ${sub.color} hover:scale-105 transition-transform cursor-pointer`}
						onClick={() => navigate(`/resources/ppts/${sub.name.toLowerCase()}`)}
					>
						{sub.name}
					</button>
				))}
			</div>
		</div>
	);
}
