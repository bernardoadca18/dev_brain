import React, { memo } from 'react';
import { Panel, useReactFlow } from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import { useCanvasStore } from '@/store/useCanvasStore';
import { Mic, Video, FileAudio, Type, Image as ImageIcon, CheckSquare, FileText, LayoutGrid } from 'lucide-react';
import { AppNode } from '@/types';

function CanvasToolbar() {
  const { screenToFlowPosition } = useReactFlow();
  const setNodes = useCanvasStore((state) => state.setNodes);
  const accentColor = useCanvasStore((state) => state.accentColor);
  const setAccentColor = useCanvasStore((state) => state.setAccentColor);

  const createNode = (type: AppNode['type'], defaultData: any, defaultStyle?: any) => {
    const position = screenToFlowPosition({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
    setNodes((nds) => nds.concat({ 
      id: uuidv4(), 
      type, 
      position, 
      data: defaultData,
      ...(defaultStyle ? { style: defaultStyle } : {})
    } as AppNode));
  };

  return (
    <Panel position="top-center" className="bg-obsidian-card p-2 rounded-xl border border-obsidian-border shadow-lg flex items-center gap-1 mt-4">
      <button 
        onClick={() => createNode('note', { title: 'New Note', content: 'Double click to edit...' })}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-obsidian-text hover:bg-obsidian-border hover:text-accent rounded-lg transition-colors"
        title="Add Note"
      >
        <FileText size={16} />
        <span className="hidden sm:inline">Note</span>
      </button>
      <button 
        onClick={() => createNode('task', { title: 'New Task List', tasks: [] })}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-obsidian-text hover:bg-obsidian-border hover:text-accent rounded-lg transition-colors"
        title="Add Task List"
      >
        <CheckSquare size={16} />
        <span className="hidden sm:inline">Tasks</span>
      </button>
      <button 
        onClick={() => createNode('image', { imageUrl: '' })}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-obsidian-text hover:bg-obsidian-border hover:text-accent rounded-lg transition-colors"
        title="Add Image"
      >
        <ImageIcon size={16} />
        <span className="hidden sm:inline">Image</span>
      </button>
      <button 
        onClick={() => createNode('audio', { audioUrl: '' })}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-obsidian-text hover:bg-obsidian-border hover:text-accent rounded-lg transition-colors"
        title="Add Audio"
      >
        <FileAudio size={16} />
        <span className="hidden sm:inline">Audio</span>
      </button>
      <button 
        onClick={() => createNode('video', { videoUrl: '' })}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-obsidian-text hover:bg-obsidian-border hover:text-accent rounded-lg transition-colors"
        title="Add Video"
      >
        <Video size={16} />
        <span className="hidden sm:inline">Video</span>
      </button>
      <button 
        onClick={() => createNode('speechToText', { transcript: '' })}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-obsidian-text hover:bg-obsidian-border hover:text-accent rounded-lg transition-colors"
        title="Add Voice Memo"
      >
        <Mic size={16} />
        <span className="hidden sm:inline">Dictate</span>
      </button>
      <div className="w-px h-6 bg-obsidian-border mx-1" />
      <button 
        onClick={() => createNode('group', { title: 'New Group' }, { width: 400, height: 300 })}
        className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-obsidian-text hover:bg-obsidian-border hover:text-accent rounded-lg transition-colors"
        title="Add Group"
      >
        <LayoutGrid size={16} />
        <span className="hidden sm:inline">Group</span>
      </button>
      <div className="w-px h-6 bg-obsidian-border mx-1" />
      <div className="flex items-center gap-2 px-3 py-2" title="Accent Color">
        <input 
          type="color" 
          value={accentColor} 
          onChange={(e) => setAccentColor(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
        />
      </div>
    </Panel>
  );
}

export default memo(CanvasToolbar);
