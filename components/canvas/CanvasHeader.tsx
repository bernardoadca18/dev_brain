import React from 'react';
import { Panel } from '@xyflow/react';

export default function CanvasHeader() {
  return (
    <Panel position="top-left" className="bg-obsidian-card p-4 rounded-xl border border-obsidian-border shadow-lg max-w-xs">
      <h1 className="text-lg font-bold text-obsidian-text mb-1">Vália Wiki & Planner</h1>
      <p className="text-xs text-obsidian-text-muted">
        Double-click anywhere to create a new note. Drag handles to connect nodes.
      </p>
    </Panel>
  );
}
