import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const formatShortDate = (date: string) =>
  new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

const subjectColor = (subject = "General") => {
  const colors = ["#2563eb", "#059669", "#d97706", "#dc2626", "#0891b2", "#4f46e5", "#7c2d12"];
  const index = subject.split("").reduce((sum, letter) => sum + letter.charCodeAt(0), 0) % colors.length;
  return colors[index];
};

export function PerformanceLineChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="date" tickFormatter={formatShortDate} tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip labelFormatter={formatDate} />
        <Line type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

export function SubjectBarChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data}>
        <CartesianGrid stroke="#e5e7eb" vertical={false} />
        <XAxis dataKey="subject" tick={{ fontSize: 12 }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
        <Tooltip />
        <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
          {data.map((subject: any) => (
            <Cell key={subject.subject} fill={subjectColor(subject.subject)} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TimePieChart({ data }: any) {
  return (
    <ResponsiveContainer width="100%" height={240}>
      <PieChart>
        <Pie data={data} dataKey="hours" nameKey="subject" innerRadius={58} outerRadius={86} paddingAngle={4}>
          {data.map((item: any) => (
            <Cell key={item.subject} fill={subjectColor(item.subject)} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default {
  PerformanceLineChart,
  SubjectBarChart,
  TimePieChart,
};
