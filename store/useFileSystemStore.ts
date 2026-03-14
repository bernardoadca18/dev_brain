import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { idbStorage } from './idbStorage';
import { FileSystemNode, FolderNode, CanvasFileNode, AppNode } from '@/types';
import { Edge } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';

interface FileSystemState {
  fileTree: FileSystemNode[];
  activeFileId: string | null;
  setActiveFileId: (id: string | null) => void;
  addFolder: (parentId: string | null, name: string) => void;
  addCanvas: (parentId: string | null, name: string) => void;
  updateCanvasData: (id: string, data: { nodes: AppNode[]; edges: Edge[]; accentColor: string }) => void;
  toggleFolder: (id: string) => void;
  renameNode: (id: string, newName: string) => void;
  deleteNode: (id: string) => void;
}

const updateNodeInTree = (
  tree: FileSystemNode[],
  id: string,
  updater: (node: FileSystemNode) => FileSystemNode
): FileSystemNode[] => {
  return tree.map((node) => {
    if (node.id === id) {
      return updater(node);
    }
    if (node.type === 'folder') {
      return {
        ...node,
        children: updateNodeInTree(node.children, id, updater),
      };
    }
    return node;
  });
};

const deleteNodeInTree = (tree: FileSystemNode[], id: string): FileSystemNode[] => {
  return tree
    .filter((node) => node.id !== id)
    .map((node) => {
      if (node.type === 'folder') {
        return {
          ...node,
          children: deleteNodeInTree(node.children, id),
        };
      }
      return node;
    });
};

const addNodeToTree = (
  tree: FileSystemNode[],
  parentId: string | null,
  newNode: FileSystemNode
): FileSystemNode[] => {
  if (!parentId) {
    return [...tree, newNode];
  }
  return tree.map((node) => {
    if (node.id === parentId && node.type === 'folder') {
      return {
        ...node,
        children: [...node.children, newNode],
        isExpanded: true,
      };
    }
    if (node.type === 'folder') {
      return {
        ...node,
        children: addNodeToTree(node.children, parentId, newNode),
      };
    }
    return node;
  });
};

export const useFileSystemStore = create<FileSystemState>()(
  persist(
    (set, get) => ({
      fileTree: [
        {
          id: 'root-canvas',
          name: 'Welcome Canvas',
          type: 'canvas',
          canvasData: {
            nodes: [],
            edges: [],
            accentColor: '#a882ff',
          },
        },
      ],
      activeFileId: 'root-canvas',
      setActiveFileId: (id) => set({ activeFileId: id }),
      addFolder: (parentId, name) => {
        const newFolder: FolderNode = {
          id: uuidv4(),
          name,
          type: 'folder',
          children: [],
          isExpanded: true,
        };
        set({ fileTree: addNodeToTree(get().fileTree, parentId, newFolder) });
      },
      addCanvas: (parentId, name) => {
        const newCanvas: CanvasFileNode = {
          id: uuidv4(),
          name,
          type: 'canvas',
          canvasData: {
            nodes: [],
            edges: [],
            accentColor: '#a882ff',
          },
        };
        set({
          fileTree: addNodeToTree(get().fileTree, parentId, newCanvas),
          activeFileId: newCanvas.id,
        });
      },
      updateCanvasData: (id, data) => {
        set({
          fileTree: updateNodeInTree(get().fileTree, id, (node) => {
            if (node.type === 'canvas') {
              return { ...node, canvasData: data };
            }
            return node;
          }),
        });
      },
      toggleFolder: (id) => {
        set({
          fileTree: updateNodeInTree(get().fileTree, id, (node) => {
            if (node.type === 'folder') {
              return { ...node, isExpanded: !node.isExpanded };
            }
            return node;
          }),
        });
      },
      renameNode: (id, newName) => {
        set({
          fileTree: updateNodeInTree(get().fileTree, id, (node) => ({ ...node, name: newName })),
        });
      },
      deleteNode: (id) => {
        set((state) => {
          const newTree = deleteNodeInTree(state.fileTree, id);
          return {
            fileTree: newTree,
            activeFileId: state.activeFileId === id ? null : state.activeFileId,
          };
        });
      },
    }),
    {
      name: 'dev_brain_filesystem',
      storage: createJSONStorage(() => idbStorage),
    }
  )
);
