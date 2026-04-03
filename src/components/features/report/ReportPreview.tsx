import React from "react";
import { useParams } from "react-router-dom";
import { useReport } from "./hooks/useReport";

import Section from "./components/Section";
import StatCard from "./components/StatCard";
import SubjectBars from "./components/SubjectBars";
import QuizTable from "./components/QuizTable";
import SummaryList from "./components/SummaryList";
import InsightsPanel from "./components/InsightsPanel";
import StreakCard from "./components/StreakCard";
import SkeletonLoader from "./components/SkeletonLoader";
import ShareBar from "./components/ShareBar";

export default function ReportPreview() {
  const { id } = useParams(); // for future share link
  const { data, loading, error } = useReport("30d");

  if (loading) return <SkeletonLoader />;
  if (error) return <div style={{ padding: 40 }}>Error loading report</div>;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f14",
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: "800px" }}>

        {/* 🔥 HEADER */}
        <div
          style={{
            background: "linear-gradient(135deg, #534AB7, #7F77DD)",
            padding: "24px",
            borderRadius: "16px",
            color: "#fff",
            marginBottom: "20px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
          }}
        >
          <h1 style={{ fontSize: "22px", fontWeight: "600" }}>
            {data?.user?.name || "Student"}'s Learning Report
          </h1>

          <p style={{ fontSize: "12px", opacity: 0.8 }}>
            {data?.generatedAt
              ? new Date(data.generatedAt).toLocaleDateString()
              : ""}
          </p>

          <div style={{ marginTop: "10px" }}>
            <span style={{ fontSize: "28px", fontWeight: "700" }}>
              {data?.stats?.avgScore || 0}%
            </span>
            <span style={{ fontSize: "12px", marginLeft: "6px", opacity: 0.7 }}>
              Overall Score
            </span>
          </div>
        </div>

        {/* 🔥 STATS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: "10px",
            marginBottom: "20px",
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
            label="Flashcards"
            value={data?.stats?.flashcardsReviewed || 0}
          />
          <StatCard
            label="Summaries"
            value={data?.stats?.summariesCreated || 0}
          />
        </div>

        {/* 🔥 SUBJECT BREAKDOWN */}
        <Section title="Subject Breakdown">
          <SubjectBars data={data?.subjectDistribution || []} />
        </Section>

        {/* 🔥 QUIZ TABLE */}
        <Section title="Recent Quiz Attempts">
          <QuizTable quizzes={data?.recentQuizzes || []} />
        </Section>

        {/* 🔥 SUMMARIES */}
        <Section title="Summaries Created">
          <SummaryList summaries={data?.recentSummaries || []} />
        </Section>

        {/* 🔥 INSIGHTS */}
        <Section title="AI Insights">
          <InsightsPanel insights={data?.insights || []} />
        </Section>

        {/* 🔥 STREAK */}
        <Section title="Study Streak">
          <StreakCard streak={data?.streak || 0} />
        </Section>

        {/* 🔥 SHARE */}
        <Section title="Share this Report">
          <ShareBar
            user={data?.user || {}}
            stats={data?.stats || {}}
            period={"30d"}
          />
        </Section>

      </div>
    </div>
  );
}