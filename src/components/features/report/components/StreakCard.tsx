import React from "react";

export default function StreakCard({ streak }) {
  const { current = 0, best = 0 } = streak || {};

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
      <div>
        <div style={{
          fontSize: "56px", fontWeight: "800",
          fontFamily: "var(--font-display)",
          color: current > 0 ? "var(--amber)" : "var(--text3)",
          lineHeight: 1,
          textShadow: current > 0 ? "0 0 30px rgba(245,166,35,0.35)" : "none",
        }}>
          {current}
        </div>
        <div style={{ fontSize: "12px", color: "var(--text3)", marginTop: "4px", textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-display)" }}>
          day streak
        </div>
      </div>

      <div style={{
        width: "1px", height: "48px",
        background: "var(--border)",
      }} />

      <div>
        <div style={{ fontSize: "13px", color: "var(--text3)", marginBottom: "4px" }}>Personal best</div>
        <div style={{
          fontSize: "24px", fontWeight: "700",
          fontFamily: "var(--font-display)",
          color: "var(--text2)",
        }}>
          {best} days
        </div>
      </div>

      {current > 0 && (
        <div style={{ marginLeft: "auto" }}>
          <div style={{
            width: "48px", height: "48px",
            background: "var(--amber-dim)",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "22px",
            animation: "pulse 2s ease-in-out infinite",
          }}>
            🔥
          </div>
          <style>{`@keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.12)} }`}</style>
        </div>
      )}
    </div>
  );
}
