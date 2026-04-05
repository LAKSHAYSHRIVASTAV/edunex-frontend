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

/* ================= STORE ================= */

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
      const res = await conceptMapAPI.generate(payload);
      const newMap = res.data;

      set((state) => ({
        maps: [newMap, ...state.maps],
        currentMap: newMap,
        generating: false,
      }));

      return newMap;
    } catch (err: any) {
      console.error("Generate Map Error:", err);

      set({
        generating: false,
        error: err?.response?.data?.message || err.message,
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
        maps: res.data,
        loading: false,
      });
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || err.message,
      });
    }
  },

  /* ================= FETCH ONE ================= */

  fetchMap: async (id) => {
    set({ loading: true, error: null });

    try {
      const res = await conceptMapAPI.getOne(id);

      set({
        currentMap: res.data,
        loading: false,
      });

      return res.data;
    } catch (err: any) {
      set({
        loading: false,
        error: err?.response?.data?.message || err.message,
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
        error: err?.response?.data?.message || err.message,
      });
    }
  },
}));

export default useConceptMapStore;