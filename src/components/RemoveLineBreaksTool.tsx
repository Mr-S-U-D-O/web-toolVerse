import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, WrapText } from 'lucide-react';

export default function RemoveLineBreaksTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // Configs
  const [replacement, setReplacement] = useState<'space' | 'none' | 'custom'>('space');
  const [customChar, setCustomChar] = useState('');
  const [keepParagraphs, setKeepParagraphs] = useState(false);
  const [trimText, setTrimText] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let result = inputText;

    // Define break replacement
    let replChar = '';
    if (replacement === 'space') {
      replChar = ' ';
    } else if (replacement === 'custom') {
      replChar = customChar;
    }

    if (keepParagraphs) {
      // Split into paragraphs (defined by double newlines)
      const paragraphs = result.split(/\r?\n\s*\r?\n/);
      
      // Clean up each paragraph (remove internal line breaks)
      const cleanedParagraphs = paragraphs.map(para => {
        let lines = para.split(/\r?\n/);
        if (trimText) {
          lines = lines.map(line => line.trim());
        }
        return lines.join(replChar);
      });

      result = cleanedParagraphs.join('\n\n');
    } else {
      // Merge everything
      let lines = result.split(/\r?\n/);
      if (trimText) {
        lines = lines.map(line => line.trim());
      }
      result = lines.join(replChar);
    }

    if (trimText) {
      result = result.trim();
    }

    setOutputText(result);
  }, [inputText, replacement, customChar, keepParagraphs, trimText]);

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
            <div className="font-sans text-sm font-medium text-on-surface">Remove Line Breaks</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Remove Line Breaks</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Clean up messy text by removing unwanted carriage returns and newlines. Reformat copied text from PDFs or web articles into single lines, or preserve double-newline paragraphs.
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
                  Input Text with Line Breaks
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
                placeholder="Paste your text with breaks here...&#10;This is a line.&#10;And this is another.&#10;&#10;This is a new paragraph."
                className="w-full h-64 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-y placeholder:text-outline"
              />
              <div className="mt-2 flex justify-between text-[11px] font-mono text-on-surface-variant">
                <span>Original Breaks: {inputText.split(/\r?\n/).length - 1}</span>
                <span>Length: {inputText.length} chars</span>
              </div>
            </div>

            {/* Config Panel */}
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
              <h2 className="font-heading font-semibold text-base mb-4 flex items-center gap-2">
                <WrapText className="w-4 h-4 text-[#008cff]" />
                Cleaning Options
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Break Replacement */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Replace Breaks With
                  </label>
                  <select
                    value={replacement}
                    onChange={(e) => setReplacement(e.target.value as any)}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors mb-2"
                  >
                    <option value="space">Single Space</option>
                    <option value="none">Absolutely Nothing (Merge)</option>
                    <option value="custom">Custom Character / Delimiter</option>
                  </select>
                  {replacement === 'custom' && (
                    <input
                      type="text"
                      value={customChar}
                      onChange={(e) => setCustomChar(e.target.value)}
                      placeholder="e.g. - or , "
                      className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-sm font-mono text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                    />
                  )}
                </div>

                {/* Option Toggles */}
                <div className="flex flex-col gap-4 justify-center sm:pl-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={keepParagraphs}
                      onChange={(e) => setKeepParagraphs(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <div>
                      <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors block">
                        Keep double line breaks
                      </span>
                      <span className="text-[10px] text-outline font-mono block mt-0.5">
                        Preserves separate paragraphs
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={trimText}
                      onChange={(e) => setTrimText(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <div>
                      <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors block">
                        Trim whitespace
                      </span>
                      <span className="text-[10px] text-outline font-mono block mt-0.5">
                        Removes excess spaces at ends
                      </span>
                    </div>
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
                  Cleaned Output
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
                placeholder="Cleaned text will appear here..."
                className="w-full h-80 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none resize-none placeholder:text-outline/70"
              />
              <div className="mt-2 flex justify-between text-[11px] font-mono text-on-surface-variant">
                <span>Remaining Breaks: {outputText ? (outputText.match(/\n/g) || []).length : 0}</span>
                <span>Length: {outputText.length} chars</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
