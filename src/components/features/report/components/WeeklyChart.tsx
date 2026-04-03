import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, TooltipProps,
} from "recharts";

function formatWeek(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
}

type CustomTooltipProps = TooltipProps<number, string> | { active?: boolean; payload?: any; label?: string | number };

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "var(--bg4)", border: "1px solid var(--border2)",
      borderRadius: "10px", padding: "10px 14px",
      fontSize: "13px", color: "var(--text)",
    }}>
      <div style={{ color: "var(--text3)", marginBottom: "4px", fontSize: "11px" }}>
        Week of {formatWeek(label)}
      </div>
      <div style={{ color: "var(--accent2)", fontWeight: "600", fontFamily: "var(--font-display)", fontSize: "18px" }}>
        {payload[0].value}h
      </div>
    </div>
  );
};

export default function WeeklyChart({ data }) {
  if (!data || data.length === 0) {
    return <div style={{ color: "var(--text3)", fontSize: "13px", padding: "20px 0" }}>No study data for this period.</div>;
  }

  const chartData = data.map((d) => ({
    week: d.weekStart,
    hours: d.hours,
  }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c6dfa" stopOpacity={0.3} />
            <stop offset="100%" stopColor="#7c6dfa" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
        <XAxis
          dataKey="week"
          tickFormatter={formatWeek}
          tick={{ fill: "var(--text3)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: "var(--text3)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          unit="h"
        />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="hours"
          stroke="#7c6dfa"
          strokeWidth={2}
          fill="url(#grad)"
          dot={false}
          activeDot={{ r: 4, fill: "#7c6dfa", stroke: "var(--bg)", strokeWidth: 2 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
