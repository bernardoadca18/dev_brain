import React, { useState } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { ImageNodeData } from '@/types';
import { Trash2 } from 'lucide-react';
import { useCanvasStore } from '@/store/useCanvasStore';

export default function ImageNode({ id, data, selected }: { id: string, data: ImageNodeData, selected?: boolean }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isEditingUrl, setIsEditingUrl] = useState(!data.imageUrl);

  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const setNodes = useCanvasStore((state) => state.setNodes);

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditingTitle(false);
    updateNodeData(id, { title: e.target.value });
  };

  const handleDescBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsEditingDesc(false);
    updateNodeData(id, { description: e.target.value });
  };

  const handleUrlBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditingUrl(false);
    updateNodeData(id, { imageUrl: e.target.value });
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
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-obsidian-border hover:!bg-accent transition-colors" />
      
      <div className="p-3 flex flex-col gap-2">
        <div className="flex justify-between items-start">
          {isEditingTitle ? (
            <input
              type="text"
              defaultValue={data.title || ''}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              className="nodrag bg-obsidian-bg text-obsidian-text font-bold text-sm w-full p-1 rounded border border-obsidian-border focus:outline-none focus:border-accent"
              autoFocus
              placeholder="Add title..."
            />
          ) : (
            <h3 
              className="text-obsidian-text font-bold text-sm leading-tight select-none cursor-text flex-1 min-h-[20px]"
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
            >
              {data.title || <span className="text-obsidian-text-muted italic">Double-click to add title</span>}
            </h3>
          )}
          <button 
            onClick={handleDelete}
            className="text-obsidian-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="w-full bg-obsidian-bg rounded overflow-hidden min-h-[100px] flex items-center justify-center border border-obsidian-border relative">
          {isEditingUrl ? (
            <input
              type="text"
              defaultValue={data.imageUrl || ''}
              onBlur={handleUrlBlur}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              className="nodrag bg-obsidian-card text-obsidian-text text-xs w-11/12 p-2 rounded border border-obsidian-border focus:outline-none focus:border-accent absolute z-10"
              autoFocus
              placeholder="Paste image URL..."
            />
          ) : data.imageUrl ? (
            <img 
              src={data.imageUrl} 
              alt={data.title || 'Node image'} 
              className="w-full h-auto object-cover"
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditingUrl(true); }}
            />
          ) : (
            <div 
              className="text-obsidian-text-muted text-xs cursor-pointer w-full h-full flex items-center justify-center p-4 text-center"
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditingUrl(true); }}
            >
              Double-click to add image URL
            </div>
          )}
        </div>

        {isEditingDesc ? (
          <textarea
            defaultValue={data.description || ''}
            onBlur={handleDescBlur}
            className="nodrag bg-obsidian-bg text-obsidian-text-muted text-xs w-full p-2 rounded border border-obsidian-border focus:outline-none focus:border-accent resize-none min-h-[60px]"
            autoFocus
            placeholder="Add description..."
          />
        ) : (
          <div 
            className="text-obsidian-text-muted text-xs whitespace-pre-wrap select-none leading-relaxed cursor-text min-h-[20px]"
            onDoubleClick={(e) => { e.stopPropagation(); setIsEditingDesc(true); }}
          >
            {data.description || <span className="italic opacity-50">Double-click to add description</span>}
          </div>
        )}
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-obsidian-border hover:!bg-accent transition-colors" />
    </div>
  );
}
