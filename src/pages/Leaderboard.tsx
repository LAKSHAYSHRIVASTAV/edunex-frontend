import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CountUp from "react-countup";

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
          headers: { Authorization: `Bearer ${token}` },
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
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-8">

      {/* 🌈 FLOATING BLOBS */}
      <div className="absolute inset-0 -z-10 overflow-hidden">

        <motion.div
          className="absolute w-72 h-72 bg-blue-300 opacity-30 rounded-full blur-3xl"
          animate={{ x: [0, 100, -50, 0], y: [0, -100, 50, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute w-80 h-80 bg-purple-300 opacity-30 rounded-full blur-3xl top-40 right-10"
          animate={{ x: [0, -120, 60, 0], y: [0, 80, -60, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />

        <motion.div
          className="absolute w-72 h-72 bg-pink-300 opacity-30 rounded-full blur-3xl bottom-10 left-20"
          animate={{ x: [0, 60, -80, 0], y: [0, -60, 80, 0] }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
        />

      </div>

      <div className="max-w-5xl mx-auto relative z-10">

        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold flex items-center gap-3 text-gray-800 dark:text-white">
            🏆 Leaderboard
          </h1>

          <div className="bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 px-4 py-2 rounded-full text-sm font-medium shadow">
            {activeTab === "global" ? "🌍 Global Ranking" : "👥 Friends Ranking"}
          </div>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("global")}
            className={`px-5 py-2 rounded-full font-medium transition ${
              activeTab === "global"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300"
            }`}
          >
            🌍 Global
          </button>

          <button
            onClick={() => setActiveTab("friends")}
            className={`px-5 py-2 rounded-full font-medium transition ${
              activeTab === "friends"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300"
            }`}
          >
            👥 Friends
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            ⏳ Loading leaderboard...
          </div>
        ) : leaders.length === 0 ? (
          <div className="text-center py-10 text-gray-500 dark:text-gray-400">
            No quiz data available yet.
          </div>
        ) : (
          <>
            {/* 🥇 TOP 3 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-center">
              {leaders.slice(0, 3).map((user, i) => (
                <div
                  key={i}
                  className={`relative p-6 rounded-2xl shadow-lg ${
                    i === 0
                      ? "bg-yellow-100 dark:bg-yellow-900 scale-105"
                      : i === 1
                      ? "bg-gray-100 dark:bg-gray-800"
                      : "bg-orange-100 dark:bg-orange-900"
                  }`}
                >
                  {i === 0 && (
                    <div className="absolute inset-0 rounded-2xl bg-yellow-300/20 animate-pulse" />
                  )}

                  <div className="text-3xl">
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : "🥉"}
                  </div>

                  <p className="font-bold mt-2 dark:text-white">{user.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {user.averageScore}%
                  </p>
                </div>
              ))}
            </div>

            {/* LIST */}
            <div className="space-y-4">
              {leaders.map((user) => (
                <motion.div
                  key={user.rank}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: user.rank * 0.05 }}
                  className={`flex items-center justify-between p-5 rounded-2xl shadow-md transition hover:scale-[1.02] hover:shadow-xl ${
                    user.name === currentUser.name
                      ? "bg-blue-100 dark:bg-blue-900 border-2 border-blue-500"
                      : "bg-white/80 backdrop-blur-md dark:bg-gray-800"
                  } ${user.rank === 1 ? "ring-2 ring-yellow-400 shadow-lg" : ""}`}
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

                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-lg flex items-center gap-2 dark:text-white">
                        {user.name}
                        {user.name === currentUser.name && (
                          <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">
                            You
                          </span>
                        )}
                      </p>

                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user.totalQuizzes} quizzes • {user.averageScore * 10} XP
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-xl font-bold text-blue-600">
                      <CountUp end={user.averageScore} duration={1.5} />%
                    </p>

                    <div className="w-32 bg-gray-200 dark:bg-gray-700 h-2 rounded-full mt-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${user.averageScore}%` }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* BACK */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-10 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}