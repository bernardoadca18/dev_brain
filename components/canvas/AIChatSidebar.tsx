import React, { useState } from 'react';
import { Panel } from '@xyflow/react';
import { MessageSquare, X, Send } from 'lucide-react';

export default function AIChatSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
    { role: 'ai', content: 'Hello! I am your dev_brain assistant. How can I help you organize your project today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');
    // Simulate AI response for now
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'ai', content: 'I am a placeholder AI. Soon I will be able to read your canvas and help you brainstorm!' }]);
    }, 1000);
  };

  if (!isOpen) {
    return (
      <Panel position="bottom-right" className="m-4">
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-accent hover:bg-accent/80 text-white p-3 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center"
          style={{ backgroundColor: 'var(--accent-color)' }}
        >
          <MessageSquare size={24} />
        </button>
      </Panel>
    );
  }

  return (
    <Panel position="top-right" className="h-[calc(100vh-32px)] m-4 w-80 bg-obsidian-card border border-obsidian-border rounded-xl shadow-2xl flex flex-col overflow-hidden z-50">
      <div className="p-4 border-b border-obsidian-border flex justify-between items-center bg-obsidian-bg/50">
        <div className="flex items-center gap-2">
          <MessageSquare size={18} className="text-accent" style={{ color: 'var(--accent-color)' }} />
          <h2 className="font-bold text-obsidian-text text-sm">AI Assistant</h2>
        </div>
        <button 
          onClick={() => setIsOpen(false)}
          className="text-obsidian-text-muted hover:text-obsidian-text transition-colors p-1"
        >
          <X size={18} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((msg, i) => (
          <div 
            key={i} 
            className={`max-w-[85%] p-3 rounded-lg text-sm ${
              msg.role === 'user' 
                ? 'bg-accent/20 border border-accent/30 text-obsidian-text self-end rounded-tr-sm' 
                : 'bg-obsidian-bg border border-obsidian-border text-obsidian-text-muted self-start rounded-tl-sm'
            }`}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-obsidian-border bg-obsidian-bg/50">
        <div className="flex items-center gap-2 bg-obsidian-bg border border-obsidian-border rounded-lg p-1 focus-within:border-accent transition-colors">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask dev_brain..."
            className="flex-1 bg-transparent border-none focus:outline-none text-obsidian-text text-sm p-2"
          />
          <button 
            onClick={handleSend}
            className="p-2 text-obsidian-text-muted hover:text-accent transition-colors"
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </Panel>
  );
}
