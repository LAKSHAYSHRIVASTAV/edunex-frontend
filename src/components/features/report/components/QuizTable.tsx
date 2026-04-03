import React, { useState } from "react";
import { fmtShort, scoreColor, scoreBg, subjectColor } from "../utils/helpers";

export default function QuizTable({ quizzes }) {
  const [expanded, setExpanded] = useState(false);

  if (!quizzes || quizzes.length === 0) {
    return <div style={{ color: "var(--text3)", fontSize: "13px", padding: "12px 0" }}>No quizzes taken in this period.</div>;
  }

  const visible = expanded ? quizzes : quizzes.slice(0, 5);

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
          <thead>
            <tr>
              {["Quiz", "Subject", "Score", "Questions", "Date"].map((h) => (
                <th key={h} style={{
                  textAlign: "left",
                  padding: "0 12px 10px 0",
                  color: "var(--text3)",
                  fontWeight: "500",
                  fontSize: "11px",
                  textTransform: "uppercase",
                  letterSpacing: "0.07em",
                  fontFamily: "var(--font-display)",
                  borderBottom: "1px solid var(--border)",
                  whiteSpace: "nowrap",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.map((q, i) => (
              <tr key={q.id}
                style={{ borderBottom: i < visible.length - 1 ? "1px solid var(--border)" : "none" }}
              >
                <td style={{ padding: "11px 12px 11px 0", color: "var(--text)", fontWeight: "400", maxWidth: "180px" }}>
                  {q.quizName}
                </td>
                <td style={{ padding: "11px 12px 11px 0" }}>
                  <span style={{
                    fontSize: "11px", padding: "3px 8px", borderRadius: "20px",
                    background: `${subjectColor(q.subject)}18`,
                    color: subjectColor(q.subject),
                    fontWeight: "500",
                    whiteSpace: "nowrap",
                  }}>{q.subject}</span>
                </td>
                <td style={{ padding: "11px 12px 11px 0" }}>
                  <span style={{
                    fontSize: "12px", padding: "3px 10px", borderRadius: "20px",
                    background: scoreBg(q.score),
                    color: scoreColor(q.score),
                    fontWeight: "600",
                    fontFamily: "var(--font-display)",
                  }}>{q.score}%</span>
                </td>
                <td style={{ padding: "11px 12px 11px 0", color: "var(--text3)" }}>
                  {q.correctAnswers}/{q.totalQuestions}
                </td>
                <td style={{ padding: "11px 0 11px 0", color: "var(--text3)", whiteSpace: "nowrap" }}>
                  {fmtShort(q.date)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {quizzes.length > 5 && (
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
          {expanded ? "Show less ↑" : `Show all ${quizzes.length} attempts ↓`}
        </button>
      )}
    </div>
  );
}
