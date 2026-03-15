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

        // 🎉 Celebrate good performance
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
    return (
      <div className="p-8">
        Loading analytics...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8">
        No analytics data found.
      </div>
    );
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
            transition={{ duration: 0.6 }}
          >

            <h2 className="text-3xl font-bold mb-6">
              Analytics Dashboard
            </h2>

            {/* Performance Badge */}

            <div
              className={`inline-block px-4 py-2 rounded-full font-semibold mb-6 ${getPerformanceLevel().style}`}
            >
              {getPerformanceLevel().text}
            </div>

            {/* Circular Performance */}

            <div className="w-40 mx-auto mb-10">

              <CircularProgressbar
                value={data.averageScore}
                text={`${data.averageScore}%`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: "#6366f1",
                  textColor: "#111827",
                  trailColor: "#e5e7eb",
                })}
              />

              <p className="text-center mt-3 font-medium">
                Overall Performance
              </p>

            </div>

            {/* Stats Cards */}

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-10">

              <StatCard title="Total Quizzes" value={data.totalQuizzes} />

              <StatCard title="Average Score" value={data.averageScore} />

              <StatCard title="Streak" value={data.streak} />

              <StatCard title="Highest Score" value={data.highestScore} />

              <StatCard title="Lowest Score" value={data.lowestScore} />

            </div>

            {/* Performance Chart */}

            <div className="bg-white shadow rounded-xl p-6 mb-10">

              <h3 className="text-xl font-semibold mb-4">
                Recent Performance
              </h3>

              <ResponsiveContainer width="100%" height={300}>

                <LineChart data={data.recentAttempts}>

                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis
                    dataKey="date"
                    tickFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                  />

                  <YAxis domain={[0, 100]} />

                  <Tooltip
                    labelFormatter={(value) =>
                      new Date(value).toLocaleDateString()
                    }
                  />

                  <Line
                    type="monotone"
                    dataKey="percentage"
                    stroke="#6366f1"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                    activeDot={{ r: 8 }}
                  />

                </LineChart>

              </ResponsiveContainer>

            </div>

            {/* Recent Attempts */}

            <div className="bg-white shadow rounded-xl p-6">

              <h3 className="text-xl font-semibold mb-4">
                Last 5 Attempts
              </h3>

              {!data.recentAttempts || data.recentAttempts.length === 0 ? (

                <p>No quiz attempts yet.</p>

              ) : (

                <ul className="space-y-3">

                  {data.recentAttempts.map((attempt, index) => (

                    <li
                      key={index}
                      className="flex justify-between border-b pb-2"
                    >

                      <span>
                        {new Date(attempt.date).toLocaleDateString()}
                      </span>

                      <span className="font-semibold">
                        {attempt.percentage}%
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

const StatCard = ({
  title,
  value,
}: {
  title: string;
  value: number;
}) => {

  const getColor = () => {

    switch (title) {

      case "Average Score":
        return "bg-blue-50 text-blue-600";

      case "Highest Score":
        return "bg-green-50 text-green-600";

      case "Lowest Score":
        return "bg-red-50 text-red-600";

      case "Streak":
        return "bg-purple-50 text-purple-600";

      default:
        return "bg-gray-50 text-gray-700";

    }

  };

  return (

    <div
      className={`shadow rounded-xl p-4 text-center transition-transform duration-300 hover:scale-105 ${getColor()}`}
    >

      <p className="text-sm">{title}</p>

      <p className="text-2xl font-bold mt-2">

        <CountUp end={value} duration={1.5} />

        {title === "Average Score" ||
        title === "Highest Score" ||
        title === "Lowest Score"
          ? "%"
          : title === "Streak"
          ? " Days"
          : ""}

      </p>

    </div>

  );

};

export default Analytics;




