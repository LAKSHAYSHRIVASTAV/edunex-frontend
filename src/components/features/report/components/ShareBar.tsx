import React, { useState } from "react";

const SHARE_PLATFORMS = [
  { id: "link",      label: "Copy link",      icon: "⌘" },
  { id: "whatsapp",  label: "WhatsApp",        icon: "W" },
  { id: "twitter",   label: "Twitter / X",     icon: "𝕏" },
  { id: "linkedin",  label: "LinkedIn",         icon: "in" },
  { id: "instagram", label: "Instagram",        icon: "◎" },
];

export default function ShareBar({ user, period, stats }) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const shareUrl = `https://edunex.app/report/${user?.id}?period=${period}`;
  const shareText = `📊 My Edunex ${period} report: ${stats?.quizzesCompleted} quizzes, ${stats?.avgScore}% avg score, ${stats?.totalHours}h studied. Check it out!`;

  const handleShare = (platform) => {
    const urls = {
      link: () => {
        navigator.clipboard?.writeText(shareUrl).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
      },
      whatsapp: () =>
        window.open(`https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`, "_blank"),
      twitter: () =>
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, "_blank"),
      linkedin: () =>
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, "_blank"),
      instagram: () =>
        alert("Screenshot this report and share it on Instagram with #Edunex!"),
    };
    urls[platform]?.();
  };

  const handleDownload = () => {
    setDownloading(true);
    // In production: call /api/report/pdf?period=... and download the PDF
    // For now we simulate with a brief delay
    setTimeout(() => {
      const content = `EDUNEX PROGRESS REPORT\n${"=".repeat(40)}\nUser: ${user?.name}\nPeriod: ${period}\nGenerated: ${new Date().toLocaleString()}\n\nSTATS\n-----\nTotal Study Hours : ${stats?.totalHours}h\nQuizzes Completed : ${stats?.quizzesCompleted}\nAverage Score     : ${stats?.avgScore}%\nSummaries Created : ${stats?.summariesCreated}\nFlashcards        : ${stats?.flashcardsReviewed}\n\nShared from Edunex — edunex.app`;
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `edunex-report-${period}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      setDownloading(false);
    }, 800);
  };

  return (
    <div>
      <p style={{ fontSize: "13px", color: "var(--text3)", marginBottom: "14px", lineHeight: 1.5 }}>
        Share your learning milestones with friends, colleges, or on social media.
      </p>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
        {SHARE_PLATFORMS.map((p) => (
          <button
            key={p.id}
            onClick={() => handleShare(p.id)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              padding: "8px 14px",
              background: "var(--bg4)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: p.id === "link" && copied ? "var(--green)" : "var(--text2)",
              fontSize: "12px",
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "var(--font-body)",
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border2)"; e.currentTarget.style.color = "var(--text)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = p.id === "link" && copied ? "var(--green)" : "var(--text2)"; }}
          >
            <span style={{ fontSize: "10px", fontWeight: "700", opacity: 0.6 }}>{p.icon}</span>
            {p.id === "link" && copied ? "Copied!" : p.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "10px 20px",
          background: downloading ? "var(--bg4)" : "var(--accent)",
          border: "none",
          borderRadius: "10px",
          color: "#fff",
          fontSize: "13px",
          fontWeight: "500",
          cursor: downloading ? "not-allowed" : "pointer",
          transition: "all 0.15s",
          fontFamily: "var(--font-body)",
          boxShadow: downloading ? "none" : "0 0 20px var(--accent-glow)",
          opacity: downloading ? 0.6 : 1,
        }}
      >
        {downloading ? "Generating…" : "⬇  Download PDF report"}
      </button>
    </div>
  );
}
