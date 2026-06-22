import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';

interface WhitespaceRemoverToolProps {
  onBack: () => void;
}

export default function WhitespaceRemoverTool({ onBack }: WhitespaceRemoverToolProps) {
  const [input, setInput] = useState('This   text    has     \n\n\nway   too  much     whitespace!');
  const [output, setOutput] = useState('');
  const [copied, setCopied] = useState(false);
  
  const [removeNewlines, setRemoveNewlines] = useState(false);
  const [removeTabs, setRemoveTabs] = useState(true);

  useEffect(() => {
    let result = input;
    
    // Replace tabs with spaces if requested
    if (removeTabs) {
      result = result.replace(/\\t/g, ' ');
    }

    // Replace multiple newlines with single if we aren't completely removing them
    if (!removeNewlines) {
       result = result.replace(/\\n{2,}/g, '\\n');
    } else {
       result = result.replace(/\\n/g, ' ');
    }

    // Replace multiple spaces with single space
    result = result.replace(/ {2,}/g, ' ');

    setOutput(result.trim());
  }, [input, removeNewlines, removeTabs]);

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Whitespace Remover</h1>
        <p className="text-on-surface-variant mb-8">Clean up extra spaces, tabs, and newlines from your text.</p>

        <div className="flex flex-wrap gap-6 mb-6">
          <label className="flex items-center gap-2 cursor-pointer bg-surface border border-outline px-4 py-2 rounded-lg">
             <input type="checkbox" checked={removeTabs} onChange={e => setRemoveTabs(e.target.checked)} className="w-4 h-4 accent-primary" />
             <span className="text-sm font-bold">Replace Tabs with Spaces</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer bg-surface border border-outline px-4 py-2 rounded-lg">
             <input type="checkbox" checked={removeNewlines} onChange={e => setRemoveNewlines(e.target.checked)} className="w-4 h-4 accent-primary" />
             <span className="text-sm font-bold">Remove All Newlines</span>
          </label>
        </div>

        <div className="grid md:grid-cols-2 gap-6 min-h-[500px]">
           <div className="bg-surface rounded-xl border border-outline flex flex-col">
              <div className="p-4 bg-background border-b border-outline font-bold text-sm">Original Text</div>
              <textarea 
                 value={input}
                 onChange={e => setInput(e.target.value)}
                 className="flex-1 w-full p-4 bg-transparent border-none focus:outline-none resize-none font-mono text-sm leading-relaxed"
                 placeholder="Paste text with excessive whitespace here..."
              />
           </div>
           
           <div className="bg-surface rounded-xl border border-outline flex flex-col relative">
              <div className="p-4 bg-background border-b border-outline flex justify-between items-center">
                 <span className="font-bold text-sm">Cleaned Text</span>
                 <button onClick={handleCopy} className="flex items-center justify-center gap-2 bg-primary text-on-primary px-3 py-1.5 rounded text-sm font-bold hover:bg-surface-tint transition-colors">
                    {copied ? <Check size={16} /> : <Copy size={16} />} Copy
                 </button>
              </div>
              <textarea 
                 value={output}
                 readOnly
                 className="flex-1 w-full p-4 bg-transparent border-none focus:outline-none resize-none font-mono text-sm leading-relaxed"
              />
           </div>
        </div>

      </div>
    </div>
  );
}
