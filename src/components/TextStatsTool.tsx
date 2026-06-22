import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface TextStatsToolProps {
  onBack: () => void;
}

export default function TextStatsTool({ onBack }: TextStatsToolProps) {
  const [text, setText] = useState('Typing some text here allows you to view the raw statistics of your words, characters, and sentences.');

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\\s+/).length : 0;
  const sentenceCount = text.trim() ? (text.match(/[.!?]+/g) || []).length : 0;
  const paragraphCount = text.trim() ? text.trim().split(/\\n+/).length : 0;
  const readingTime = Math.ceil(wordCount / 200); // 200 words per minute
  
  const charWithoutSpaces = text.replace(/\\s/g, '').length;

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Text Statistics</h1>
        <p className="text-on-surface-variant mb-8">Count words, characters, sentences, and estimate reading time.</p>

        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-surface border border-outline rounded-xl p-6 text-center">
             <div className="text-3xl font-bold font-mono text-primary mb-1">{wordCount}</div>
             <div className="text-sm text-on-surface-variant font-bold uppercase tracking-wider">Words</div>
          </div>
          <div className="bg-surface border border-outline rounded-xl p-6 text-center">
             <div className="text-3xl font-bold font-mono text-primary mb-1">{charCount}</div>
             <div className="text-sm text-on-surface-variant font-bold uppercase tracking-wider">Characters</div>
          </div>
          <div className="bg-surface border border-outline rounded-xl p-6 text-center">
             <div className="text-3xl font-bold font-mono text-primary mb-1">{readingTime} <span className="text-sm">min</span></div>
             <div className="text-sm text-on-surface-variant font-bold uppercase tracking-wider">Reading Time</div>
          </div>
          <div className="bg-surface border border-outline rounded-xl p-6 text-center">
             <div className="text-3xl font-bold font-mono text-primary mb-1">{sentenceCount}</div>
             <div className="text-sm text-on-surface-variant font-bold uppercase tracking-wider">Sentences</div>
          </div>
          <div className="bg-surface border border-outline rounded-xl p-6 text-center">
             <div className="text-3xl font-bold font-mono text-primary mb-1">{paragraphCount}</div>
             <div className="text-sm text-on-surface-variant font-bold uppercase tracking-wider">Paragraphs</div>
          </div>
          <div className="bg-surface border border-outline rounded-xl p-6 text-center">
             <div className="text-3xl font-bold font-mono text-primary mb-1">{charWithoutSpaces}</div>
             <div className="text-sm text-on-surface-variant font-bold uppercase tracking-wider">Chars (no spaces)</div>
          </div>
        </div>

        <div className="bg-surface border border-outline rounded-xl flex flex-col min-h-[300px]">
           <div className="p-3 bg-background border-b border-outline flex items-center justify-between">
              <span className="font-bold text-sm">Your Text</span>
           </div>
           <textarea
             className="w-full h-full bg-surface border-none p-4 font-mono text-sm focus:outline-none resize-y min-h-[300px]"
             value={text}
             onChange={(e) => setText(e.target.value)}
             placeholder="Start typing or pasting..."
           />
        </div>
      </div>
    </div>
  );
}
