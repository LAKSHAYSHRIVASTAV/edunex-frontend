import { useEffect, useState } from "react";

interface Achievement {
  title: string;
  unlocked: boolean;
}

export default function Achievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    const fetchAchievements = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://edunex-backend-rj22.onrender.com/api/achievements",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();

      // Check for newly unlocked achievements
      const previouslyUnlocked =
        JSON.parse(localStorage.getItem("unlockedAchievements") || "[]");

      const newlyUnlocked = data.find(
        (a: Achievement) =>
          a.unlocked && !previouslyUnlocked.includes(a.title)
      );

      if (newlyUnlocked) {
        setNewAchievement(newlyUnlocked);

        // Save it so popup doesn't repeat
        const updatedUnlocked = [
          ...previouslyUnlocked,
          newlyUnlocked.title,
        ];
        localStorage.setItem(
          "unlockedAchievements",
          JSON.stringify(updatedUnlocked)
        );

        // Auto hide popup after 3 seconds
        setTimeout(() => {
          setNewAchievement(null);
        }, 3000);
      }

      setAchievements(data);
    };

    fetchAchievements();
  }, []);

  return (
  <div className="p-10 relative bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">

    {/* HEADER */}
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-4xl font-bold flex items-center gap-3 text-gray-800">
        🏅 Achievements
      </h1>

      <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-medium shadow">
        ⭐ Level 3 • 120 XP
      </div>
    </div>

    {/* CARDS */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {achievements.map((ach, index) => (
        <div
          key={index}
          className={`relative p-6 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
            ach.unlocked
              ? "bg-gradient-to-br from-green-50 to-green-100 border border-green-300"
              : "bg-gray-100 opacity-60"
          }`}
        >
          {/* ICON */}
          <div className="text-3xl mb-3">
            {ach.unlocked ? "🏆" : "🔒"}
          </div>

          {/* TITLE */}
          <p className="text-lg font-semibold text-gray-800">
            {ach.title}
          </p>

          {/* STATUS BADGE */}
          <span
            className={`inline-block mt-2 px-3 py-1 text-xs rounded-full ${
              ach.unlocked
                ? "bg-green-200 text-green-800"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {ach.unlocked ? "Unlocked" : "Locked"}
          </span>

          {/* PROGRESS BAR */}
          <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
            <div
              className={`h-2 rounded-full ${
                ach.unlocked ? "bg-green-500 w-full" : "bg-gray-400 w-1/3"
              }`}
            />
          </div>

          {/* HOVER GLOW */}
          {ach.unlocked && (
            <div className="absolute inset-0 rounded-2xl bg-green-400/10 opacity-0 hover:opacity-100 transition" />
          )}
        </div>
      ))}
    </div>

    {/* 🎉 POPUP (UPGRADED) */}
    {newAchievement && (
      <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-4 rounded-2xl shadow-2xl animate-[slideIn_0.5s_ease]">
        <p className="font-bold text-lg flex items-center gap-2">
          🎉 Achievement Unlocked!
        </p>
        <p className="text-sm mt-1">{newAchievement.title}</p>
      </div>
    )}
  </div>
);
}