'use client';

import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, X } from 'lucide-react';

interface TaskItemProps {
  task: { id: string; content: string; completed: boolean };
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (content: string) => void;
}

export default function TaskItem({ task, onToggle, onDelete, onUpdate }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(task.content);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (content.trim() !== task.content) {
      onUpdate(content);
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className="flex items-center gap-2 bg-obsidian-bg p-2 rounded border border-obsidian-border group"
    >
      <div 
        {...attributes} 
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-obsidian-text-muted hover:text-obsidian-text p-0.5 shrink-0"
      >
        <GripVertical size={14} />
      </div>
      
      <input 
        type="checkbox" 
        checked={task.completed}
        onChange={onToggle}
        className="rounded border-obsidian-border text-accent focus:ring-accent focus:ring-offset-obsidian-bg bg-obsidian-card cursor-pointer shrink-0"
        style={{ 
          accentColor: 'var(--accent-color)',
          width: 'calc(14px * var(--node-scale))',
          height: 'calc(14px * var(--node-scale))'
        }}
      />
      
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <input
            type="text"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
            className="nodrag bg-transparent text-obsidian-text w-full focus:outline-none"
            style={{ fontSize: 'calc(12px * var(--node-scale))' }}
            autoFocus
          />
        ) : (
          <span 
            className={`block truncate select-none cursor-text ${
              task.completed ? 'text-obsidian-text-muted line-through' : 'text-obsidian-text'
            }`}
            style={{ fontSize: 'calc(12px * var(--node-scale))' }}
            onDoubleClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
          >
            {task.content}
          </span>
        )}
      </div>

      <button 
        onClick={onDelete}
        className="text-obsidian-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 shrink-0"
      >
        <X size={14} />
      </button>
    </div>
  );
}
