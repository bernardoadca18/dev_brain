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
  Node,
} from '@xyflow/react';
import { v4 as uuidv4 } from 'uuid';
import NoteNode from './nodes/NoteNode';
import TaskNode from './nodes/TaskNode';
import ImageNode from './nodes/ImageNode';
import GroupNode from './nodes/GroupNode';
import AudioNode from './nodes/AudioNode';
import VideoNode from './nodes/VideoNode';
import SpeechToTextNode from './nodes/SpeechToTextNode';
import CanvasToolbar from './CanvasToolbar';
import HueShifter from './HueShifter';
import AIChatSidebar from './AIChatSidebar';
import MainSidebar from '../MainSidebar';
import { useCanvasStore } from '@/store/useCanvasStore';
import { useFileSystemStore } from '@/store/useFileSystemStore';
import { AppNode } from '@/types';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useAutoSave } from '@/hooks/useAutoSave';

const nodeTypes = {
  note: NoteNode,
  task: TaskNode,
  image: ImageNode,
  group: GroupNode,
  audio: AudioNode,
  video: VideoNode,
  speechToText: SpeechToTextNode,
};

const initialNodes: AppNode[] = [
  {
    id: '1',
    type: 'note',
    position: { x: 250, y: 100 },
    data: {
      title: '',
      content: '',
    },
  },
  {
    id: '2',
    type: 'note',
    position: { x: 100, y: 300 },
    data: {
      title: '',
      content: '',
    },
  },
  {
    id: '3',
    type: 'note',
    position: { x: 400, y: 300 },
    data: {
      title: '',
      content: '',
    },
  },
  {
    id: '4',
    type: 'task',
    position: { x: 700, y: 100 },
    data: {
      title: '',
      tasks: [
        { id: 't1', content: '', completed: true },
        { id: 't2', content: '', completed: false },
        { id: 't3', content: '', completed: false },
        { id: 't4', content: '', completed: false },
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
  const setAccentColor = useCanvasStore((state) => state.setAccentColor);
  const hasInitialized = useCanvasStore((state) => state.hasInitialized);
  const setHasInitialized = useCanvasStore((state) => state.setHasInitialized);
  const setSelectedNodeId = useCanvasStore((state) => state.setSelectedNodeId);

  const activeFileId = useFileSystemStore((state) => state.activeFileId);

  const { screenToFlowPosition } = useReactFlow();
  
  useKeyboardShortcuts();
  useAutoSave();

  // Initialize store with initial data only if not initialized
  useEffect(() => {
    if (!hasInitialized) {
      setNodes(initialNodes);
      setEdges(initialEdges);
      setHasInitialized(true);
    }
  }, [hasInitialized, setNodes, setEdges, setHasInitialized]);

  // Handle active file deletion
  useEffect(() => {
    if (activeFileId === null) {
      setNodes([]);
      setEdges([]);
      setAccentColor('#a882ff');
    }
  }, [activeFileId, setNodes, setEdges, setAccentColor]);

  const lastClickTime = useRef(0);

  const onPaneClick = useCallback(
    (event: React.MouseEvent) => {
      setSelectedNodeId(null);
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
    [screenToFlowPosition, setNodes, setSelectedNodeId]
  );

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
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
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      className="bg-obsidian-bg"
      minZoom={0.1}
      maxZoom={4}
      deleteKeyCode={['Backspace', 'Delete']}
      defaultEdgeOptions={{ style: { strokeWidth: 4 } }}
    >
      <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#3d3d3d" />
      <Controls />
      <MiniMap 
        position="bottom-left"
        nodeColor={(node) => {
          if (node.type === 'task') return 'var(--accent-color)';
          if (node.type === 'image') return '#4a90e2';
          if (node.type === 'group') return 'transparent';
          if (node.type === 'audio') return '#e2a04a';
          if (node.type === 'video') return '#e24a4a';
          if (node.type === 'speechToText') return '#a04ae2';
          return '#3d3d3d';
        }}
        maskColor="rgba(30, 30, 30, 0.7)"
      />
      
      <CanvasToolbar />
      <HueShifter />
      <AIChatSidebar />
      <MainSidebar />
      
      {activeFileId === null && (
        <div className="absolute inset-0 z-40 bg-obsidian-bg/80 backdrop-blur-sm flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-obsidian-text mb-2">No Canvas Selected</h2>
            <p className="text-obsidian-text-muted">Select a canvas from the sidebar or create a new one.</p>
          </div>
        </div>
      )}
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

