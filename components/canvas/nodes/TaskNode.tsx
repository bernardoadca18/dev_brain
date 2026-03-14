'use client';

import React, { useState } from 'react';
import { NodeProps } from '@xyflow/react';
import { Trash2, Plus } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import TaskItem from './TaskItem';
import { TaskNodeData, Task } from '@/types';
import { useCanvasStore } from '@/store/useCanvasStore';
import BaseNodeWrapper from './BaseNodeWrapper';

export default function TaskNode({ id, data, selected, width, height }: NodeProps & { data: TaskNodeData }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [tasks, setTasks] = useState<Task[]>(data.tasks || []);
  const [newTaskContent, setNewTaskContent] = useState('');
  
  const updateNodeDataStore = useCanvasStore((state) => state.updateNodeData);
  const setNodes = useCanvasStore((state) => state.setNodes);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement before drag starts, allows clicking
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const updateNodeData = (newTitle: string, newTasks: Task[]) => {
    updateNodeDataStore(id, { title: newTitle, tasks: newTasks });
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    updateNodeData(title, tasks);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nds) => nds.filter((node) => node.id !== id));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskContent.trim()) return;
    
    const newTasks = [...tasks, { id: uuidv4(), content: newTaskContent, completed: false }];
    setTasks(newTasks);
    setNewTaskContent('');
    updateNodeData(title, newTasks);
  };

  const toggleTask = (taskId: string) => {
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t);
    setTasks(newTasks);
    updateNodeData(title, newTasks);
  };

  const deleteTask = (taskId: string) => {
    const newTasks = tasks.filter(t => t.id !== taskId);
    setTasks(newTasks);
    updateNodeData(title, newTasks);
  };

  const updateTaskContent = (taskId: string, newContent: string) => {
    const newTasks = tasks.map(t => t.id === taskId ? { ...t, content: newContent } : t);
    setTasks(newTasks);
    updateNodeData(title, newTasks);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = tasks.findIndex((t) => t.id === active.id);
      const newIndex = tasks.findIndex((t) => t.id === over.id);
      
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      setTasks(newTasks);
      updateNodeData(title, newTasks);
    }
  };

  return (
    <BaseNodeWrapper id={id} selected={selected} width={width} height={height} defaultWidth={400} defaultHeight="auto">
      <div className="p-6 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-start shrink-0">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
              className="nodrag bg-obsidian-bg text-obsidian-text font-bold w-full p-2 rounded border border-obsidian-border focus:outline-none focus:border-accent"
              style={{ fontSize: 'calc(16px * var(--node-scale))' }}
              autoFocus
            />
          ) : (
            <h3 
              className="text-obsidian-text font-bold leading-tight select-none cursor-text flex-1"
              style={{ fontSize: 'calc(16px * var(--node-scale))' }}
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
            >
              {title}
            </h3>
          )}
          <button 
            onClick={handleDelete}
            className="text-obsidian-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2 shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-3 nodrag flex-1 overflow-y-auto min-h-0">
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={tasks.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((task) => (
                <TaskItem 
                  key={task.id} 
                  task={task} 
                  onToggle={() => toggleTask(task.id)}
                  onDelete={() => deleteTask(task.id)}
                  onUpdate={(content) => updateTaskContent(task.id, content)}
                />
              ))}
            </SortableContext>
          </DndContext>
        </div>

        <form onSubmit={addTask} className="flex items-center gap-3 mt-1 nodrag shrink-0">
          <input
            type="text"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            placeholder="Add a task..."
            className="bg-obsidian-bg text-obsidian-text-muted w-full p-3 rounded border border-obsidian-border focus:outline-none focus:border-accent"
            style={{ fontSize: 'calc(14px * var(--node-scale))' }}
          />
          <button 
            type="submit"
            disabled={!newTaskContent.trim()}
            className="bg-obsidian-bg border border-obsidian-border text-obsidian-text p-3 rounded hover:text-accent hover:border-accent disabled:opacity-50 transition-colors flex items-center justify-center"
          >
            <Plus size={16} />
          </button>
        </form>
      </div>
    </BaseNodeWrapper>
  );
}
