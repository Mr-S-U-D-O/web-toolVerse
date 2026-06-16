import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Code, AlertTriangle, Play } from 'lucide-react';

interface JsonFormatterToolProps {
  onBack: () => void;
}

export default function JsonFormatterTool({ onBack }: JsonFormatterToolProps) {
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const formatJSON = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed, null, 2));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const minifyJSON = () => {
    if (!input.trim()) return;
    try {
      const parsed = JSON.parse(input);
      setInput(JSON.stringify(parsed));
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const validateJSON = () => {
    if (!input.trim()) return;
    try {
      JSON.parse(input);
      setError('Valid JSON');
      setTimeout(() => setError(null), 3000);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleCopy = () => {
    if (!input) return;
    navigator.clipboard.writeText(input);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
        <div className="w-full max-w-5xl flex flex-col gap-6 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              <h1 className="font-heading text-xl font-semibold tracking-tight">JSON Formatter & Validator</h1>
            </div>
            
            <div className="flex gap-3">
               <button onClick={validateJSON} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors px-4 border border-outline-variant rounded bg-surface-container-low py-1.5 font-mono text-[11px] uppercase tracking-wider">
                 Validate
               </button>
               <button onClick={formatJSON} className="flex items-center gap-2 text-on-surface hover:text-primary border-primary border hover:border-primary-container transition-colors px-4 rounded bg-primary/10 py-1.5 font-mono text-[11px] uppercase tracking-wider font-semibold">
                 Beautify
               </button>
               <button onClick={minifyJSON} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors px-4 border border-outline-variant rounded bg-surface-container-low py-1.5 font-mono text-[11px] uppercase tracking-wider">
                 Minify
               </button>
            </div>
          </div>
          
          {error && (
            <div className={`p-4 rounded border ${error === 'Valid JSON' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-error-container/20 border-error-container text-error flex items-center gap-3 font-mono text-sm'}`}>
              {error !== 'Valid JSON' && <AlertTriangle className="w-5 h-5" />}
              {error}
            </div>
          )}

          <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                if (error && error !== 'Valid JSON') setError(null);
              }}
              placeholder="Paste JSON payload here..."
              className="flex-grow w-full bg-transparent p-6 outline-none font-mono text-[13px] text-on-surface resize-none placeholder:text-outline leading-relaxed"
              spellCheck="false"
            />
            <div className="h-14 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4">
              <span className="font-mono text-xs text-outline ml-2">
                {input.length} characters
              </span>
              <button 
                onClick={handleCopy}
                className="p-2 text-primary hover:text-white transition-colors flex items-center gap-2"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span className="font-mono text-[11px] uppercase tracking-wider">{copied ? 'Copied JSON!' : 'Copy to Clipboard'}</span>
              </button>
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
