import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { FileText } from 'lucide-react';

export default function TextSentenceCounterTool({ onBack }: { onBack: () => void }) {
  const [text, setText] = useState<string>('');

  const countSentences = (str: string) => {
    if (!str.trim()) return 0;
    // using a simple regex for finding sentences ending with ., !, or ?
    const matches = str.match(/[^\.!\?]+[\.!\?]+/g);
    return matches ? matches.length : 0;
  };

  const sentenceCount = countSentences(text);

  return (
        <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">\n      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">\n        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">\n          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">\n             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />\n             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>\n          </button>\n        </div>\n      </header>\n\n      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
      <div className="max-w-4xl mx-auto p-6 md:p-8">
        <div className="flex flex-col items-center justify-center mb-12 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-primary/20">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
            Sentence Counter
          </h1>
          <p className="text-on-surface-variant max-w-2xl">
            Analyze your text to count the total current completed sentences.
          </p>
        </div>

        <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
          <div className="flex justify-center mb-6">
            <div className="w-full max-w-sm bg-surface-container-high p-4 rounded-xl border border-outline border-l-4 border-l-primary/50 text-center">
              <div className="text-sm text-on-surface-variant mb-1">Sentence Count</div>
              <div className="text-4xl font-bold text-on-surface">{sentenceCount}</div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-on-surface flex justify-between">
              <span>Text Input</span>
              {text.length > 0 && (
                <button
                  onClick={() => setText('')}
                  className="text-error hover:text-error/80 text-xs"
                >
                  Clear text
                </button>
              )}
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y"
              placeholder="Paste or type your text here. A sentence ends with a period, exclamation mark, or question mark."
            />
          </div>
        </div>
      </div>
          </main>
    </div>
  );
}
