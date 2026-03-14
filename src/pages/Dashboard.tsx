import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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

  const [userName, setUserName] = useState("User");

  const [dashboardData, setDashboardData] = useState<any>(null);
  const [goalProgress, setGoalProgress] = useState<any>(null);
  const [recommendation, setRecommendation] = useState<any>(null);

  const [knowledgeGraph, setKnowledgeGraph] = useState<any>({
    labels: [],
    scores: [],
  });

  const [learningInsights, setLearningInsights] = useState<any>(null);

  const [newGoal, setNewGoal] = useState(5);

  const navigate = useNavigate();

  // ================= USER NAME =================
  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed?.name) setUserName(parsed.name);
      } catch {}
    }
  }, []);

  // ================= FETCH ALL DASHBOARD DATA =================
  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) return;

    const headers = { Authorization: `Bearer ${token}` };

    const fetchData = async () => {
      try {

        const dashboardRes = await fetch(`${API}/analytics`, { headers });
        const dashboard = await dashboardRes.json();
        setDashboardData(dashboard);

        const weeklyRes = await fetch(`${API}/analytics/weekly`, { headers });
        const weekly = await weeklyRes.json();

        const graphRes = await fetch(`${API}/analytics/knowledge-graph`, { headers });
        const graph = await graphRes.json();
        setKnowledgeGraph(graph);

        const insightsRes = await fetch(`${API}/analytics/learning-insights`, { headers });
        const insights = await insightsRes.json();
        setLearningInsights(insights);

        const goalRes = await fetch(`${API}/goals/progress`, { headers });
        const goal = await goalRes.json();
        setGoalProgress(goal);
        setNewGoal(goal.weeklyQuizTarget);

        const recRes = await fetch(`${API}/recommendation`, { headers });
        const rec = await recRes.json();
        setRecommendation(rec);

      } catch (err) {
        console.log("Dashboard fetch error", err);
      }
    };

    fetchData();

  }, []);

  // ================= UPDATE GOAL =================
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
        body: JSON.stringify({ weeklyQuizTarget: newGoal }),
      });

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

          <ActionButtons
            onFlashcardsClick={() => navigate("/flashcards")}
          />

          {/* AI INSIGHTS */}
          {learningInsights && (
            <div className="bg-white rounded-xl p-6 shadow">

              <h2 className="text-xl font-bold mb-4">
                🧠 AI Learning Insights
              </h2>

              <p>
                Mastery Score: {learningInsights.masteryScore}%
              </p>

              <p>
                Weak Topics: {learningInsights.weakTopics?.join(", ") || "None"}
              </p>

              <p>
                Strong Topics: {learningInsights.strongTopics?.join(", ") || "None"}
              </p>

            </div>
          )}

          {/* WEEKLY GOAL */}
          {goalProgress && (
            <div className="bg-white rounded-xl p-8 shadow flex flex-col items-center">

              <h2 className="text-xl font-bold mb-6">🎯 Weekly Goal</h2>

              <div className="flex items-center gap-3 mb-6">

                <input
                  type="number"
                  min="1"
                  value={newGoal}
                  onChange={(e) => setNewGoal(Number(e.target.value))}
                  className="w-20 px-2 py-1 border rounded text-center"
                />

                <button
                  onClick={handleUpdateGoal}
                  className="px-4 py-1 bg-indigo-600 text-white rounded"
                >
                  Update
                </button>

              </div>

              <ProgressRing percentage={goalProgress.progressPercentage} />

              <p className="mt-6">
                {goalProgress.completed} / {goalProgress.weeklyQuizTarget} quizzes completed
              </p>

            </div>
          )}

          {/* SMART RECOMMENDATION */}
          {recommendation && (
            <div className="bg-white rounded-xl p-6 shadow">

              <h2 className="text-xl font-bold mb-4">
                🧠 Smart Recommendation
              </h2>

              <p>{recommendation.recommendation}</p>

            </div>
          )}

          {/* PROGRESS CHART */}
          {dashboardData && (
            <ProgressChart dashboardData={dashboardData} />
          )}

          {/* KNOWLEDGE GRAPH */}
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







