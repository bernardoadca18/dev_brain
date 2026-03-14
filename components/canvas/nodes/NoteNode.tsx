'use client';

import React, { useState, memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { Trash2 } from 'lucide-react';
import { NoteNodeData } from '@/types';
import { useCanvasStore } from '@/store/useCanvasStore';
import BaseNodeWrapper from './BaseNodeWrapper';

function NoteNode({ id, data, selected, dragging, width, height }: NodeProps & { data: NoteNodeData }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingContent, setIsEditingContent] = useState(false);
  
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const deleteNode = useCanvasStore((state) => state.deleteNode);

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditingTitle(false);
    updateNodeData(id, { title: e.target.value });
  };

  const handleContentBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsEditingContent(false);
    updateNodeData(id, { content: e.target.value });
  };

  return (
    <BaseNodeWrapper id={id} selected={selected} dragging={dragging} width={width} height={height} defaultWidth={400} defaultHeight={300}>
      <div className="p-6 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-start shrink-0">
          {isEditingTitle ? (
            <input
              type="text"
              defaultValue={data.title || ''}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              className="nodrag bg-obsidian-bg text-obsidian-text font-bold w-full p-2 rounded border border-obsidian-border focus:outline-none focus:border-accent"
              style={{ fontSize: 'calc(16px * var(--node-scale))' }}
              autoFocus
              placeholder="Add title..."
            />
          ) : (
            <h3 
              className="text-obsidian-text font-bold leading-tight select-none cursor-text flex-1"
              style={{ fontSize: 'calc(16px * var(--node-scale))' }}
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
            >
              {data.title || <span className="text-obsidian-text-muted italic">Double-click to add title</span>}
            </h3>
          )}
          <button 
            onClick={handleDelete}
            className="text-obsidian-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2 shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
          {isEditingContent ? (
            <textarea
              defaultValue={data.content || ''}
              onBlur={handleContentBlur}
              className="nodrag bg-obsidian-bg text-obsidian-text-muted w-full h-full p-3 rounded border border-obsidian-border focus:outline-none focus:border-accent resize-none"
              style={{ fontSize: 'calc(14px * var(--node-scale))' }}
              autoFocus
              placeholder="Add content..."
            />
          ) : (
            <div 
              className="text-obsidian-text-muted whitespace-pre-wrap select-none leading-relaxed cursor-text h-full"
              style={{ fontSize: 'calc(14px * var(--node-scale))' }}
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditingContent(true); }}
            >
              {data.content || <span className="italic opacity-50">Double-click to add content</span>}
            </div>
          )}
        </div>
      </div>
    </BaseNodeWrapper>
  );
}

export default memo(NoteNode);
