import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Palette } from 'lucide-react';

interface ColorConverterToolProps {
  onBack: () => void;
}

export default function ColorConverterTool({ onBack }: ColorConverterToolProps) {
  const [hex, setHex] = useState('#6366f1');
  const [rgb, setRgb] = useState('rgb(99, 102, 241)');
  const [hsl, setHsl] = useState('hsl(239, 84%, 67%)');
  
  const [activeInput, setActiveInput] = useState<'hex'|'rgb'|'hsl'|null>(null);
  const [copiedStates, setCopiedStates] = useState<{ [key: string]: boolean }>({});

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStates({ ...copiedStates, [id]: true });
    setTimeout(() => setCopiedStates(s => ({ ...s, [id]: false })), 2000);
  };

  // Convert HEX to RGB
  const hexToRgb = (h: string) => {
    let r = 0, g = 0, b = 0;
    if (h.length === 4) {
      r = parseInt(h[1] + h[1], 16);
      g = parseInt(h[2] + h[2], 16);
      b = parseInt(h[3] + h[3], 16);
    } else if (h.length === 7) {
      r = parseInt(h.substring(1, 3), 16);
      g = parseInt(h.substring(3, 5), 16);
      b = parseInt(h.substring(5, 7), 16);
    }
    return `rgb(${r}, ${g}, ${b})`;
  };

  // Convert HEX to HSL
  const hexToHsl = (h: string) => {
    let r = 0, g = 0, b = 0;
    if (h.length === 4) {
      r = parseInt(h[1] + h[1], 16) / 255;
      g = parseInt(h[2] + h[2], 16) / 255;
      b = parseInt(h[3] + h[3], 16) / 255;
    } else if (h.length === 7) {
      r = parseInt(h.substring(1, 3), 16) / 255;
      g = parseInt(h.substring(3, 5), 16) / 255;
      b = parseInt(h.substring(5, 7), 16) / 255;
    }

    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let hVal = 0, sVal = 0, lVal = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      sVal = lVal > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: hVal = (g - b) / d + (g < b ? 6 : 0); break;
        case g: hVal = (b - r) / d + 2; break;
        case b: hVal = (r - g) / d + 4; break;
      }
      hVal /= 6;
    }

    return `hsl(${Math.round(hVal * 360)}, ${Math.round(sVal * 100)}%, ${Math.round(lVal * 100)}%)`;
  };

  const parseRgb = (rStr: string) => {
    const match = rStr.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    if (!match) return null;
    return { r: parseInt(match[1]), g: parseInt(match[2]), b: parseInt(match[3]) };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
  };

  const handleHexChange = (val: string) => {
    let clean = val;
    if (!clean.startsWith('#')) clean = '#' + clean;
    setHex(clean);
    
    if (/^#([0-9A-F]{3}){1,2}$/i.test(clean)) {
      setRgb(hexToRgb(clean));
      setHsl(hexToHsl(clean));
    }
  };

  const handleRgbChange = (val: string) => {
    setRgb(val);
    const parsed = parseRgb(val);
    if (parsed && parsed.r <= 255 && parsed.g <= 255 && parsed.b <= 255) {
      const h = rgbToHex(parsed.r, parsed.g, parsed.b);
      setHex(h);
      setHsl(hexToHsl(h));
    }
  };

  const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(hex);

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">
      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-300">
          
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-2 mb-2">
              <Palette className="w-5 h-5 text-primary" />
              <h1 className="font-heading text-xl font-semibold tracking-tight">Color Converter</h1>
            </div>
            
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6">
               <ColorInput 
                 label="HEX" 
                 value={hex} 
                 onChange={handleHexChange} 
                 onFocus={() => setActiveInput('hex')}
                 onCopy={() => handleCopy(hex, 'hex')}
                 copied={copiedStates['hex']}
               />
               <ColorInput 
                 label="RGB" 
                 value={rgb} 
                 onChange={handleRgbChange} 
                 onFocus={() => setActiveInput('rgb')}
                 onCopy={() => handleCopy(rgb, 'rgb')}
                 copied={copiedStates['rgb']}
               />
               <ColorInput 
                 label="HSL" 
                 value={hsl} 
                 onChange={(e) => setHsl(e)} 
                 onFocus={() => setActiveInput('hsl')}
                 onCopy={() => handleCopy(hsl, 'hsl')}
                 copied={copiedStates['hsl']}
                 disabled={true}
                 note="Calculated automatically"
               />
            </div>
          </div>

          {/* Color Preview */}
          <div className="flex flex-col items-center justify-center">
             <div 
               className="w-full aspect-square md:aspect-auto md:h-full max-h-[500px] rounded-2xl border-2 border-outline-variant shadow-2xl relative overflow-hidden flex flex-col items-center justify-center transition-colors duration-500"
               style={{ backgroundColor: isValidHex ? hex : 'transparent' }}
             >
                {!isValidHex && <span className="font-mono text-outline">Invalid Color</span>}
                {isValidHex && (
                  <div className="bg-black/40 backdrop-blur-md px-6 py-4 rounded-xl border border-white/10 text-white font-mono text-xl tracking-wider shadow-xl">
                    {hex.toUpperCase()}
                  </div>
                )}
             </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

function ColorInput({ label, value, onChange, onFocus, onCopy, copied, disabled, note }: { 
  label: string, value: string, onChange: (v: string) => void, onFocus: () => void, onCopy: () => void, copied: boolean, disabled?: boolean, note?: string
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end">
        <label className="font-mono text-[11px] text-outline uppercase tracking-widest font-semibold">{label}</label>
        {note && <span className="font-mono text-[10px] text-on-surface-variant">{note}</span>}
      </div>
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          disabled={disabled}
          className={`w-full bg-surface-container-highest border ${disabled ? 'border-transparent text-on-surface-variant' : 'border-outline-variant hover:border-outline focus:border-primary text-on-surface'} rounded-lg px-4 py-3 font-mono text-[14px] outline-none transition-colors pr-12`}
        />
        <button 
          onClick={onCopy}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant hover:text-primary transition-colors disabled:opacity-0"
        >
          {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
