import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";

import SummaryCard from "../dashboard/SummaryCard";
import ActionButtons from "../dashboard/ActionButtons";
import ProgressChart from "../dashboard/ProgressChart";
import ProgressRing from "../dashboard/ProgressRing";
import KnowledgeGraph from "../dashboard/KnowledgeGraph";

import { Sparkles } from "lucide-react";

interface DashboardData {
  readingProgress: number;
  quizCompletion: number;
  flashcardsReviewed: number;

  totalQuizzes: number;
  averageScore: number;
  streak: number;
  highestScore: number;
  lowestScore: number;

  weeklyActivity: { date: string; hours: number }[];
  subjectDistribution: { subject: string; count: number }[];

  studyStreak: number;
  totalHours: number;
  avgDailyHours: number;

  aiInsights?: {
    learningState: string;
    recommendedDifficulty: string;
    weakestTopic: string | null;
  };
}
interface KnowledgeGraphData {
  labels: string[];
  scores: number[];
}

export default function Dashboard() {

  const [userName, setUserName] = useState<string>("User");
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [goalProgress, setGoalProgress] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [newGoal, setNewGoal] = useState<number>(5);

  const [knowledgeGraph, setKnowledgeGraph] = useState<KnowledgeGraphData>({
    labels: [],
    scores: [],
  });

  const navigate = useNavigate();

  /* ================= USER NAME ================= */

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.name) setUserName(parsedUser.name);
      } catch {}
    }

  }, []);

  /* ================= ANALYTICS DATA ================= */

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchAnalytics = async () => {

      try {

        const res = await fetch(
          "https://edunex-backend-rj22.onrender.com/api/dashboard",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        setDashboardData(data);

      } catch (err) {
        console.log("Analytics API error", err);
      }

    };

    fetchAnalytics();

  }, []);

  /* ================= KNOWLEDGE GRAPH ================= */

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchGraph = async () => {

      try {

        const res = await fetch(
          "https://edunex-backend-rj22.onrender.com/api/analytics/knowledge-graph",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        setKnowledgeGraph(data);

      } catch (err) {
        console.log("Graph API error", err);
      }

    };

    fetchGraph();

  }, []);

  /* ================= GOAL + RECOMMENDATION ================= */

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

  /* ================= UPDATE GOAL ================= */

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
          Math.round((prev.completed / data.weeklyQuizTarget) * 100),
          100
        ),
      }));

    } catch (error) {
      console.log("Goal update error", error);
    }

  };

  return (

    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">

      <Navbar />

      <div className="flex relative z-10">

        <Sidebar />

        <main className="flex-1 ml-64 px-10 py-12 space-y-12">

          {/* Welcome */}

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 mb-6">
              <Sparkles size={16} className="text-indigo-600" />
              <span className="text-sm font-semibold text-indigo-600">
                AI Powered
              </span>
            </div>

            <h1 className="text-5xl font-black mb-4">
              Welcome Back, {userName} 👋
            </h1>

            <p className="text-lg text-gray-600">
              Your intelligent study ecosystem designed to maximize performance.
            </p>

          </motion.div>

          <SummaryCard />

          <ActionButtons onFlashcardsClick={() => navigate("/flashcards")} />

          {/* Progress Overview */}

          {dashboardData && (
            <ProgressChart dashboardData={dashboardData} />
          )}

          {/* Knowledge Graph */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl p-6 shadow"
          >
            <KnowledgeGraph data={knowledgeGraph} />
          </motion.div>

        </main>

      </div>

    </div>
  );
}