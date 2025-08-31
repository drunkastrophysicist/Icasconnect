import React from "react";
import { useNavigate } from "react-router-dom";

const subjects = [
  { name: "Math", color: "bg-blue-100 text-blue-800" },
  { name: "Physics", color: "bg-green-100 text-green-800" },
  { name: "English", color: "bg-yellow-100 text-yellow-800" },
  { name: "Psychology", color: "bg-purple-100 text-purple-800" }
];

export default function PQYS() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-background">
      <h1 className="text-3xl font-bold text-cyan-700 mb-8">PQYS - Subjects</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 w-full max-w-4xl">
        {subjects.map((sub) => (
          <button
            key={sub.name}
            className={`px-10 py-16 rounded-2xl shadow-lg font-bold text-2xl flex items-center justify-center ${sub.color} hover:scale-105 transition-transform cursor-pointer`}
            onClick={() => navigate(`/resources/pqys/${sub.name.toLowerCase()}`)}
          >
            {sub.name}
          </button>
        ))}
      </div>
    </div>
  );
}
