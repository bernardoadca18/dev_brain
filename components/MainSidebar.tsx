'use client';

import React, { useState } from 'react';
import { Menu, LayoutDashboard, Map, Settings, Download, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MainSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  // These navigation links will be wired to the backend later
  const navLinks = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
    { icon: <Map size={20} />, label: 'Canvas' },
    { icon: <Settings size={20} />, label: 'Settings' },
    { icon: <Download size={20} />, label: 'Export' },
  ];

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
              className="fixed top-0 left-0 h-full w-64 bg-obsidian-card border-r border-obsidian-border z-50 flex flex-col shadow-2xl"
            >
              <div className="p-4 flex justify-between items-center border-b border-obsidian-border">
                <h2 className="text-xl font-bold text-obsidian-text tracking-tight">Menu</h2>
                <button
                  onClick={toggleSidebar}
                  className="p-1 text-obsidian-text-muted hover:text-accent transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 p-4 flex flex-col gap-2">
                {navLinks.map((link, index) => (
                  <button
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg text-obsidian-text hover:bg-obsidian-border/50 hover:text-accent transition-colors w-full text-left"
                  >
                    <span className="text-obsidian-text-muted">{link.icon}</span>
                    <span className="font-medium">{link.label}</span>
                  </button>
                ))}
              </nav>

              <div className="p-4 border-t border-obsidian-border text-xs text-obsidian-text-muted text-center">
                v0.1.0-alpha
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
