import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Flashcard {
  question: string;
  answer: string;
}

export default function FlashcardsPage() {
  const navigate = useNavigate();

  const [text, setText] = useState("");
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cardStatus, setCardStatus] = useState<{ [key: number]: string }>({});

  /* ================= GENERATE ================= */
  const generateFlashcards = async () => {
    if (!text.trim()) return alert("Enter some text");

    const token = localStorage.getItem("token");
    if (!token) return alert("Login again");

    setLoading(true);

    try {
      const res = await fetch(
        "https://edunex-backend-rj22.onrender.com/api/ai/flashcards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text }),
        }
      );

      const data = await res.json();
      setFlashcards(data.flashcards || []);
      setCurrent(0);
      setFlipped(false);
      setCardStatus({});
    } catch {
      alert("Error generating flashcards");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EASY / HARD ================= */
  const handleAnswer = (type: "easy" | "hard") => {
    setCardStatus((prev) => ({
      ...prev,
      [current]: type,
    }));

    setFlipped(false);

    if (type === "easy") {
      if (current < flashcards.length - 1) {
        setCurrent(current + 1);
      }
    }

    if (type === "hard") {
      setFlashcards((prev) => [...prev, prev[current]]);
      if (current < flashcards.length - 1) {
        setCurrent(current + 1);
      }
    }
  };

  /* ================= SAVE ================= */
  const saveProgress = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      const res = await fetch(
        "https://edunex-backend-rj22.onrender.com/api/flashcard/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            topic: text,
            cards: flashcards.map((card, i) => ({
              ...card,
              difficulty: cardStatus[i] || "easy",
            })),
          }),
        }
      );

      const data = await res.json();
      alert(`📊 Performance: ${data.weakness}`);
    } catch (err) {
      console.error("Save error", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-emerald-50 to-yellow-100 flex items-center justify-center p-6">

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl bg-white/60 backdrop-blur-xl border border-gray-200 rounded-3xl shadow-xl p-8"
      >

        {/* HEADER */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-2">🧠✨</div>
          <h1 className="text-3xl font-bold text-gray-800">
            AI Flashcard Generator
          </h1>
          <p className="text-gray-500 mt-2 text-sm">
            Turn your notes into smart flashcards instantly
          </p>
        </div>

        {flashcards.length === 0 ? (
          <>
            {/* INPUT */}
            <textarea
              rows={6}
              placeholder="Paste your notes..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full p-4 rounded-2xl bg-white/80 border border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-300 outline-none transition"
            />

            {/* BUTTON */}
            <button
              onClick={generateFlashcards}
              className="mt-6 w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:scale-105 hover:shadow-lg transition"
            >
              {loading ? "🤖 Generating..." : "🚀 Generate Flashcards"}
            </button>
          </>
        ) : (
          <>
            {/* PROGRESS */}
            <div className="w-full bg-gray-200 h-2 rounded-full mb-4">
              <div
                className="h-2 bg-green-500 rounded-full transition-all"
                style={{
                  width: `${((current + 1) / flashcards.length) * 100}%`,
                }}
              />
            </div>

            <h2 className="text-center text-gray-600 mb-4">
              Card {current + 1} / {flashcards.length}
            </h2>

            {/* CARD */}
            <div className="perspective-1000">
              <motion.div
                onClick={() => setFlipped(!flipped)}
                className={`relative w-full min-h-[260px] cursor-pointer ${
                  flipped ? "rotate-y-180" : ""
                }`}
                style={{
                  transformStyle: "preserve-3d",
                  transition: "transform 0.7s",
                }}
              >

                {/* FRONT */}
                <div
                  className="absolute inset-0 flex items-center justify-center text-center p-10 rounded-3xl bg-gradient-to-br from-indigo-400 to-purple-500 text-white text-xl font-semibold shadow-lg"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {cardStatus[current] && (
                    <div className="absolute top-3 right-3 text-xs px-2 py-1 rounded-full bg-white/20">
                      {cardStatus[current] === "easy" ? "✅ Easy" : "🔥 Hard"}
                    </div>
                  )}
                  {flashcards[current].question}
                </div>

                {/* BACK */}
                <div
                  className="absolute inset-0 flex items-center justify-center text-center p-10 rounded-3xl bg-gradient-to-br from-green-400 to-emerald-500 text-white text-xl font-semibold shadow-lg"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {flashcards[current].answer}
                </div>
              </motion.div>
            </div>

            {/* ACTIONS */}
            <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => handleAnswer("easy")}
                className="px-5 py-2 bg-green-500 text-white rounded-xl hover:scale-105 transition"
              >
                😊 Easy
              </button>

              <button
                onClick={() => handleAnswer("hard")}
                className="px-5 py-2 bg-red-500 text-white rounded-xl hover:scale-105 transition"
              >
                😓 Hard
              </button>
            </div>

            {/* NAV */}
            <div className="flex justify-between mt-6">
              <button
                disabled={current === 0}
                onClick={() => {
                  setCurrent(current - 1);
                  setFlipped(false);
                }}
                className="px-5 py-2 bg-gray-200 rounded-lg"
              >
                ⬅ Prev
              </button>

              <button
                onClick={() => {
                  if (current === flashcards.length - 1) {
                    saveProgress();
                  } else {
                    setCurrent(current + 1);
                    setFlipped(false);
                  }
                }}
                className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:scale-105 transition"
              >
                Next ➡
              </button>
            </div>

            {/* RESET */}
            <button
              onClick={() => {
                setFlashcards([]);
                setText("");
              }}
              className="mt-6 w-full py-2 bg-red-500 text-white rounded-lg hover:scale-105 transition"
            >
              🔄 Generate New
            </button>
          </>
        )}

        {/* BACK */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-8 w-full py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
        >
          ← Back
        </button>

      </motion.div>
    </div>
  );
}