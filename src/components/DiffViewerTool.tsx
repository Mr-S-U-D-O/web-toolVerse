import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { diffWords, diffLines } from 'diff';

interface DiffViewerToolProps {
  onBack: () => void;
}

export default function DiffViewerTool({ onBack }: DiffViewerToolProps) {
  const [oldText, setOldText] = useState('This is a simple text.\nIt has a few lines.\nSome things will change.');
  const [newText, setNewText] = useState('This is a modified text.\nIt has a few lines.\nSome things will definitely change.');
  const [diffType, setDiffType] = useState<'words' | 'lines'>('words');

  const diffResult = diffType === 'words' 
    ? diffWords(oldText, newText)
    : diffLines(oldText, newText);

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Text Diff Viewer</h1>
        <p className="text-on-surface-variant mb-8">Compare two text snippets and see the differences.</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden">
            <div className="p-3 bg-background border-b border-outline font-bold text-sm">Original Text</div>
            <textarea
              className="w-full bg-surface border-none p-4 font-mono text-sm focus:outline-none min-h-[250px] resize-y"
              value={oldText}
              onChange={(e) => setOldText(e.target.value)}
              placeholder="Paste original text here..."
            />
          </div>
          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden">
            <div className="p-3 bg-background border-b border-outline font-bold text-sm">Modified Text</div>
            <textarea
              className="w-full bg-surface border-none p-4 font-mono text-sm focus:outline-none min-h-[250px] resize-y"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              placeholder="Paste modified text here..."
            />
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden">
          <div className="p-4 bg-background border-b border-outline flex justify-between items-center">
            <span className="font-bold">Difference Result</span>
            <div className="flex bg-surface rounded-lg border border-outline overflow-hidden text-sm">
              <button 
                onClick={() => setDiffType('words')}
                className={`px-4 py-1.5 ${diffType === 'words' ? 'bg-primary text-on-primary font-bold' : 'hover:bg-background'}`}
              >Words</button>
              <button 
                onClick={() => setDiffType('lines')}
                className={`px-4 py-1.5 ${diffType === 'lines' ? 'bg-primary text-on-primary font-bold' : 'hover:bg-background'}`}
              >Lines</button>
            </div>
          </div>
          <div className="p-6 font-mono text-sm whitespace-pre-wrap leading-relaxed overflow-x-auto min-h-[200px]">
            {diffResult.map((part, index) => {
              const color = part.added ? 'bg-green-500/20 text-green-700 dark:text-green-400' 
                : part.removed ? 'bg-red-500/20 text-red-700 dark:text-red-400 line-through' 
                : 'text-on-surface-variant';
              return (
                <span key={index} className={`${color} rounded px-0.5 mx-0.5`}>
                  {part.value}
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
