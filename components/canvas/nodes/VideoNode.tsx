'use client';

import React, { useState, useRef, memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { VideoNodeData } from '@/types';
import { Trash2, Upload, Video } from 'lucide-react';
import { useCanvasStore } from '@/store/useCanvasStore';
import BaseNodeWrapper from './BaseNodeWrapper';

function VideoNode({ id, data, selected, dragging, width, height }: NodeProps & { data: VideoNodeData }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const deleteNode = useCanvasStore((state) => state.deleteNode);

  const handleDelete = () => {
    deleteNode(id);
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditingTitle(false);
    updateNodeData(id, { title: e.target.value });
  };

  const handleDescBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsEditingDesc(false);
    updateNodeData(id, { description: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateNodeData(id, { videoUrl: url });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <BaseNodeWrapper id={id} selected={selected} dragging={dragging} width={width} height={height} defaultWidth={500} defaultHeight={400}>
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
              className="text-obsidian-text font-bold leading-tight select-none cursor-text flex-1 min-h-[20px]"
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

        <div className="flex-1 bg-obsidian-bg rounded-xl overflow-hidden flex flex-col items-center justify-center border border-obsidian-border relative group/video min-h-0">
          <input 
            type="file" 
            accept="video/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          
          {data.videoUrl ? (
            <div className="w-full h-full relative">
              <video 
                controls 
                src={data.videoUrl} 
                className="w-full h-full object-contain nodrag"
              />
              <div className="absolute top-2 right-2 opacity-0 group-hover/video:opacity-100 transition-opacity">
                <button 
                  onClick={triggerFileInput}
                  className="bg-obsidian-card/80 backdrop-blur-sm text-obsidian-text p-2 rounded-lg hover:bg-obsidian-border transition-colors border border-obsidian-border shadow-lg"
                  title="Replace Video"
                >
                  <Upload size={16} />
                </button>
              </div>
            </div>
          ) : (
            <button 
              onClick={triggerFileInput}
              className="text-obsidian-text-muted cursor-pointer w-full h-full flex flex-col items-center justify-center p-6 text-center hover:text-obsidian-text hover:bg-obsidian-border/50 transition-colors gap-3 border-2 border-dashed border-obsidian-border/50 rounded-xl m-4"
            >
              <Video size={48} className="opacity-50" />
              <div className="flex flex-col gap-1">
                <span className="font-medium text-lg" style={{ fontSize: 'calc(16px * var(--node-scale))' }}>Upload Video</span>
                <span className="text-sm opacity-70" style={{ fontSize: 'calc(12px * var(--node-scale))' }}>MP4, WebM, or Ogg</span>
              </div>
            </button>
          )}
        </div>

        <div className="shrink-0">
          {isEditingDesc ? (
            <textarea
              defaultValue={data.description || ''}
              onBlur={handleDescBlur}
              className="nodrag bg-obsidian-bg text-obsidian-text-muted w-full p-3 rounded border border-obsidian-border focus:outline-none focus:border-accent resize-none min-h-[60px]"
              style={{ fontSize: 'calc(14px * var(--node-scale))' }}
              autoFocus
              placeholder="Add description..."
            />
          ) : (
            <div 
              className="text-obsidian-text-muted whitespace-pre-wrap select-none leading-relaxed cursor-text min-h-[20px]"
              style={{ fontSize: 'calc(14px * var(--node-scale))' }}
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditingDesc(true); }}
            >
              {data.description || <span className="italic opacity-50">Double-click to add description</span>}
            </div>
          )}
        </div>
      </div>
    </BaseNodeWrapper>
  );
}

export default memo(VideoNode, (prevProps, nextProps) => {
  return (
    prevProps.selected === nextProps.selected &&
    prevProps.dragging === nextProps.dragging &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.data === nextProps.data
  );
});

