export function fmt(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}
 
export function fmtShort(date) {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric", month: "short",
  });
}
 
export function scoreColor(score) {
  if (score >= 75) return "var(--green)";
  if (score >= 55) return "var(--amber)";
  return "var(--red)";
}
 
export function scoreBg(score) {
  if (score >= 75) return "var(--green-dim)";
  if (score >= 55) return "var(--amber-dim)";
  return "var(--red-dim)";
}
 
export function subjectColor(subject) {
  const map = {
    Physics: "#7c6dfa",
    Mathematics: "#2dd4a7",
    Computer: "#f5a623",
    English: "#f06060",
    General: "#a78bfa",
    AI: "#60c8f0",
  };
  return map[subject] || "#9b9aac";
}
 
export function insightIcon(type) {
  return { success: "✦", warning: "⚠", info: "◆" }[type] || "◆";
}
 
export function insightAccent(type) {
  return {
    success: "var(--green)",
    warning: "var(--amber)",
    info: "var(--accent2)",
  }[type] || "var(--accent2)";
}
 
export function plural(n, word) {
  return `${n} ${word}${n !== 1 ? "s" : ""}`;
}
