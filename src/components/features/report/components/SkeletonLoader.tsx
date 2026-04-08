import React from "react";
import "./reportPreview.css";

function Bone({ className = "" }) {
  return <div className={`skeleton-bone ${className}`} />;
}

export default function SkeletonLoader() {
  return (
    <div className="report skeleton-report">
      <style>{`
        .skeleton-bone {
          border-radius: 8px;
          background: linear-gradient(90deg, #e5e7eb, #f3f4f6, #e5e7eb);
          background-size: 200% 100%;
          animation: shimmer 1.2s ease-in-out infinite;
        }
        .skeleton-report .report-hero { background: #ffffff; }
        .skeleton-title { width: 320px; height: 38px; }
        .skeleton-subtitle { width: 180px; height: 16px; margin-top: 12px; }
        .skeleton-score { width: 132px; height: 132px; }
        .skeleton-card { height: 96px; }
        .skeleton-chart { height: 300px; }
        @keyframes shimmer {
          0% { background-position: 0 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>

      <section className="report-hero">
        <div>
          <Bone className="skeleton-title" />
          <Bone className="skeleton-subtitle" />
        </div>
        <Bone className="skeleton-score" />
      </section>

      <section className="metrics-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <Bone key={index} className="metric-card skeleton-card" />
        ))}
      </section>

      <section className="dashboard-grid">
        <Bone className="report-card wide skeleton-chart" />
        <Bone className="report-card skeleton-chart" />
        <Bone className="report-card skeleton-chart" />
      </section>
    </div>
  );
}
