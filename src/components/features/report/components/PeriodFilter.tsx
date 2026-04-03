import React from "react";

const PERIODS = [
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "3m", label: "3M" },
  { value: "6m", label: "6M" },
  { value: "1y", label: "1Y" },
  { value: "all", label: "All" },
];

export default function PeriodFilter({ value, onChange }) {
  return (
    <div style={{
      display: "flex",
      gap: "4px",
      background: "var(--bg3)",
      border: "1px solid var(--border)",
      borderRadius: "50px",
      padding: "4px",
    }}>
      {PERIODS.map((p) => {
        const active = value === p.value;
        return (
          <button
            key={p.value}
            onClick={() => onChange(p.value)}
            style={{
              padding: "6px 14px",
              borderRadius: "50px",
              border: "none",
              fontSize: "12px",
              fontWeight: active ? "600" : "400",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.03em",
              background: active ? "var(--accent)" : "transparent",
              color: active ? "#fff" : "var(--text2)",
              cursor: "pointer",
              transition: "all 0.15s ease",
              boxShadow: active ? "0 0 12px var(--accent-glow)" : "none",
            }}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
