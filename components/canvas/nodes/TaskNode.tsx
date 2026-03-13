'use client';

import React, { useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
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

export default function TaskNode({ id, data, selected }: any) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [title, setTitle] = useState(data.title);
  const [tasks, setTasks] = useState<{id: string, content: string, completed: boolean}[]>(data.tasks || []);
  const [newTaskContent, setNewTaskContent] = useState('');
  const { setNodes } = useReactFlow();

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

  const updateNodeData = (newTitle: string, newTasks: any[]) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          node.data = { ...node.data, title: newTitle, tasks: newTasks };
        }
        return node;
      })
    );
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
    <div 
      className={`bg-obsidian-card border rounded-xl shadow-lg w-72 transition-colors duration-200 group ${
        selected ? 'border-accent shadow-[0_0_15px_rgba(168,130,255,0.2)]' : 'border-obsidian-border'
      }`}
      style={{
        boxShadow: selected ? '0 0 15px var(--accent-color)' : undefined,
        borderColor: selected ? 'var(--accent-color)' : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-obsidian-border hover:!bg-accent transition-colors" />
      
      <div className="p-4 flex flex-col gap-3">
        <div className="flex justify-between items-start">
          {isEditingTitle ? (
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleTitleBlur()}
              className="nodrag bg-obsidian-bg text-obsidian-text font-bold text-sm w-full p-1 rounded border border-obsidian-border focus:outline-none focus:border-accent"
              autoFocus
            />
          ) : (
            <h3 
              className="text-obsidian-text font-bold text-sm leading-tight select-none cursor-text flex-1"
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
            >
              {title}
            </h3>
          )}
          <button 
            onClick={handleDelete}
            className="text-obsidian-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2"
          >
            <Trash2 size={14} />
          </button>
        </div>

        <div className="flex flex-col gap-2 nodrag">
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

        <form onSubmit={addTask} className="flex items-center gap-2 mt-1 nodrag">
          <input
            type="text"
            value={newTaskContent}
            onChange={(e) => setNewTaskContent(e.target.value)}
            placeholder="Add a task..."
            className="bg-obsidian-bg text-obsidian-text-muted text-xs w-full p-2 rounded border border-obsidian-border focus:outline-none focus:border-accent"
          />
          <button 
            type="submit"
            disabled={!newTaskContent.trim()}
            className="bg-obsidian-bg border border-obsidian-border text-obsidian-text p-2 rounded hover:text-accent hover:border-accent disabled:opacity-50 transition-colors"
          >
            <Plus size={14} />
          </button>
        </form>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-obsidian-border hover:!bg-accent transition-colors" />
    </div>
  );
}
