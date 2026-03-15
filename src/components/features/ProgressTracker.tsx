import React from "react";
import { Line } from "react-chartjs-2";

const ProgressChart = ({ dashboardData }) => {

  if (!dashboardData?.subjectDistribution) {
    return (
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Progress Tracker</h2>
        <p>No data available</p>
      </div>
    );
  }

  const labels = dashboardData.subjectDistribution.map(
    (s) => s.subject
  );

  const scores = dashboardData.subjectDistribution.map(
    (s) => s.percentage
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: "Subject Progress",
        data: scores,
        fill: false,
        backgroundColor: "rgba(99,102,241,0.4)",
        borderColor: "rgba(99,102,241,1)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-4">
        📊 Subject Distribution
      </h2>

      <Line data={chartData} options={options} />
    </div>
  );
};

export default ProgressChart;
