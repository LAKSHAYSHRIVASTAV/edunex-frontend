import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";
import SummaryCard from "../components/dashboard/SummaryCard";
import ActionButtons from "../components/dashboard/ActionButtons";
import ProgressChart from "../components/dashboard/ProgressChart";
import ProgressRing from "../components/dashboard/ProgressRing";
import { Sparkles } from "lucide-react";

interface DashboardData {
  readingProgress: number;
  quizCompletion: number;
  flashcardsReviewed: number;
  weeklyStudyHours: number;
  weeklyActivity: { date: string; hours: number }[];
  subjectDistribution: { subject: string; count: number }[];
  studyStreak: number;
  totalHours: number;
  avgDailyHours: number;
}

export default function Dashboard() {
  const [userName, setUserName] = useState<string>("User");
  const [dashboardData, setDashboardData] =
    useState<DashboardData | null>(null);
  const [goalProgress, setGoalProgress] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [newGoal, setNewGoal] = useState<number>(5);

  const navigate = useNavigate();

  // ================= USER NAME =================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.name) setUserName(parsedUser.name);
      } catch {}
    }
  }, []);

  // ================= DASHBOARD DATA =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchDashboard = async () => {
      try {
        const res = await fetch(
          "https://edunex-backend-rj22.onrender.com/api/dashboard",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.log("Dashboard API error", err);
      }
    };

    fetchDashboard();
  }, []);

  // ================= GOAL + RECOMMENDATION =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchExtras = async () => {
      try {
        const goalRes = await fetch(
          "https://edunex-backend-rj22.onrender.com/api/goals/progress",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const goalData = await goalRes.json();
        setGoalProgress(goalData);
        setNewGoal(goalData.weeklyQuizTarget);

        const recRes = await fetch(
          "https://edunex-backend-rj22.onrender.com/api/recommendation",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const recData = await recRes.json();
        setRecommendation(recData);
      } catch (err) {
        console.log("Extras API error", err);
      }
    };

    fetchExtras();
  }, []);

  // ================= UPDATE GOAL =================
  const handleUpdateGoal = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        "https://edunex-backend-rj22.onrender.com/api/goals/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ weeklyQuizTarget: newGoal }),
        }
      );

      const data = await res.json();
      setGoalProgress((prev: any) => ({
        ...prev,
        weeklyQuizTarget: data.weeklyQuizTarget,
        progressPercentage: Math.min(
          Math.round(
            (prev.completed / data.weeklyQuizTarget) * 100
          ),
          100
        ),
      }));
    } catch (error) {
      console.log("Goal update error", error);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">
      
      <div className="absolute w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 top-10 left-10 animate-pulse"></div>
      <div className="absolute w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20 bottom-10 right-10 animate-pulse"></div>

      <Navbar />

      <div className="flex relative z-10">
        <Sidebar />

        <main className="flex-1 ml-64 px-10 py-12 space-y-12">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-md border border-white/40 mb-6 shadow-sm">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-sm font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                AI Powered
              </span>
            </div>

            <h1 className="text-5xl font-black leading-tight mb-4">
              <span className="bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900 bg-clip-text text-transparent">
                Welcome Back, {userName} 👋
              </span>
            </h1>

            <p className="text-lg text-gray-600 max-w-2xl">
              Your intelligent study ecosystem designed to maximize performance.
            </p>
          </motion.div>

          <SummaryCard />

          <ActionButtons
            onFlashcardsClick={() => navigate("/flashcards")}
          />

          {/* Weekly Goal */}
          {goalProgress && (
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-8 shadow-xl border border-white/40 flex flex-col items-center"
            >
              <h2 className="text-xl font-bold mb-6">
                🎯 Weekly Goal
              </h2>

              {/* Goal Input */}
              <div className="flex items-center gap-3 mb-6">
                <input
                  type="number"
                  min="1"
                  value={newGoal}
                  onChange={(e) =>
                    setNewGoal(Number(e.target.value))
                  }
                  className="w-20 px-2 py-1 border rounded text-center"
                />
                <button
                  onClick={handleUpdateGoal}
                  className="px-4 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
                >
                  Update
                </button>
              </div>

              <ProgressRing
                percentage={goalProgress.progressPercentage}
              />

              <p className="mt-6 font-medium text-gray-700">
                {goalProgress.completed} /{" "}
                {goalProgress.weeklyQuizTarget} quizzes completed
              </p>

              <p className="text-sm text-gray-500 mt-2">
                Stay consistent and keep improving 🚀
              </p>
            </motion.div>
          )}

          {recommendation && (
            <motion.div
              whileHover={{ y: -5 }}
              className="bg-white/70 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/40"
            >
              <h2 className="text-xl font-bold mb-4">
                🧠 Smart Recommendation
              </h2>
              <p className="text-gray-700">
                {recommendation.recommendation}
              </p>
            </motion.div>
          )}

          {dashboardData && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <ProgressChart dashboardData={dashboardData} />
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
}







