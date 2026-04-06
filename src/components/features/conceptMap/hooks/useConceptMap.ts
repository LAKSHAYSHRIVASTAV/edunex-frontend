import { create } from "zustand";
import { conceptMapAPI } from "../../../../services/conceptMapService";

/* ================= TYPES ================= */

type NodeType = {
  id: string;
  label: string;
  type?: string;
  position?: { x: number; y: number };
};

type EdgeType = {
  source: string;
  target: string;
  label?: string;
  type?: string;
};

type ConceptMap = {
  _id?: string;
  title?: string;
  summary?: string;
  nodes: NodeType[];
  edges: EdgeType[];
};

/* ================= GRAPH BUILDER ================= */

const buildGraph = (data: any) => {
  const nodes: NodeType[] = [];
  const edges: EdgeType[] = [];

  // Core
  nodes.push({
    id: "core",
    label: data.title || "Main Concept",
    type: "core",
    position: { x: 300, y: 200 },
  });

  // Inputs
  data.nodes?.forEach((n: any, i: number) => {
    const id = n.id || `node-${i}`;

    nodes.push({
      id,
      label: n.label || n.name,
      type: n.type || "concept",
      position: n.position || {
        x: 200 + Math.random() * 200,
        y: 100 + i * 80,
      },
    });
  });

  data.edges?.forEach((e: any) => {
    edges.push({
      source: e.source,
      target: e.target,
      label: e.label,
    });
  });

  return { nodes, edges };
};

/* ================= STORE ================= */

const useConceptMapStore = create<any>((set) => ({
  maps: [],
  currentMap: null,
  loading: false,
  generating: false,
  error: null,
  selectedNode: null,

  setSelectedNode: (node: NodeType | null) =>
    set({ selectedNode: node }),

  clearError: () => set({ error: null }),

  setCurrentMap: (map: ConceptMap) =>
    set({ currentMap: map, selectedNode: null }),

  /* ================= GENERATE ================= */

  generateMap: async (payload: any) => {
    set({ generating: true, error: null });

    try {
      // 🔥 FIX: correct response handling
      const response = await conceptMapAPI.generate(payload);

      const rawData = response.data; // ⚠️ IMPORTANT

      const graph = buildGraph(rawData);

      const finalMap: ConceptMap = {
        _id: rawData._id,
        title: rawData.title,
        summary: rawData.summary,
        nodes: graph.nodes,
        edges: graph.edges,
      };

      set((state: any) => ({
        maps: [finalMap, ...state.maps],
        currentMap: finalMap,
        generating: false,
      }));

      return finalMap;
    } catch (err: any) {
      console.error(err);

      set({
        generating: false,
        error: err.message || "Failed to generate map",
      });

      throw err;
    }
  },

  /* ================= FETCH ALL ================= */

  fetchMaps: async (userId: string) => {
    set({ loading: true, error: null });

    try {
      const res = await conceptMapAPI.getAll(userId);

      set({
        maps: res.data || [],
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || "Failed to fetch maps",
      });
    }
  },

  /* ================= FETCH ONE ================= */

  fetchMap: async (id: string) => {
    set({ loading: true, error: null });

    try {
      const response = await conceptMapAPI.getOne(id);
      const rawData = response.data;

      const graph = buildGraph(rawData);

      const finalMap: ConceptMap = {
        _id: rawData._id,
        title: rawData.title,
        summary: rawData.summary,
        nodes: graph.nodes,
        edges: graph.edges,
      };

      set({
        currentMap: finalMap,
        loading: false,
      });

      return finalMap;
    } catch (err: any) {
      set({
        loading: false,
        error: err.message || "Failed to fetch map",
      });
    }
  },

  /* ================= DELETE ================= */

  deleteMap: async (id: string) => {
    try {
      await conceptMapAPI.delete(id);

      set((state: any) => ({
        maps: state.maps.filter((m: any) => m._id !== id),
        currentMap:
          state.currentMap?._id === id ? null : state.currentMap,
      }));
    } catch (err: any) {
      set({
        error: err.message || "Failed to delete map",
      });
    }
  },
}));

export default useConceptMapStore;