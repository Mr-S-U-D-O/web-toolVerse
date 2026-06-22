import React, { useState } from 'react';
import { ArrowLeft, Binary } from 'lucide-react';


export default function TextDecimalGeneratorTool({ onBack }: { onBack: () => void }) {
  const [text, setText] = useState<string>('');
  const dec = text.split('').map(c => c.charCodeAt(0).toString(10)).join(' ');

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
              <Binary className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              Decimal Generator
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Convert any text into ASCII Decimal numbers
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Text</span>
                {text && <button onClick={() => setText('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Enter text..."/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Decimal Result</span>
                {dec && <button onClick={() => navigator.clipboard.writeText(dec)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={dec} readOnly className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="97 98..."/>
            </div>
          </div>
          </div>
        </div>
      </main>
    </div>
  );
}