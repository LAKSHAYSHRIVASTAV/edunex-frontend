import React, { useMemo } from "react";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  ReactFlow,
  type Edge,
  type Node,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { getLayoutedNodes, type ConceptEdge, type ConceptNode, type LayoutMode } from "../utils/layout";

const TYPE_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  core: { bg: "#EDE9FF", border: "#5B4EE8", text: "#3730A3" },
  input: { bg: "#D1FAE5", border: "#1D9E75", text: "#065F46" },
  output: { bg: "#FEF3C7", border: "#EF9F27", text: "#92400E" },
  process: { bg: "#DBEAFE", border: "#3B8BD4", text: "#1E3A8A" },
  byproduct: { bg: "#FCE7F3", border: "#D4537E", text: "#831843" },
  concept: { bg: "#F3F4F6", border: "#6B7280", text: "#374151" },
};

type ConceptMapCanvasProps = {
  mapData: {
    nodes: ConceptNode[];
    edges: ConceptEdge[];
  };
  layoutMode: LayoutMode;
  onNodeClick?: (node: ConceptNode | null) => void;
  selectedNodeId?: string;
};

const nodeStyle = (node: ConceptNode, selectedNodeId?: string) => {
  const colors = TYPE_COLORS[node.type || "concept"] || TYPE_COLORS.concept;
  const selected = selectedNodeId === node.id;

  return {
    background: colors.bg,
    border: `${selected ? 3 : 2}px solid ${colors.border}`,
    borderRadius: 8,
    color: colors.text,
    fontSize: 13,
    fontWeight: node.type === "core" ? 700 : 600,
    minWidth: node.type === "core" ? 170 : 145,
    maxWidth: 190,
    padding: "12px 14px",
    textAlign: "center" as const,
    boxShadow: selected
      ? `0 0 0 5px ${colors.border}22, 0 12px 30px rgba(15, 23, 42, 0.14)`
      : "0 10px 24px rgba(15, 23, 42, 0.10)",
  };
};

function ConceptMapFlow({ mapData, layoutMode, onNodeClick, selectedNodeId }: ConceptMapCanvasProps) {
  const { nodes, edges } = useMemo(() => {
    const laidOutNodes = getLayoutedNodes(mapData.nodes || [], mapData.edges || [], layoutMode);

    const flowNodes: Node[] = laidOutNodes.map((node) => ({
      id: node.id,
      type: "default",
      position: node.position || { x: 0, y: 0 },
      data: {
        label: node.label,
        raw: node,
      },
      style: nodeStyle(node, selectedNodeId),
    }));

    const flowEdges: Edge[] = (mapData.edges || []).map((edge, index) => ({
      id: edge.id || `${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
      label: edge.label,
      animated: edge.type === "animated",
      type: "smoothstep",
      labelBgPadding: [8, 4],
      labelBgBorderRadius: 8,
      labelBgStyle: { fill: "#ffffff", fillOpacity: 0.9 },
      style: { stroke: "#64748B", strokeWidth: 2 },
      markerEnd: { type: "arrowclosed", color: "#64748B" },
    }));

    return { nodes: flowNodes, edges: flowEdges };
  }, [layoutMode, mapData.edges, mapData.nodes, selectedNodeId]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      fitView
      fitViewOptions={{ padding: 0.18 }}
      minZoom={0.25}
      maxZoom={1.8}
      onNodeClick={(_, node) => onNodeClick?.(node.data.raw as ConceptNode)}
      onPaneClick={() => onNodeClick?.(null)}
    >
      <Background color="#CBD5E1" gap={22} />
      <MiniMap
        pannable
        zoomable
        nodeColor={(node) => {
          const raw = node.data?.raw as ConceptNode | undefined;
          return TYPE_COLORS[raw?.type || "concept"]?.border || TYPE_COLORS.concept.border;
        }}
      />
      <Controls />
    </ReactFlow>
  );
}

export default function ConceptMapCanvas(props: ConceptMapCanvasProps) {
  return (
    <ReactFlowProvider>
      <ConceptMapFlow {...props} />
    </ReactFlowProvider>
  );
}
