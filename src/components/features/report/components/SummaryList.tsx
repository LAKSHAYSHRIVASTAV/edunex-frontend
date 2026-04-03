import React, { useState } from "react";
import { fmtShort, subjectColor } from "../utils/helpers";

export default function SummaryList({ summaries }) {
  const [expanded, setExpanded] = useState(false);

  if (!summaries || summaries.length === 0) {
    return <div style={{ color: "var(--text3)", fontSize: "13px", padding: "12px 0" }}>No summaries created in this period.</div>;
  }

  const visible = expanded ? summaries : summaries.slice(0, 5);

  return (
    <div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
        {visible.map((s, i) => (
          <div key={s.id} style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "11px 0",
            borderBottom: i < visible.length - 1 ? "1px solid var(--border)" : "none",
            gap: "12px",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
              <div style={{
                width: "3px", height: "28px", borderRadius: "2px",
                background: subjectColor(s.subject), flexShrink: 0,
              }} />
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: "13px", color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {s.title}
                </div>
                <div style={{ fontSize: "11px", color: "var(--text3)", marginTop: "2px" }}>
                  {s.wordCount} words
                </div>
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
              <span style={{
                fontSize: "11px", padding: "2px 8px", borderRadius: "20px",
                background: `${subjectColor(s.subject)}15`, color: subjectColor(s.subject),
              }}>{s.subject}</span>
              <span style={{ fontSize: "12px", color: "var(--text3)", whiteSpace: "nowrap" }}>
                {fmtShort(s.date)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {summaries.length > 5 && (
        <button onClick={() => setExpanded(!expanded)} style={{
          marginTop: "12px",
          background: "transparent",
          border: "1px solid var(--border)",
          borderRadius: "8px",
          color: "var(--text2)",
          fontSize: "12px",
          padding: "7px 16px",
          cursor: "pointer",
          fontFamily: "var(--font-body)",
          transition: "all 0.15s",
        }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text2)"; }}
        >
          {expanded ? "Show less ↑" : `Show all ${summaries.length} summaries ↓`}
        </button>
      )}
    </div>
  );
}
