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
          confetti({
            particleCount: 120,
            spread: 80,
          });
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
    return <div className="p-8">Loading analytics...</div>;
  }

  if (!data) {
    return <div className="p-8">No analytics data found.</div>;
  }

  const getPerformanceLevel = () => {
    if (data.averageScore >= 75)
      return {
        text: "🚀 Excellent Performance",
        style: "bg-green-100 text-green-700",
      };

    if (data.averageScore >= 50)
      return {
        text: "👍 Good Progress",
        style: "bg-yellow-100 text-yellow-700",
      };

    return {
      text: "📚 Needs Improvement",
      style: "bg-red-100 text-red-700",
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">

      <Navbar />

      <div className="flex">
        <Sidebar />

        <main className="flex-1 ml-64 p-8 space-y-10">

          <motion.div
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
          >

            <h2 className="text-3xl font-bold mb-4">
              Analytics Dashboard
            </h2>

            {/* PERFORMANCE BADGE */}
            <div className={`inline-block px-4 py-2 rounded-full font-semibold mb-6 ${getPerformanceLevel().style}`}>
              {getPerformanceLevel().text}
            </div>

            {/* CIRCULAR */}
            <div className="w-40 mx-auto mb-10">
              <CircularProgressbar
                value={data.averageScore}
                text={`${data.averageScore}%`}
                styles={buildStyles({
                  pathColor: "#6366f1",
                  textColor: "#111827",
                  trailColor: "#e5e7eb",
                })}
              />
              <p className="text-center mt-3 font-medium">
                Overall Performance
              </p>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-5 mb-10">
              <StatCard title="Total Quizzes" value={data.totalQuizzes} icon="📘" />
              <StatCard title="Average Score" value={data.averageScore} icon="📊" />
              <StatCard title="Streak" value={data.streak} icon="🔥" />
              <StatCard title="Highest Score" value={data.highestScore} icon="🏆" />
              <StatCard title="Lowest Score" value={data.lowestScore} icon="⚠️" />
            </div>

            {/* AI INSIGHT */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-5 shadow-md mb-10">
              <h3 className="font-semibold mb-2">🧠 AI Insight</h3>
              <p className="text-sm text-gray-600">
                {data.averageScore >= 70
                  ? "You are performing consistently well. Keep pushing!"
                  : "Focus on weak areas and maintain consistency to improve performance."}
              </p>
            </div>

            {/* CHART */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-md mb-10">
              <h3 className="text-xl font-semibold mb-4">
                Recent Performance
              </h3>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data.recentAttempts}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(v) => new Date(v).toLocaleDateString()}
                  />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />

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

            {/* ATTEMPTS */}
            <div className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Last 5 Attempts
              </h3>

              {!data.recentAttempts.length ? (
                <p>No quiz attempts yet.</p>
              ) : (
                <ul className="space-y-3">
                  {data.recentAttempts.map((a, i) => (
                    <li
                      key={i}
                      className="flex justify-between p-3 rounded-xl hover:bg-gray-100 transition"
                    >
                      <span>
                        {new Date(a.date).toLocaleDateString()}
                      </span>
                      <span className="font-semibold text-indigo-600">
                        {a.percentage}%
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

          </motion.div>

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
      whileHover={{ scale: 1.05 }}
      className="bg-white/60 backdrop-blur-xl border border-gray-200 rounded-2xl p-4 text-center shadow-md"
    >
      <div className="text-2xl">{icon}</div>
      <p className="text-sm mt-2">{title}</p>

      <p className="text-2xl font-bold mt-1">
        <CountUp end={value} duration={1.5} />
        {title.includes("Score") ? "%" : title === "Streak" ? " Days" : ""}
      </p>
    </motion.div>
  );
};

export default Analytics;



