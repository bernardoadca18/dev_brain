'use client';

import React, { useCallback, useRef, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  useReactFlow,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import NoteNode from './nodes/NoteNode';
import TaskNode from './nodes/TaskNode';
import ImageNode from './nodes/ImageNode';
import GroupNode from './nodes/GroupNode';
import CanvasToolbar from './CanvasToolbar';
import CanvasHeader from './CanvasHeader';
import CanvasColorPicker from './CanvasColorPicker';
import AIChatSidebar from './AIChatSidebar';
import { useCanvasStore } from '@/store/useCanvasStore';
import { AppNode } from '@/types';

const nodeTypes = {
  note: NoteNode,
  task: TaskNode,
  image: ImageNode,
  group: GroupNode,
};

const initialNodes: AppNode[] = [
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

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3', animated: true },
  { id: 'e1-4', source: '1', target: '4', animated: false },
];

function Flow() {
  const nodes = useCanvasStore((state) => state.nodes);
  const edges = useCanvasStore((state) => state.edges);
  const onNodesChange = useCanvasStore((state) => state.onNodesChange);
  const onEdgesChange = useCanvasStore((state) => state.onEdgesChange);
  const onConnect = useCanvasStore((state) => state.onConnect);
  const setNodes = useCanvasStore((state) => state.setNodes);
  const setEdges = useCanvasStore((state) => state.setEdges);
  const accentColor = useCanvasStore((state) => state.accentColor);

  const { screenToFlowPosition } = useReactFlow();

  // Initialize store with initial data
  useEffect(() => {
    setNodes(initialNodes);
    setEdges(initialEdges);
  }, [setNodes, setEdges]);

  const lastClickTime = useRef(0);

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      const now = Date.now();
      if (now - lastClickTime.current < 300) {
        const position = screenToFlowPosition({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode: AppNode = {
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

  useEffect(() => {
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
          if (node.type === 'image') return '#4a90e2';
          if (node.type === 'group') return 'transparent';
          return '#3d3d3d';
        }}
        maskColor="rgba(30, 30, 30, 0.7)"
      />
      
      <CanvasHeader />
      <CanvasToolbar />
      <CanvasColorPicker />
      <AIChatSidebar />
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

