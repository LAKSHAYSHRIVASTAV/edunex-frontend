import { create } from "zustand";
import { conceptMapAPI } from "../../../../services/conceptMapService";
import type { ConceptEdge, ConceptNode } from "../utils/layout";

type ConceptMap = {
  _id?: string;
  title?: string;
  summary?: string;
  createdAt?: string;
  tags?: string[];
  nodes: ConceptNode[];
  edges: ConceptEdge[];
};

const unwrapResponse = (response: any) => response?.data || response?.map || response;

const makeId = (value: any, fallback: string) =>
  String(value?.id || value?._id || value?.key || fallback);

const normalizeMap = (response: any): ConceptMap => {
  const data = unwrapResponse(response) || {};
  const sourceNodes = Array.isArray(data.nodes) ? data.nodes : [];
  const sourceEdges = Array.isArray(data.edges) ? data.edges : [];

  const normalizedNodes: ConceptNode[] = sourceNodes.map((node: any, index: number) => ({
    id: makeId(node, `node-${index + 1}`),
    label: node.label || node.name || node.title || `Concept ${index + 1}`,
    type: node.type || node.category || "concept",
    description: node.description || node.summary || node.details,
    position: node.position,
  }));

  const hasCore = normalizedNodes.some((node) => node.type === "core" || node.id === "core");
  const nodes = hasCore
    ? normalizedNodes
    : [
        {
          id: "core",
          label: data.title || data.topic || "Main Concept",
          type: "core",
          description: data.summary,
        },
        ...normalizedNodes,
      ];

  const nodeIds = new Set(nodes.map((node) => node.id));
  const edges = sourceEdges
    .map((edge: any, index: number) => ({
      id: edge.id || edge._id || `edge-${index + 1}`,
      source: String(edge.source || edge.from || "core"),
      target: String(edge.target || edge.to || ""),
      label: edge.label || edge.relationship || edge.relation || "relates to",
      type: edge.type,
    }))
    .filter((edge: ConceptEdge) => nodeIds.has(edge.source) && nodeIds.has(edge.target));

  if (!sourceEdges.length && nodes.length > 1) {
    nodes.slice(1).forEach((node, index) => {
      edges.push({
        id: `core-edge-${index + 1}`,
        source: "core",
        target: node.id,
        label: "includes",
      });
    });
  }

  return {
    _id: data._id || data.id,
    title: data.title || data.topic || nodes[0]?.label || "Concept Map",
    summary: data.summary || data.description,
    createdAt: data.createdAt,
    tags: data.tags,
    nodes,
    edges,
  };
};

const normalizeMaps = (response: any) => {
  const data = unwrapResponse(response);
  const maps = Array.isArray(data) ? data : data?.maps || [];
  return maps.map(normalizeMap);
};

const useConceptMapStore = create<any>((set) => ({
  maps: [],
  currentMap: null,
  loading: false,
  generating: false,
  error: null,
  selectedNode: null,

  setSelectedNode: (node: ConceptNode | null) => set({ selectedNode: node }),
  clearError: () => set({ error: null }),
  setCurrentMap: (map: ConceptMap) => set({ currentMap: normalizeMap(map), selectedNode: null }),

  generateMap: async (payload: any) => {
    set({ generating: true, error: null });

    try {
      const response = await conceptMapAPI.generate(payload);
      const finalMap = normalizeMap(response);

      set((state: any) => ({
        maps: [finalMap, ...state.maps],
        currentMap: finalMap,
        selectedNode: null,
        generating: false,
      }));

      return finalMap;
    } catch (err: any) {
      set({
        generating: false,
        error: err?.response?.data?.message || err.message || "Failed to generate map",
      });

      throw err;
    }
  },

  fetchMaps: async (userId: string) => {
    set({ loading: true, error: null });

    try {
      const response = await conceptMapAPI.getAll(userId);
      set({ maps: normalizeMaps(response), loading: false });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || err.message || "Failed to fetch maps",
      });
    }
  },

  fetchMap: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await conceptMapAPI.getOne(id);
      const finalMap = normalizeMap(response);
      set({ currentMap: finalMap, selectedNode: null, loading: false });
      return finalMap;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || err.message || "Failed to fetch map",
      });
    }
  },

  deleteMap: async (id: string) => {
    try {
      await conceptMapAPI.delete(id);

      set((state: any) => ({
        maps: state.maps.filter((map: ConceptMap) => map._id !== id),
        currentMap: state.currentMap?._id === id ? null : state.currentMap,
        selectedNode: state.currentMap?._id === id ? null : state.selectedNode,
      }));
    } catch (err: any) {
      set({
        error: err?.response?.data?.message || err.message || "Failed to delete map",
      });
    }
  },
}));

export default useConceptMapStore;
