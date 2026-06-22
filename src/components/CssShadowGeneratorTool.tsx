import React, { useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';

interface CssShadowGeneratorToolProps {
  onBack: () => void;
}

export default function CssShadowGeneratorTool({ onBack }: CssShadowGeneratorToolProps) {
  const [offsetX, setOffsetX] = useState(10);
  const [offsetY, setOffsetY] = useState(10);
  const [blur, setBlur] = useState(15);
  const [spread, setSpread] = useState(-3);
  const [color, setColor] = useState('rgba(0,0,0,0.1)');
  const [inset, setInset] = useState(false);
  const [copied, setCopied] = useState(false);

  const shadowString = `${inset ? 'inset ' : ''}${offsetX}px ${offsetY}px ${blur}px ${spread}px ${color}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`box-shadow: ${shadowString};`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-5xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">CSS Box Shadow Generator</h1>
        <p className="text-on-surface-variant mb-8">Generate and preview CSS box-shadows visually.</p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-surface p-6 rounded-xl border border-outline flex flex-col items-center justify-center min-h-[400px]">
            <div 
              className="w-48 h-48 bg-surface rounded-xl transition-shadow duration-200"
              style={{ boxShadow: shadowString }}
            ></div>
          </div>

          <div className="bg-surface p-6 rounded-xl border border-outline space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold">Offset X</label>
                <span className="text-sm font-mono">{offsetX}px</span>
              </div>
              <input type="range" min="-50" max="50" value={offsetX} onChange={(e) => setOffsetX(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>
            
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold">Offset Y</label>
                <span className="text-sm font-mono">{offsetY}px</span>
              </div>
              <input type="range" min="-50" max="50" value={offsetY} onChange={(e) => setOffsetY(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold">Blur Radius</label>
                <span className="text-sm font-mono">{blur}px</span>
              </div>
              <input type="range" min="0" max="100" value={blur} onChange={(e) => setBlur(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-bold">Spread Radius</label>
                <span className="text-sm font-mono">{spread}px</span>
              </div>
              <input type="range" min="-50" max="50" value={spread} onChange={(e) => setSpread(parseInt(e.target.value))} className="w-full accent-primary" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="block text-sm font-bold mb-2">Shadow Color</label>
                <input type="text" value={color} onChange={(e) => setColor(e.target.value)} className="w-full bg-background border border-outline rounded-lg px-4 py-2 focus:border-primary focus:outline-none" />
              </div>
              <div className="flex items-center gap-2 mt-6">
                <input type="checkbox" id="inset" checked={inset} onChange={(e) => setInset(e.target.checked)} className="w-5 h-5 accent-primary rounded" />
                <label htmlFor="inset" className="text-sm font-bold cursor-pointer">Inset</label>
              </div>
            </div>

            <div className="pt-4 border-t border-outline">
              <label className="block text-sm font-bold mb-2">CSS Output</label>
              <div className="flex">
                <div className="flex-1 bg-background border border-outline rounded-l-lg p-3 font-mono text-sm break-all">
                  box-shadow: {shadowString};
                </div>
                <button onClick={handleCopy} className="bg-primary text-on-primary px-4 rounded-r-lg hover:bg-surface-tint transition-colors flex items-center justify-center border border-primary">
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
