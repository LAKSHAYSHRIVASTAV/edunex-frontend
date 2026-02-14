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
    <div className="p-10 relative">
      <h1 className="text-3xl font-bold mb-6">
        🏅 Achievements
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {achievements.map((ach, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl shadow transform transition-all duration-500 hover:scale-105 ${
              ach.unlocked
                ? "bg-green-100 border border-green-300"
                : "bg-gray-100 opacity-60"
            }`}
          >
            <p className="text-lg font-semibold">
              {ach.title}
            </p>
            <p className="mt-2 text-sm">
              {ach.unlocked ? "Unlocked 🎉" : "Locked"}
            </p>
          </div>
        ))}
      </div>

      {/* 🎉 Achievement Popup */}
      {newAchievement && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-4 rounded-xl shadow-lg animate-bounce">
          <p className="font-bold text-lg">
            🎉 Achievement Unlocked!
          </p>
          <p>{newAchievement.title}</p>
        </div>
      )}
    </div>
  );
}

