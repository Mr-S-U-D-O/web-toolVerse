import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Type, Trash2, AlignLeft } from 'lucide-react';

interface TextFormatterToolProps {
  onBack: () => void;
}

export default function TextFormatterTool({ onBack }: TextFormatterToolProps) {
  const [inputText, setInputText] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (!inputText) return;
    navigator.clipboard.writeText(inputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const transform = (type: string) => {
    let result = inputText;
    switch (type) {
      case 'upper': result = result.toUpperCase(); break;
      case 'lower': result = result.toLowerCase(); break;
      case 'title': result = result.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.substring(1).toLowerCase()); break;
      case 'sentence': result = result.toLowerCase().replace(/(^\s*\w|[\.\!\?]\s*\w)/g, (c) => c.toUpperCase()); break;
      case 'spaces': result = result.replace(/\s+/g, ' ').trim(); break;
      case 'lines': result = result.replace(/(\r\n|\n|\r)/gm, ' '); break;
    }
    setInputText(result);
  };

  const getStats = () => {
    const chars = inputText.length;
    const words = inputText.trim() ? inputText.trim().split(/\s+/).length : 0;
    const lines = inputText === '' ? 0 : inputText.split(/\r\n|\r|\n/).length;
    return { chars, words, lines };
  };

  const stats = getStats();

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">
      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 animate-in fade-in duration-300">
          
          <div className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <Type className="w-5 h-5 text-primary" />
                <h1 className="font-heading text-xl font-semibold tracking-tight">Text Formatter</h1>
              </div>
              <div className="flex items-center gap-4 text-outline font-mono text-[13px]">
                <span>W: {stats.words}</span>
                <span>C: {stats.chars}</span>
                <span>L: {stats.lines}</span>
              </div>
            </div>
            
            <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste or type your text here..."
                className="flex-grow w-full bg-transparent p-6 outline-none font-sans text-on-surface resize-none placeholder:text-outline"
              />
              <div className="h-14 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4">
                <button 
                  onClick={() => setInputText('')} 
                  className="p-2 text-on-surface-variant hover:text-error transition-colors flex items-center gap-2"
                  title="Clear Text"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="font-mono text-[11px] uppercase tracking-wider">Clear</span>
                </button>
                <button 
                  onClick={handleCopy}
                  className="p-2 text-primary hover:text-white transition-colors flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span className="font-mono text-[11px] uppercase tracking-wider">{copied ? 'Copied!' : 'Copy Result'}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-4">
              <h3 className="font-mono text-[13px] text-on-surface uppercase tracking-widest font-semibold flex items-center justify-between border-b border-outline-variant pb-4 mb-2">
                Transform Actions
              </h3>
              
              <div className="grid grid-cols-2 gap-3">
                <ActionButton label="UPPERCASE" onClick={() => transform('upper')} />
                <ActionButton label="lowercase" onClick={() => transform('lower')} />
                <ActionButton label="Title Case" onClick={() => transform('title')} />
                <ActionButton label="Sentence case" onClick={() => transform('sentence')} />
              </div>

              <div className="border-t border-outline-variant my-2" />
              
              <h3 className="font-mono text-[11px] text-outline uppercase tracking-widest font-semibold mb-1">
                Cleanup
              </h3>
              <div className="flex flex-col gap-3">
                <ActionButton label="Remove Extra Spaces" onClick={() => transform('spaces')} />
                <ActionButton label="Remove Line Breaks" onClick={() => transform('lines')} />
              </div>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

function ActionButton({ label, onClick }: { label: string, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="bg-surface-container-highest border border-outline-variant hover:border-outline text-on-surface hover:text-primary rounded py-3 px-4 font-mono text-[12px] transition-colors text-left font-medium w-full"
    >
      {label}
    </button>
  );
}
