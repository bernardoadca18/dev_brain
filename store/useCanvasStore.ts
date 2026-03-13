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

interface CanvasState {
  nodes: AppNode[];
  edges: Edge[];
  accentColor: string;
  hasInitialized: boolean;
  onNodesChange: OnNodesChange<AppNode>;
  onEdgesChange: OnEdgesChange;
  onConnect: OnConnect;
  setNodes: (nodes: AppNode[] | ((nds: AppNode[]) => AppNode[])) => void;
  setEdges: (edges: Edge[] | ((eds: Edge[]) => Edge[])) => void;
  setAccentColor: (color: string) => void;
  updateNodeData: (id: string, data: any) => void;
  setHasInitialized: (val: boolean) => void;
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
      onNodesChange: (changes: NodeChange<AppNode>[]) => {
        set({
          nodes: applyNodeChanges(changes, get().nodes),
        });
      },
      onEdgesChange: (changes: EdgeChange[]) => {
        set({
          edges: applyEdgeChanges(changes, get().edges),
        });
      },
      onConnect: (connection: Connection) => {
        set({
          edges: addEdge(connection, get().edges),
        });
      },
      setNodes: (nodes) => {
        set({
          nodes: typeof nodes === 'function' ? nodes(get().nodes) : nodes,
        });
      },
      setEdges: (edges) => {
        set({
          edges: typeof edges === 'function' ? edges(get().edges) : edges,
        });
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
      },
      setHasInitialized: (val: boolean) => {
        set({ hasInitialized: val });
      },
    }),
    {
      name: 'dev_brain_canvas_storage',
      storage: createJSONStorage(() => typeof window !== 'undefined' ? localStorage : dummyStorage),
    }
  )
);
