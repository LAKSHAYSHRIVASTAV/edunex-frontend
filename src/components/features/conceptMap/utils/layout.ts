import * as d3 from "d3";

/* ================= TYPES ================= */

type NodeType = {
  id: string;
  label: string;
  type?: string;
  x?: number;
  y?: number;
};

type EdgeType = {
  source: string;
  target: string;
};

/* ================= LAYOUT FUNCTION ================= */

export function generateLayout(
  nodes: NodeType[],
  edges: EdgeType[],
  width = 800,
  height = 600
) {
  const simulation = d3
    .forceSimulation(nodes as any)
    .force(
      "link",
      d3
        .forceLink(edges as any)
        .id((d: any) => d.id)
        .distance(120)
    )
    .force("charge", d3.forceManyBody().strength(-300))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(50));

  // Run simulation manually
  for (let i = 0; i < 200; i++) {
    simulation.tick();
  }

  simulation.stop();

  return nodes.map((node: any) => ({
    ...node,
    position: {
      x: node.x,
      y: node.y,
    },
  }));
}