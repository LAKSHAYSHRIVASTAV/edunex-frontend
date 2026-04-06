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

  // Core node
  nodes.push({
    id: "core",
    label: data.core || data.title || "Main Concept",
    type: "core",
    position: { x: 300, y: 200 },
  });

  // Inputs
  data.inputs?.forEach((item: string, i: number) => {
    const id = `input-${i}`;
    nodes.push({
      id,
      label: item,
      type: "input",
      position: { x: 100, y: 80 + i * 80 },
    });

    edges.push({
      source: id,
      target: "core",
      label: "input",
    });
  });

  // Outputs
  data.outputs?.forEach((item: string, i: number) => {
    const id = `output-${i}`;
    nodes.push({
      id,
      label: item,
      type: "output",
      position: { x: 500, y: 80 + i * 80 },
    });

    edges.push({
      source: "core",
      target: id,
      label: "produces",
    });
  });

  // Byproducts
  data.byproducts?.forEach((item: string, i: number) => {
    const id = `by-${i}`;
    nodes.push({
      id,
      label: item,
      type: "byproduct",
      position: { x: 300, y: 400 + i * 80 },
    });

    edges.push({
      source: "core",
      target: id,
      label: "releases",
    });
  });

  return { nodes, edges };
};

/* ================= STORE ================= */

type ConceptMapStore = {
  maps: ConceptMap[];
  currentMap: ConceptMap | null;
  loading: boolean;
  generating: boolean;
  error: string | null;
  selectedNode: NodeType | null;

  setSelectedNode: (node: NodeType | null) => void;
  clearError: () => void;
  setCurrentMap: (map: ConceptMap) => void;

  generateMap: (payload: {
    text?: string;
    topic?: string;
    userId?: string;
  }) => Promise<ConceptMap>;

  fetchMaps: (userId: string) => Promise<void>;
  fetchMap: (id: string) => Promise<ConceptMap | void>;
  deleteMap: (id: string) => Promise<void>;
};

const useConceptMapStore = create<ConceptMapStore>((set, get) => ({
  maps: [],
  currentMap: null,
  loading: false,
  generating: false,
  error: null,
  selectedNode: null,

  /* ================= UI ================= */

  setSelectedNode: (node) => set({ selectedNode: node }),

  clearError: () => set({ error: null }),

  setCurrentMap: (map) =>
    set({ currentMap: map, selectedNode: null }),

  /* ================= GENERATE ================= */

  generateMap: async (payload) => {
    set({ generating: true, error: null });

    try {
      // ✅ FIXED API CALL
      const rawData = await conceptMapAPI.generate(payload);

      // ✅ TRANSFORM TO GRAPH
      const graph = buildGraph(rawData);

      const finalMap: ConceptMap = {
        _id: rawData._id,
        title: rawData.title || rawData.core,
        summary: rawData.summary,
        nodes: graph.nodes,
        edges: graph.edges,
      };

      set((state) => ({
        maps: [finalMap, ...state.maps],
        currentMap: finalMap,
        generating: false,
      }));

      return finalMap;
    } catch (err: any) {
      console.error("Generate Map Error:", err);

      set({
        generating: false,
        error: err.message || "Failed to generate map",
      });

      throw err;
    }
  },

  /* ================= FETCH ALL ================= */

  fetchMaps: async (userId) => {
    set({ loading: true, error: null });

    try {
      const res = await conceptMapAPI.getAll(userId);

      set({
        maps: res,
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

  fetchMap: async (id) => {
    set({ loading: true, error: null });

    try {
      const rawData = await conceptMapAPI.getOne(id);

      const graph = buildGraph(rawData);

      const finalMap: ConceptMap = {
        _id: rawData._id,
        title: rawData.title || rawData.core,
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

  deleteMap: async (id) => {
    try {
      await conceptMapAPI.delete(id);

      set((state) => ({
        maps: state.maps.filter((m) => m._id !== id),
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