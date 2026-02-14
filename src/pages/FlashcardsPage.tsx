import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const generateFlashcards = async () => {
    if (!text.trim()) {
      alert("Please enter some text first.");
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login again.");
      return;
    }

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

      if (!res.ok) {
        throw new Error(data.message || "Failed to generate flashcards");
      }

      setFlashcards(data.flashcards || []);
      setCurrent(0);
      setFlipped(false);
    } catch (error: any) {
      alert(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl">

        {flashcards.length === 0 ? (
          <>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Generate Flashcards
            </h2>

            <textarea
              rows={6}
              className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Paste your study text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <button
              onClick={generateFlashcards}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
            >
              {loading ? "Generating..." : "Generate Flashcards"}
            </button>
          </>
        ) : (
          <>
            <h2 className="text-xl font-bold mb-6 text-gray-700 text-center">
              Flashcard {current + 1} of {flashcards.length}
            </h2>

            {/* 3D Animated Flashcard */}
            <div className="perspective-1000">
              <div
                onClick={() => setFlipped(!flipped)}
                className={`relative w-full min-h-[260px] transition-all duration-700 transform cursor-pointer ${
                  flipped ? "rotate-y-180" : ""
                } hover:scale-[1.02]`}
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* FRONT */}
                <div
                  className="absolute inset-0 flex items-center justify-center text-center p-10 rounded-3xl shadow-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white text-xl font-semibold tracking-wide"
                  style={{ backfaceVisibility: "hidden" }}
                >
                  {flashcards[current].question}
                </div>

                {/* BACK */}
                <div
                  className="absolute inset-0 flex items-center justify-center text-center p-10 rounded-3xl shadow-2xl bg-gradient-to-br from-emerald-500 via-teal-500 to-green-600 text-white text-xl font-semibold tracking-wide"
                  style={{
                    backfaceVisibility: "hidden",
                    transform: "rotateY(180deg)",
                  }}
                >
                  {flashcards[current].answer}
                </div>
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                disabled={current === 0}
                onClick={() => {
                  setCurrent(current - 1);
                  setFlipped(false);
                }}
                className="px-5 py-2 bg-gray-200 rounded-lg disabled:opacity-50 hover:bg-gray-300 transition"
              >
                Previous
              </button>

              <button
                disabled={current === flashcards.length - 1}
                onClick={() => {
                  setCurrent(current + 1);
                  setFlipped(false);
                }}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 hover:bg-blue-700 transition"
              >
                Next
              </button>
            </div>
          </>
        )}

        <button
          onClick={() => navigate("/dashboard")}
          className="mt-10 px-5 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
