import React, { useState } from "react";
import { useReport } from "./hooks/useReport";

import PeriodFilter from "./components/PeriodFilter";
import StatCard from "./components/StatCard";
import Section from "./components/Section";
import SubjectBars from "./components/SubjectBars";
import WeeklyChart from "./components/WeeklyChart";
import QuizTable from "./components/QuizTable";
import SummaryList from "./components/SummaryList";
import InsightsPanel from "./components/InsightsPanel";
import StreakCard from "./components/StreakCard";
import ShareBar from "./components/ShareBar";
import SkeletonLoader from "./components/SkeletonLoader";

const PERIOD_LABELS = {
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  "3m": "Last 3 months",
  "6m": "Last 6 months",
  "1y": "Last year",
  "all": "All time",
};

export default function ReportPage() {
  const [period, setPeriod] = useState("30d");
  const { data, loading, error } = useReport(period);

  const handlePeriodChange = (newPeriod) => {
    setPeriod(newPeriod);
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <div style={{ marginLeft: "220px", padding: "32px 36px" }}>

        {/* 🔥 HEADER (UPGRADED) */}
        <div
          style={{
            background: "linear-gradient(135deg, #534AB7, #7F77DD)",
            padding: "28px",
            borderRadius: "18px",
            color: "#fff",
            marginBottom: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}
        >
          <h1 style={{ fontSize: "24px", fontWeight: "700" }}>
            {data?.user?.name || "Student"}'s Learning Report
          </h1>

          <p style={{ opacity: 0.8, fontSize: "13px" }}>
            {loading
              ? "Loading..."
              : `${PERIOD_LABELS[period]} · ${
                  data?.generatedAt
                    ? new Date(data.generatedAt).toLocaleString()
                    : ""
                }`}
          </p>

          <div style={{ marginTop: "12px", fontSize: "28px", fontWeight: "800" }}>
            {data?.stats?.avgScore || 0}%
          </div>

          <div style={{ fontSize: "12px", opacity: 0.7 }}>
            Overall Performance
          </div>
        </div>

        {/* FILTER */}
        <PeriodFilter value={period} onChange={handlePeriodChange} />

        {/* ERROR */}
        {error && (
          <div style={{ color: "red", marginTop: "10px" }}>
            Error: {error}
          </div>
        )}

        {/* LOADING */}
        {loading && <SkeletonLoader />}

        {/* DATA */}
        {!loading && data && (
          <>
            {/* 🔥 STATS (UPGRADED CARDS) */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "14px",
                marginTop: "22px",
              }}
            >
              <StatCard
                label="Study Hours"
                value={`${data?.stats?.totalHours || 0}h`}
              />
              <StatCard
                label="Quizzes"
                value={data?.stats?.quizzesCompleted || 0}
              />
              <StatCard
                label="Summaries"
                value={data?.stats?.summariesCreated || 0}
              />
              <StatCard
                label="Flashcards"
                value={data?.stats?.flashcardsReviewed || 0}
              />
            </div>

            {/* 🔥 CHARTS */}
            <Section title="Study Activity">
              <WeeklyChart data={data?.weeklyHours || []} />
            </Section>

            <Section title="Subject Breakdown">
              <SubjectBars data={data?.subjectDistribution || []} />
            </Section>

            {/* 🔥 QUIZ TABLE */}
            <Section title="Quiz Attempts">
              <QuizTable quizzes={data?.recentQuizzes || []} />
            </Section>

            {/* 🔥 SUMMARIES */}
            <Section title="Summaries">
              <SummaryList summaries={data?.recentSummaries || []} />
            </Section>

            {/* 🔥 STREAK */}
            <Section title="Study Streak">
              <StreakCard streak={data?.streak || 0} />
            </Section>

            {/* 🔥 INSIGHTS */}
            <Section title="AI Insights">
              <InsightsPanel insights={data?.insights || []} />
            </Section>

            {/* 🔥 SHARE */}
            <Section title="Share Progress">
              <ShareBar
                user={data?.user || {}}
                period={period}
                stats={data?.stats || {}}
              />
            </Section>
          </>
        )}
      </div>
    </div>
  );
}