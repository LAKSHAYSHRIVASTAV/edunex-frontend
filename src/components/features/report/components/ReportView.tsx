import React, { lazy, Suspense, useMemo, useState } from "react";
import { Brain, Flame, Lightbulb, Target, TrendingDown, TrendingUp } from "lucide-react";
import "./reportPreview.css";

const PerformanceLineChart = lazy(() =>
  import("./ReportCharts").then((module) => ({ default: module.PerformanceLineChart }))
);
const SubjectBarChart = lazy(() =>
  import("./ReportCharts").then((module) => ({ default: module.SubjectBarChart }))
);
const TimePieChart = lazy(() =>
  import("./ReportCharts").then((module) => ({ default: module.TimePieChart }))
);

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const formatShortDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const subjectColor = (subject = "General") => {
  const colors = ["#2563eb", "#059669", "#d97706", "#dc2626", "#0891b2", "#4f46e5", "#7c2d12"];
  const index = subject.split("").reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

const formatDay = (date: string) => new Date(date).toLocaleDateString("en-IN", { weekday: "short" });

const scoreClass = (score: number) => {
  if (score >= 80) return "excellent";
  if (score >= 50) return "average";
  return "weak";
};

const scoreLabel = (score: number) => {
  if (score >= 80) return "Excellent";
  if (score >= 50) return "Average";
  return "Weak";
};

const getTrend = (value: number) => {
  if (value > 0) return { label: `+${value}%`, icon: <TrendingUp size={14} />, className: "up" };
  if (value < 0) return { label: `${value}%`, icon: <TrendingDown size={14} />, className: "down" };
  return { label: "0%", icon: null, className: "flat" };
};

export default function ReportView({ data, period }: any) {
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [sortBy, setSortBy] = useState("date");

  const stats = data.studyStats || {};
  const subjects = data.subjectBreakdown || [];
  const quizzes = data.quizHistory || [];
  const summaries = data.summaries || [];
  const insights = data.aiInsights || [];
  const recommendations = data.recommendations || [];
  const weakTopics = data.weakTopics || [];
  const trendPeriod = period === "7d" || period === "30d" ? period : "90d";
  const performanceData = data.trends?.performance?.[trendPeriod] || [];
  const studyHours = data.trends?.studyHours?.["7d"] || [];
  const rawTimeDistribution = data.timeDistribution || [];
  const timeTotal = rawTimeDistribution.reduce((sum: number, item: any) => sum + Number(item.hours || 0), 0);
  const timeDistribution = rawTimeDistribution.map((item: any) => ({
    ...item,
    hours: timeTotal ? Math.round((Number(item.hours || 0) / timeTotal) * 100) : 0,
  })).filter((item: any) => item.hours > 0);
  const gamification = data.gamification || {};
  const visibleStudyHours = studyHours.length
    ? studyHours
    : Array.from({ length: 7 }).map((_, index) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - index));
        return { date: date.toISOString(), hours: 0 };
      });
  const strongestSubject = subjects[0];
  const focusTopic = weakTopics[0] || recommendations[0];
  const performanceHasValues = performanceData.some((item: any) => Number(item.score || 0) > 0);

  const quizSubjects = useMemo(
    () => ["All", ...Array.from(new Set(quizzes.map((quiz: any) => quiz.subject).filter(Boolean)))],
    [quizzes]
  );

  const filteredQuizzes = useMemo(() => {
    const filtered = subjectFilter === "All" ? quizzes : quizzes.filter((quiz: any) => quiz.subject === subjectFilter);
    return [...filtered].sort((a: any, b: any) => {
      if (sortBy === "score") return (b.score || 0) - (a.score || 0);
      if (sortBy === "subject") return String(a.subject || "").localeCompare(String(b.subject || ""));
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }, [quizzes, subjectFilter, sortBy]);

  const shareText = `${data.user?.name || "My"} Edunex report: ${data.overallScore || 0}% overall score, ${stats.quizzesDone || 0} quizzes, ${stats.totalHours || 0}h studied.`;

  const copyReportLink = () => {
    navigator.clipboard?.writeText(window.location.href);
  };

  const downloadReport = () => {
    window.print();
  };

  return (
    <div className="report">
      <section className="report-hero">
        <div className="report-title-block">
          <p className="eyebrow">Learning analytics</p>
          <div className="user-report-heading">
            <span>{data.user?.avatarInitials || "ST"}</span>
            <div>
              <h1>{data.user?.name || "Student"}'s Learning Report</h1>
              <p>
                Generated for {data.user?.email || "your Edunex account"} on {formatDate(data.generatedAt)}
              </p>
            </div>
          </div>
        </div>
        <div className="score-orb">
          <strong>{data.overallScore || 0}%</strong>
          <span>Overall score</span>
        </div>
      </section>

      <section className="metrics-grid">
        <Metric label="Study hours" value={`${stats.totalHours || 0}h`} />
        <Metric label="Quizzes done" value={stats.quizzesDone || 0} />
        <Metric label="Flashcards" value={stats.flashcardsCreated || 0} />
        <Metric label="Summaries" value={stats.summariesCreated || 0} />
        <Metric label="Expected next week" value={`${data.expectedScoreNextWeek || 0}%`} />
        <Metric label="XP level" value={`Lv ${gamification.level || 1}`} sub={`${gamification.xp || 0} XP`} />
      </section>

      <section className="report-highlights">
        <article>
          <span>Strongest subject</span>
          <strong>{strongestSubject?.subject || "Start with a quiz"}</strong>
          <p>{strongestSubject ? `${strongestSubject.progress}% current performance` : "Your first quiz will unlock subject ranking."}</p>
        </article>
        <article>
          <span>Focus area</span>
          <strong>{focusTopic?.topic || focusTopic?.subject || "No weak area yet"}</strong>
          <p>{focusTopic ? "Recommended for your next short study session." : "Keep adding activity to personalize this."}</p>
        </article>
        <article>
          <span>Next score forecast</span>
          <strong>{data.expectedScoreNextWeek || 0}%</strong>
          <p>Based on your recent report trend.</p>
        </article>
      </section>

      <section className="dashboard-grid">
        <Card title="Performance Trend" className="wide">
          <ChartBoundary
            empty={!performanceData.length || !performanceHasValues}
            title="No performance points yet"
            detail="Take a quiz to start plotting your score trend across this report period."
          >
            <PerformanceLineChart data={performanceData} />
          </ChartBoundary>
        </Card>

        <Card title="Study Streak">
          <div className="streak-card">
            <div className={data.streak?.current > 7 ? "fire active" : "fire"}>
              <Flame size={30} />
            </div>
            <strong>{data.streak?.current || 0} days</strong>
            <span>Best: {data.streak?.best || 0} days</span>
          </div>
          <div className="consistency-row">
            {visibleStudyHours.map((day: any) => (
              <div key={day.date} title={`${formatDate(day.date)}: ${day.hours}h`}>
                <span>{day.hours}h</span>
                <i style={{ height: `${Math.max(10, day.hours * 24)}px` }} />
                <small>{formatDay(day.date)}</small>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Subject Comparison">
          <ChartBoundary
            empty={!subjects.length}
            title="No subject comparison yet"
            detail="Complete quizzes across subjects to compare your progress here."
          >
            <SubjectBarChart data={subjects} />
          </ChartBoundary>
        </Card>

        <Card title="Time Distribution">
          <ChartBoundary
            empty={!timeDistribution.length}
            title="No study time logged yet"
            detail="Study sessions, summaries, flashcards, and quizzes will appear here as subject-wise time share."
          >
            <TimePieChart data={timeDistribution} />
            <div className="chart-legend">
              {timeDistribution.map((item: any) => (
                <div key={item.subject}>
                  <i style={{ background: subjectColor(item.subject) }} />
                  <span>{item.subject}</span>
                  <strong>{item.hours}%</strong>
                </div>
              ))}
            </div>
          </ChartBoundary>
        </Card>
      </section>

      <section className="dashboard-grid">
        <Card title="Subject Breakdown">
          <div className="subject-list">
            {subjects.length === 0 && <EmptyState>No subject performance yet.</EmptyState>}
            {subjects.map((subject: any) => {
              const trend = getTrend(subject.improvementRate || 0);
              return (
                <div key={subject.subject} className="subject-item">
                  <div>
                    <span>{subject.subject}</span>
                    <strong>{subject.progress}%</strong>
                  </div>
                  <div className="bar-track">
                    <div
                      className="subject-fill"
                      style={{ width: `${subject.progress}%`, background: subjectColor(subject.subject) }}
                    />
                  </div>
                  {subject.improvementRate ? (
                    <em className={trend.className}>{trend.icon}{trend.label} trend</em>
                  ) : null}
                </div>
              );
            })}
          </div>
        </Card>

        <Card title="AI Insights">
          <div className="insight-grid">
            {insights.map((insight: any, index: number) => (
              <article key={`${insight.title}-${index}`} className={`insight-card ${insight.type || "info"}`}>
                <Lightbulb size={18} />
                <div>
                  <strong>{insight.title}</strong>
                  <p>{insight.message}</p>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <section className="dashboard-grid">
        <Card title="Weak Areas to Focus">
          <FocusList items={weakTopics} empty="No weak topics found in this period." />
        </Card>

        <Card title="Recommended Topics">
          <div className="recommendation-list">
            {recommendations.length === 0 && <EmptyState>Complete more activities to unlock recommendations.</EmptyState>}
            {recommendations.map((item: any) => (
              <article key={`${item.subject}-${item.topic}`} className="recommendation-card">
                <Target size={18} />
                <div>
                  <strong>{item.topic}</strong>
                  <span>{item.subject} - {item.priority} priority</span>
                  <p>{item.actions?.join(" | ")}</p>
                </div>
              </article>
            ))}
          </div>
        </Card>
      </section>

      <section className="report-card">
        <div className="table-head">
          <div>
            <p className="eyebrow">Recent attempts</p>
            <h2>Quiz Table</h2>
          </div>
          <div className="table-controls">
            <select value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
              {quizSubjects.map((subject: any) => <option key={subject}>{subject}</option>)}
            </select>
            <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
              <option value="date">Sort by date</option>
              <option value="score">Sort by score</option>
              <option value="subject">Sort by subject</option>
            </select>
          </div>
        </div>

        {filteredQuizzes.length === 0 ? (
          <EmptyState>No quizzes found for this filter.</EmptyState>
        ) : (
          <div className="quiz-table">
            <div className="quiz-header">
              <span>Topic</span>
              <span>Subject</span>
              <span>Score</span>
              <span>Status</span>
              <span>Date</span>
            </div>
            {filteredQuizzes.map((quiz: any) => (
              <div key={quiz.id} className="quiz-row">
                <span>{quiz.topic || quiz.title}</span>
                <span>{quiz.subject}</span>
                <span>{quiz.score}%</span>
                <span className={`score-pill ${scoreClass(quiz.score)}`}>{scoreLabel(quiz.score)}</span>
                <span>{formatShortDate(quiz.date)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="dashboard-grid">
        <Card title="Summaries Created">
          <div className="summary-list">
            {summaries.length === 0 && <EmptyState>No summaries created in this period.</EmptyState>}
            {summaries.map((summary: any) => (
              <div key={summary.id} className="summary-row">
                <Brain size={16} />
                <span>{summary.title}</span>
                <em>{summary.subject}</em>
                <small>{formatShortDate(summary.date)}</small>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Badges">
          <div className="badge-grid">
            {(gamification.badges || []).length === 0 && <EmptyState>Badges unlock as your real activity grows.</EmptyState>}
            {(gamification.badges || []).map((badge: any) => (
              <div key={badge.name} className="earned-badge">
                <strong>{badge.name}</strong>
                <span>{badge.description}</span>
              </div>
            ))}
          </div>
        </Card>
      </section>

      <section className="report-card share-card">
        <p className="eyebrow">Share your progress</p>
        <div className="share-links">
          <button type="button" onClick={() => window.open(`https://www.instagram.com/`, "_blank")}>Instagram</button>
          <button type="button" onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank")}>WhatsApp</button>
          <button type="button" onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, "_blank")}>Twitter</button>
          <button type="button" onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`, "_blank")}>LinkedIn</button>
          <button type="button" onClick={copyReportLink}>Copy Link</button>
          <button type="button" className="download-btn" onClick={downloadReport}>Download PDF</button>
        </div>
      </section>
    </div>
  );
}

function Metric({ label, value, sub }: any) {
  return (
    <article className="metric-card">
      <span>{label}</span>
      <strong>{value}</strong>
      {sub && <em>{sub}</em>}
    </article>
  );
}

function Card({ title, children, className = "" }: any) {
  return (
    <section className={`report-card ${className}`}>
      <div className="card-title">
        <h2>{title}</h2>
      </div>
      {children}
    </section>
  );
}

function ChartBoundary({ empty, children, title, detail }: any) {
  if (empty) return <ChartEmpty title={title} detail={detail} />;
  return <Suspense fallback={<EmptyState>Loading chart...</EmptyState>}>{children}</Suspense>;
}

function ChartEmpty({ title, detail }: any) {
  return (
    <div className="chart-empty">
      <div className="chart-empty-visual">
        <span />
        <span />
        <span />
      </div>
      <strong>{title || "No chart data yet"}</strong>
      <p>{detail || "New activity will appear here automatically."}</p>
    </div>
  );
}

function FocusList({ items, empty }: any) {
  if (!items?.length) return <EmptyState>{empty}</EmptyState>;
  return (
    <div className="focus-list">
      {items.map((item: any) => (
        <div key={`${item.subject}-${item.topic}`}>
          <strong>{item.topic}</strong>
          <span>{item.subject}</span>
          <em>{item.score}% average</em>
        </div>
      ))}
    </div>
  );
}

function EmptyState({ children }: any) {
  return <p className="empty-state">{children}</p>;
}
