import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';

interface RgbHexConverterToolProps {
  onBack: () => void;
}

export default function RgbHexConverterTool({ onBack }: RgbHexConverterToolProps) {
  const [hex, setHex] = useState('#3B82F6');
  const [r, setR] = useState('59');
  const [g, setG] = useState('130');
  const [b, setB] = useState('246');
  
  const [copiedHex, setCopiedHex] = useState(false);
  const [copiedRgb, setCopiedRgb] = useState(false);

  useEffect(() => {
    // Basic validation when hex changes, update rgb
    let h = hex.replace('#', '');
    if (h.length === 3) {
      h = h.split('').map(x => x + x).join('');
    }
    if (h.length === 6) {
      const red = parseInt(h.substring(0, 2), 16);
      const green = parseInt(h.substring(2, 4), 16);
      const blue = parseInt(h.substring(4, 6), 16);
      if (!isNaN(red) && !isNaN(green) && !isNaN(blue)) {
        setR(red.toString());
        setG(green.toString());
        setB(blue.toString());
      }
    }
  }, [hex]);

  const handleRgbChange = (color: 'r' | 'g' | 'b', value: string) => {
    let num = parseInt(value);
    if (isNaN(num)) num = 0;
    if (num > 255) num = 255;
    if (num < 0) num = 0;
    
    let curR = parseInt(r), curG = parseInt(g), curB = parseInt(b);
    if (isNaN(curR)) curR = 0; if (isNaN(curG)) curG = 0; if (isNaN(curB)) curB = 0;

    if (color === 'r') { setR(value); curR = num; }
    if (color === 'g') { setG(value); curG = num; }
    if (color === 'b') { setB(value); curB = num; }

    const toHexCode = (c: number) => c.toString(16).padStart(2, '0').toUpperCase();
    setHex('#' + toHexCode(curR) + toHexCode(curG) + toHexCode(curB));
  };


  const handleCopy = (str: string, type: 'hex' | 'rgb') => {
    navigator.clipboard.writeText(str);
    if (type === 'hex') {
      setCopiedHex(true); setTimeout(() => setCopiedHex(false), 2000);
    } else {
      setCopiedRgb(true); setTimeout(() => setCopiedRgb(false), 2000);
    }
  };

  const currentRgbString = `rgb(${r || 0}, ${g || 0}, ${b || 0})`;
  let isValidHex = /^#?([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">RGB ↔ Hex Converter</h1>
        <p className="text-on-surface-variant mb-8">Quickly translate colors between Hexadecimal and RGB formats.</p>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
           
           <div className="bg-surface rounded-xl p-6 border border-outline relative">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">Hexadecimal</h2>
                <button onClick={() => handleCopy(hex, 'hex')} className="text-primary hover:bg-primary/10 p-2 rounded transition-colors">
                  {copiedHex ? <Check size={18} /> : <Copy size={18} />}
                </button>
             </div>
             <div className="flex gap-4">
               <input 
                 type="color" 
                 value={isValidHex ? (hex.startsWith('#') ? hex : '#'+hex) : '#000000'}
                 onChange={(e) => setHex(e.target.value.toUpperCase())}
                 className="w-16 h-16 rounded cursor-pointer border-none p-0 flex-shrink-0"
               />
               <input 
                 type="text" 
                 value={hex}
                 onChange={(e) => setHex(e.target.value)}
                 className={`flex-1 h-16 bg-background border text-2xl font-mono text-center focus:outline-none rounded-lg uppercase ${isValidHex ? 'border-outline focus:border-primary' : 'border-red-500/50'}`}
                 placeholder="#FFFFFF"
               />
             </div>
             {!isValidHex && <div className="text-red-500 text-xs mt-2 text-center absolute -bottom-5 w-full left-0">Invalid hex format</div>}
           </div>

           <div className="bg-surface rounded-xl p-6 border border-outline relative">
             <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold">RGB</h2>
                <button onClick={() => handleCopy(currentRgbString, 'rgb')} className="text-primary hover:bg-primary/10 p-2 rounded transition-colors">
                  {copiedRgb ? <Check size={18} /> : <Copy size={18} />}
                </button>
             </div>
             <div className="flex items-center gap-2">
                <div className="flex-1 text-center">
                  <div className="text-xs font-bold text-red-500 mb-1">R</div>
                  <input type="number" value={r} onChange={(e) => handleRgbChange('r', e.target.value)} className="w-full bg-background border border-outline focus:border-primary focus:outline-none rounded h-12 text-center font-mono text-xl" />
                </div>
                <div className="text-xl font-mono text-on-surface-variant pt-4">,</div>
                <div className="flex-1 text-center">
                  <div className="text-xs font-bold text-green-500 mb-1">G</div>
                  <input type="number" value={g} onChange={(e) => handleRgbChange('g', e.target.value)} className="w-full bg-background border border-outline focus:border-primary focus:outline-none rounded h-12 text-center font-mono text-xl" />
                </div>
                <div className="text-xl font-mono text-on-surface-variant pt-4">,</div>
                <div className="flex-1 text-center">
                  <div className="text-xs font-bold text-blue-500 mb-1">B</div>
                  <input type="number" value={b} onChange={(e) => handleRgbChange('b', e.target.value)} className="w-full bg-background border border-outline focus:border-primary focus:outline-none rounded h-12 text-center font-mono text-xl" />
                </div>
             </div>
           </div>

        </div>

        <div className="w-full h-48 rounded-xl border border-outline-variant shadow-inner" style={{ backgroundColor: isValidHex ? (hex.startsWith('#') ? hex : '#'+hex) : '#000000' }}></div>
      </div>
    </div>
  );
}
