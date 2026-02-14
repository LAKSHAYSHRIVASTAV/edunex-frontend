import { useState } from "react";

interface StudySession {
  day: string;
  subject: string;
  duration: string;
  focus: string;
}

interface GeneratedPlan {
  [week: string]: StudySession[];
}

export default function AIPlanGenerator() {
  const [subject, setSubject] = useState("");
  const [topics, setTopics] = useState("");
  const [examDate, setExamDate] = useState("");
  const [hoursPerDay, setHoursPerDay] = useState<number | "">("");
  const [plan, setPlan] = useState<GeneratedPlan | null>(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  const BASE_URL =
    "https://edunex-backend-rj22.onrender.com/api/ai/generate-plan";

  const generatePlan = async () => {
    if (!subject || !examDate || !hoursPerDay || hoursPerDay < 1) {
      alert("Please fill all fields properly");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subjects: subject,
          topics,
          examDate,
          hoursPerDay,
        }),
      });

      const data = await res.json();
      setPlan(data.generatedPlan);
    } catch (err) {
      console.error("AI Plan Error:", err);
      alert("AI plan generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-10 space-y-8">
      <h1 className="text-3xl font-bold">
        🤖 AI Smart Study Plan Generator
      </h1>

      <div className="bg-white p-6 rounded-xl shadow space-y-4">
        <input
          placeholder="Subject (e.g. Mathematics)"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          placeholder="Topics (comma separated)"
          value={topics}
          onChange={(e) => setTopics(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <input
          type="date"
          value={examDate}
          onChange={(e) => setExamDate(e.target.value)}
          className="w-full p-2 border rounded"
        />

        <div>
          <label className="block font-medium mb-1">
            Study Hours Per Day
          </label>

          <input
            type="number"
            min="1"
            max="12"
            placeholder="Enter hours (1–12)"
            value={hoursPerDay}
            onChange={(e) =>
              setHoursPerDay(
                e.target.value === "" ? "" : Number(e.target.value)
              )
            }
            className="w-full p-2 border rounded"
          />
        </div>

        <button
          onClick={generatePlan}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
        >
          {loading ? "Generating Plan..." : "Generate AI Plan"}
        </button>
      </div>

      {plan && (
        <div className="space-y-6">
          {Object.entries(plan).map(([week, sessions]) => (
            <div
              key={week}
              className="bg-white p-6 rounded-xl shadow"
            >
              <h2 className="text-xl font-semibold mb-4 capitalize">
                {week}
              </h2>

              <div className="space-y-3">
                {sessions.map((session, index) => (
                  <div
                    key={index}
                    className="p-4 border rounded-lg bg-gray-50"
                  >
                    <p className="font-semibold">
                      {session.day} – {session.subject}
                    </p>
                    <p className="text-sm text-gray-600">
                      Duration: {session.duration}
                    </p>
                    <p className="text-sm text-gray-600">
                      Focus: {session.focus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

