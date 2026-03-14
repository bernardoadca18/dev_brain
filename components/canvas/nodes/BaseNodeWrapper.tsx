import React from 'react';
import { Handle, Position, NodeResizer } from '@xyflow/react';

interface BaseNodeWrapperProps {
  id: string;
  selected?: boolean;
  width?: number;
  height?: number;
  children: React.ReactNode;
  isGroup?: boolean;
  hideHandles?: boolean;
  minWidth?: number;
  minHeight?: number;
  defaultWidth?: number | 'auto';
  defaultHeight?: number | 'auto';
}

export default function BaseNodeWrapper({
  id,
  selected,
  width,
  height,
  children,
  isGroup = false,
  hideHandles = false,
  minWidth = 300,
  minHeight = 200,
  defaultWidth = 400,
  defaultHeight = 'auto',
}: BaseNodeWrapperProps) {
  
  const baseWidth = typeof defaultWidth === 'number' ? defaultWidth : 400;
  const baseHeight = typeof defaultHeight === 'number' ? defaultHeight : 300;
  
  const scaleX = width ? width / baseWidth : 1;
  const scaleY = height ? height / baseHeight : 1;
  // If height is auto (not resized yet), we only scale based on width, or just 1.
  const scale = (width && height) ? Math.min(scaleX, scaleY) : scaleX;
  const clampedScale = Math.max(0.5, Math.min(scale, 4));

  return (
    <>
      <NodeResizer
        color="var(--accent-color)"
        isVisible={selected}
        minWidth={minWidth}
        minHeight={minHeight}
        handleClassName="w-5 h-5 rounded-sm border-none bg-accent opacity-0 hover:opacity-100 transition-opacity"
      />
      <div
        className={`w-full h-full flex flex-col transition-colors duration-200 group relative ${
          isGroup
            ? 'bg-obsidian-card/30 border-2 rounded-xl backdrop-blur-sm'
            : 'bg-obsidian-card border rounded-xl shadow-lg'
        } ${
          selected
            ? 'border-accent shadow-[0_0_15px_rgba(168,130,255,0.2)]'
            : isGroup ? 'border-obsidian-border/50' : 'border-obsidian-border'
        }`}
        style={{
          boxShadow: selected ? '0 0 15px var(--accent-color)' : undefined,
          borderColor: selected ? 'var(--accent-color)' : undefined,
          '--node-scale': clampedScale,
          width: width ? '100%' : defaultWidth,
          height: height ? '100%' : defaultHeight,
        } as React.CSSProperties}
      >
        {!hideHandles && (
          <Handle type="target" position={Position.Top} className="w-5 h-5 !bg-obsidian-border hover:!bg-accent transition-colors" />
        )}
        
        {children}

        {!hideHandles && (
          <Handle type="source" position={Position.Bottom} className="w-5 h-5 !bg-obsidian-border hover:!bg-accent transition-colors" />
        )}
      </div>
    </>
  );
}
