import React from "react";
import { Bar } from "react-chartjs-2";
import useStudyData from "../../hooks/useStudyData";

const Analytics: React.FC = () => {
  const { dashboardData, loading } = useStudyData();

  // ✅ Prevent crash if data not loaded yet
  const dataArray = dashboardData?.subjectDistribution || [];

const labels = dataArray.map((item: any) => item.subject);
const progressData = dataArray.map((item: any) => item.percentage);

  const data = {
    labels,
    datasets: [
      {
        label: "Progress",
        data: progressData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        borderRadius: 8, // 🔥 nice UI touch
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "#374151", // better text color
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: "#6b7280",
        },
      },
      x: {
        ticks: {
          color: "#6b7280",
        },
      },
    },
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-md">
      <h2 className="text-xl font-bold mb-4 dark:text-white">📊 Analytics</h2>

      {loading ? (
        <p className="text-gray-500">Loading chart...</p>
      ) : (
        <Bar data={data} options={options} />
      )}
    </div>
  );
};

export default Analytics;
