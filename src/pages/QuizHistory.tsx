import { useEffect, useState } from "react";

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

        console.log("Quiz History:", data);

        setHistory(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  if (!history.length)
    return (
      <h2 className="text-center mt-10 text-xl font-bold">
        No Quiz History Found
      </h2>
    );

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">📊 Quiz History</h2>

      <div className="space-y-4">
        {history.map((quiz) => (
          <div key={quiz._id} className="p-4 bg-white shadow rounded-xl">
            <p className="font-semibold">
              {quiz.subject} - {quiz.topic}
            </p>
            <p>
              Score: {quiz.score} / {quiz.totalQuestions}
            </p>
            <p className="text-sm text-gray-500">
              {new Date(quiz.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}