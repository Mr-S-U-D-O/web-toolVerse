import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, RefreshCw } from 'lucide-react';

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace(/^#/, '').trim();
  if (clean.length !== 3 && clean.length !== 6) return null;
  
  let r, g, b;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
}

export default function HexToRgbTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('#008cff\n#ff4b4b\n#2ecc71\n#9b59b6');
  const [results, setResults] = useState<Array<{ hex: string; rgb: string; r: number; g: number; b: number; valid: boolean }>>([]);
  const [copiedAll, setCopiedAll] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    const lines = inputText.split('\n');
    const computed = lines.map(line => {
      const cleanLine = line.trim();
      if (!cleanLine) return null;
      const rgbObj = hexToRgb(cleanLine);
      if (rgbObj) {
        return {
          hex: cleanLine.startsWith('#') ? cleanLine : `#${cleanLine}`,
          rgb: `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`,
          r: rgbObj.r,
          g: rgbObj.g,
          b: rgbObj.b,
          valid: true
        };
      }
      return {
        hex: cleanLine,
        rgb: 'Invalid hex code',
        r: 0,
        g: 0,
        b: 0,
        valid: false
      };
    }).filter(Boolean) as typeof results;
    setResults(computed);
  }, [inputText]);

  const handleCopySingle = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyAll = async () => {
    const allRgbText = results
      .filter(r => r.valid)
      .map(r => r.rgb)
      .join('\n');
    if (!allRgbText) return;
    try {
      await navigator.clipboard.writeText(allRgbText);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface w-full pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">HEX to RGB</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#008cff]/10 border border-[#008cff]/20 text-[10px] font-mono uppercase tracking-wider text-[#008cff]">
              <Shield className="w-3 h-3" />
              100% Client-Side
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10 w-full">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">HEX to RGB</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Convert Hexadecimal color codes (e.g. #008CFF) into standard Decimal RGB values. Paste a single code or a bulk list (one per line).
          </p>
        </div>

        {/* Dual Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Input Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                HEX Hexadecimal Codes (one per line)
              </label>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="#008cff&#10;#ff4b4b&#10;#2ecc71"
              className="w-full h-80 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
            />
            
            <div className="mt-2 text-[11px] font-mono text-on-surface-variant flex justify-between">
              <span>Lines: {inputText.split('\n').filter(Boolean).length}</span>
            </div>
          </div>

          {/* Results Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                RGB Conversions
              </label>
              {results.some(r => r.valid) && (
                <button
                  onClick={handleCopyAll}
                  className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                    copiedAll ? 'text-emerald-400' : 'text-[#008cff] hover:text-[#0070cc]'
                  }`}
                >
                  {copiedAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAll ? 'All Copied' : 'Copy All RGB'}
                </button>
              )}
            </div>

            <div className="w-full h-80 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin">
              {results.length > 0 ? (
                results.map((res, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-surface-container rounded-xl border border-outline-variant/60 hover:border-outline-variant transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {res.valid ? (
                        <div
                          className="w-8 h-8 rounded-lg border border-outline-variant/40 flex-shrink-0"
                          style={{ backgroundColor: res.hex }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-lg border border-red-500/20 bg-red-500/10 flex-shrink-0 flex items-center justify-center text-red-400 font-mono text-[9px] font-semibold">
                          Err
                        </div>
                      )}
                      <div className="overflow-hidden">
                        <span className="font-mono text-xs font-semibold text-white truncate block">
                          {res.hex}
                        </span>
                        <span className={`font-mono text-[11px] truncate block ${res.valid ? 'text-[#008cff]' : 'text-red-400'}`}>
                          {res.rgb}
                        </span>
                      </div>
                    </div>
                    {res.valid && (
                      <button
                        onClick={() => handleCopySingle(res.rgb, index)}
                        className={`p-1.5 rounded-lg border bg-surface-container-low transition-colors ${
                          copiedIndex === index
                            ? 'border-emerald-500/30 text-emerald-400'
                            : 'border-outline-variant hover:border-[#008cff] text-on-surface-variant hover:text-[#008cff]'
                        }`}
                      >
                        {copiedIndex === index ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center text-outline text-xs font-mono">
                  Waiting for input...
                </div>
              )}
            </div>

            <div className="mt-2 text-[11px] font-mono text-on-surface-variant flex justify-between">
              <span>Valid conversions: {results.filter(r => r.valid).length}</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
