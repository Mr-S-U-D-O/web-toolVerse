import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, HelpCircle } from 'lucide-react';

const WORDS_MAP: Record<string, number> = {
  zero: 0, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, nine: 9,
  ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15, sixteen: 16,
  seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, thirty: 30, forty: 40, fifty: 50, sixty: 60, seventy: 70, eighty: 80, ninety: 90
};

const SCALES_MAP: Record<string, number> = {
  thousand: 1000,
  million: 1000000,
  billion: 1000000000,
  trillion: 1000000000000
};

function parseWordsToNumber(text: string): number | null {
  const clean = text
    .toLowerCase()
    .replace(/-/g, ' ') // replace hyphens
    .replace(/[^a-z\s]/g, '') // remove symbols
    .trim();

  if (!clean) return null;

  const parts = clean.split(/\s+/).filter(w => w !== 'and'); // split and remove 'and'
  
  let total = 0;
  let currentVal = 0;
  let isDecimal = false;
  let decimalStr = '';

  for (let i = 0; i < parts.length; i++) {
    const word = parts[i];

    if (word === 'point') {
      isDecimal = true;
      continue;
    }

    if (isDecimal) {
      // Spell out digits: e.g. "point five six"
      const val = WORDS_MAP[word];
      if (val !== undefined && val < 10) {
        decimalStr += val.toString();
      }
      continue;
    }

    if (WORDS_MAP[word] !== undefined) {
      currentVal += WORDS_MAP[word];
    } else if (word === 'hundred') {
      currentVal = (currentVal || 1) * 100;
    } else if (SCALES_MAP[word] !== undefined) {
      total += (currentVal || 1) * SCALES_MAP[word];
      currentVal = 0;
    } else {
      // Unrecognized word
      return null;
    }
  }

  let finalVal = total + currentVal;
  
  if (isDecimal && decimalStr.length > 0) {
    finalVal = parseFloat(`${finalVal}.${decimalStr}`);
  }

  return finalVal;
}

export default function WordToNumberConverterTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('one million two hundred thousand and forty-five');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }

    const val = parseWordsToNumber(inputText);
    if (val === null || isNaN(val)) {
      setOutputText('Could not parse text. Make sure it is a valid English number spelling.');
    } else {
      setOutputText(val.toString());
    }
  }, [inputText]);

  const handleCopy = async () => {
    if (!outputText || outputText.startsWith('Could not')) return;
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
    <div className="min-h-screen bg-background text-on-surface w-full pb-20">
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
            <div className="font-sans text-sm font-medium text-on-surface">Word to Number Converter</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Word to Number Converter</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Parse spelled-out English numbers back into standard numeric digits. Handles scales up to trillions (e.g., millions, billions) and digit decimals.
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
                  Spelled Words Input
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
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. twelve thousand five hundred and sixty-two point eight"
                className="w-full h-36 bg-surface-container border border-outline-variant rounded-xl p-4 font-sans text-base text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-y placeholder:text-outline"
              />
            </div>

            {/* Quick Helper Panel */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant font-sans text-xs text-on-surface-variant leading-relaxed">
              <h3 className="font-semibold text-white mb-2 uppercase font-mono tracking-wider flex items-center gap-1">
                <HelpCircle className="w-3.5 h-3.5 text-[#008cff]" /> Supported Syntax
              </h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Double digit hyphenations: <code className="font-mono text-white bg-surface-container px-1 py-0.5 rounded">forty-five</code> or <code className="font-mono text-white bg-surface-container px-1 py-0.5 rounded">forty five</code></li>
                <li>Grammatical conjunctions: <code className="font-mono text-white bg-surface-container px-1 py-0.5 rounded">and</code> is automatically ignored</li>
                <li>Decimals: Use <code className="font-mono text-white bg-surface-container px-1 py-0.5 rounded">point</code> followed by single digits (e.g. <code className="font-mono text-white bg-surface-container px-1 py-0.5 rounded">point five zero</code>)</li>
                <li>Scales: <code className="font-mono text-white bg-surface-container px-1 py-0.5 rounded">hundred</code>, <code className="font-mono text-white bg-surface-container px-1 py-0.5 rounded">thousand</code>, <code className="font-mono text-white bg-surface-container px-1 py-0.5 rounded">million</code>, <code className="font-mono text-white bg-surface-container px-1 py-0.5 rounded">billion</code>, <code className="font-mono text-white bg-surface-container px-1 py-0.5 rounded">trillion</code></li>
              </ul>
            </div>

          </div>

          {/* Result Output (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant sticky top-[80px]">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Numerical Output
                </label>
                {outputText && !outputText.startsWith('Could not') && (
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
                {outputText.startsWith('Could not') ? (
                  <span className="text-red-400 text-sm font-sans">{outputText}</span>
                ) : (
                  outputText || <span className="text-outline/70 text-sm font-sans">Parsed value will appear here...</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
