import { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import CountUp from "react-countup";

export default function QuizHistory() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}/ai/quiz/history`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setHistory(data);

        // 🎉 Confetti for high score
        data.forEach((q: any) => {
          const percent = (q.score / q.totalQuestions) * 100;
          if (percent >= 80) {
            confetti({ particleCount: 80, spread: 60 });
          }
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  // 🧠 Smart Stats
  const totalQuizzes = history.length;

  const avgScore =
    history.reduce((acc, q) => acc + (q.score / q.totalQuestions) * 100, 0) /
      totalQuizzes || 0;

  const subjectStats: any = {};
  history.forEach((q) => {
    if (!subjectStats[q.subject]) subjectStats[q.subject] = [];
    subjectStats[q.subject].push((q.score / q.totalQuestions) * 100);
  });

  const getAvg = (arr: number[]) =>
    arr.reduce((a, b) => a + b, 0) / arr.length;

  let bestSubject = "N/A";
  let weakSubject = "N/A";

  if (Object.keys(subjectStats).length) {
    const sorted = Object.entries(subjectStats).sort(
      (a: any, b: any) => getAvg(b[1]) - getAvg(a[1])
    );
    bestSubject = sorted[0][0];
    weakSubject = sorted[sorted.length - 1][0];
  }

  const getColor = (score: number, total: number) => {
    const percent = (score / total) * 100;
    if (percent >= 80) return "bg-green-100 text-green-600";
    if (percent >= 50) return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-600";
  };

  const getInsight = () => {
    if (!history.length) return "";
    if (avgScore >= 80)
      return "🔥 Excellent performance! Keep pushing your limits.";
    if (avgScore >= 50)
      return "👍 Good progress, but consistency will boost your results.";
    return "⚡ You need more practice. Focus on weak subjects.";
  };

  // ⏳ Loading UI
  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <p className="text-lg text-gray-600 animate-pulse">
          Loading your performance...
        </p>
      </div>
    );

  // ❌ Empty State
  if (!history.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-pink-50">
        <p className="text-2xl font-semibold text-gray-700 mb-2">
          No Quiz History Yet
        </p>
        <p className="text-gray-500">
          Start solving quizzes to see your progress 🚀
        </p>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-pink-50 p-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          📊 Quiz History
        </h2>

        {/* 🧠 Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: "Quizzes", value: totalQuizzes },
            { label: "Avg Score", value: Math.round(avgScore) + "%" },
            { label: "Best", value: bestSubject },
            { label: "Weak", value: weakSubject },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow hover:shadow-lg transition"
            >
              <p className="text-sm text-gray-500">{item.label}</p>
              <h2 className="text-xl font-bold text-indigo-600">
                {typeof item.value === "number" ? (
                  <CountUp end={item.value} duration={1} />
                ) : (
                  item.value
                )}
              </h2>
            </div>
          ))}
        </div>

        {/* 🧠 Insight */}
        <div className="bg-indigo-100 text-indigo-700 p-4 rounded-xl mb-6 shadow">
          {getInsight()}
        </div>

        {/* 📋 Quiz Cards */}
        <div className="space-y-4">
          {history.map((quiz) => {
            const percent = (quiz.score / quiz.totalQuestions) * 100;

            return (
              <div
                key={quiz._id}
                className="bg-white/70 backdrop-blur-md border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex justify-between items-center"
              >
                {/* LEFT */}
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {quiz.subject} - {quiz.topic}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* RIGHT */}
                <div className="text-right">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${getColor(
                      quiz.score,
                      quiz.totalQuestions
                    )}`}
                  >
                    {quiz.score} / {quiz.totalQuestions}
                  </span>

                  {/* Progress */}
                  <div className="w-32 h-2 bg-gray-200 rounded-full mt-2 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}