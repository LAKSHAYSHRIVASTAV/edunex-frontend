import CountUp from "react-countup";
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  ReferenceLine,
} from "recharts";

import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

interface Attempt {
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
}

interface AnalyticsData {
  totalQuizzes: number;
  averageScore: number;
  streak: number;
  highestScore: number;
  lowestScore: number;
  recentAttempts: Attempt[];
}

const API = "https://edunex-backend-rj22.onrender.com/api";

const Analytics = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(`${API}/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(res.data);

        if (res.data.highestScore >= 80) {
          confetti({ particleCount: 120, spread: 80 });
        }
      } catch (error) {
        console.error("Analytics Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="p-8 animate-pulse">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="p-8">No analytics data found.</div>;
  }

  const getInsight = () => {
    if (data.averageScore >= 70) return "🚀 You're performing great!";
    if (data.averageScore >= 40) return "📈 You're improving steadily!";
    return "⚠️ Focus more to boost your score!";
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 70) return "bg-green-500";
    if (score >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-100">
      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 ml-64 p-8 space-y-10">

          {/* HERO INSIGHT */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg"
          >
            <h2 className="text-2xl font-bold">🚀 Performance Insight</h2>
            <p className="text-sm mt-1">{getInsight()}</p>
          </motion.div>

          {/* CIRCLE */}
          <div className="w-44 mx-auto">
            <CircularProgressbar
              value={data.averageScore}
              text={`${data.averageScore}%`}
              styles={buildStyles({
                pathColor: "#6366f1",
                textColor: "#111827",
                trailColor: "#e5e7eb",
              })}
            />
            <p className="text-center mt-3 font-semibold">
              Overall Performance
            </p>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-5">
            <StatCard title="Total Quizzes" value={data.totalQuizzes} icon="📘" />
            <StatCard title="Average Score" value={data.averageScore} icon="📊" />
            <StatCard title="Streak" value={data.streak} icon="🔥" />
            <StatCard title="Highest Score" value={data.highestScore} icon="🏆" />
            <StatCard title="Lowest Score" value={data.lowestScore} icon="⚠️" />
          </div>

          {/* AI INSIGHT */}
          <div className="bg-white/70 backdrop-blur-xl border rounded-2xl p-5 shadow-md">
            <h3 className="font-semibold mb-2">🧠 AI Insight</h3>
            <p className="text-sm text-gray-600">
              {data.averageScore >= 70
                ? "You are consistent and improving rapidly."
                : "Focus on weak areas and practice regularly."}
            </p>
          </div>

          {/* CHART */}
          <div className="bg-white/70 backdrop-blur-xl border rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              📊 Performance Trend
            </h3>

            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.recentAttempts}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>

                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) =>
                    new Date(v).toLocaleDateString()
                  }
                />
                <YAxis domain={[0, 100]} />
                <Tooltip />

                <ReferenceLine y={70} stroke="green" label="Target" />

                <Area
                  type="monotone"
                  dataKey="percentage"
                  stroke="none"
                  fill="url(#colorScore)"
                />

                <Line
                  type="monotone"
                  dataKey="percentage"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* TIMELINE */}
          <div className="bg-white/70 backdrop-blur-xl border rounded-2xl p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-4">
              🕒 Recent Attempts
            </h3>

            {!data.recentAttempts.length ? (
              <p className="text-gray-500">
                📭 No attempts yet. Start a quiz!
              </p>
            ) : (
              <div className="space-y-4">
                {data.recentAttempts.map((a, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-3 h-3 rounded-full ${getPerformanceColor(
                          a.percentage
                        )}`}
                      ></div>

                      <span>
                        {new Date(a.date).toLocaleDateString()}
                      </span>
                    </div>

                    <span className="font-semibold text-indigo-600">
                      {a.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
};

/* ================= CARD ================= */

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.07 }}
      className="bg-white/70 backdrop-blur-xl border rounded-2xl p-4 text-center shadow-md hover:shadow-xl transition"
    >
      <div className="text-2xl">{icon}</div>
      <p className="text-sm mt-2 text-gray-600">{title}</p>

      <p className="text-2xl font-bold mt-1 text-indigo-600">
        <CountUp end={value} duration={1.5} />
        {title.includes("Score") ? "%" : title === "Streak" ? " Days" : ""}
      </p>
    </motion.div>
  );
};

export default Analytics;



