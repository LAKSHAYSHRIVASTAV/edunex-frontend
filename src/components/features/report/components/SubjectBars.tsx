import React from "react";
import { subjectColor } from "../utils/helpers";

export default function SubjectBars({ data }) {
  if (!data || data.length === 0) return (
    <div style={{ color: "var(--text3)", fontSize: "13px", padding: "12px 0" }}>No subject data for this period.</div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {data.map((item) => (
        <div key={item.subject}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
            <span style={{ fontSize: "13px", color: "var(--text2)", fontWeight: "400" }}>{item.subject}</span>
            <span style={{ fontSize: "13px", fontWeight: "600", fontFamily: "var(--font-display)", color: subjectColor(item.subject) }}>
              {item.percentage}%
            </span>
          </div>
          <div style={{
            height: "6px", background: "var(--bg4)", borderRadius: "3px", overflow: "hidden",
          }}>
            <div style={{
              height: "100%",
              width: `${item.percentage}%`,
              background: subjectColor(item.subject),
              borderRadius: "3px",
              transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: `0 0 8px ${subjectColor(item.subject)}66`,
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}
