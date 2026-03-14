import React, { useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { GroupNodeData } from '@/types';
import { useCanvasStore } from '@/store/useCanvasStore';
import BaseNodeWrapper from './BaseNodeWrapper';

export default function GroupNode({ id, data, selected, width, height }: NodeProps & { data: GroupNodeData }) {
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
    <BaseNodeWrapper 
      id={id} 
      selected={selected} 
      width={width} 
      height={height} 
      isGroup={true} 
      hideHandles={true}
      defaultWidth={600}
      defaultHeight={400}
    >
      <div className="p-4 flex justify-between items-start bg-obsidian-bg/50 rounded-t-xl border-b border-obsidian-border/50 backdrop-blur-sm shrink-0">
        {isEditingTitle ? (
          <input
            type="text"
            defaultValue={data.title || ''}
            onBlur={handleTitleBlur}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="nodrag bg-obsidian-bg text-obsidian-text font-bold w-full p-2 rounded border border-obsidian-border focus:outline-none focus:border-accent"
            style={{ fontSize: 'calc(16px * var(--node-scale))' }}
            autoFocus
            placeholder="Group Title..."
          />
        ) : (
          <h3 
            className="text-obsidian-text font-bold leading-tight select-none cursor-text flex-1"
            style={{ fontSize: 'calc(16px * var(--node-scale))' }}
            onDoubleClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
          >
            {data.title || 'New Group'}
          </h3>
        )}
        <button 
          onClick={handleDelete}
          className="text-obsidian-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2 shrink-0"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
        </button>
      </div>
    </BaseNodeWrapper>
  );
}
