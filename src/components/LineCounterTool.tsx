import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface LineCounterToolProps {
  onBack: () => void;
}

export default function LineCounterTool({ onBack }: LineCounterToolProps) {
  const [text, setText] = useState('Line 1\\n\\nLine 3 (Line 2 was empty)\\nLine 4');
  const [totalLines, setTotalLines] = useState(0);
  const [emptyLines, setEmptyLines] = useState(0);
  const [populatedLines, setPopulatedLines] = useState(0);

  useEffect(() => {
    if (!text && text !== '') {
       setTotalLines(0);
       setEmptyLines(0);
       setPopulatedLines(0);
       return;
    }
    const lines = text.split('\\n');
    setTotalLines(lines.length);
    const emptyCount = lines.filter(l => l.trim().length === 0).length;
    setEmptyLines(emptyCount);
    setPopulatedLines(lines.length - emptyCount);
  }, [text]);

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Line Counter</h1>
        <p className="text-on-surface-variant mb-8">Count total lines, empty lines, and non-empty lines instantly.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-surface rounded-xl border border-outline p-6 text-center shadow-sm">
             <div className="text-4xl font-mono font-bold text-primary mb-2">{totalLines}</div>
             <div className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Total Lines</div>
          </div>
          <div className="bg-surface rounded-xl border border-outline p-6 text-center shadow-sm">
             <div className="text-4xl font-mono font-bold text-emerald-500 mb-2">{populatedLines}</div>
             <div className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Populated Lines</div>
          </div>
          <div className="bg-surface rounded-xl border border-outline p-6 text-center shadow-sm">
             <div className="text-4xl font-mono font-bold text-red-500 mb-2">{emptyLines}</div>
             <div className="text-sm font-bold text-on-surface-variant uppercase tracking-wider">Empty Lines</div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline min-h-[500px] flex flex-col">
           <div className="bg-background border-b border-outline p-4 font-bold text-sm">
              Text Input
           </div>
           <textarea
             className="w-full flex-1 bg-transparent p-4 focus:outline-none resize-none font-mono text-sm leading-relaxed"
             value={text}
             onChange={(e) => setText(e.target.value)}
             placeholder="Paste your code or text here..."
             spellCheck={false}
           />
        </div>
      </div>
    </div>
  );
}
