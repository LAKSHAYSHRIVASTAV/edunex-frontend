import { useState } from "react";
import { motion } from "framer-motion";

interface DayPlan {
  day: string;
  focus: string;
  hours: number;
}

interface WeekPlan {
  week: string;
  days: DayPlan[];
}

export default function AIPlanGenerator() {
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState<number | "">("");
  const [plan, setPlan] = useState<WeekPlan[]>([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const BASE_URL =
    "https://edunex-backend-rj22.onrender.com/api/ai/generate-plan";

  const generatePlan = async () => {
    if (!subject || !topics || !examDate || !hoursPerDay) {
      alert("Please fill all fields properly");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          topics,
          examDate,
          hoursPerDay: Number(hoursPerDay),
        }),
      });

      const data = await response.json();
      setPlan(data.generatedPlan.weeks);

    } catch (error) {
      console.error("AI Plan Error:", error);
      alert("Failed to generate AI plan");
    } finally {
      setLoading(false);
    }
  };

  const markProgress = async (topic: string, difficulty: string) => {
    try {
      await fetch(
        "https://edunex-backend-rj22.onrender.com/api/progress",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            topic,
            difficulty,
            completed: difficulty !== "hard",
          }),
        }
      );

      alert("Progress saved!");
    } catch (error) {
      console.error("Progress save failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6 text-gray-800">

      {/* INNER GRADIENT CARD */}
      <div className="max-w-5xl mx-auto rounded-3xl p-6 text-white bg-gradient-to-br from-[#5f5cff] via-[#8b5cf6] to-[#ec4899] shadow-xl">

        {/* HEADER */}
        <h1 className="text-4xl font-bold mb-8">
          🤖 AI Smart Study Plan Generator
        </h1>

        {/* INPUT */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-2xl space-y-4 mb-8"
        >
          <input
            placeholder="📘 Subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 outline-none"
          />

          <input
            placeholder="📖 Topics"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 outline-none"
          />

          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/20 outline-none"
          />

          <input
            type="number"
            placeholder="Hours per day"
            value={hoursPerDay}
            onChange={(e) =>
              setHoursPerDay(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="w-full p-3 rounded-xl bg-white/20 outline-none"
          />

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={generatePlan}
            className="w-full bg-gradient-to-r from-indigo-400 to-pink-500 py-3 rounded-xl font-semibold"
          >
            {loading ? "⏳ Generating..." : "🚀 Generate AI Plan"}
          </motion.button>
        </motion.div>

        {/* PLAN */}
        {plan.length > 0 && (
          <div className="space-y-6">
            {plan.map((week, index) => (
              <div
                key={index}
                className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl"
              >
                <h2 className="text-xl font-semibold mb-4">
                  📅 {week.week}
                </h2>

                {week.days.map((day, i) => (
                  <div
                    key={i}
                    className="p-4 mb-3 rounded-xl bg-white/20"
                  >
                    <p className="font-semibold">{day.day}</p>
                    <p className="text-sm">{day.focus}</p>
                    <p className="text-sm">{day.hours} hrs</p>

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => markProgress(day.focus, "easy")}
                        className="bg-green-500 px-3 py-1 rounded"
                      >
                        ✔ Done
                      </button>

                      <button
                        onClick={() => markProgress(day.focus, "hard")}
                        className="bg-red-500 px-3 py-1 rounded"
                      >
                        ❗ Hard
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}