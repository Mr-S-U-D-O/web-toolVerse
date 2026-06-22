import React, { useState } from 'react';
import { ArrowLeft, ArrowRightLeft } from 'lucide-react';

interface TextDiffCheckerToolProps {
  onBack: () => void;
}

export default function TextDiffCheckerTool({ onBack }: TextDiffCheckerToolProps) {
  const [text1, setText1] = useState('This is the original text.\\nIt has some lines.\\nAnd some words.');
  const [text2, setText2] = useState('This is the modified text.\\nIt has some lines.\\nAnd some new words.');

  // Simplified word-by-word diff approximation since we don't have a diff library
  const getDiffs = () => {
     const t1 = text1.split('\\n');
     const t2 = text2.split('\\n');
     const maxLines = Math.max(t1.length, t2.length);
     
     const lines = [];
     for(let i=0; i<maxLines; i++){
        const l1 = t1[i] || '';
        const l2 = t2[i] || '';
        
        if (l1 === l2) {
           lines.push({ type: 'equal', text: l1 });
        } else if (l1 && !l2) {
           lines.push({ type: 'removed', text: l1 });
        } else if (!l1 && l2) {
           lines.push({ type: 'added', text: l2 });
        } else {
           lines.push({ type: 'removed', text: l1 });
           lines.push({ type: 'added', text: l2 });
        }
     }
     return lines;
  };

  const diffs = getDiffs();

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Simple Text Diff</h1>
        <p className="text-on-surface-variant mb-6">Compare two text blocks line-by-line.</p>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
           <div className="bg-surface border border-outline rounded-xl p-4 flex flex-col">
              <label className="font-bold mb-2">Original Text</label>
              <textarea 
                className="flex-1 min-h-[250px] bg-background border border-outline p-4 font-mono text-sm focus:outline-none focus:border-primary rounded resize-y"
                value={text1}
                onChange={e => setText1(e.target.value)}
              />
           </div>
           <div className="bg-surface border border-outline rounded-xl p-4 flex flex-col">
              <label className="font-bold mb-2">Modified Text</label>
              <textarea 
                className="flex-1 min-h-[250px] bg-background border border-outline p-4 font-mono text-sm focus:outline-none focus:border-primary rounded resize-y"
                value={text2}
                onChange={e => setText2(e.target.value)}
              />
           </div>
        </div>

        <div className="bg-surface border border-outline rounded-xl overflow-hidden shadow-sm">
           <div className="bg-background border-b border-outline p-4 font-bold flex justify-between items-center">
              <span>Diff Result</span>
              <div className="flex gap-4 text-sm font-normal text-on-surface-variant">
                 <span className="flex items-center gap-1"><span className="w-3 h-3 bg-red-500/20 border border-red-500 inline-block"></span> Removed</span>
                 <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500/20 border border-emerald-500 inline-block"></span> Added</span>
              </div>
           </div>
           <div className="p-4 overflow-x-auto font-mono text-sm whitespace-pre">
              {diffs.map((d, i) => (
                 <div key={i} className={`px-2 py-1 ${d.type === 'added' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-l-2 border-emerald-500' : d.type === 'removed' ? 'bg-red-500/10 text-red-600 dark:text-red-400 border-l-2 border-red-500 line-through opacity-70' : 'text-on-surface'}`}>
                    {d.type === 'added' ? '+ ' : d.type === 'removed' ? '- ' : '  '}
                    {d.text || '\\n'}
                 </div>
              ))}
           </div>
        </div>

      </div>
    </div>
  );
}
