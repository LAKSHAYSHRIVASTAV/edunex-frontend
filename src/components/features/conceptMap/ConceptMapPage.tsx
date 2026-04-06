import React, { useState, useCallback, useEffect } from "react";
import ConceptMapCanvas from "./components/ConceptMapCanvas";
import GeneratePanel from "./components/GeneratePanel";
import NodeDetailPanel from "./components/NodeDetailPanel";
import MapHistory from "./components/MapHistory";
import useConceptMapStore from "./hooks/useConceptMap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

/* ================= USER ID ================= */
const USER_ID =
  localStorage.getItem("userId") ||
  (() => {
    const id = "user_" + Math.random().toString(36).slice(2, 9);
    localStorage.setItem("userId", id);
    return id;
  })();

export default function ConceptMapPage() {
  const { currentMap, selectedNode, setSelectedNode, error } =
    useConceptMapStore();

  const [leftTab, setLeftTab] = useState<"generate" | "history">("generate");
  const [showSummary, setShowSummary] = useState(false);

  const handleNodeClick = useCallback(
    (node: any) => {
      setSelectedNode(node);
    },
    [setSelectedNode]
  );

  const handleGenerated = useCallback((map: any) => {
    toast.success(`Map "${map?.title}" generated!`);
    setShowSummary(true);
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  console.log("MAP:", currentMap);
  const nodes = currentMap?.nodes || [];
  const edges = currentMap?.edges || [];

  return (
    <div className="flex h-screen bg-gray-100">

      {/* ================= LEFT PANEL ================= */}
      <aside className="w-80 bg-white border-r flex flex-col p-4 gap-4">
        <h2 className="text-xl font-bold">Concept Map</h2>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setLeftTab("generate")}
            className={`flex-1 py-2 rounded-lg ${
              leftTab === "generate"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            Generate
          </button>
          <button
            onClick={() => setLeftTab("history")}
            className={`flex-1 py-2 rounded-lg ${
              leftTab === "history"
                ? "bg-blue-500 text-white"
                : "bg-gray-100"
            }`}
          >
            History
          </button>
        </div>

        {/* Panel */}
        <div className="flex-1 overflow-auto">
          {leftTab === "generate" ? (
            <GeneratePanel onGenerated={handleGenerated} />
          ) : (
            <MapHistory userId={USER_ID} />
          )}
        </div>
      </aside>

      {/* ================= MAIN CANVAS ================= */}
      <main className="flex-1 flex flex-col">

        {/* Top Bar */}
        <div className="bg-white border-b p-4 flex justify-between items-center">
          {currentMap ? (
            <>
              <div>
                <h2 className="font-semibold text-lg">
                  {currentMap.title}
                </h2>
                <p className="text-sm text-gray-500">
                  {nodes.length} nodes · {edges.length} edges
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowSummary((s) => !s)}
                  className="px-3 py-1 bg-gray-200 rounded"
                >
                  Summary
                </button>

                <button
                  onClick={() => {
                    const svg = document.querySelector("svg");
                    if (!svg) return;

                    const blob = new Blob([svg.outerHTML], {
                      type: "image/svg+xml",
                    });

                    const a = document.createElement("a");
                    a.href = URL.createObjectURL(blob);
                    a.download = "concept-map.svg";
                    a.click();
                  }}
                  className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                  Export
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">
              Generate a concept map to start
            </p>
          )}
        </div>

        {/* Summary */}
        {showSummary && currentMap?.summary && (
          <div className="p-3 bg-yellow-50 border-b flex justify-between">
            <p>{currentMap.summary}</p>
            <button onClick={() => setShowSummary(false)}>✕</button>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 m-4 bg-white rounded-xl shadow relative">
          {!currentMap ? (
            <div className="flex items-center justify-center h-full text-gray-400">
              No concept map yet
            </div>
          ) : (
            <ConceptMapCanvas
              mapData={currentMap}
              onNodeClick={handleNodeClick}
              selectedNodeId={selectedNode?.id}
            />
          )}
        </div>
      </main>

      {/* ================= RIGHT PANEL ================= */}
      <aside className="w-80 bg-white border-l p-4 flex flex-col gap-4">
        {selectedNode ? (
          <NodeDetailPanel
            node={selectedNode}
            mapData={currentMap}
            onClose={() => setSelectedNode(null)}
          />
        ) : (
          <p className="text-gray-400">
            Click node to see details
          </p>
        )}

        {/* Stats */}
        {currentMap && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h3 className="font-semibold mb-2">Stats</h3>
            <p>Nodes: {nodes.length}</p>
            <p>Edges: {edges.length}</p>
          </div>
        )}
      </aside>
    </div>
  );
}