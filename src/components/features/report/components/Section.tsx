import React from "react";

type SectionProps = {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode; // ✅ OPTIONAL (fixes your error)
};

export default function Section({
  title,
  children,
  action,
}: SectionProps) {
  return (
    <div
      style={{
        background: "var(--bg2)",
        border: "1px solid var(--border)",
        borderRadius: "var(--r-lg)",
        padding: "22px 24px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "18px",
        }}
      >
        <h2
          style={{
            fontSize: "13px",
            fontWeight: "600",
            fontFamily: "var(--font-display)",
            color: "var(--text3)",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {title}
        </h2>

        {/* ✅ Safe render */}
        {action && <div>{action}</div>}
      </div>

      {children}
    </div>
  );
}