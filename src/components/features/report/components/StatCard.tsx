import React from "react";

export default function StatCard({ label, value, sub, accent, icon }) {
  return (
    <div style={{
      background: "var(--bg3)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      gap: "6px",
      position: "relative",
      overflow: "hidden",
      transition: "border-color 0.2s",
    }}
      onMouseEnter={e => e.currentTarget.style.borderColor = "var(--border2)"}
      onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
    >
      {/* Glow blob */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "80px", height: "80px",
        background: accent ? `${accent}22` : "var(--accent-glow)",
        borderRadius: "50%", filter: "blur(24px)",
        pointerEvents: "none",
      }} />

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "11px", fontWeight: "500", color: "var(--text3)", textTransform: "uppercase", letterSpacing: "0.08em", fontFamily: "var(--font-display)" }}>
          {label}
        </span>
        {icon && <span style={{ fontSize: "16px", opacity: 0.5 }}>{icon}</span>}
      </div>

      <div style={{
        fontSize: "32px",
        fontWeight: "700",
        fontFamily: "var(--font-display)",
        color: accent || "var(--text)",
        lineHeight: 1.1,
      }}>
        {value}
      </div>

      {sub && (
        <div style={{ fontSize: "12px", color: "var(--text3)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}
