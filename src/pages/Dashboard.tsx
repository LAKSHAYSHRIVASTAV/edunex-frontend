import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../components/layout/Navbar";
import Sidebar from "../components/layout/Sidebar";

import SummaryCard from "../components/dashboard/SummaryCard";
import ActionButtons from "../components/dashboard/ActionButtons";
import ProgressChart from "../components/dashboard/ProgressChart";
import ProgressRing from "../components/dashboard/ProgressRing";
import KnowledgeGraph from "../components/dashboard/KnowledgeGraph";

import { Sparkles } from "lucide-react";

const API = "https://edunex-backend-rj22.onrender.com/api";

export default function Dashboard() {

  const navigate = useNavigate();
  const location = useLocation();

  const [userName, setUserName] = useState("User");

  const [progressOverview, setProgressOverview] = useState(null);
  const [goalProgress, setGoalProgress] = useState(null);
  const [recommendation, setRecommendation] = useState(null);
  const [learningInsights, setLearningInsights] = useState(null);

  const [knowledgeGraph, setKnowledgeGraph] = useState({
    labels: [],
    scores: [],
  });

  const [newGoal, setNewGoal] = useState(5);
  const [loading, setLoading] = useState(true);

  /* ================= USER NAME ================= */

  useEffect(() => {

    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) setUserName(parsed.name);
      } catch {}
    }

  }, []);

  /* ================= FETCH DASHBOARD DATA ================= */

  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const fetchDashboard = async () => {

      try {

        fetch(`${API}/analytics/progress-overview`, {
          headers,
          cache: "no-store"
        })
          .then(res => res.json())
          .then(data => setProgressOverview(data))
          .catch(() => {});

        fetch(`${API}/analytics/knowledge-graph`, {
          headers,
          cache: "no-store"
        })
          .then(res => res.json())
          .then(data => setKnowledgeGraph(data))
          .catch(() => {});

        fetch(`${API}/analytics/learning-insights`, {
          headers,
          cache: "no-store"
        })
          .then(res => res.json())
          .then(data => setLearningInsights(data))
          .catch(() => {});

        fetch(`${API}/goals/progress`, {
          headers,
          cache: "no-store"
        })
          .then(res => res.json())
          .then(data => {
            setGoalProgress(data);
            setNewGoal(data.weeklyQuizTarget);
          })
          .catch(() => {});

        fetch(`${API}/recommendation`, {
          headers,
          cache: "no-store"
        })
          .then(res => res.json())
          .then(data => setRecommendation(data))
          .catch(() => {});

        setLoading(false);

      } catch (err) {

        console.log("Dashboard fetch error", err);
        setLoading(false);

      }

    };

    fetchDashboard();

  }, [location]);

  /* ================= UPDATE GOAL ================= */

  const handleUpdateGoal = async () => {

    const token = localStorage.getItem("token");
    if (!token) return;

    try {

      const res = await fetch(`${API}/goals/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          weeklyQuizTarget: newGoal,
        }),
      });

      const data = await res.json();

      setGoalProgress(prev => ({
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
  <div className="min-h-screen bg-gray-50">
    
    <Navbar />

    <div className="flex">
      <Sidebar />

      <main className="flex-1 ml-64 px-10 py-12 space-y-12">

        {/* Welcome */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-gray-200 mb-6 shadow-sm">
            <Sparkles size={16} className="text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">
              AI Powered
            </span>
          </div>

          <h1 className="text-5xl font-black mb-4 text-gray-900">
            Welcome Back, {userName} 👋
          </h1>

          <p className="text-lg text-gray-600">
            Your intelligent study ecosystem designed to maximize performance.
          </p>

        </motion.div>

        <SummaryCard />

        <ActionButtons onFlashcardsClick={() => navigate("/flashcards")} />

 {/* AI Insights */}
{learningInsights && (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
    <h2 className="text-xl font-bold mb-4 text-gray-900">
      🧠 AI Learning Insights
    </h2>

    <p className="text-gray-800">
      Mastery Score: {learningInsights.masteryScore}%
    </p>
    <p className="text-gray-800">
      Weak Topics: {learningInsights.weakTopics?.join(", ") || "None"}
    </p>
    <p className="text-gray-800">
      Strong Topics: {learningInsights.strongTopics?.join(", ") || "None"}
    </p>
  </div>
)}

{/* Weekly Goal */}
{goalProgress && (
  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-md flex flex-col items-center">

    <h2 className="text-xl font-bold mb-6 text-gray-900">
      🎯 Weekly Goal
    </h2>

    <div className="flex items-center gap-3 mb-6">
      <input
        type="number"
        min="1"
        value={newGoal}
        onChange={(e) => setNewGoal(Number(e.target.value))}
        className="w-20 px-2 py-1 border border-gray-300 rounded text-center text-gray-900 bg-white"
      />

      <button
        onClick={handleUpdateGoal}
        className="px-4 py-1 bg-indigo-600 text-white rounded hover:scale-105 transition"
      >
        Update
      </button>
    </div>

    <ProgressRing percentage={goalProgress.progressPercentage} />

    <p className="mt-6 text-gray-800">
      {goalProgress.completed} / {goalProgress.weeklyQuizTarget} quizzes completed
    </p>

  </div>
)}

{/* Smart Recommendation */}
{recommendation && (
  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-md">
    <h2 className="text-xl font-bold mb-4 text-gray-900">
      🧠 Smart Recommendation
    </h2>

    <p className="text-gray-800">
      {recommendation.recommendation}
    </p>
  </div>
)}

{/* Progress Overview */}
{loading ? (
  <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-md animate-pulse h-64"></div>
) : (
  progressOverview && <ProgressChart dashboardData={progressOverview} />
)}

{/* Knowledge Graph */}
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 0.4 }}
  className="bg-white border border-gray-200 rounded-xl p-6 shadow-md mt-8 text-gray-900"
>
  <KnowledgeGraph data={knowledgeGraph} />

        </motion.div>

      </main>
    </div>
  </div>
);
};