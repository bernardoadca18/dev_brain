import { Node } from '@xyflow/react';

export interface NoteNodeData extends Record<string, unknown> {
  title: string;
  content: string;
}

export interface Task {
  id: string;
  content: string;
  completed: boolean;
}

export interface TaskNodeData extends Record<string, unknown> {
  title: string;
  tasks: Task[];
}

export interface ImageNodeData extends Record<string, unknown> {
  title?: string;
  imageUrl: string;
  description?: string;
}

export interface GroupNodeData extends Record<string, unknown> {
  title: string;
}

export type AppNode = 
  | Node<NoteNodeData, 'note'>
  | Node<TaskNodeData, 'task'>
  | Node<ImageNodeData, 'image'>
  | Node<GroupNodeData, 'group'>;
