import React from "react";

function Bone({ w = "100%", h = "16px", r = "8px", style = {} }) {
  return (
    <div style={{
      width: w, height: h, borderRadius: r,
      background: "var(--bg4)",
      animation: "shimmer 1.4s ease-in-out infinite",
      ...style,
    }} />
  );
}

export default function SkeletonLoader() {
  return (
    <div>
      <style>{`
        @keyframes shimmer {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Header skeleton */}
      <div style={{ marginBottom: "28px" }}>
        <Bone w="220px" h="36px" r="10px" style={{ marginBottom: "10px" }} />
        <Bone w="160px" h="14px" />
      </div>

      {/* Stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "20px" }}>
        {[...Array(4)].map((_, i) => (
          <div key={i} style={{
            background: "var(--bg3)", border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)", padding: "20px",
          }}>
            <Bone w="60px" h="11px" style={{ marginBottom: "10px" }} />
            <Bone w="80px" h="32px" r="6px" />
          </div>
        ))}
      </div>

      {/* Two column layout */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        {[...Array(2)].map((_, i) => (
          <div key={i} style={{
            background: "var(--bg2)", border: "1px solid var(--border)",
            borderRadius: "var(--r-lg)", padding: "22px 24px",
          }}>
            <Bone w="100px" h="11px" style={{ marginBottom: "18px" }} />
            {[...Array(5)].map((_, j) => (
              <div key={j} style={{ marginBottom: "12px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "5px" }}>
                  <Bone w="80px" h="12px" />
                  <Bone w="28px" h="12px" />
                </div>
                <Bone h="6px" r="3px" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div style={{
        background: "var(--bg2)", border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)", padding: "22px 24px",
      }}>
        <Bone w="100px" h="11px" style={{ marginBottom: "18px" }} />
        {[...Array(5)].map((_, i) => (
          <div key={i} style={{ display: "flex", gap: "16px", padding: "11px 0", borderBottom: i < 4 ? "1px solid var(--border)" : "none" }}>
            <Bone w="160px" h="13px" />
            <Bone w="70px" h="13px" />
            <Bone w="46px" h="20px" r="20px" />
            <Bone w="40px" h="13px" />
            <Bone w="60px" h="13px" />
          </div>
        ))}
      </div>
    </div>
  );
}
