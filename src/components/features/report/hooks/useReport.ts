import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../../../../config/api";

const getStoredUser = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    return JSON.parse(storedUser);
  } catch {
    return null;
  }
};

const getStoredUserId = () => getStoredUser()?.id || getStoredUser()?._id || null;

const clamp = (value: number, min = 0, max = 100) => Math.max(min, Math.min(max, Number(value) || 0));

const normalizeDate = (date: any, fallbackDate: any) => {
  if (!date) return fallbackDate || new Date().toISOString();
  const parsed = new Date(date);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString();

  const fallbackYear = new Date(fallbackDate || Date.now()).getFullYear();
  const withYear = new Date(`${date} ${fallbackYear}`);
  return Number.isNaN(withYear.getTime()) ? fallbackDate || new Date().toISOString() : withYear.toISOString();
};

const normalizeInsights = (insights: any[] = []) =>
  insights.map((insight) => {
    if (typeof insight !== "string") return insight;
    const isWarning = insight.toLowerCase().includes("need") || insight.toLowerCase().includes("attention");
    return {
      type: isWarning ? "warning" : "success",
      title: isWarning ? "Focus area detected" : "Learning signal",
      message: insight,
    };
  });

const buildPerformanceTrend = (quizzes: any[]) => {
  const sorted = [...quizzes]
    .filter((quiz) => quiz.date)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return sorted.map((quiz) => ({
    date: quiz.date,
    score: clamp(quiz.score),
  }));
};

const normalizeUser = (rawUser: any, loggedInUser: any) => {
  const realUser = loggedInUser || rawUser || {};
  const name = realUser.name || realUser.fullName || realUser.username || realUser.email?.split("@")[0] || "Student";

  return {
    ...rawUser,
    ...realUser,
    id: realUser.id || realUser._id || rawUser?.id || rawUser?._id,
    name,
    email: realUser.email || rawUser?.email,
    avatarInitials: name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0])
      .join("")
      .toUpperCase(),
  };
};

