'use client';

import React, { useState, useEffect, memo } from 'react';
import { Copy, Check, Palette, X } from 'lucide-react';
import { generatePalette } from '@/lib/colorUtils';
import { useCanvasStore } from '@/store/useCanvasStore';

function HueShifter() {
  const [isOpen, setIsOpen] = useState(false);
  const [baseColor, setBaseColor] = useState('#a882ff');
  const [hStep, setHStep] = useState(15);
  const [sStep, setSStep] = useState(10);
  const [vStep, setVStep] = useState(15);
  const [steps, setSteps] = useState(3);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  const selectedNodeId = useCanvasStore((state) => state.selectedNodeId);
  const updateNodeData = useCanvasStore((state) => state.updateNodeData);

  const palette = React.useMemo(() => {
    try {
      if (/^#[0-9A-F]{6}$/i.test(baseColor) || /^#[0-9A-F]{3}$/i.test(baseColor)) {
        return generatePalette(baseColor, steps, hStep, sStep, vStep);
      }
    } catch (e) {
      // Ignore invalid colors
    }
    return [];
  }, [baseColor, hStep, sStep, vStep, steps]);

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);

    if (selectedNodeId) {
      updateNodeData(selectedNodeId, { accentColor: color });
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 p-3 bg-obsidian-card border border-obsidian-border rounded-full text-obsidian-text hover:text-accent hover:border-accent transition-colors shadow-lg"
        title="Hue Shifter"
      >
        <Palette size={24} />
      </button>

      {isOpen && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden flex flex-col text-zinc-100">
          <div className="flex items-center justify-between p-4 border-b border-zinc-800 bg-zinc-950">
            <h3 className="font-semibold flex items-center gap-2">
              <Palette size={16} className="text-accent" />
              Hue Shifter
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          <div className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-400 mb-1">Base Color (HEX)</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer bg-transparent border-0 p-0"
                />
                <input
                  type="text"
                  value={baseColor}
                  onChange={(e) => setBaseColor(e.target.value)}
                  className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 text-sm text-zinc-100 focus:outline-none focus:border-accent"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <label>Hue Shift (ΔH)</label>
                  <span>{hStep}°</span>
                </div>
                <input
                  type="range"
                  min="-60"
                  max="60"
                  value={hStep}
                  onChange={(e) => setHStep(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <label>Saturation Shift (ΔS)</label>
                  <span>{sStep}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={sStep}
                  onChange={(e) => setSStep(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <label>Value Shift (ΔV)</label>
                  <span>{vStep}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={vStep}
                  onChange={(e) => setVStep(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
              
              <div>
                <div className="flex justify-between text-xs text-zinc-400 mb-1">
                  <label>Steps (each side)</label>
                  <span>{steps}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-zinc-800">
              <label className="block text-xs font-medium text-zinc-400 mb-2">Generated Palette</label>
              <div className="flex h-12 rounded-lg overflow-hidden border border-zinc-800">
                {palette.map((color, index) => (
                  <button
                    key={index}
                    onClick={() => handleCopy(color)}
                    className="flex-1 relative group transition-transform hover:scale-110 hover:z-10"
                    style={{ backgroundColor: color }}
                    title={`Copy ${color}`}
                  >
                    {copiedColor === color && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px]">
                        <Check size={14} className="text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500 mt-2 text-center">
                Click a swatch to copy HEX & apply to selected node
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default memo(HueShifter);
