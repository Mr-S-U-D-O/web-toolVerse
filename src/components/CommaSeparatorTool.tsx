import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, ArrowRightLeft } from 'lucide-react';

export default function CommaSeparatorTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // Configs
  const [inputDelimiter, setInputDelimiter] = useState<'newline' | 'comma' | 'semicolon' | 'space'>('newline');
  const [outputDelimiter, setOutputDelimiter] = useState<', ' | ',' | '; ' | ' | ' | '\\n' | '\\t' | 'custom'>(', ');
  const [customDelimiter, setCustomDelimiter] = useState('');
  const [quoteWrap, setQuoteWrap] = useState<'none' | 'single' | 'double' | 'backtick'>('none');
  const [trimItems, setTrimItems] = useState(true);
  const [removeEmpty, setRemoveEmpty] = useState(true);
  const [removeDuplicates, setRemoveDuplicates] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    // 1. Split input by selected delimiter
    let items: string[] = [];
    if (inputDelimiter === 'newline') {
      items = inputText.split(/\r?\n/);
    } else if (inputDelimiter === 'comma') {
      items = inputText.split(',');
    } else if (inputDelimiter === 'semicolon') {
      items = inputText.split(';');
    } else if (inputDelimiter === 'space') {
      items = inputText.split(/\s+/);
    }

    // 2. Apply cleaning (Trim)
    if (trimItems) {
      items = items.map(item => item.trim());
    }

    // 3. Filter empty elements
    if (removeEmpty) {
      items = items.filter(item => item !== '');
    }

    // 4. Remove Duplicates
    if (removeDuplicates) {
      items = Array.from(new Set(items));
    }

    // 5. Apply quote wrapping
    if (quoteWrap !== 'none') {
      const q = quoteWrap === 'single' ? "'" : quoteWrap === 'double' ? '"' : '`';
      items = items.map(item => `${q}${item}${q}`);
    }

    // 6. Join output
    let delim = '';
    if (outputDelimiter === 'custom') {
      delim = customDelimiter;
    } else if (outputDelimiter === '\\n') {
      delim = '\n';
    } else if (outputDelimiter === '\\t') {
      delim = '\t';
    } else {
      delim = outputDelimiter;
    }

    setOutputText(items.join(delim));
  }, [
    inputText,
    inputDelimiter,
    outputDelimiter,
    customDelimiter,
    quoteWrap,
    trimItems,
    removeEmpty,
    removeDuplicates
  ]);

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
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">Comma Separator</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Comma Separator</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Convert lists, column data, or text items into comma-separated strings or custom delimited formats. Clean duplicates and wrap items in quotes instantly.
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
                  Input Text / List
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
                placeholder="Paste list here (e.g. one item per line)...&#10;Apple&#10;Banana&#10;Cherry"
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
                <ArrowRightLeft className="w-4 h-4 text-[#008cff]" />
                Formatting Configuration
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Input Delimiter */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Separate Input By
                  </label>
                  <select
                    value={inputDelimiter}
                    onChange={(e) => setInputDelimiter(e.target.value as any)}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                  >
                    <option value="newline">New Line (\n)</option>
                    <option value="comma">Comma (,)</option>
                    <option value="semicolon">Semicolon (;)</option>
                    <option value="space">Whitespace / Space</option>
                  </select>
                </div>

                {/* Output Delimiter */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Join Output With
                  </label>
                  <select
                    value={outputDelimiter}
                    onChange={(e) => setOutputDelimiter(e.target.value as any)}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors mb-2"
                  >
                    <option value=", ">Comma & Space (, )</option>
                    <option value=",">Comma (,)</option>
                    <option value="; ">Semicolon & Space (; )</option>
                    <option value=" | ">Pipe ( | )</option>
                    <option value="\\n">New Line (\n)</option>
                    <option value="\\t">Tab (\t)</option>
                    <option value="custom">Custom Separator</option>
                  </select>
                  {outputDelimiter === 'custom' && (
                    <input
                      type="text"
                      value={customDelimiter}
                      onChange={(e) => setCustomDelimiter(e.target.value)}
                      placeholder="e.g. _or_"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-sm font-mono text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                    />
                  )}
                </div>

                {/* Quote Wrap */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Wrap Items In
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'none', label: 'None' },
                      { value: 'single', label: "Single '" },
                      { value: 'double', label: 'Double "' },
                      { value: 'backtick', label: 'Backtick `' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setQuoteWrap(opt.value as any)}
                        className={`py-2 px-3 text-xs font-mono rounded-lg border transition-colors ${
                          quoteWrap === opt.value
                            ? 'border-[#008cff] bg-[#008cff]/10 text-white'
                            : 'border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Checklist options */}
                <div className="flex flex-col gap-3 justify-center">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={trimItems}
                      onChange={(e) => setTrimItems(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      Trim items whitespace
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
                      Remove empty elements
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
                      Deduplicate items
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
                  Formatted Output
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
                placeholder="Formatted output will appear here..."
                className="w-full h-80 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none resize-none placeholder:text-outline/70"
              />
              <div className="mt-2 flex justify-between text-[11px] font-mono text-on-surface-variant">
                <span>Items: {outputText ? outputText.split(outputDelimiter === 'custom' ? customDelimiter : outputDelimiter === '\\n' ? '\n' : outputDelimiter === '\\t' ? '\t' : outputDelimiter).length : 0}</span>
                <span>Length: {outputText.length} chars</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