const normalizeReport = (raw: any, period: string, loggedInUser: any) => {
  if (!raw) return raw;
  const reportUser = normalizeUser(raw.user, loggedInUser);
  if (raw.studyStats && raw.subjectBreakdown && raw.quizHistory) {
    return { ...raw, user: reportUser };
  }

  const generatedAt = raw.generatedAt || new Date().toISOString();
  const oldStats = raw.stats || {};
  const subjectSource = raw.subjectBreakdown || raw.subjectDistribution || [];
  const quizSource = raw.quizHistory || raw.recentQuizzes || [];
  const summarySource = raw.summaries || raw.recentSummaries || [];
  const overallScore = clamp(raw.overallScore ?? oldStats.avgScore);

  const quizHistory = quizSource.map((quiz: any, index: number) => ({
    id: quiz.id || quiz._id || `quiz-${index}`,
    topic: quiz.topic || quiz.title || quiz.quizName || "Untitled quiz",
    title: quiz.title || quiz.quizName || quiz.topic || "Untitled quiz",
    subject: quiz.subject || "General",
    score: clamp(quiz.score),
    correctAnswers: quiz.correctAnswers || 0,
    totalQuestions: quiz.totalQuestions || 0,
    difficulty: quiz.difficulty || "medium",
    date: normalizeDate(quiz.date || quiz.createdAt, generatedAt),
  }));

  const subjectBreakdown = subjectSource.map((subject: any) => ({
    subject: subject.subject || "General",
    progress: clamp(subject.progress ?? subject.percentage ?? subject.count ?? subject.value),
    improvementRate: Number(subject.improvementRate || 0),
    attempts: Number(subject.attempts || 1),
  }));

  const weakTopics = quizHistory
    .filter((quiz: any) => quiz.score < 50)
    .map((quiz: any) => ({
      topic: quiz.topic,
      subject: quiz.subject,
      score: quiz.score,
      attempts: 1,
    }));

  const recommendations = weakTopics.slice(0, 4).map((topic: any) => ({
    topic: topic.topic,
    subject: topic.subject,
    priority: "High",
    actions: [
      `Retake a focused quiz on ${topic.topic}`,
      `Generate a short summary for ${topic.topic}`,
      `Add ${topic.topic} to your next study session`,
    ],
  }));

  const summaries = summarySource.map((summary: any, index: number) => ({
    id: summary.id || summary._id || `summary-${index}`,
    title: summary.title || `${summary.subject || "General"} summary`,
    subject: summary.subject || "General",
    date: normalizeDate(summary.date || summary.createdAt, generatedAt),
  }));

  const weeklyHours = raw.weeklyHours || [];
  const studyHours7d = weeklyHours.map((day: any) => ({
    date: normalizeDate(day.date, generatedAt),
    hours: Number(day.hours ?? day.value ?? 0),
  }));

  const performanceTrend = buildPerformanceTrend(quizHistory);
  const safeTrend = performanceTrend.length ? performanceTrend : [{ date: generatedAt, score: overallScore }];

  return {
    ...raw,
    user: reportUser,
    period: raw.period || period,
    generatedAt,
    overallScore,
    studyStats: {
      totalHours: Number(oldStats.totalHours || 0),
      quizzesDone: Number(oldStats.quizzesCompleted || oldStats.quizzesDone || quizHistory.length || 0),
      flashcardsCreated: Number(oldStats.flashcardsReviewed || oldStats.flashcardsCreated || 0),
      summariesCreated: Number(oldStats.summariesCreated || summaries.length || 0),
    },
    subjectBreakdown,
    quizHistory,
    summaries,
    aiInsights: normalizeInsights(raw.aiInsights || raw.insights || []),
    streak:
      typeof raw.streak === "number"
        ? { current: raw.streak, best: oldStats.bestStreak || raw.streak }
        : raw.streak || { current: 0, best: 0 },
    weakTopics,
    strongTopics: quizHistory
      .filter((quiz: any) => quiz.score > 80)
      .map((quiz: any) => ({ topic: quiz.topic, subject: quiz.subject, score: quiz.score, attempts: 1 })),
    recommendations,
    expectedScoreNextWeek: overallScore,
    trends: {
      performance: {
        "7d": safeTrend.slice(-7),
        "30d": safeTrend.slice(-30),
        "90d": safeTrend.slice(-90),
      },
      studyHours: {
        "7d": studyHours7d,
        "30d": studyHours7d,
        "90d": studyHours7d,
      },
    },
    timeDistribution: subjectSource.map((subject: any) => ({
      subject: subject.subject || "General",
      hours: Number(subject.hours ?? subject.value ?? subject.count ?? subject.progress ?? 0),
    })),
    gamification: {
      xp: Number(raw.gamification?.xp || oldStats.quizzesCompleted * 20 || 0),
      level: Number(raw.gamification?.level || 1),
      badges: raw.gamification?.badges || [],
    },
  };
};

export function useReport(period: string) {
  const loggedInUser = useMemo(getStoredUser, []);
  const userId = loggedInUser?.id || loggedInUser?._id || null;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      let res;

      try {
        const endpoint = userId ? `/report/${userId}` : "/summary";
        res = await API.get(endpoint, { params: { period } });
      } catch (primaryError: any) {
        const status = primaryError?.response?.status;
        if (userId && (status === 404 || status === 405)) {
          res = await API.get("/summary", { params: { period } });
        } else {
          throw primaryError;
        }
      }

      setData(normalizeReport(res.data, period, loggedInUser));
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to fetch report");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period, userId, loggedInUser]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { data, loading, error, refetch: fetchReport };
}

export function usePeriods() {
  const [periods, setPeriods] = useState([
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "3m", label: "3M" },
    { value: "6m", label: "6M" },
    { value: "1y", label: "1Y" },
    { value: "all", label: "All" },
  ]);

  useEffect(() => {
    API.get("/report/periods")
      .then((res) => {
        setPeriods(
          res.data.map((period: any) => ({
            value: period.value,
            label: period.value === "all" ? "All" : period.value.toUpperCase(),
          }))
        );
      })
      .catch(() => {
        API.get("/periods")
          .then((res) => {
            setPeriods(
              res.data.map((period: any) => ({
                value: period.value,
                label: period.value === "all" ? "All" : period.value.toUpperCase(),
              }))
            );
          })
          .catch(() => {});
      });
  }, []);

  return periods;
}
