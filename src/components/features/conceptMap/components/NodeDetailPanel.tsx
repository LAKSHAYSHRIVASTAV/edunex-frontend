import React from "react";

const TYPE_LABELS: Record<string, string> = {
  core: "Core Concept",
  input: "Input",
  output: "Output",
  process: "Process",
  byproduct: "Byproduct",
  concept: "Concept",
};

const TYPE_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  core: { bg: "#EDE9FF", text: "#5B4EE8", border: "#C4B9FF" },
  input: { bg: "#D1FAE5", text: "#1D9E75", border: "#6EE7B7" },
  output: { bg: "#FEF3C7", text: "#D97706", border: "#FCD34D" },
  process: { bg: "#DBEAFE", text: "#1D4ED8", border: "#93C5FD" },
  byproduct: { bg: "#FCE7F3", text: "#BE185D", border: "#F9A8D4" },
  concept: { bg: "#F3F4F6", text: "#4B5563", border: "#D1D5DB" },
};

export default function NodeDetailPanel({ node, mapData, onClose }: any) {
  if (!node) return null;

  const colors = TYPE_COLORS[node.type || "concept"] || TYPE_COLORS.concept;
  const connectedEdges =
    mapData?.edges?.filter((edge: any) => edge.source === node.id || edge.target === node.id) || [];

  const connectedNodes = connectedEdges
    .map((edge: any) => {
      const otherId = edge.source === node.id ? edge.target : edge.source;
      const other = mapData?.nodes?.find((candidate: any) => candidate.id === otherId);
      return { node: other, edge, direction: edge.source === node.id ? "out" : "in" };
    })
    .filter((connection: any) => connection.node);

  return (
    <div className="flex h-full flex-col gap-5">
      <div className="flex items-start justify-between gap-3">
        <span
          className="rounded-full border px-3 py-1 text-xs font-semibold"
          style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}
        >
          {TYPE_LABELS[node.type || "concept"] || "Concept"}
        </span>
        <button
          className="rounded-lg border border-slate-200 px-3 py-1 text-sm text-slate-500 hover:bg-slate-50"
          onClick={onClose}
        >
          Close
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold text-slate-900">{node.label}</h2>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          {node.description || "No description was provided for this concept."}
        </p>
      </div>

      <div className="min-h-0 flex-1">
        <h3 className="mb-3 text-sm font-semibold text-slate-700">
          Connections ({connectedNodes.length})
        </h3>
        {connectedNodes.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-200 p-4 text-sm text-slate-500">
            No connected concepts yet.
          </div>
        ) : (
          <div className="flex flex-col gap-3 overflow-auto pr-1">
            {connectedNodes.map(({ node: other, edge, direction }: any) => (
              <div key={`${edge.source}-${edge.target}`} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                <p className="text-xs font-semibold uppercase text-slate-500">
                  {direction === "out" ? "Connects to" : "Connected from"}
                </p>
                <p className="mt-1 text-sm font-semibold text-slate-800">{other.label}</p>
                <p className="mt-1 text-xs text-slate-500">{edge.label || "related to"}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
