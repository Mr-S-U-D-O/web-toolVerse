import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Copy, Check, Shield, ArrowRightLeft } from 'lucide-react';

export type FormatType = 'text' | 'binary' | 'octal' | 'decimal' | 'hex' | 'ascii';

interface BaseEncodingConverterProps {
  fromType: FormatType;
  toType: FormatType;
  onBack?: () => void;
}

const FORMAT_LABELS: Record<FormatType, string> = {
  text: 'Text (UTF-8)',
  binary: 'Binary (Base 2)',
  octal: 'Octal (Base 8)',
  decimal: 'Decimal (Base 10)',
  hex: 'Hexadecimal (Base 16)',
  ascii: 'ASCII (Decimal)'
};

const DEFAULT_PLACEHOLDERS: Record<FormatType, string> = {
  text: 'Type plain text here... (e.g. Hello)',
  binary: 'Type binary bytes separated by spaces... (e.g. 01001000 01100101)',
  octal: 'Type octal bytes separated by spaces... (e.g. 110 145)',
  decimal: 'Type decimal bytes separated by spaces... (e.g. 72 101)',
  hex: 'Type hex bytes separated by spaces... (e.g. 48 65)',
  ascii: 'Type ASCII decimal values separated by spaces... (e.g. 72 101)'
};

const DEFAULT_VALUES: Record<FormatType, string> = {
  text: 'Hello',
  binary: '01001000 01100101 01101100 01101100 01101111',
  octal: '110 145 154 154 157',
  decimal: '72 101 108 108 111',
  hex: '48 65 6c 6c 6f',
  ascii: '72 101 108 108 111'
};

// Parse value string to byte array (Uint8Array)
function decodeToBytes(input: string, format: FormatType): Uint8Array {
  if (!input) return new Uint8Array();
  
  try {
    if (format === 'text') {
      return new TextEncoder().encode(input);
    }
    
    // Non-text inputs are space/comma separated codes
    const tokens = input.trim().split(/[\s,]+/);
    const bytes: number[] = [];
    
    if (format === 'hex') {
      // Hex can sometimes be compact (e.g. "48656c6c6f" instead of "48 65 6c 6c 6f")
      let hexTokens = tokens;
      if (tokens.length === 1 && tokens[0].length % 2 === 0 && tokens[0].length > 2) {
        hexTokens = tokens[0].match(/.{1,2}/g) || [];
      }
      
      hexTokens.forEach(t => {
        const clean = t.replace(/[^0-9a-fA-F]/g, '');
        if (clean) {
          const val = parseInt(clean, 16);
          if (!isNaN(val) && val >= 0 && val <= 255) {
            bytes.push(val);
          }
        }
      });
    } else {
      const base = format === 'binary' ? 2 : format === 'octal' ? 8 : 10;
      const mask = format === 'binary' ? /[^01]/g : format === 'octal' ? /[^0-7]/g : /[^0-9]/g;
      
      tokens.forEach(t => {
        const clean = t.replace(mask, '');
        if (clean) {
          const val = parseInt(clean, base);
          if (!isNaN(val) && val >= 0 && val <= 255) {
            bytes.push(val);
          }
        }
      });
    }
    
    return new Uint8Array(bytes);
  } catch (err) {
    console.error('Decoding failed', err);
    return new Uint8Array();
  }
}

// Format byte array to value string
function encodeFromBytes(bytes: Uint8Array, format: FormatType): string {
  if (bytes.length === 0) return '';
  
  try {
    if (format === 'text') {
      return new TextDecoder().decode(bytes);
    }
    
    const arr = Array.from(bytes);
    
    if (format === 'binary') {
      return arr.map(b => b.toString(2).padStart(8, '0')).join(' ');
    }
    if (format === 'octal') {
      return arr.map(b => b.toString(8).padStart(3, '0')).join(' ');
    }
    if (format === 'hex') {
      return arr.map(b => b.toString(16).padStart(2, '0')).join(' ');
    }
    // decimal and ascii
    return arr.map(b => b.toString(10)).join(' ');
  } catch (err) {
    console.error('Encoding failed', err);
    return '';
  }
}

