import React, { useState, useCallback, useEffect } from "react";
import ConceptMapCanvas from "./components/ConceptMapCanvas";
import GeneratePanel from "./components/GeneratePanel";
import NodeDetailPanel from "./components/NodeDetailPanel";
import MapHistory from "./components/MapHistory";
import useConceptMapStore from "./hooks/useConceptMap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./ConceptMapPage.css";

/* ================= USER ID ================= */
const USER_ID =
  localStorage.getItem("userId") ||
  (() => {
    const id = "user_" + Math.random().toString(36).slice(2, 9);
    localStorage.setItem("userId", id);
    return id;
  })();

/* ================= TYPE COLORS ================= */
const TYPE_COLORS: Record<string, string> = {
  core: "#7c6dfa",
  input: "#2dd4a7",
  output: "#f5a623",
  process: "#3b82f6",
  unknown: "#888",
};

export default function ConceptMapPage() {
  const { currentMap, selectedNode, setSelectedNode, error } =
    useConceptMapStore();

  const [leftTab, setLeftTab] = useState<"generate" | "history">("generate");
  const [showSummary, setShowSummary] = useState(false);

  /* ================= HANDLERS ================= */

  const handleNodeClick = useCallback(
    (node: any) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const handleGenerated = useCallback((map: any) => {
    toast.success(
      `Map "${map?.title || "Untitled"}" generated with ${
        map?.nodes?.length || 0
      } concepts!`
    );
    setShowSummary(true);
  }, []);

  /* ================= ERROR HANDLING ================= */

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  /* ================= SAFE VALUES ================= */

  const nodes = currentMap?.nodes || [];
  const edges = currentMap?.edges || [];

  /* ================= NODE TYPE BREAKDOWN ================= */

  const breakdown = Object.entries(
    nodes.reduce((acc: any, n: any) => {
      const type = n?.type || "unknown";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {})
  );

  /* ================= UI ================= */

  return (
    <div className="cm-page">
      {/* LEFT SIDEBAR */}
      <aside className="cm-sidebar cm-sidebar--left">
        <div className="cm-sidebar__tabs">
          <button
            className={`cm-tab ${leftTab === "generate" ? "active" : ""}`}
            onClick={() => setLeftTab("generate")}
          >
            Generate
          </button>

          <button
            className={`cm-tab ${leftTab === "history" ? "active" : ""}`}
            onClick={() => setLeftTab("history")}
          >
            History
          </button>
        </div>

        <div className="cm-sidebar__body">
          {leftTab === "generate" ? (
            <GeneratePanel onGenerated={handleGenerated} />
          ) : (
            <MapHistory
              userId={USER_ID}
              onSelect={() => setLeftTab("generate")}
            />
          )}
        </div>
      </aside>

      {/* MAIN CANVAS */}
      <main className="cm-canvas-wrap">
        {/* TOOLBAR */}
        <div className="cm-toolbar">
          {currentMap ? (
            <>
              <div className="cm-toolbar__info">
                <span className="cm-map-title">
                  {currentMap.title || "Untitled Map"}
                </span>
                <span className="cm-map-meta">
                  {nodes.length} nodes · {edges.length} edges
                </span>
              </div>

              <div className="cm-toolbar__actions">
                <button
                  className="toolbar-btn"
                  onClick={() => setShowSummary((s) => !s)}
                >
                  Summary
                </button>

                <button
                  className="toolbar-btn"
                  onClick={() => {
                    const svg = document.querySelector(
                      ".cm-canvas-wrap svg"
                    );
                    if (!svg) return;

                    const blob = new Blob([svg.outerHTML], {
                      type: "image/svg+xml",
                    });

                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = `${currentMap.title || "map"}.svg`;
                    a.click();

                    toast.success("SVG exported!");
                  }}
                >
                  Export
                </button>
              </div>
            </>
          ) : (
            <div className="cm-toolbar__placeholder">
              Generate a concept map to get started
            </div>
          )}
        </div>

        {/* SUMMARY */}
        {showSummary && currentMap?.summary && (
          <div className="cm-summary-bar">
            <p>{currentMap.summary}</p>
            <button onClick={() => setShowSummary(false)}>✕</button>
          </div>
        )}

        {/* CANVAS */}
        <div className="cm-canvas">
          {!currentMap ? (
            <div className="cm-empty-state">
              <h2>No concept map yet</h2>
              <p>Use Generate panel to create one</p>
            </div>
          ) : (
            <ConceptMapCanvas
              mapData={currentMap}
              onNodeClick={handleNodeClick}
              selectedNodeId={selectedNode?.id}
            />
          )}
        </div>

        {/* HINT */}
        {currentMap && (
          <div className="cm-hint-bar">
            🖱 Scroll to zoom · Drag to pan · Click nodes
          </div>
        )}
      </main>

      {/* RIGHT PANEL */}
      <aside className="cm-sidebar cm-sidebar--right">
        {selectedNode ? (
          <NodeDetailPanel
            node={selectedNode}
            mapData={currentMap}
            onClose={() => setSelectedNode(null)}
          />
        ) : (
          <p className="cm-right-placeholder">
            Click node to see details
          </p>
        )}

        {/* STATS */}
        {currentMap && (
          <div className="cm-stats">
            <div className="cm-stats__title">Map Stats</div>

            <div className="cm-stats__grid">
              <div className="stat-item">
                <span className="stat-val">{nodes.length}</span>
                <span className="stat-label">Nodes</span>
              </div>

              <div className="stat-item">
                <span className="stat-val">{edges.length}</span>
                <span className="stat-label">Edges</span>
              </div>

              <div className="stat-item">
                <span className="stat-val">
                  {nodes.filter((n) => n?.type === "core").length}
                </span>
                <span className="stat-label">Core</span>
              </div>

              <div className="stat-item">
                <span className="stat-val">
                  {[...new Set(nodes.map((n) => n?.type || "unknown"))].length}
                </span>
                <span className="stat-label">Types</span>
              </div>
            </div>

            {/* BREAKDOWN */}
            <div className="cm-stats__breakdown">
              {breakdown.map(([type, count]) => (
                <div key={String(type)} className="breakdown-row">
                  <span
                    className="breakdown-dot"
                    style={{
                      background: TYPE_COLORS[String(type)] || "#888",
                    }}
                  />
                  <span className="breakdown-type">{String(type)}</span>
                  <span className="breakdown-count">{Number(count)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}