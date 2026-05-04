import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import Navbar from "../layout/Navbar";
import Sidebar from "../layout/Sidebar";

import SummaryCard from "../dashboard/SummaryCard";
import ActionButtons from "../dashboard/ActionButtons";
import NotesGenerator from "./NotesGenerator";
import ProgressChart from "../dashboard/ProgressChart";
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

  /* ================= DATA TRANSFORM FOR CHART ================= */

  const chartData = dashboardData
    ? {
        weeklyHours: {
          Mon: dashboardData.weeklyActivity?.[0]?.hours || 0,
          Tue: dashboardData.weeklyActivity?.[1]?.hours || 0,
          Wed: dashboardData.weeklyActivity?.[2]?.hours || 0,
          Thu: dashboardData.weeklyActivity?.[3]?.hours || 0,
          Fri: dashboardData.weeklyActivity?.[4]?.hours || 0,
          Sat: dashboardData.weeklyActivity?.[5]?.hours || 0,
          Sun: dashboardData.weeklyActivity?.[6]?.hours || 0,
        },

        subjectDistribution:
          dashboardData.subjectDistribution?.map((s) => ({
            subject: s.subject,
            percentage: s.count,
          })) || [],

        totalHours: dashboardData.totalHours || 0,
        avgDaily: dashboardData.avgDailyHours || 0,
        streak: dashboardData.studyStreak || 0,
      }
    : null;

  return (

    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50">

      <Navbar />

      <div className="flex relative z-10">

        <Sidebar />

        <main className="flex-1 ml-64 px-10 py-12 space-y-12">

          {/* Welcome */}

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >

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

          {/* Summary Cards */}

          <SummaryCard />

          {/* Action Buttons */}

          <ActionButtons onFlashcardsClick={() => navigate("/flashcards")} />
           
            {/*  AI Notes Generator */}
<NotesGenerator />

          {/* Progress Overview */}

          {chartData && (
            <ProgressChart dashboardData={chartData} />
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