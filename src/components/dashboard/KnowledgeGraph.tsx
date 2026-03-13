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

interface TopicData {
  topic: string;
  mastery: number;
}

const KnowledgeGraph = () => {
  const [data, setData] = useState<TopicData[]>([]);

  useEffect(() => {
    const fetchGraph = async () => {
      try {
        const res = await api.get("/knowledge-graph");
        setData(res.data.topics || []);
      } catch (err) {
        console.error(err);
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

          <XAxis dataKey="topic" />

          <YAxis domain={[0, 100]} />

          <Tooltip />

          <Bar dataKey="mastery" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KnowledgeGraph;