import React, { useState } from 'react';
import { ArrowLeft, Trash2, Edit3 } from 'lucide-react';

export default function WordCounterTool({ onBack }: { onBack: () => void }) {
  const [text, setText] = useState('');

  const charCount = text.length;
  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
  const lineCount = text === '' ? 0 : text.split('\n').length;
  const charNoSpace = text.replace(/\s/g, '').length;

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
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <Edit3 className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">Word Counter</h1>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
             <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col gap-1 items-center justify-center text-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-outline">Words</span>
                <span className="font-heading text-3xl font-bold text-primary">{wordCount}</span>
             </div>
             <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col gap-1 items-center justify-center text-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-outline">Characters</span>
                <span className="font-heading text-3xl font-bold text-primary">{charCount}</span>
             </div>
             <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col gap-1 items-center justify-center text-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-outline">Chars (No Space)</span>
                <span className="font-heading text-3xl font-bold text-primary">{charNoSpace}</span>
             </div>
             <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col gap-1 items-center justify-center text-center">
                <span className="font-mono text-[10px] uppercase tracking-widest text-outline">Lines</span>
                <span className="font-heading text-3xl font-bold text-primary">{lineCount}</span>
             </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col min-h-[400px]">
              <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                <span className="font-mono text-xs text-outline uppercase tracking-widest">Input Text</span>
              </div>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste text here to count..."
                className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-[14px] text-on-surface resize-none placeholder:text-outline"
              />
              <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4">
                <button onClick={() => setText('')} className="p-1.5 text-on-surface-variant hover:text-error transition-colors flex items-center gap-2">
                  <Trash2 className="w-4 h-4" />
                  <span className="font-mono text-[10px] uppercase tracking-wider">Clear</span>
                </button>
              </div>
           </div>
        </div>
      </main>
    </div>
  );
}
