'use client';

import { useEffect, useState } from 'react';
import Canvas from '@/components/canvas/Canvas';

export default function Home() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <main className="w-full h-screen flex items-center justify-center bg-obsidian-bg text-obsidian-text">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-obsidian-text-muted">Loading Workspace...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full h-screen overflow-hidden bg-obsidian-bg">
      <Canvas />
    </main>
  );
}
