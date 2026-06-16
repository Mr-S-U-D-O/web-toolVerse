import React, { useState } from 'react';
import { ArrowLeft, Trash2, Copy, Check, FileDown, ArrowRightLeft } from 'lucide-react';

export default function CsvToJsonTool({ onBack }: { onBack: () => void }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    if (!input.trim()) return;
    try {
      const lines = input.trim().split('\n');
      if (lines.length === 0) throw new Error("Empty CSV");
      
      const headers = lines[0].split(',').map(h => h.trim());
      const result = [];

      for (let i = 1; i < lines.length; i++) {
        const obj: Record<string, string> = {};
        const currentline = lines[i].split(',');
        for (let j = 0; j < headers.length; j++) {
            obj[headers[j]] = currentline[j] ? currentline[j].trim() : "";
        }
        result.push(obj);
      }
      
      setOutput(JSON.stringify(result, null, 2));
      setError(null);
    } catch (e: any) {
      setOutput('');
      setError('Invalid CSV format. Ensure comma-separated values with headers.');
    }
  };

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output);
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

      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
        <div className="w-full max-w-5xl flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <FileDown className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">CSV to JSON Converter</h1>
            </div>
            <button 
              onClick={handleConvert}
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-on-primary px-4 py-2 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors shadow-sm font-semibold"
            >
              <ArrowRightLeft className="w-4 h-4" /> Convert
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 min-h-[500px]">
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px] md:h-full">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">Input CSV</span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => { setInput(e.target.value); setOutput(''); setError(null); }}
                  placeholder={"name,age,city\njohn,30,new york\njane,25,london"}
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-[12px] text-on-surface resize-none placeholder:text-outline/50"
                  spellCheck="false"
                  wrap="off"
                />
                <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4">
                  <button onClick={() => { setInput(''); setError(null); }} className="p-1.5 text-on-surface-variant hover:text-error transition-colors flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    <span className="font-mono text-[10px] uppercase tracking-wider">Clear</span>
                  </button>
                </div>
             </div>

             <div className={`border rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px] md:h-full transition-colors ${error ? 'bg-error-container/10 border-error-container' : 'bg-surface-container-low border-outline-variant'}`}>
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">JSON Output</span>
                </div>
                <textarea
                  value={error || output}
                  readOnly
                  placeholder="Result..."
                  className={`flex-grow w-full bg-transparent p-5 outline-none font-mono text-[12px] resize-none placeholder:text-outline ${error ? 'text-error' : 'text-primary'}`}
                  spellCheck="false"
                  wrap="off"
                />
                <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4">
                  <button 
                    onClick={handleCopy}
                    disabled={!output || !!error}
                    className="p-1.5 text-primary hover:text-white disabled:opacity-50 transition-colors flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span className="font-mono text-[10px] uppercase tracking-wider">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
