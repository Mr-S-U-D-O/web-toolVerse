import React, { useState } from 'react';
import { ArrowLeft, Combine } from 'lucide-react';


export default function TextWordMergerTool({ onBack }: { onBack: () => void }) {
  const [text, setText] = useState<string>('');
  const [delimiter, setDelimiter] = useState<string>(', ');
  
  const d = delimiter === '\\n' ? '\n' : delimiter === '\\t' ? '\t' : delimiter;
  const words = text.split(/[\n\s]+/).filter(Boolean);
  const result = words.join(d);

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
        <div className="max-w-4xl w-full mx-auto p-6 md:p-8">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-primary/20">
              <Combine className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              Word Merger
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Join unstructured word lists or paragraphs with a delimiter
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input List/Words</span>
                {text && <button onClick={() => setText('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full border border-outline h-[350px] bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Enter words on new lines or space separated..."/>
            </div>
            <div className="flex flex-col gap-4">
               <div>
                  <label className="text-sm font-medium text-on-surface">Merge Delimiter</label>
                  <input type="text" value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="w-full mt-2 bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" placeholder="e.g. , or -"/>
               </div>
               <div className="flex flex-col gap-2 flex-grow">
                  <label className="text-sm font-medium text-on-surface flex justify-between">
                    <span>Merged Result</span>
                    {result && <button onClick={() => navigator.clipboard.writeText(result)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
                  </label>
                  <textarea value={result} readOnly className="w-full flex-grow bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Result will appear here..."/>
               </div>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}