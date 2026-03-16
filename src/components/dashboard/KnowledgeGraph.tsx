import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface GraphData {
  labels: string[];
  scores: number[];
  colors?: string[];
}

interface Props {
  data: GraphData;
}

export default function KnowledgeGraph({ data }: Props) {

  const chartData = {
    labels: data.labels || [],
    datasets: [
      {
        label: "Average Score (%)",
        data: data.scores || [],
        backgroundColor: data.colors || "#94A3B8",
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">📊 Knowledge Graph</h2>

      {data.labels.length === 0 ? (
        <p className="text-gray-500">No quiz data yet.</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}