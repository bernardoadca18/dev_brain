'use client';

import React, { useState, useRef, useEffect, memo } from 'react';
import { NodeProps } from '@xyflow/react';
import { AudioNodeData } from '@/types';
import { Trash2, Upload, Mic, Square, Play, Pause } from 'lucide-react';
import { useCanvasStore } from '@/store/useCanvasStore';
import BaseNodeWrapper from './BaseNodeWrapper';

function AudioNode({ id, data, selected, dragging, width, height }: NodeProps & { data: AudioNodeData }) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const updateNodeData = useCanvasStore((state) => state.updateNodeData);
  const deleteNode = useCanvasStore((state) => state.deleteNode);

  const handleDelete = () => {
    deleteNode(id);
  };

  const handleTitleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsEditingTitle(false);
    updateNodeData(id, { title: e.target.value });
  };

  const handleDescBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsEditingDesc(false);
    updateNodeData(id, { description: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      updateNodeData(id, { audioUrl: url });
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        updateNodeData(id, { audioUrl });
        
        // Stop all tracks to release microphone
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      
    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && isRecording) {
        mediaRecorderRef.current.stop();
      }
    };
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <BaseNodeWrapper id={id} selected={selected} dragging={dragging} width={width} height={height} defaultWidth={400} defaultHeight={300}>
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
              {data.title || <span className="text-obsidian-text-muted italic">Double-click to add title</span>}
            </h3>
          )}
          <button 
            onClick={handleDelete}
            className="text-obsidian-text-muted hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 ml-2 shrink-0"
          >
            <Trash2 size={16} />
          </button>
        </div>

        <div className="flex-1 bg-obsidian-bg rounded-xl overflow-hidden flex flex-col items-center justify-center border border-obsidian-border relative min-h-0 p-4">
          <input 
            type="file" 
            accept="audio/*" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          
          {data.audioUrl ? (
            <div className="w-full flex flex-col items-center gap-4">
              <audio controls src={data.audioUrl} className="w-full max-w-[300px] nodrag" />
              <div className="flex gap-2">
                <button 
                  onClick={triggerFileInput}
                  className="bg-obsidian-card text-obsidian-text px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 hover:bg-obsidian-border transition-colors text-sm border border-obsidian-border"
                >
                  <Upload size={14} />
                  Replace
                </button>
                <button 
                  onClick={() => updateNodeData(id, { audioUrl: undefined })}
                  className="bg-obsidian-card text-red-400 px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 hover:bg-obsidian-border transition-colors text-sm border border-obsidian-border"
                >
                  <Trash2 size={14} />
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4 w-full h-full justify-center">
              {isRecording ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center animate-pulse">
                    <div className="w-8 h-8 rounded-full bg-red-500" />
                  </div>
                  <span className="text-red-400 font-mono text-lg">{formatTime(recordingTime)}</span>
                  <button 
                    onClick={stopRecording}
                    className="bg-obsidian-card text-obsidian-text px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-obsidian-border transition-colors border border-obsidian-border mt-2"
                  >
                    <Square size={16} className="text-red-400 fill-red-400" />
                    Stop Recording
                  </button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-4 w-full">
                  <button 
                    onClick={startRecording}
                    className="w-full max-w-[200px] bg-obsidian-card text-obsidian-text px-4 py-3 rounded-xl font-medium flex flex-col items-center gap-2 hover:bg-obsidian-border hover:text-accent transition-colors border border-obsidian-border group"
                  >
                    <Mic size={24} className="group-hover:scale-110 transition-transform" />
                    <span>Record Audio</span>
                  </button>
                  
                  <div className="flex items-center gap-2 w-full max-w-[200px]">
                    <div className="h-px bg-obsidian-border flex-1" />
                    <span className="text-obsidian-text-muted text-xs uppercase tracking-wider">OR</span>
                    <div className="h-px bg-obsidian-border flex-1" />
                  </div>

                  <button 
                    onClick={triggerFileInput}
                    className="w-full max-w-[200px] bg-obsidian-card text-obsidian-text px-4 py-3 rounded-xl font-medium flex flex-col items-center gap-2 hover:bg-obsidian-border hover:text-accent transition-colors border border-obsidian-border group"
                  >
                    <Upload size={24} className="group-hover:-translate-y-1 transition-transform" />
                    <span>Upload Audio</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="shrink-0">
          {isEditingDesc ? (
            <textarea
              defaultValue={data.description || ''}
              onBlur={handleDescBlur}
              className="nodrag bg-obsidian-bg text-obsidian-text-muted w-full p-3 rounded border border-obsidian-border focus:outline-none focus:border-accent resize-none min-h-[60px]"
              style={{ fontSize: 'calc(14px * var(--node-scale))' }}
              autoFocus
              placeholder="Add description..."
            />
          ) : (
            <div 
              className="text-obsidian-text-muted whitespace-pre-wrap select-none leading-relaxed cursor-text min-h-[20px]"
              style={{ fontSize: 'calc(14px * var(--node-scale))' }}
              onDoubleClick={(e) => { e.stopPropagation(); setIsEditingDesc(true); }}
            >
              {data.description || <span className="italic opacity-50">Double-click to add description</span>}
            </div>
          )}
        </div>
      </div>
    </BaseNodeWrapper>
  );
}

export default memo(AudioNode, (prevProps, nextProps) => {
  return (
    prevProps.selected === nextProps.selected &&
    prevProps.dragging === nextProps.dragging &&
    prevProps.width === nextProps.width &&
    prevProps.height === nextProps.height &&
    prevProps.data === nextProps.data
  );
});

