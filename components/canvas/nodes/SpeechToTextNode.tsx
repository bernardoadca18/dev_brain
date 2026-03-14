'use client';

import React, { useState, useEffect, useRef } from 'react';
import { NodeProps } from '@xyflow/react';
import { SpeechToTextNodeData } from '@/types';
import { Trash2, Mic, Square, Loader2 } from 'lucide-react';
import { useCanvasStore } from '@/store/useCanvasStore';
import BaseNodeWrapper from './BaseNodeWrapper';

// Type declarations for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function SpeechToTextNode({ id, data, selected, width, height }: NodeProps & { data: SpeechToTextNodeData }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  
  const recognitionRef = useRef<any>(null);
  const transcriptRef = useRef(data.transcript || '');

  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const setNodes = useCanvasStore((state) => state.setNodes);

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      let currentInterim = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript + ' ';
        } else {
          currentInterim += event.results[i][0].transcript;
        }
      }

      if (finalTranscript) {
        const newTranscript = transcriptRef.current + finalTranscript;
        transcriptRef.current = newTranscript;
        updateNodeData(id, { transcript: newTranscript });
      }
      
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [id, updateNodeData]);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setInterimTranscript('');
    } else {
      try {
        recognitionRef.current?.start();
        setIsListening(true);
      } catch (e) {
        console.error("Could not start recognition", e);
      }
    }
  };

  const handleDelete = () => {
    setNodes((nds) => nds.filter((n) => n.id !== id));
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditingTitle(false);
    updateNodeData(id, { title: e.target.value });
  };

  const handleTranscriptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    transcriptRef.current = newText;
    updateNodeData(id, { transcript: newText });
  };

  return (
    <BaseNodeWrapper id={id} selected={selected} width={width} height={height} defaultWidth={400} defaultHeight={350}>
      <div className="p-6 flex flex-col gap-4 h-full">
        <div className="flex justify-between items-start shrink-0">
          {isEditingTitle ? (
            <input
              type="text"
              defaultValue={data.title || ''}
              onBlur={handleTitleBlur}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              className="nodrag bg-obsidian-bg text-obsidian-text font-bold w-full p-2 rounded border border-obsidian-border focus:outline-none focus:border-accent"
              style={{ fontSize: 'calc(16px * var(--node-scale))' }}
              autoFocus
              placeholder="Add title..."
            />
          ) : (
            <h3 
              className="text-obsidian-text font-bold leading-tight select-none cursor-text flex-1 min-h-[20px]"
              style={{ fontSize: 'calc(16px * var(--node-scale))' }}
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditingTitle(true); }}
            >
              {data.title || <span className="text-obsidian-text-muted italic">Voice Memo</span>}
            </h3>
          )}
          <button 
            onClick={handleDelete}
            className="text-obsidian-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2 shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {!isSupported ? (
          <div className="flex-1 flex items-center justify-center bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-center text-red-400">
            Speech recognition is not supported in this browser. Please try Chrome or Edge.
          </div>
        ) : (
          <>
            <div className="shrink-0 flex justify-center">
              <button
                onClick={toggleListening}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all shadow-lg ${
                  isListening 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30' 
                    : 'bg-accent/20 text-accent border border-accent/50 hover:bg-accent/30'
                }`}
                style={{ fontSize: 'calc(14px * var(--node-scale))' }}
              >
                {isListening ? (
                  <>
                    <Square size={16} className="fill-current" />
                    Stop Dictation
                  </>
                ) : (
                  <>
                    <Mic size={16} />
                    Start Dictation
                  </>
                )}
              </button>
            </div>

            <div className="flex-1 relative flex flex-col min-h-0 bg-obsidian-bg rounded-xl border border-obsidian-border overflow-hidden">
              <textarea
                value={data.transcript || ''}
                onChange={handleTranscriptChange}
                className="nodrag w-full h-full p-4 bg-transparent text-obsidian-text focus:outline-none resize-none"
                style={{ fontSize: 'calc(14px * var(--node-scale))' }}
                placeholder={isListening ? "Listening..." : "Click 'Start Dictation' to speak, or type here..."}
              />
              
              {/* Interim Transcript Overlay */}
              {isListening && interimTranscript && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-obsidian-bg to-transparent pointer-events-none">
                  <p className="text-obsidian-text-muted italic flex items-center gap-2" style={{ fontSize: 'calc(14px * var(--node-scale))' }}>
                    <Loader2 size={14} className="animate-spin" />
                    {interimTranscript}
                  </p>
                </div>
              )}
              
              {/* Recording Indicator */}
              {isListening && (
                <div className="absolute top-3 right-3 flex items-center gap-2 bg-obsidian-bg/80 backdrop-blur-sm px-2 py-1 rounded-full border border-obsidian-border">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-xs text-obsidian-text-muted uppercase tracking-wider font-medium">Rec</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </BaseNodeWrapper>
  );
}
