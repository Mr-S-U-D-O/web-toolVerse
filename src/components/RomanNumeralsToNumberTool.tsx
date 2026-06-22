import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2 } from 'lucide-react';

const CHAR_MAP: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000
};

// Regex validating standard Roman numerals up to 3999
const ROMAN_REGEX = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;

function romanToInt(romanStr: string): number {
  const str = romanStr.toUpperCase();
  let total = 0;
  for (let i = 0; i < str.length; i++) {
    const currentVal = CHAR_MAP[str.charAt(i)] || 0;
    const nextVal = CHAR_MAP[str.charAt(i + 1)] || 0;

    if (currentVal < nextVal) {
      total -= currentVal;
    } else {
      total += currentVal;
    }
  }
  return total;
}

export default function RomanNumeralsToNumberTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('MMXXVI');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const cleanStr = inputText.trim();
    if (!cleanStr) {
      setOutputText('');
      return;
    }

    if (!ROMAN_REGEX.test(cleanStr)) {
      setOutputText('Invalid Roman numeral structure (e.g. max 3 of M/C/X/I sequentially, and subtractive rules apply).');
      return;
    }

    const value = romanToInt(cleanStr);
    if (value === 0) {
      setOutputText('Invalid Roman numeral value');
    } else {
      setOutputText(value.toString());
    }
  }, [inputText]);

  const handleCopy = async () => {
    if (!outputText || outputText.startsWith('Invalid')) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleClear = () => {
    setInputText('');
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
            <div className="font-sans text-sm font-medium text-on-surface">Roman Numerals to Number</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Roman Numerals to Number</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Convert Roman numeral strings back into standard decimal integers. Validates syntax rules and handles subtractive notations (e.g. IV, IX, CD).
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Configurations (Left) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Input box */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Roman Numeral Input
                </label>
                {inputText && (
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value.replace(/[^IVXLCDMivxlcdm]/g, ''))} // allow only roman numerals
                placeholder="e.g. MMXXVI"
                className="w-full bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-lg text-on-surface focus:outline-none focus:border-[#008cff] transition-colors placeholder:text-outline uppercase"
              />
            </div>

          </div>

          {/* Result Output (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant sticky top-[80px]">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Integer Result
                </label>
                {outputText && !outputText.startsWith('Invalid') && (
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                      copied
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#008cff] text-white hover:bg-[#0070cc] shadow-sm'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Result
                      </>
                    )}
                  </button>
                )}
              </div>
              <div className="w-full min-h-[100px] bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-lg text-on-surface flex items-center break-all">
                {outputText.startsWith('Invalid') ? (
                  <span className="text-red-400 text-sm font-sans">{outputText}</span>
                ) : (
                  outputText || <span className="text-outline/70 text-sm font-sans">Decimal integer will appear here...</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
