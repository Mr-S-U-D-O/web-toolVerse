import React, { useState } from 'react';
import { ArrowLeft, Settings2 } from 'lucide-react';

interface AspectRatioCalculatorToolProps {
  onBack: () => void;
}

export default function AspectRatioCalculatorTool({ onBack }: AspectRatioCalculatorToolProps) {
  const [width1, setWidth1] = useState<string>('1920');
  const [height1, setHeight1] = useState<string>('1080');
  
  const [width2, setWidth2] = useState<string>('1280');
  const [height2, setHeight2] = useState<string>('720');

  const [activeInput, setActiveInput] = useState<'w1' | 'h1' | 'w2' | 'h2'>('w2');

  const updateValues = (changed: 'w1' | 'h1' | 'w2' | 'h2', val: string) => {
    setActiveInput(changed);
    const num = parseFloat(val);
    
    if (changed === 'w1') {
      setWidth1(val);
      if (!isNaN(num) && num > 0) {
        const ratio = parseFloat(height1) / num;
        if (!isNaN(parseFloat(width2))) setHeight2(Math.round(parseFloat(width2) * ratio).toString());
      }
    } else if (changed === 'h1') {
      setHeight1(val);
      if (!isNaN(num) && num > 0) {
        const ratio = parseFloat(width1) / num;
        if (!isNaN(parseFloat(height2))) setWidth2(Math.round(parseFloat(height2) * ratio).toString());
      }
    } else if (changed === 'w2') {
      setWidth2(val);
      if (!isNaN(num) && num > 0) {
        const ratio = parseFloat(height1) / parseFloat(width1);
        if (!isNaN(ratio)) setHeight2(Math.round(num * ratio).toString());
      }
    } else if (changed === 'h2') {
      setHeight2(val);
      if (!isNaN(num) && num > 0) {
        const ratio = parseFloat(width1) / parseFloat(height1);
        if (!isNaN(ratio)) setWidth2(Math.round(num * ratio).toString());
      }
    }
  };

  const getRatioString = () => {
    const w = parseFloat(width1);
    const h = parseFloat(height1);
    if (!isNaN(w) && !isNaN(h) && w > 0 && h > 0) {
      // Find gcd
      const gcd = (a: number, b: number): number => b === 0 ? a : gcd(b, a % b);
      const div = gcd(w, h);
      return `${w / div}:${h / div}`;
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Aspect Ratio Calculator</h1>
        <p className="text-on-surface-variant mb-8">Calculate missing dimensions while maintaining a proportional aspect ratio.</p>

        <div className="bg-surface rounded-xl p-8 border border-outline flex flex-col gap-10">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="w-full flex-1">
              <h3 className="font-bold mb-4 text-on-surface-variant">Original Dimensions</h3>
              <div className="flex items-center gap-4">
                <div className="flex-1 border border-outline rounded-lg bg-background px-4 py-3 focus-within:border-primary transition-colors">
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">Width (W1)</label>
                  <input
                    type="number"
                    className="w-full bg-transparent focus:outline-none font-mono text-lg"
                    value={width1}
                    onChange={(e) => updateValues('w1', e.target.value)}
                  />
                </div>
                <div className="text-xl font-bold text-on-surface-variant mb-0 mt-4">:</div>
                <div className="flex-1 border border-outline rounded-lg bg-background px-4 py-3 focus-within:border-primary transition-colors">
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">Height (H1)</label>
                  <input
                    type="number"
                    className="w-full bg-transparent focus:outline-none font-mono text-lg"
                    value={height1}
                    onChange={(e) => updateValues('h1', e.target.value)}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center justify-center pt-8">
              <Settings2 size={32} className="text-primary hidden sm:block" />
              <div className="font-bold text-lg mt-2 text-primary">{getRatioString()}</div>
            </div>
          </div>

          <div className="w-full h-[1px] bg-outline/50 relative">
             <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface px-4 text-sm font-bold text-on-surface-variant">
               New Dimensions
             </div>
          </div>

          <div className="w-full flex-1">
             <div className="flex items-center gap-4">
                <div className="flex-1 border border-outline rounded-lg bg-background px-4 py-3 focus-within:border-primary transition-colors">
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">New Width (W2)</label>
                  <input
                    type="number"
                    className="w-full bg-transparent focus:outline-none font-mono text-lg"
                    value={width2}
                    onChange={(e) => updateValues('w2', e.target.value)}
                  />
                </div>
                <div className="text-xl font-bold text-on-surface-variant mb-0 mt-4">:</div>
                <div className="flex-1 border border-outline rounded-lg bg-background px-4 py-3 focus-within:border-primary transition-colors">
                  <label className="text-xs font-bold text-on-surface-variant block mb-1">New Height (H2)</label>
                  <input
                    type="number"
                    className="w-full bg-transparent focus:outline-none font-mono text-lg"
                    value={height2}
                    onChange={(e) => updateValues('h2', e.target.value)}
                  />
                </div>
              </div>
          </div>

        </div>
      </div>
    </div>
  );
}
