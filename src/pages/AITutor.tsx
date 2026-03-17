import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AITutor() {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  /* ✅ BACKEND PROGRESS STATE */
  const [progress, setProgress] = useState({
    xp: 0,
    level: 1,
    streak: 0,
  });

  /* ✅ LOAD PROGRESS ON PAGE LOAD */
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://edunex-backend-rj22.onrender.com/api/user/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setProgress({
          xp: data.xp || 0,
          level: data.level || 1,
          streak: data.streak || 0,
        });
      } catch (error) {
        console.error("Progress fetch error:", error);
      }
    };

    fetchProgress();
  }, []);

  const askTutor = async () => {
    if (!question.trim()) {
      alert("Please enter a question");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in");
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: question,
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);

    try {
      const res = await fetch(
        "https://edunex-backend-rj22.onrender.com/api/ai/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ message: userMessage.content }),
        }
      );

      const data = await res.json();

      /* ✅ UPDATE FROM BACKEND */
      if (data.progress) {
        setProgress(data.progress);

        // 🎉 Level up detection (simple)
        if (data.progress.xp === 0) {
          confetti({
            particleCount: 200,
            spread: 90,
          });
        }
      }

      /* AI MESSAGE */
      const aiMessage: Message = {
        role: "ai",
        content: data.reply || "AI could not respond.",
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (error) {
      console.error("AI Tutor Error:", error);
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Error connecting to AI service." },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center p-6">

      <div className="w-full max-w-3xl bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col h-[80vh]">

        {/* HEADER */}
        <div className="p-5 border-b flex items-center justify-between">
          <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800">
            🤖 AI Tutor
          </h1>

          {/* ✅ LIVE USER STATS */}
          <div className="flex gap-4 text-sm bg-white/70 px-4 py-2 rounded-xl shadow">
            <span>⭐ Level {progress.level}</span>
            <span>⚡ {progress.xp} XP</span>
            <span>🔥 {progress.streak}</span>
          </div>
        </div>

        {/* CHAT AREA */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {messages.length === 0 && (
            <p className="text-gray-400 text-center mt-20">
              💡 Ask anything... your AI tutor will help you
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white"
                    : "bg-white border text-gray-800"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="px-4 py-3 rounded-2xl bg-gray-200 text-gray-600 animate-pulse">
                🤖 AI is thinking...
              </div>
            </div>
          )}
        </div>

        {/* INPUT */}
        <div className="p-4 border-t flex gap-3">

          <textarea
            rows={1}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="💬 Ask your study question..."
            className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-purple-400 outline-none resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askTutor();
              }
            }}
          />

          <button
            onClick={askTutor}
            className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl shadow-lg hover:scale-105 transition"
          >
            🚀
          </button>
        </div>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/dashboard")}
          className="m-4 py-2 bg-gray-800 text-white rounded-xl hover:bg-black transition"
        >
          ← Back to Dashboard
        </button>
      </div>
    </div>
  );
}