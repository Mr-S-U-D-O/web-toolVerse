import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, Link } from 'lucide-react';

const ENGLISH_STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'but', 'by',
  'for', 'if', 'in', 'into', 'is', 'it', 'no', 'not', 'of',
  'on', 'or', 'such', 'that', 'the', 'their', 'then', 'there',
  'these', 'they', 'this', 'to', 'was', 'will', 'with'
]);

export default function TextToSlugTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  
  // Configs
  const [separator, setSeparator] = useState<'-' | '_'>('-');
  const [removeStopWords, setRemoveStopWords] = useState(false);
  const [lowercase, setLowercase] = useState(true);
  const [stripAccents, setStripAccents] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let text = inputText;

    // 1. Lowercase if needed
    if (lowercase) {
      text = text.toLowerCase();
    }

    // 2. Normalize and strip accents / diacritics
    if (stripAccents) {
      text = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    // 3. Remove punctuation / non-alphanumeric, keeping space, hyphen, underscore
    text = text.replace(/[^a-zA-Z0-9\s-_]/g, '');

    // 4. Split by whitespace/hyphen/underscore to get word tokens
    let tokens = text.trim().split(/[\s-_]+/);

    // 5. Filter stop words if option enabled
    if (removeStopWords) {
      tokens = tokens.filter(token => !ENGLISH_STOP_WORDS.has(token.toLowerCase()));
    }

    // 6. Join with chosen separator
    let slug = tokens.join(separator);

    // Clean up double separators or starting/ending separators
    const doubleSepRegex = new RegExp(`\\${separator}{2,}`, 'g');
    slug = slug.replace(doubleSepRegex, separator);

    // Trim separators from ends
    if (slug.startsWith(separator)) {
      slug = slug.slice(1);
    }
    if (slug.endsWith(separator)) {
      slug = slug.slice(0, -1);
    }

    setOutputText(slug);
  }, [inputText, separator, removeStopWords, lowercase, stripAccents]);

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
            <div className="font-sans text-sm font-medium text-on-surface">Text to Slug</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Text to Slug</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Convert any text or title into an SEO-friendly, clean URL slug. Automatically normalizes accented characters, removes symbols, and strips useless stop words.
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
                  Input Title / Text
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
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. 10 Best Productivity Tools for Developers in 2026!"
                className="w-full bg-surface-container border border-outline-variant rounded-xl p-4 font-sans text-base text-on-surface focus:outline-none focus:border-[#008cff] transition-colors placeholder:text-outline"
              />
            </div>

            {/* Config Panel */}
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
              <h2 className="font-heading font-semibold text-base mb-4 flex items-center gap-2">
                <Link className="w-4 h-4 text-[#008cff]" />
                Slug Generation Settings
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Separator Select */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Separator Character
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: '-', label: 'Hyphen ( - )' },
                      { value: '_', label: 'Underscore ( _ )' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setSeparator(opt.value as any)}
                        className={`py-2 px-3 text-xs font-mono rounded-lg border transition-colors ${
                          separator === opt.value
                            ? 'border-[#008cff] bg-[#008cff]/10 text-white'
                            : 'border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Option Toggles */}
                <div className="flex flex-col gap-3 justify-center sm:pl-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={removeStopWords}
                      onChange={(e) => setRemoveStopWords(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <div>
                      <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors block">
                        Remove English stop words
                      </span>
                      <span className="text-[10px] text-outline font-mono block mt-0.5">
                        Strips 'the', 'and', 'for', etc.
                      </span>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={lowercase}
                      onChange={(e) => setLowercase(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      Force lowercase output
                    </span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={stripAccents}
                      onChange={(e) => setStripAccents(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      Strip accents / diacritics
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
                  Generated URL Slug
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
              <div className="w-full min-h-[80px] bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface break-all flex items-center">
                {outputText || <span className="text-outline/70">Your slug will appear here...</span>}
              </div>
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
