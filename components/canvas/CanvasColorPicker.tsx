import React from 'react';
import { Panel } from '@xyflow/react';
import { useCanvasStore } from '@/store/useCanvasStore';

export default function CanvasColorPicker() {
  const accentColor = useCanvasStore((state) => state.accentColor);
  const setAccentColor = useCanvasStore((state) => state.setAccentColor);

  return (
    <Panel position="top-right" className="bg-obsidian-card p-3 rounded-xl border border-obsidian-border shadow-lg flex items-center gap-3">
      <span className="text-sm font-medium text-obsidian-text">Accent Color</span>
      <input 
        type="color" 
        value={accentColor} 
        onChange={(e) => setAccentColor(e.target.value)}
        className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
      />
    </Panel>
  );
}
