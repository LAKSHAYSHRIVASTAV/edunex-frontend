import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { toPng } from "html-to-image";
import toast from "react-hot-toast";
import ConceptMapCanvas from "./components/ConceptMapCanvas";
import GeneratePanel from "./components/GeneratePanel";
import NodeDetailPanel from "./components/NodeDetailPanel";
import useConceptMapStore from "./hooks/useConceptMap";
import type { ConceptNode, LayoutMode } from "./utils/layout";

const LAYOUTS: LayoutMode[] = ["map", "tree", "radial", "timeline"];

export default function ConceptMapPage() {
  const graphRef = useRef<HTMLDivElement>(null);
  const { currentMap, selectedNode, setSelectedNode, error } = useConceptMapStore();
  const [layoutMode, setLayoutMode] = useState<LayoutMode>("map");

  const nodes = currentMap?.nodes || [];
  const edges = currentMap?.edges || [];

  const concepts = useMemo(
    () => nodes.filter((node: ConceptNode) => node.type !== "core"),
    [nodes]
  );

  const handleGenerated = useCallback((map: any) => {
    toast.success(`Generated "${map?.title || "Concept Map"}"`);
  }, []);

  const handleExport = useCallback(async () => {
    if (!graphRef.current || !currentMap) return;

    try {
      const dataUrl = await toPng(graphRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: "#ffffff",
      });

      const link = document.createElement("a");
      link.download = `${currentMap.title || "concept-map"}.png`;
      link.href = dataUrl;
      link.click();
    } catch {
      toast.error("Unable to export the map right now.");
    }
  }, [currentMap]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 text-slate-900">
      <aside className="flex w-80 shrink-0 flex-col gap-4 border-r border-slate-200 bg-white p-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
            Edunex
          </p>
          <h1 className="mt-1 text-2xl font-bold">Concept Map</h1>
        </div>

        <GeneratePanel
          concepts={concepts}
          onGenerated={handleGenerated}
          onConceptSelect={setSelectedNode}
        />
      </aside>

      <main className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-4">
          <div className="min-w-0">
            <h2 className="truncate text-lg font-bold">
              {currentMap?.title || "Generate a concept map"}
            </h2>
            <p className="text-sm text-slate-500">
              {currentMap ? `${nodes.length} nodes, ${edges.length} labeled edges` : "Paste study material to begin."}
            </p>
          </div>

          <div className="flex rounded-lg border border-slate-200 bg-slate-50 p-1">
            {LAYOUTS.map((layout) => (
              <button
                key={layout}
                className={`rounded-md px-3 py-2 text-sm font-semibold capitalize transition ${
                  layoutMode === layout
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-slate-600 hover:bg-white"
                }`}
                onClick={() => setLayoutMode(layout)}
              >
                {layout}
              </button>
            ))}
          </div>
        </header>

        {currentMap?.summary && (
          <div className="border-b border-blue-100 bg-blue-50 px-5 py-3 text-sm text-blue-900">
            {currentMap.summary}
          </div>
        )}

        <section className="min-h-0 flex-1 p-5">
          <div ref={graphRef} className="h-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            {!currentMap ? (
              <div className="flex h-full items-center justify-center px-8 text-center text-slate-500">
                Your generated graph visualization will appear here.
              </div>
            ) : (
              <ConceptMapCanvas
                mapData={currentMap}
                layoutMode={layoutMode}
                onNodeClick={setSelectedNode}
                selectedNodeId={selectedNode?.id}
              />
            )}
          </div>
        </section>

        <footer className="flex items-center justify-between border-t border-slate-200 bg-white px-5 py-4">
          <p className="text-sm text-slate-500">Export the current map as a PNG.</p>
          <button
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            onClick={handleExport}
            disabled={!currentMap}
          >
            Export PNG
          </button>
        </footer>
      </main>

      <aside className="flex w-80 shrink-0 flex-col border-l border-slate-200 bg-white p-5">
        {selectedNode ? (
          <NodeDetailPanel
            node={selectedNode}
            mapData={currentMap}
            onClose={() => setSelectedNode(null)}
          />
        ) : (
          <div className="flex h-full items-center justify-center rounded-lg border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            Select a node to see concept details and its connections.
          </div>
        )}
      </aside>
    </div>
  );
}
