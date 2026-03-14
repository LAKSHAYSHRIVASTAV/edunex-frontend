import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";
import api from "../../config/api";

interface GraphData {
  subject: string;
  averageScore: number;
}

const KnowledgeGraph = () => {
  const [data, setData] = useState<GraphData[]>([]);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await api.get("/analytics/knowledge-graph");
        setData(res.data);
      } catch (err) {
        console.error("Knowledge Graph Error:", err);
      }
    };

    fetchGraph();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">📚 Knowledge Graph</h2>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          {/* Subject name */}
          <XAxis dataKey="subject" />

          {/* Score percentage */}
          <YAxis domain={[0, 100]} />

          <Tooltip />

          {/* Average score */}
          <Bar dataKey="averageScore" fill="#6366f1" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KnowledgeGraph;