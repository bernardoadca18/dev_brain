import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import {
  Connection,
  Edge,
  EdgeChange,
  NodeChange,
  addEdge,
  OnNodesChange,
  OnEdgesChange,
  OnConnect,
  applyNodeChanges,
  applyEdgeChanges,
} from '@xyflow/react';
import { AppNode } from '@/types';

interface HistoryState {
  nodes: AppNode[];
  edges: Edge[];
}

interface CanvasState {
  nodes: AppNode[];
  edges: Edge[];
  accentColor: string;
  hasInitialized: boolean;
  selectedNodeId: string | null;
  history: HistoryState[];
  historyIndex: number;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[] | ((nds: AppNode[]) => AppNode[])) => void;
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void;
  setAccentColor: (color: string) => void;
  updateNodeData: (id: string, data: any) => void;
  setHasInitialized: (val: boolean) => void;
  setSelectedNodeId: (id: string | null) => void;
  deleteNode: (id: string) => void;
  saveHistory: () => void;
  undo: () => void;
  redo: () => void;
}

const dummyStorage: StateStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      accentColor: '#a882ff',
      hasInitialized: false,
      selectedNodeId: null,
      history: [],
      historyIndex: -1,
      
      saveHistory: () => {
        const { nodes, edges, history, historyIndex } = get();
        const newState = { nodes, edges };
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(newState);
        
        // Keep last 50 states
        if (newHistory.length > 50) {
          newHistory.shift();
        }
        
        set({
          history: newHistory,
          historyIndex: newHistory.length - 1,
        });
      },
      
      undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
          const newIndex = historyIndex - 1;
          const previousState = history[newIndex];
          set({
            nodes: previousState.nodes,
            edges: previousState.edges,
            historyIndex: newIndex,
          });
        }
      },
      
      redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
          const newIndex = historyIndex + 1;
          const nextState = history[newIndex];
          set({
            nodes: nextState.nodes,
            edges: nextState.edges,
            historyIndex: newIndex,
          });
        }
      },

      onNodesChange: (changes: NodeChange<AppNode>[]) => {
        const oldNodes = get().nodes;
        const newNodes = applyNodeChanges(changes, oldNodes);
        set({ nodes: newNodes });
        
        // Save history on drag end or specific changes
        const isSignificantChange = changes.some(
          (c) => c.type === 'position' && !c.dragging || c.type === 'remove' || c.type === 'add'
        );
        if (isSignificantChange) {
          get().saveHistory();
        }

        // Clear selectedNodeId if the selected node is removed
        const removedNodeIds = changes.filter(c => c.type === 'remove').map(c => c.id);
        if (get().selectedNodeId && removedNodeIds.includes(get().selectedNodeId!)) {
          set({ selectedNodeId: null });
        }
      },
      
      onEdgesChange: (changes: EdgeChange[]) => {
        const oldEdges = get().edges;
        const newEdges = applyEdgeChanges(changes, oldEdges);
        set({ edges: newEdges });
        
        const isSignificantChange = changes.some((c) => c.type === 'remove' || c.type === 'add');
        if (isSignificantChange) {
          get().saveHistory();
        }
      },
      
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
        get().saveHistory();
      },
      
      setNodes: (nodes) => {
        set({
          nodes: typeof nodes === 'function' ? nodes(get().nodes) : nodes,
        });
        get().saveHistory();
      },
      
      setEdges: (edges) => {
        set({
          edges: typeof edges === 'function' ? edges(get().edges) : edges,
        });
        get().saveHistory();
      },
      
      setAccentColor: (color: string) => {
        set({ accentColor: color });
      },
      
      updateNodeData: (id: string, data: any) => {
        set({
          nodes: get().nodes.map((node) => {
            if (node.id === id) {
              return { ...node, data: { ...node.data, ...data } };
            }
            return node;
          }),
        });
        get().saveHistory();
      },
      
      setHasInitialized: (val: boolean) => {
        set({ hasInitialized: val });
        if (val && get().history.length === 0) {
          get().saveHistory();
        }
      },
      
      setSelectedNodeId: (id: string | null) => {
        set({ selectedNodeId: id });
      },
      
      deleteNode: (id: string) => {
        set({
          nodes: get().nodes.filter((n) => n.id !== id),
          edges: get().edges.filter((e) => e.source !== id && e.target !== id),
          selectedNodeId: get().selectedNodeId === id ? null : get().selectedNodeId,
        });
        get().saveHistory();
      },
    }),
    {
      name: 'dev_brain_canvas_storage',
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : dummyStorage),
      partialize: (state) => ({
        nodes: state.nodes,
        edges: state.edges,
        accentColor: state.accentColor,
        hasInitialized: state.hasInitialized,
      }),
    }
  )
);
