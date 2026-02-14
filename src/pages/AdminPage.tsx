import { useEffect, useState } from "react";
import CountUp from "react-countup";

export default function AdminPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://edunex-backend-rj22.onrender.com/api/admin/stats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setStats(data);
    };

    fetchStats();
  }, []);

  if (!stats)
    return <div className="p-10">Loading Admin Overview...</div>;

  const healthStatus =
    stats.averagePlatformScore >= 70
      ? "Healthy 🚀"
      : stats.averagePlatformScore >= 50
      ? "Moderate ⚡"
      : "Needs Improvement ⚠️";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-10 space-y-10">

      <div>
        <h1 className="text-4xl font-bold mb-2">
          📊 Admin Monitoring Dashboard
        </h1>
        <p className="text-gray-600">
          System-wide analytics and performance overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-gray-500 mb-3">
            Total Registered Users
          </h2>
          <p className="text-4xl font-bold text-blue-600">
            <CountUp end={stats.totalUsers} duration={1.5} />
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-gray-500 mb-3">
            Total Quizzes Attempted
          </h2>
          <p className="text-4xl font-bold text-green-600">
            <CountUp end={stats.totalQuizzes} duration={1.5} />
          </p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg hover:scale-105 transition">
          <h2 className="text-gray-500 mb-3">
            Platform Average Score
          </h2>
          <p className="text-4xl font-bold text-purple-600">
            <CountUp end={stats.averagePlatformScore} duration={1.5} />%
          </p>
        </div>

      </div>

      {/* Platform Health Section */}
      <div className="bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-xl font-semibold mb-4">
          🧠 Platform Health Status
        </h2>

        <p className="text-lg">
          Current Learning Performance:
          <span className="font-bold ml-2">
            {healthStatus}
          </span>
        </p>

        <p className="text-gray-600 mt-3 text-sm">
          This metric evaluates overall user performance across
          the platform based on aggregated quiz data.
        </p>
      </div>

    </div>
  );
}

