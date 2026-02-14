import { useEffect, useState } from "react";

export default function AIStudyPlanner() {
  const [plan, setPlan] = useState("");

  useEffect(() => {
    const fetchPlan = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://edunex-backend-rj22.onrender.com/api/ai/study-plan",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setPlan(data.recommendation);
    };

    fetchPlan();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        🧠 AI Study Planner
      </h2>
      <p>{plan}</p>
    </div>
  );
}
