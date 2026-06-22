import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, Repeat } from 'lucide-react';

export default function TextRepeaterTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // Configs
  const [count, setCount] = useState(10);
  const [separator, setSeparator] = useState<'newline' | 'space' | 'none' | 'custom'>('newline');
  const [customSeparator, setCustomSeparator] = useState('');
  const [addLineNumbers, setAddLineNumbers] = useState(false);
  const [trimRepeated, setTrimRepeated] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    const segments: string[] = [];
    const baseText = trimRepeated ? inputText.trim() : inputText;

    for (let i = 0; i < count; i++) {
      let repeatedSegment = baseText;
      if (addLineNumbers) {
        repeatedSegment = `${i + 1}. ${repeatedSegment}`;
      }
      segments.push(repeatedSegment);
    }

    let joinChar = '';
    if (separator === 'newline') {
      joinChar = '\n';
    } else if (separator === 'space') {
      joinChar = ' ';
    } else if (separator === 'custom') {
      joinChar = customSeparator;
    }

    setOutputText(segments.join(joinChar));
  }, [inputText, count, separator, customSeparator, addLineNumbers, trimRepeated]);

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
            <div className="font-sans text-sm font-medium text-on-surface">Text Repeater</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Text Repeater</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Multiply text snippets instantly. Set exact repeating frequencies, append customized index numbers, and format separators to generate massive test datasets or repeating strings.
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
                  Text to Repeat
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
                placeholder="Type or paste your text here..."
                className="w-full h-48 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-y placeholder:text-outline"
              />
            </div>

            {/* Config Panel */}
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
              <h2 className="font-heading font-semibold text-base mb-4 flex items-center gap-2">
                <Repeat className="w-4 h-4 text-[#008cff]" />
                Multiplier Configuration
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Repetitions count */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Repeat Count ({count})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="500"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-[#008cff]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-outline mt-1">
                    <span>1</span>
                    <span>500</span>
                  </div>
                </div>

                {/* Separator Select */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Separator Character
                  </label>
                  <select
                    value={separator}
                    onChange={(e) => setSeparator(e.target.value as any)}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors mb-2"
                  >
                    <option value="newline">New Line (\n)</option>
                    <option value="space">Space</option>
                    <option value="none">No Separator</option>
                    <option value="custom">Custom Separator</option>
                  </select>
                  {separator === 'custom' && (
                    <input
                      type="text"
                      value={customSeparator}
                      onChange={(e) => setCustomSeparator(e.target.value)}
                      placeholder="e.g. - or ***"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-sm font-mono text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                    />
                  )}
                </div>

                {/* Toggles */}
                <div className="flex flex-col gap-3 justify-center sm:col-span-2">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={addLineNumbers}
                      onChange={(e) => setAddLineNumbers(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      Add index line numbers (1., 2., 3...)
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={trimRepeated}
                      onChange={(e) => setTrimRepeated(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      Trim input whitespace before repeating
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
                  Repeated Output
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
                placeholder="Repeated text will appear here..."
                className="w-full h-80 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none resize-none placeholder:text-outline/70"
              />
              <div className="mt-2 text-[11px] font-mono text-on-surface-variant">
                <span>Length: {outputText.length} chars</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
