'use client';

import React, { useState, memo, useRef, useEffect } from 'react';
import { Menu, LayoutDashboard, Map, Settings, Download, X, Folder, File as FileIcon, ChevronRight, ChevronDown, Trash2, Edit2, Plus, FolderPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFileSystemStore } from '@/store/useFileSystemStore';
import { FileSystemNode } from '@/types';
import { useCanvasStore } from '@/store/useCanvasStore';

const FileTreeNode = memo(({ node, level = 0 }: { node: FileSystemNode; level?: number }) => {
  const { activeFileId, setActiveFileId, toggleFolder, renameNode, deleteNode, addFolder, addCanvas } = useFileSystemStore();
  const { setNodes, setEdges, setAccentColor } = useCanvasStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(node.name);
  const inputRef = useRef<HTMLInputElement>(null);

  const isFolder = node.type === 'folder';
  const isActive = activeFileId === node.id;

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRename = () => {
    if (editName.trim() && editName !== node.name) {
      renameNode(node.id, editName.trim());
    } else {
      setEditName(node.name);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRename();
    } else if (e.key === 'Escape') {
      setEditName(node.name);
      setIsEditing(false);
    }
  };

  const handleClick = () => {
    if (isFolder) {
      toggleFolder(node.id);
    } else {
      setActiveFileId(node.id);
      if (node.canvasData) {
        setNodes(node.canvasData.nodes);
        setEdges(node.canvasData.edges);
        setAccentColor(node.canvasData.accentColor);
      }
    }
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(node.id);
  };

  return (
    <div className="w-full">
      <div 
        className={`group flex items-center justify-between py-1.5 px-2 rounded-md cursor-pointer transition-colors ${
          isActive ? 'bg-accent/20 text-accent' : 'text-obsidian-text hover:bg-obsidian-border/50'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
        onDoubleClick={() => setIsEditing(true)}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isFolder ? (
            <span className="text-obsidian-text-muted">
              {node.isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            </span>
          ) : (
            <span className="w-[14px]" /> // Spacer for alignment
          )}
          
          <span className={isActive ? 'text-accent' : 'text-obsidian-text-muted'}>
            {isFolder ? <Folder size={14} /> : <FileIcon size={14} />}
          </span>
          
          {isEditing ? (
            <input
              ref={inputRef}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={handleKeyDown}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-obsidian-bg border border-accent rounded px-1 text-sm text-obsidian-text focus:outline-none min-w-0"
            />
          ) : (
            <span className="text-sm truncate select-none">{node.name}</span>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
          {isFolder && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); addCanvas(node.id, 'New Canvas'); }}
                className="p-1 text-obsidian-text-muted hover:text-accent rounded"
                title="New Canvas"
              >
                <Plus size={12} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); addFolder(node.id, 'New Folder'); }}
                className="p-1 text-obsidian-text-muted hover:text-accent rounded"
                title="New Folder"
              >
                <FolderPlus size={12} />
              </button>
            </>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsEditing(true); }}
            className="p-1 text-obsidian-text-muted hover:text-accent rounded"
            title="Rename"
          >
            <Edit2 size={12} />
          </button>
          <button 
            onClick={handleDelete}
            className="p-1 text-obsidian-text-muted hover:text-red-400 rounded"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {isFolder && node.isExpanded && node.children && (
        <div className="flex flex-col">
          {node.children.map((child) => (
            <FileTreeNode key={child.id} node={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
});

FileTreeNode.displayName = 'FileTreeNode';

function MainSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const { fileTree, addFolder, addCanvas } = useFileSystemStore();

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute top-4 left-4 z-50 p-2 bg-obsidian-card border border-obsidian-border rounded-lg text-obsidian-text hover:text-accent hover:border-accent transition-colors shadow-lg"
        aria-label="Toggle Sidebar"
      >
        <Menu size={24} />
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleSidebar}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 h-full w-72 bg-obsidian-card border-r border-obsidian-border z-50 flex flex-col shadow-2xl"
            >
              <div className="p-4 flex justify-between items-center border-b border-obsidian-border shrink-0">
                <h2 className="text-xl font-bold text-obsidian-text tracking-tight">Explorer</h2>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => addCanvas(null, 'New Canvas')}
                    className="p-1.5 text-obsidian-text-muted hover:text-accent hover:bg-obsidian-border/50 rounded transition-colors"
                    title="New Canvas"
                  >
                    <Plus size={16} />
                  </button>
                  <button
                    onClick={() => addFolder(null, 'New Folder')}
                    className="p-1.5 text-obsidian-text-muted hover:text-accent hover:bg-obsidian-border/50 rounded transition-colors"
                    title="New Folder"
                  >
                    <FolderPlus size={16} />
                  </button>
                  <button
                    onClick={toggleSidebar}
                    className="p-1.5 text-obsidian-text-muted hover:text-accent hover:bg-obsidian-border/50 rounded transition-colors ml-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {fileTree.map((node) => (
                  <FileTreeNode key={node.id} node={node} />
                ))}
              </div>

              <div className="p-4 border-t border-obsidian-border text-xs text-obsidian-text-muted text-center shrink-0">
                v0.1.0-alpha
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default memo(MainSidebar);
