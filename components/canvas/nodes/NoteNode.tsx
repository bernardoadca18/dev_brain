'use client';

import React, { useState } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Trash2 } from 'lucide-react';
import { NoteNodeData } from '@/types';
import { useCanvasStore } from '@/store/useCanvasStore';

export default function NoteNode({ id, data, selected }: { id: string, data: NoteNodeData, selected?: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [content, setContent] = useState(data.content);
  
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const setNodes = useCanvasStore((state) => state.setNodes);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    updateNodeData(id, { title, content });
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  return (
    <div 
      className={`bg-obsidian-card border rounded-xl shadow-lg w-64 transition-colors duration-200 group ${
        selected ? 'border-accent shadow-[0_0_15px_rgba(168,130,255,0.2)]' : 'border-obsidian-border'
      }`}
      style={{
        boxShadow: selected ? '0 0 15px var(--accent-color)' : undefined,
        borderColor: selected ? 'var(--accent-color)' : undefined,
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-obsidian-border hover:!bg-accent transition-colors" />
      
      <div className="p-4 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          {isEditing ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleBlur}
              className="nodrag bg-obsidian-bg text-obsidian-text font-bold text-sm w-full p-1 rounded border border-obsidian-border focus:outline-none focus:border-accent"
              autoFocus
            />
          ) : (
            <h3 className="text-obsidian-text font-bold text-sm leading-tight select-none">{title}</h3>
          )}
          <button 
            onClick={handleDelete}
            className="text-obsidian-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
          >
            <Trash2 size={14} />
          </button>
        </div>

        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleBlur}
            className="nodrag bg-obsidian-bg text-obsidian-text-muted text-xs w-full p-2 rounded border border-obsidian-border focus:outline-none focus:border-accent resize-none min-h-[80px]"
          />
        ) : (
          <div className="text-obsidian-text-muted text-xs whitespace-pre-wrap select-none leading-relaxed">
            {content}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-obsidian-border hover:!bg-accent transition-colors" />
    </div>
  );
}
