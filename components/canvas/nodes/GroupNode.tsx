import React, { useState } from 'react';
import { NodeProps, NodeResizer } from '@xyflow/react';
import { GroupNodeData } from '@/types';
import { useCanvasStore } from '@/store/useCanvasStore';

export default function GroupNode({ id, data, selected }: { id: string, data: GroupNodeData, selected?: boolean }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const setNodes = useCanvasStore((state) => state.setNodes);

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditingTitle(false);
    updateNodeData(id, { title: e.target.value });
  };

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  return (
    <>
      <NodeResizer 
        color="var(--accent-color)" 
        isVisible={selected} 
        minWidth={200} 
        minHeight={150} 
      />
      <div 
        className={`w-full h-full bg-obsidian-card/30 border-2 rounded-xl transition-colors duration-200 group ${
          selected ? 'border-accent shadow-[0_0_15px_rgba(168,130,255,0.1)]' : 'border-obsidian-border/50'
        }`}
        style={{
          borderColor: selected ? 'var(--accent-color)' : undefined,
        }}
      >
        <div className="p-2 flex justify-between items-start bg-obsidian-bg/50 rounded-t-xl border-b border-obsidian-border/50 backdrop-blur-sm">
          {isEditingTitle ? (
            <input
              type="text"
              defaultValue={data.title || ''}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              className="nodrag bg-obsidian-bg text-obsidian-text font-bold text-sm w-full p-1 rounded border border-obsidian-border focus:outline-none focus:border-accent"
              autoFocus
              placeholder="Group Title..."
            />
          ) : (
            <h3 
              className="text-obsidian-text font-bold text-sm leading-tight select-none cursor-text flex-1"
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
            >
              {data.title || 'New Group'}
            </h3>
          )}
          <button 
            onClick={handleDelete}
            className="text-obsidian-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
          </button>
        </div>
      </div>
    </>
  );
}
