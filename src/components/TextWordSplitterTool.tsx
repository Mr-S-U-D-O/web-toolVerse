import React, { useState } from 'react';
import { ArrowLeft, SplitSquareHorizontal } from 'lucide-react';

export default function TextWordSplitterTool({ onBack }: { onBack: () => void }) {
  const [text, setText] = useState<string>('');
  const [delimiter, setDelimiter] = useState<string>(' ');
  const [splitWords, setSplitWords] = useState<string[]>([]);

  const splitText = () => {
    if (!text) {
      setSplitWords([]);
      return;
    }
    // Handle special delimiter cases if needed, like newline \n
    const d = delimiter === '\\n' ? '\n' : delimiter === '\\t' ? '\t' : delimiter;
    setSplitWords(text.split(d).filter(Boolean));
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
        <div className="max-w-4xl w-full mx-auto p-6 md:p-8">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-primary/20">
              <SplitSquareHorizontal className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              Word Splitter
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              Split unstructured text into a list or array using a specific delimiter.
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface flex justify-between">
                  <span>Input Text</span>
                  {text && <button onClick={() => {setText(''); setSplitWords([])}} className="text-error hover:text-error/80 text-xs">Clear</button>}
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-full h-48 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm"
                  placeholder="Enter text to split..."
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Separator/Delimiter</label>
                <input
                  type="text"
                  value={delimiter}
                  onChange={(e) => setDelimiter(e.target.value)}
                  className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono"
                  placeholder="Enter a character e.g. a comma or a space"
                />
                <button
                  onClick={splitText}
                  className="w-full bg-primary hover:bg-primary/90 text-on-primary font-medium rounded-xl px-6 py-3 transition-colors mt-[10px]"
                >
                  Split Text
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Split Result Array ({splitWords.length} items)</span>
              </label>
              <textarea
                value={JSON.stringify(splitWords, null, 2)}
                readOnly
                className="w-full h-48 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm whitespace-pre"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
