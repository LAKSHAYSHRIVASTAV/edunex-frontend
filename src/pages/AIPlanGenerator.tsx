import { useState } from "react";

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
      alert("Please fill all fields");
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
          subject,
          topics,
          examDate,
          hoursPerDay: Number(hoursPerDay),
        }),
      });

      const data = await res.json();

      console.log("API RESPONSE:", data);

      // 🔥 FIX
      setPlan(data.generatedPlan);

    } catch (err) {
      console.error("Error:", err);
      alert("Failed to generate plan");
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
          placeholder="Subject"
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

        <input
          type="number"
          placeholder="Hours per day"
          value={hoursPerDay}
          onChange={(e) =>
            setHoursPerDay(
              e.target.value === "" ? "" : Number(e.target.value)
            )
          }
          className="w-full p-2 border rounded"
        />

        <button
          onClick={generatePlan}
          className="bg-purple-600 text-white px-4 py-2 rounded"
        >
          {loading ? "Generating..." : "Generate AI Plan"}
        </button>

      </div>

      {/* 🔥 Study Plan Display */}

      {plan.length > 0 && (
        <div className="space-y-6">

          {plan.map((week, i) => (

            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow"
            >

              <h2 className="text-xl font-semibold mb-4">
                {week.week}
              </h2>

              {week.days.map((day, index) => (

                <div
                  key={index}
                  className="border p-3 rounded mb-2 bg-gray-50"
                >
                  <p className="font-semibold">{day.day}</p>

                  <p className="text-sm text-gray-600">
                    Focus: {day.focus}
                  </p>

                  <p className="text-sm text-gray-600">
                    Hours: {day.hours}
                  </p>

                </div>

              ))}

            </div>

          ))}

        </div>
      )}

    </div>
  );
}