export default function BaseEncodingConverter({
  fromType: initialFromType,
  toType: initialToType,
  onBack
}: BaseEncodingConverterProps) {
  const [fromType, setFromType] = useState<FormatType>(initialFromType);
  const [toType, setToType] = useState<FormatType>(initialToType);
  const [inputValue, setInputValue] = useState<string>('');
  
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedGridId, setCopiedGridId] = useState<string | null>(null);

  // Set default value based on the initial format when the component loads
  useEffect(() => {
    setInputValue(DEFAULT_VALUES[initialFromType]);
  }, [initialFromType]);

  // Decode to bytes
  const bytes = useMemo(() => {
    return decodeToBytes(inputValue, fromType);
  }, [inputValue, fromType]);

  // Compute calculated output
  const outputValue = useMemo(() => {
    return encodeFromBytes(bytes, toType);
  }, [bytes, toType]);

  // Swap From and To
  const handleSwap = () => {
    setFromType(toType);
    setToType(fromType);
    if (outputValue !== '') {
      setInputValue(outputValue);
    }
  };

  const handleCopyMain = async () => {
    if (outputValue === '') return;
    try {
      await navigator.clipboard.writeText(outputValue);
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleCopyGrid = async (valStr: string, id: string) => {
    try {
      await navigator.clipboard.writeText(valStr);
      setCopiedGridId(id);
      setTimeout(() => setCopiedGridId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const title = `${FORMAT_LABELS[fromType]} to ${FORMAT_LABELS[toType]} Converter`;

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
            <span className="font-mono text-[11px] uppercase tracking-widest">Tool Cabinet</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">{title}</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">{title}</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Convert data between standard plain text UTF-8 and numeric byte representations like binary code, octal values, hex values, and ASCII decimal tables.
          </p>
        </div>

        {/* Dual Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-10">
          
          {/* INPUT Box */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Input Format: {FORMAT_LABELS[fromType]}
              </label>
              
              <select
                value={fromType}
                onChange={(e) => setFromType(e.target.value as FormatType)}
                className="bg-surface-container border border-outline-variant rounded-lg px-3 py-1 text-xs font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
              >
                {Object.entries(FORMAT_LABELS).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={DEFAULT_PLACEHOLDERS[fromType]}
              className="w-full h-64 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
            />
            
            <div className="mt-2 text-[11px] font-mono text-on-surface-variant flex justify-between">
              <span>Bytes: {bytes.length}</span>
              <span>Length: {inputValue.length} chars</span>
            </div>
          </div>

          {/* Swap Trigger (overlay in absolute or center column) */}
          <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex items-center justify-center self-center pointer-events-none z-10">
            <button
              onClick={handleSwap}
              className="pointer-events-auto w-10 h-10 rounded-full bg-surface-container border border-outline-variant hover:border-[#008cff] text-on-surface-variant hover:text-[#008cff] flex items-center justify-center transition-all shadow-md active:scale-95"
              title="Swap formats"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* OUTPUT Box */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                Output Format: {FORMAT_LABELS[toType]}
              </label>
              
              <div className="flex items-center gap-3">
                {outputValue && (
                  <button
                    onClick={handleCopyMain}
                    className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                      copiedMain ? 'text-emerald-400' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {copiedMain ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedMain ? 'Copied' : 'Copy'}
                  </button>
                )}
                
                <select
                  value={toType}
                  onChange={(e) => setToType(e.target.value as FormatType)}
                  className="bg-surface-container border border-outline-variant rounded-lg px-3 py-1 text-xs font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                >
                  {Object.entries(FORMAT_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <textarea
              readOnly
              value={outputValue}
              placeholder="Output will load here..."
              className="w-full h-64 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-[#008cff] focus:outline-none resize-none placeholder:text-outline/70"
            />
            
            <div className="mt-2 text-[11px] font-mono text-on-surface-variant flex justify-between">
              <span>Output length: {outputValue.length} chars</span>
            </div>
          </div>

        </div>

        {/* Encoding Matrix Grid Reference */}
        <div>
          <h2 className="font-heading font-semibold text-lg mb-6 text-white">
            Encoding Matrix Dashboard
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {(Object.keys(FORMAT_LABELS) as FormatType[]).map((formatKey) => {
              const val = encodeFromBytes(bytes, formatKey);
              const isCopied = copiedGridId === formatKey;

              return (
                <div
                  key={formatKey}
                  className="bg-surface-container-low border border-outline-variant hover:border-outline p-4 rounded-xl flex flex-col justify-between group transition-colors relative"
                >
                  <button
                    onClick={() => handleCopyGrid(val, formatKey)}
                    className={`absolute top-3 right-3 p-1.5 rounded-lg border bg-surface-container-lowest transition-colors opacity-0 group-hover:opacity-100 ${
                      isCopied
                        ? 'border-emerald-500/30 text-emerald-400'
                        : 'border-outline-variant hover:border-[#008cff] text-on-surface-variant hover:text-[#008cff]'
                    }`}
                    title="Copy value"
                    disabled={!val}
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant block mb-2">
                    {FORMAT_LABELS[formatKey]}
                  </span>
                  
                  <textarea
                    readOnly
                    value={val}
                    placeholder="No bytes to represent..."
                    className="w-full h-24 bg-surface-container-lowest border border-outline-variant/50 rounded-lg p-2.5 font-mono text-[11px] text-white focus:outline-none resize-none scrollbar-thin placeholder:text-outline/50"
                  />
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
