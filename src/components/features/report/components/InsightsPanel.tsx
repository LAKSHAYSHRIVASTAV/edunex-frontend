import React from "react";
import { insightIcon, insightAccent } from "../utils/helpers";

export default function InsightsPanel({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {insights.map((ins, i) => (
        <div key={i} style={{
          display: "flex",
          gap: "12px",
          alignItems: "flex-start",
          background: `${insightAccent(ins.type)}0d`,
          border: `1px solid ${insightAccent(ins.type)}22`,
          borderRadius: "var(--r)",
          padding: "14px 16px",
        }}>
          <div style={{
            width: "26px", height: "26px", borderRadius: "50%",
            background: `${insightAccent(ins.type)}1a`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "12px", color: insightAccent(ins.type),
            flexShrink: 0, marginTop: "1px",
          }}>
            {insightIcon(ins.type)}
          </div>
          <div>
            {ins.title && (
              <div style={{ fontSize: "13px", fontWeight: "500", color: "var(--text)", marginBottom: "3px" }}>
                {ins.title}
              </div>
            )}
            <div style={{ fontSize: "13px", color: "var(--text2)", lineHeight: 1.5 }}>
              {ins.message}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
