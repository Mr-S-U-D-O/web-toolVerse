import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft, Copy, Check, FileType, Trash2 } from 'lucide-react';

interface Base64ConverterToolProps {
  onBack: () => void;
}

export default function Base64ConverterTool({ onBack }: Base64ConverterToolProps) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleProcess = () => {
    if (!input) {
      setOutput('');
      setError(null);
      return;
    }
    
    try {
      if (mode === 'encode') {
        // Handle utf-8 encoding safely
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
        setError(null);
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
        setError(null);
      }
    } catch (e: any) {
      setOutput('');
      setError(mode === 'encode' ? 'Failed to encode input.' : 'Invalid Base64 string.');
    }
  };

  React.useEffect(() => {
    handleProcess();
  }, [input, mode]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const clear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  const toggleMode = () => {
    setMode(m => m === 'encode' ? 'decode' : 'encode');
    setInput(output); // swap
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

      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
        <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <FileType className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">Base64 Converter</h1>
            </div>
            
            <button 
              onClick={toggleMode}
              className="flex items-center gap-2 bg-surface-container-highest hover:bg-surface-container text-on-surface border border-outline-variant px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors shadow-sm"
            >
              <ArrowRightLeft className="w-4 h-4" />
              {mode === 'encode' ? 'Encode Mode' : 'Decode Mode'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 min-h-[400px]">
             {/* Input Area */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px] md:h-full">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">
                    {mode === 'encode' ? 'Text Input' : 'Base64 Input'}
                  </span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={mode === 'encode' ? 'Type text to encode...' : 'Paste Base64 to decode...'}
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-[13px] text-on-surface resize-none placeholder:text-outline"
                />
                <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4">
                  <button 
                    onClick={clear} 
                    className="p-1.5 text-on-surface-variant hover:text-error transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-mono text-[10px] uppercase tracking-wider">Clear</span>
                  </button>
                  <span className="font-mono text-[10px] text-outline uppercase tracking-wider">{input.length} chars</span>
                </div>
             </div>

             {/* Output Area */}
             <div className={`border rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px] md:h-full transition-colors ${error ? 'bg-error-container/10 border-error-container' : 'bg-surface-container-low border-outline-variant'}`}>
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">
                    {mode === 'encode' ? 'Base64 Output' : 'Text Output'}
                  </span>
                </div>
                <textarea
                  value={error || output}
                  readOnly
                  placeholder="Result will appear here..."
                  className={`flex-grow w-full bg-transparent p-5 outline-none font-mono text-[13px] resize-none placeholder:text-outline ${error ? 'text-error' : 'text-primary'}`}
                />
                <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4">
                  <button 
                    onClick={handleCopy}
                    disabled={!output || !!error}
                    className="p-1.5 text-primary hover:text-white disabled:opacity-50 disabled:hover:text-primary transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="font-mono text-[10px] uppercase tracking-wider">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                  <span className="font-mono text-[10px] text-outline uppercase tracking-wider">{output.length} chars</span>
                </div>
             </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
