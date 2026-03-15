import { useEffect, useRef } from 'react';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useFileSystemStore } from '@/store/useFileSystemStore';

export function useAutoSave() {
  const { nodes, edges, accentColor } = useCanvasStore();
  const { activeFileId, updateCanvasData } = useFileSystemStore();
  
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const prevActiveFileIdRef = useRef(activeFileId);

  useEffect(() => {
    if (!activeFileId) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      updateCanvasData(activeFileId, { nodes, edges, accentColor });
    }, 1000);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [nodes, edges, accentColor, activeFileId, updateCanvasData]);

  // Handle saving when switching files or unmounting
  useEffect(() => {
    prevActiveFileIdRef.current = activeFileId;
    return () => {
      if (prevActiveFileIdRef.current) {
        updateCanvasData(prevActiveFileIdRef.current, { 
          nodes: useCanvasStore.getState().nodes, 
          edges: useCanvasStore.getState().edges, 
          accentColor: useCanvasStore.getState().accentColor 
        });
      }
    };
  }, [activeFileId, updateCanvasData]);
}
