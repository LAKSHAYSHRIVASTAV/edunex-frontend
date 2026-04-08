export type LayoutMode = "map" | "tree" | "radial" | "timeline";

export type ConceptNode = {
  id: string;
  label: string;
  type?: string;
  description?: string;
  position?: { x: number; y: number };
};

export type ConceptEdge = {
  id?: string;
  source: string;
  target: string;
  label?: string;
  type?: string;
};

const getNodeDepths = (nodes: ConceptNode[], edges: ConceptEdge[]) => {
  const firstNode = nodes[0]?.id;
  const coreNode = nodes.find((node) => node.type === "core")?.id || firstNode;
  const depths = new Map<string, number>();

  if (!coreNode) return depths;

  const adjacency = new Map<string, string[]>();
  nodes.forEach((node) => adjacency.set(node.id, []));
  edges.forEach((edge) => {
    adjacency.get(edge.source)?.push(edge.target);
    adjacency.get(edge.target)?.push(edge.source);
  });

  const queue = [coreNode];
  depths.set(coreNode, 0);

  while (queue.length) {
    const nodeId = queue.shift() as string;
    const nextDepth = (depths.get(nodeId) || 0) + 1;

    adjacency.get(nodeId)?.forEach((neighbor) => {
      if (!depths.has(neighbor)) {
        depths.set(neighbor, nextDepth);
        queue.push(neighbor);
      }
    });
  }

  nodes.forEach((node) => {
    if (!depths.has(node.id)) depths.set(node.id, 1);
  });

  return depths;
};

export function getLayoutedNodes(
  nodes: ConceptNode[],
  edges: ConceptEdge[],
  mode: LayoutMode,
  width = 920,
  height = 620
) {
  if (!nodes.length) return [];

  if (mode === "timeline") {
    const step = Math.max(170, width / Math.max(nodes.length, 1));
    return nodes.map((node, index) => ({
      ...node,
      position: {
        x: 80 + index * step,
        y: height / 2 + (index % 2 === 0 ? -70 : 70),
      },
    }));
  }

  const depths = getNodeDepths(nodes, edges);
  const grouped = nodes.reduce<Record<number, ConceptNode[]>>((acc, node) => {
    const depth = depths.get(node.id) || 0;
    acc[depth] = acc[depth] || [];
    acc[depth].push(node);
    return acc;
  }, {});

  if (mode === "tree") {
    const depthKeys = Object.keys(grouped).map(Number).sort((a, b) => a - b);
    const columnGap = Math.max(190, width / Math.max(depthKeys.length + 1, 2));

    return depthKeys.flatMap((depth, depthIndex) => {
      const levelNodes = grouped[depth];
      const rowGap = Math.max(110, height / Math.max(levelNodes.length + 1, 2));

      return levelNodes.map((node, rowIndex) => ({
        ...node,
        position: {
          x: 80 + depthIndex * columnGap,
          y: rowGap * (rowIndex + 1),
        },
      }));
    });
  }

  if (mode === "radial") {
    const center = { x: width / 2, y: height / 2 };
    const maxDepth = Math.max(...Array.from(depths.values()), 1);
    const radiusStep = Math.min(width, height) / (maxDepth + 2);

    return Object.keys(grouped).flatMap((depthKey) => {
      const depth = Number(depthKey);
      const levelNodes = grouped[depth];

      return levelNodes.map((node, index) => {
        if (depth === 0) return { ...node, position: center };

        const angle = (Math.PI * 2 * index) / levelNodes.length - Math.PI / 2;
        const radius = radiusStep * depth;

        return {
          ...node,
          position: {
            x: center.x + Math.cos(angle) * radius,
            y: center.y + Math.sin(angle) * radius,
          },
        };
      });
    });
  }

  const center = { x: width / 2, y: height / 2 };
  const core = nodes.find((node) => node.type === "core") || nodes[0];
  const others = nodes.filter((node) => node.id !== core.id);
  const radius = Math.min(width, height) * 0.34;

  return [
    { ...core, position: center },
    ...others.map((node, index) => {
      const angle = (Math.PI * 2 * index) / Math.max(others.length, 1) - Math.PI / 2;
      return {
        ...node,
        position: {
          x: center.x + Math.cos(angle) * radius,
          y: center.y + Math.sin(angle) * radius,
        },
      };
    }),
  ];
}
