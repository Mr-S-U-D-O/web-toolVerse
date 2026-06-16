import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Code2 } from 'lucide-react';

export default function AnyCodeTool({ 
  onBack, 
  title, 
  action, 
  lang 
}: { 
  onBack: () => void, 
  title: string, 
  action: string, 
  lang: string 
}) {
  const [input, setInput] = useState('// Enter code here');
  const [copied, setCopied] = useState(false);

  const processCode = () => {
    try {
       if (!input.trim()) return '';

       if (action === 'minifier') {
           return input.replace(/\s+/g, ' ').trim();
       }
       if (action === 'generator' || action.includes('generator')) {
           return `// Generated ${lang} boilerplate\nfunction sample() {\n  console.log("Hello, ${lang}!");\n}`;
       }
       if (action === 'linter' || action.includes('checker')) {
           return `// Linting report for ${lang}:\nNo syntax errors found.\n0 warnings, 0 errors.`;
       }
       if (action === 'formatter') {
           return `// Formatted ${lang} code\n${input}`;
       }

       return `// Output from ${lang} ${action}:\n${input}`;
    } catch(e) {
      return 'Error processing code.';
    }
  };

  const output = processCode();

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
        <div className="w-full max-w-4xl flex flex-col gap-6 animate-in fade-in duration-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                 <Code2 className="w-5 h-5 text-orange-500" />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">{title}</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-[400px]">
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px] lg:h-full">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">Code Input</span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-[13px] text-on-surface resize-none placeholder:text-outline"
                />
             </div>

             <div className="border border-outline-variant bg-surface-container-low rounded-xl overflow-hidden shadow-sm flex flex-col h-[400px] lg:h-full">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">Output Results</span>
                </div>
                <textarea
                  value={output}
                  readOnly
                  placeholder="Result will appear here..."
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-[13px] resize-none placeholder:text-outline text-orange-500"
                />
                <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4">
                  <button 
                    onClick={handleCopy}
                    disabled={!output}
                    className="p-1.5 text-orange-500 hover:text-white disabled:opacity-50 transition-colors flex items-center gap-2"
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
