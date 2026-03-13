import React from 'react';
import { Panel, useReactFlow } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { useCanvasStore } from '@/store/useCanvasStore';

export default function CanvasToolbar() {
  const { screenToFlowPosition } = useReactFlow();
  const setNodes = useCanvasStore((state) => state.setNodes);

  return (
    <Panel position="top-center" className="bg-obsidian-card p-2 rounded-xl border border-obsidian-border shadow-lg flex items-center gap-2 mt-4">
      <button 
        onClick={() => {
          const position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          setNodes((nds) => nds.concat({ id: uuidv4(), type: 'note', position, data: { title: 'New Note', content: 'Double click to edit...' } }));
        }}
        className="px-3 py-1.5 text-sm font-medium text-obsidian-text hover:bg-obsidian-border rounded transition-colors"
      >
        + Note
      </button>
      <button 
        onClick={() => {
          const position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          setNodes((nds) => nds.concat({ id: uuidv4(), type: 'task', position, data: { title: 'New Task List', tasks: [] } }));
        }}
        className="px-3 py-1.5 text-sm font-medium text-obsidian-text hover:bg-obsidian-border rounded transition-colors"
      >
        + Task List
      </button>
      <button 
        onClick={() => {
          const position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          setNodes((nds) => nds.concat({ id: uuidv4(), type: 'image', position, data: { imageUrl: '' } }));
        }}
        className="px-3 py-1.5 text-sm font-medium text-obsidian-text hover:bg-obsidian-border rounded transition-colors"
      >
        + Image
      </button>
      <button 
        onClick={() => {
          const position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
          setNodes((nds) => nds.concat({ 
            id: uuidv4(), 
            type: 'group', 
            position, 
            data: { title: 'New Group' },
            style: { width: 400, height: 300 }
          }));
        }}
        className="px-3 py-1.5 text-sm font-medium text-obsidian-text hover:bg-obsidian-border rounded transition-colors"
      >
        + Group
      </button>
    </Panel>
  );
}
