import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function AITutor() {
  const navigate = useNavigate();

  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [progress, setProgress] = useState({
    xp: 0,
    level: 1,
    streak: 0,
  });

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* ================= LOAD SAVED CHAT ID ================= */
  useEffect(() => {
    const savedChatId = localStorage.getItem("chatId");
    if (savedChatId) {
      setChatId(savedChatId);
    }
  }, []);

  /* ================= CREATE CHAT ================= */
  useEffect(() => {
    if (chatId) return;

    const createChat = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://edunex-backend-rj22.onrender.com/api/chat",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        setChatId(data._id);
        localStorage.setItem("chatId", data._id);

      } catch (err) {
        console.error("Create chat error:", err);
      }
    };

    createChat();
  }, [chatId]);

  /* ================= LOAD MESSAGES ================= */
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          `https://edunex-backend-rj22.onrender.com/api/chat/${chatId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.messages) {
          setMessages(data.messages);
        }

      } catch (err) {
        console.error("Load messages error:", err);
      }
    };

    loadMessages();
  }, [chatId]);

  /* ================= LOAD PROGRESS ================= */
  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(
          "https://edunex-backend-rj22.onrender.com/api/user/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        setProgress({
          xp: data.xp || 0,
          level: data.level || 1,
          streak: data.streak || 0,
        });
      } catch (error) {
        console.error(error);
      }
    };

    fetchProgress();
  }, []);

  /* ================= TYPING EFFECT ================= */
  const typeText = (text: string, callback: (val: string) => void) => {
    let i = 0;
    const speed = 20;

    const interval = setInterval(() => {
      callback(text.slice(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, speed);
  };

  /* ================= ASK AI ================= */
  const askTutor = async () => {
    if (!question.trim()) return;

    if (!chatId) {
      alert("Chat not ready yet");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) return;

    const userMessage: Message = { role: "user", content: question };

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
          body: JSON.stringify({
            message: userMessage.content,
            chatId: chatId,
          }),
        }
      );

      const data = await res.json();

      /* UPDATE PROGRESS */
      if (data.progress) {
        setProgress(data.progress);

        if (data.progress.xp === 0) {
          confetti({ particleCount: 200, spread: 90 });
        }
      }

      /* AI TYPING EFFECT */
      let temp = "";
      setMessages((prev) => [...prev, { role: "ai", content: "" }]);

      typeText(data.reply || "No response", (val) => {
        temp = val;
        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = {
            role: "ai",
            content: temp,
          };
          return newMsgs;
        });
      });

    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  };

  /* ================= VOICE INPUT ================= */
  const startVoice = () => {
    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.start();

    recognition.onresult = (event: any) => {
      setQuestion(event.results[0][0].transcript);
    };
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#fdf6ec] via-[#f8efe5] to-[#f3e7da] flex items-center justify-center p-6">

      <div className="absolute inset-0 bg-gradient-to-r from-purple-200 via-pink-200 to-blue-200 blur-3xl opacity-20"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-3xl bg-[#fffaf5]/80 backdrop-blur-xl rounded-3xl shadow-2xl flex flex-col h-[80vh]"
      >

        {/* HEADER */}
        <div className="p-5 border-b flex justify-between">
          <h1 className="text-2xl font-bold">🤖 AI Tutor</h1>

          <div className="flex gap-4 text-sm bg-white/70 px-4 py-2 rounded-xl shadow">
            ⭐ {progress.level} | ⚡ {progress.xp} | 🔥 {progress.streak}
          </div>
        </div>

        {/* CHAT */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {messages.length === 0 && (
            <div className="text-center mt-20 space-y-3">
              <p className="text-gray-400">💡 Ask anything...</p>

              <div className="flex flex-wrap gap-2 justify-center">
                {["Explain concept", "Give examples", "Make quiz"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setQuestion(s)}
                    className="px-3 py-1 bg-white shadow rounded-full text-sm hover:scale-105 transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`max-w-xs md:max-w-md px-4 py-3 rounded-2xl shadow ${
                  msg.role === "user"
                    ? "bg-gradient-to-r from-orange-400 to-pink-400 text-white"
                    : "bg-[#fffaf5] border"
                }`}
              >
                {msg.content}
              </motion.div>
            </div>
          ))}

          {loading && <div className="text-gray-400">🤖 Thinking...</div>}

          <div ref={messagesEndRef} />
        </div>

        {/* INPUT */}
        <div className="p-4 flex gap-3 border-t">

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
            className="flex-1 p-3 rounded-xl border bg-[#fffaf5]/80"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                askTutor();
              }
            }}
          />

          <button onClick={startVoice} className="px-3 bg-gray-200 rounded-xl">
            🎤
          </button>

          <button
            onClick={askTutor}
            className="px-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl"
          >
            🚀
          </button>
        </div>

        {/* BACK */}
        <button
          onClick={() => navigate("/dashboard")}
          className="m-4 py-2 bg-gray-800 text-white rounded-xl"
        >
          ← Back
        </button>
      </motion.div>
    </div>
  );
}