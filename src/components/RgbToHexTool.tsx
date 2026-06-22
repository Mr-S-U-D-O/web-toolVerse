import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield } from 'lucide-react';

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const componentToHex = (c: number) => {
    const hex = clamp(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

// Parses string containing 3 integers (comma/space/parenthesis separated)
function parseRgbString(str: string): { r: number; g: number; b: number } | null {
  const nums = str.match(/\d+/g);
  if (!nums || nums.length < 3) return null;
  const r = parseInt(nums[0], 10);
  const g = parseInt(nums[1], 10);
  const b = parseInt(nums[2], 10);
  if (isNaN(r) || isNaN(g) || isNaN(b)) return null;
  return { r, g, b };
}

export default function RgbToHexTool({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'picker' | 'bulk'>('picker');

  // Slide/Picker Mode State
  const [rVal, setRVal] = useState(0);
  const [gVal, setGVal] = useState(140);
  const [bVal, setBVal] = useState(255);
  const [copiedPicker, setCopiedPicker] = useState(false);

  // Bulk Mode State
  const [inputText, setInputText] = useState('0, 140, 255\nrgb(255, 75, 75)\n155 89 182\n46, 204, 113');
  const [bulkResults, setBulkResults] = useState<Array<{ rgb: string; hex: string; valid: boolean }>>([]);
  const [copiedBulkIndex, setCopiedBulkIndex] = useState<number | null>(null);
  const [copiedBulkAll, setCopiedBulkAll] = useState(false);

  const hexPickerResult = rgbToHex(rVal, gVal, bVal);

  useEffect(() => {
    if (activeTab === 'bulk') {
      const lines = inputText.split('\n');
      const computed = lines.map(line => {
        const cleanLine = line.trim();
        if (!cleanLine) return null;
        const rgbObj = parseRgbString(cleanLine);
        if (rgbObj) {
          return {
            rgb: `rgb(${rgbObj.r}, ${rgbObj.g}, ${rgbObj.b})`,
            hex: rgbToHex(rgbObj.r, rgbObj.g, rgbObj.b),
            valid: true
          };
        }
        return {
          rgb: cleanLine,
          hex: 'Invalid RGB format',
          valid: false
        };
      }).filter(Boolean) as typeof bulkResults;
      setBulkResults(computed);
    }
  }, [inputText, activeTab]);

  const handleCopyPicker = async () => {
    try {
      await navigator.clipboard.writeText(hexPickerResult);
      setCopiedPicker(true);
      setTimeout(() => setCopiedPicker(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyBulkSingle = async (hex: string, index: number) => {
    try {
      await navigator.clipboard.writeText(hex);
      setCopiedBulkIndex(index);
      setTimeout(() => setCopiedBulkIndex(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyBulkAll = async () => {
    const allHexText = bulkResults
      .filter(r => r.valid)
      .map(r => r.hex)
      .join('\n');
    if (!allHexText) return;
    try {
      await navigator.clipboard.writeText(allHexText);
      setCopiedBulkAll(true);
      setTimeout(() => setCopiedBulkAll(false), 2000);
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
            <div className="font-sans text-sm font-medium text-on-surface">RGB to HEX</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">RGB to HEX</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Convert standard decimal Red, Green, and Blue color channels (0-255) into standard Hexadecimal notation. Adjust with sliders or convert in bulk.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-outline-variant mb-8">
          <button
            onClick={() => setActiveTab('picker')}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'picker'
                ? 'border-[#008cff] text-[#008cff]'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Interactive Sliders
          </button>
          <button
            onClick={() => setActiveTab('bulk')}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'bulk'
                ? 'border-[#008cff] text-[#008cff]'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Bulk Converter
          </button>
        </div>

        {activeTab === 'picker' ? (
          /* PICKER / SLIDERS MODE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Control Sliders */}
            <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-6">
              <div className="flex flex-col gap-5">
                {/* R */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Red Channel</span>
                    <span className="text-red-400 font-semibold">{rVal}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={rVal}
                    onChange={(e) => setRVal(parseInt(e.target.value))}
                    className="w-full accent-red-500 bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* G */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Green Channel</span>
                    <span className="text-emerald-400 font-semibold">{gVal}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={gVal}
                    onChange={(e) => setGVal(parseInt(e.target.value))}
                    className="w-full accent-emerald-500 bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* B */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Blue Channel</span>
                    <span className="text-[#008cff] font-semibold">{bVal}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={bVal}
                    onChange={(e) => setBVal(parseInt(e.target.value))}
                    className="w-full accent-[#008cff] bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Results Swatch */}
            <div className="lg:col-span-5 bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col items-center gap-6">
              <div
                className="w-40 h-40 rounded-2xl border border-outline-variant/60 shadow-inner flex items-center justify-center transition-all duration-200"
                style={{ backgroundColor: hexPickerResult }}
              />

              <div className="w-full text-center">
                <span className="font-mono text-xs text-on-surface-variant block mb-1">
                  Hexadecimal Output
                </span>
                <span className="font-mono text-2xl font-bold text-white tracking-wider block mb-4 uppercase">
                  {hexPickerResult}
                </span>

                <button
                  onClick={handleCopyPicker}
                  className={`px-6 py-2.5 rounded-xl font-mono text-xs uppercase tracking-wider transition-all duration-300 w-full ${
                    copiedPicker
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-[#008cff] text-white hover:bg-[#0070cc] shadow-sm'
                  }`}
                >
                  {copiedPicker ? 'Copied Hex' : 'Copy Hex Color'}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* BULK MODE */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Input Box */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  RGB Formats (one per line, e.g. 0, 140, 255)
                </label>
              </div>

              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="0, 140, 255&#10;rgb(255, 75, 75)"
                className="w-full h-80 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
              />

              <div className="mt-2 text-[11px] font-mono text-on-surface-variant flex justify-between">
                <span>Lines: {inputText.split('\n').filter(Boolean).length}</span>
              </div>
            </div>

            {/* Output List Box */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Hex Conversions
                </label>
                {bulkResults.some(r => r.valid) && (
                  <button
                    onClick={handleCopyBulkAll}
                    className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                      copiedBulkAll ? 'text-emerald-400' : 'text-[#008cff] hover:text-[#0070cc]'
                    }`}
                  >
                    {copiedBulkAll ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedBulkAll ? 'All Copied' : 'Copy All Hex'}
                  </button>
                )}
              </div>

              <div className="w-full h-80 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 overflow-y-auto flex flex-col gap-3 scrollbar-thin">
                {bulkResults.length > 0 ? (
                  bulkResults.map((res, index) => (
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
                            {res.rgb}
                          </span>
                          <span className={`font-mono text-[11px] truncate block uppercase ${res.valid ? 'text-[#008cff]' : 'text-red-400'}`}>
                            {res.hex}
                          </span>
                        </div>
                      </div>
                      {res.valid && (
                        <button
                          onClick={() => handleCopyBulkSingle(res.hex, index)}
                          className={`p-1.5 rounded-lg border bg-surface-container-low transition-colors ${
                            copiedBulkIndex === index
                              ? 'border-emerald-500/30 text-emerald-400'
                              : 'border-outline-variant hover:border-[#008cff] text-on-surface-variant hover:text-[#008cff]'
                          }`}
                        >
                          {copiedBulkIndex === index ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
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
                <span>Valid conversions: {bulkResults.filter(r => r.valid).length}</span>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
