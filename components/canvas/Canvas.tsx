'use client';

import React, { useCallback, useState, useRef } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
  ReactFlowProvider,
  Panel,
  useReactFlow,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import NoteNode from './nodes/NoteNode';
import TaskNode from './nodes/TaskNode';

const nodeTypes = {
  note: NoteNode,
  task: TaskNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'note',
    position: { x: 250, y: 100 },
    data: {
      title: 'O Sacro Reino de Vália',
      content: 'The central kingdom of the game. Known for its towering spires, deep religious roots, and the ever-present fog that surrounds its borders. Ruled by the High Pontiff.',
    },
  },
  {
    id: '2',
    type: 'note',
    position: { x: 100, y: 300 },
    data: {
      title: 'Lore & History',
      content: '- Founded in the First Era after the Great Sundering.\n- The "Covenant of Light" is the primary religion.\n- Ancient ruins lie beneath the capital city.',
    },
  },
  {
    id: '3',
    type: 'note',
    position: { x: 400, y: 300 },
    data: {
      title: 'Key Characters',
      content: '- High Pontiff Aldous: The current ruler, secretly corrupted.\n- Seraphina: Captain of the Vanguard, loyal but questioning.\n- "The Whisperer": A rebel leader operating in the lower wards.',
    },
  },
  {
    id: '4',
    type: 'task',
    position: { x: 700, y: 100 },
    data: {
      title: 'Level Design To-Do\'s',
      tasks: [
        { id: 't1', content: 'Block out the Grand Cathedral', completed: true },
        { id: 't2', content: 'Design the Lower Wards slums', completed: false },
        { id: 't3', content: 'Place enemy spawns in the Catacombs', completed: false },
        { id: 't4', content: 'Lighting pass on the Royal Gardens', completed: false },
      ],
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e1-4', source: '1', target: '4', animated: false },
];

function Flow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [accentColor, setAccentColor] = useState('#a882ff');
  const { screenToFlowPosition } = useReactFlow();

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const lastClickTime = useRef(0);

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      const now = Date.now();
      if (now - lastClickTime.current < 300) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: Node = {
          id: uuidv4(),
          type: 'note',
          position,
          data: { title: 'New Note', content: 'Double click to edit...' },
        };

        setNodes((nds) => nds.concat(newNode));
      }
      lastClickTime.current = now;
    },
    [screenToFlowPosition, setNodes]
  );

  React.useEffect(() => {
    document.documentElement.style.setProperty('--accent-color', accentColor);
  }, [accentColor]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onPaneClick={onPaneClick}
      nodeTypes={nodeTypes}
      fitView
      className="bg-obsidian-bg"
      minZoom={0.1}
      maxZoom={4}
    >
      <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#3d3d3d" />
      <Controls />
      <MiniMap 
        nodeColor={(node) => {
          if (node.type === 'task') return 'var(--accent-color)';
          return '#3d3d3d';
        }}
        maskColor="rgba(30, 30, 30, 0.7)"
      />
      <Panel position="top-right" className="bg-obsidian-card p-3 rounded-xl border border-obsidian-border shadow-lg flex items-center gap-3">
        <span className="text-sm font-medium text-obsidian-text">Accent Color</span>
        <input 
          type="color" 
          value={accentColor} 
          onChange={(e) => setAccentColor(e.target.value)}
          className="w-6 h-6 rounded cursor-pointer border-0 p-0 bg-transparent"
        />
      </Panel>
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
      </Panel>
      <Panel position="top-left" className="bg-obsidian-card p-4 rounded-xl border border-obsidian-border shadow-lg max-w-xs">
        <h1 className="text-lg font-bold text-obsidian-text mb-1">Vália Wiki & Planner</h1>
        <p className="text-xs text-obsidian-text-muted">
          Double-click anywhere to create a new note. Drag handles to connect nodes.
        </p>
      </Panel>
    </ReactFlow>
  );
}

export default function Canvas() {
  return (
    <div className="w-full h-screen bg-obsidian-bg">
      <ReactFlowProvider>
        <Flow />
      </ReactFlowProvider>
    </div>
  );
}
