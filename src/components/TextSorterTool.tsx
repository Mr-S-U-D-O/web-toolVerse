import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, ArrowUpDown } from 'lucide-react';

export default function TextSorterTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // Configs
  const [sortType, setSortType] = useState<'asc' | 'desc' | 'num-asc' | 'num-desc' | 'length-asc' | 'length-desc' | 'shuffle'>('asc');
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [trimLines, setTrimLines] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    // Split text into lines
    let lines = inputText.split(/\r?\n/);

    // Apply trimming
    if (trimLines) {
      lines = lines.map(line => line.trim());
    }

    // Apply empty line filtering
    if (removeEmpty) {
      lines = lines.filter(line => line !== '');
    }

    // Apply deduplication
    if (removeDuplicates) {
      lines = Array.from(new Set(lines));
    }

    // Apply sorting logic
    if (sortType === 'shuffle') {
      // Fisher-Yates Shuffle
      const arr = [...lines];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      lines = arr;
    } else {
      lines.sort((a, b) => {
        // Handle Length sort
        if (sortType === 'length-asc') {
          return a.length - b.length || a.localeCompare(b);
        }
        if (sortType === 'length-desc') {
          return b.length - a.length || b.localeCompare(a);
        }

        // Handle Numeric sort
        if (sortType === 'num-asc' || sortType === 'num-desc') {
          const numA = parseFloat(a.match(/^-?\d+(\.\d+)?/)?.[0] || '0');
          const numB = parseFloat(b.match(/^-?\d+(\.\d+)?/)?.[0] || '0');
          if (numA !== numB) {
            return sortType === 'num-asc' ? numA - numB : numB - numA;
          }
          // fallback to standard alphabetical if numbers are equal
        }

        // Standard Alphabetical
        const strA = caseSensitive ? a : a.toLowerCase();
        const strB = caseSensitive ? b : b.toLowerCase();

        const comparison = strA.localeCompare(strB, undefined, { numeric: true, sensitivity: 'base' });
        
        if (sortType === 'desc' || sortType === 'num-desc') {
          return -comparison;
        }
        return comparison;
      });
    }

    setOutputText(lines.join('\n'));
  }, [inputText, sortType, caseSensitive, removeDuplicates, trimLines, removeEmpty]);

  const handleCopy = async () => {
    if (!outputText) return;
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
            <span className="font-mono text-[11px] uppercase tracking-widest">Tool Cabinet</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">Text Sorter</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Text Sorter</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Sort text lists instantly. Organize lines alphabetically, numerically, by word/line length, or shuffle them randomly. Removes duplicate lines and trims whitespace on the fly.
          </p>
        </div>

        {/* Two-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input & Configurations (Left) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Input box */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Input Lines to Sort
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
                placeholder="Enter lines of text here...&#10;Orange&#10;Apple&#10;Grape&#10;Banana"
                className="w-full h-64 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-y placeholder:text-outline"
              />
              <div className="mt-2 flex justify-between text-[11px] font-mono text-on-surface-variant">
                <span>Lines: {inputText.split(/\r?\n/).length}</span>
                <span>Length: {inputText.length} chars</span>
              </div>
            </div>

            {/* Config Panel */}
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
              <h2 className="font-heading font-semibold text-base mb-4 flex items-center gap-2">
                <ArrowUpDown className="w-4 h-4 text-[#008cff]" />
                Sorter Options
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Sort Type Selection */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Sort Direction & Type
                  </label>
                  <select
                    value={sortType}
                    onChange={(e) => setSortType(e.target.value as any)}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                  >
                    <option value="asc">Alphabetical (A to Z)</option>
                    <option value="desc">Reverse Alphabetical (Z to A)</option>
                    <option value="num-asc">Numeric Ascending (1 to 10)</option>
                    <option value="num-desc">Numeric Descending (10 to 1)</option>
                    <option value="length-asc">Line Length (Short to Long)</option>
                    <option value="length-desc">Line Length (Long to Short)</option>
                    <option value="shuffle">Shuffle / Randomize</option>
                  </select>
                </div>

                {/* Filters */}
                <div className="flex flex-col gap-3 justify-center sm:pl-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={caseSensitive}
                      onChange={(e) => setCaseSensitive(e.target.checked)}
                      disabled={sortType === 'shuffle' || sortType === 'length-asc' || sortType === 'length-desc'}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4 disabled:opacity-50"
                    />
                    <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors disabled:opacity-50">
                      Case sensitive sort
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={removeDuplicates}
                      onChange={(e) => setRemoveDuplicates(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      Deduplicate lines
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={trimLines}
                      onChange={(e) => setTrimLines(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      Trim line whitespace
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={removeEmpty}
                      onChange={(e) => setRemoveEmpty(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      Ignore empty lines
                    </span>
                  </label>
                </div>

              </div>
            </div>

          </div>

          {/* Output (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant sticky top-[80px]">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Sorted Output
                </label>
                {outputText && (
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
              <textarea
                readOnly
                value={outputText}
                placeholder="Sorted lines will appear here..."
                className="w-full h-80 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none resize-none placeholder:text-outline/70"
              />
              <div className="mt-2 flex justify-between text-[11px] font-mono text-on-surface-variant">
                <span>Lines: {outputText ? outputText.split('\n').length : 0}</span>
                <span>Length: {outputText.length} chars</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
