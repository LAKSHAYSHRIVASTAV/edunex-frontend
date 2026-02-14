import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface LeaderboardEntry {
  rank: number;
  name: string;
  averageScore: number;
  totalQuizzes: number;
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"global" | "friends">("global");
  const currentUser = JSON.parse(localStorage.getItem("user") || "{}");


  const fetchLeaderboard = async () => {
    const token = localStorage.getItem("token");

    try {
      const endpoint =
        activeTab === "global"
          ? "/api/leaderboard"
          : "/api/leaderboard/friends";

      const res = await fetch(
        `https://edunex-backend-rj22.onrender.com${endpoint}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setLeaders(data);
    } catch (error) {
      console.error("Leaderboard fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchLeaderboard();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("global")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "global"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            🌍 Global
          </button>

          <button
            onClick={() => setActiveTab("friends")}
            className={`px-4 py-2 rounded-lg ${
              activeTab === "friends"
                ? "bg-blue-600 text-white"
                : "bg-gray-200"
            }`}
          >
            👥 Friends
          </button>
        </div>

        {loading ? (
          <p>Loading leaderboard...</p>
        ) : leaders.length === 0 ? (
          <p>No quiz data available yet.</p>
        ) : (
          <div className="space-y-4">
            {leaders.map((user) => (
              <div
             key={user.rank}
             className={`flex items-center justify-between p-4 rounded-xl shadow-sm transition transform hover:scale-[1.02] ${
            user.name === currentUser.name
            ? "bg-blue-100 border-2 border-blue-500"
            : "bg-gray-50 hover:shadow-md"
      }`}
         >

                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold w-8">
                    {user.rank === 1
                      ? "🥇"
                      : user.rank === 2
                      ? "🥈"
                      : user.rank === 3
                      ? "🥉"
                      : `#${user.rank}`}
                  </div>
                  <div>
                  <p className="font-semibold text-lg flex items-center gap-2">
                 {user.name}
                 {user.name === currentUser.name && (
                <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                 You
                </span>
               )}
                 </p>

                    <p className="text-sm text-gray-500">
                      {user.totalQuizzes} quizzes completed
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-xl font-bold text-blue-600">
                    {user.averageScore}%
                  </p>
                  <p className="text-xs text-gray-500">
                    Average Score
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 px-6 py-2 bg-blue-600 text-white rounded-lg"
        >
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}
