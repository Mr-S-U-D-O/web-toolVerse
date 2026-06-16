import React, { useState } from 'react';
import { ArrowLeft, Edit3, Trash2 } from 'lucide-react';
import Markdown from 'react-markdown';

interface MarkdownPreviewToolProps {
  onBack: () => void;
}

const DEFAULT_MARKDOWN = `# Markdown Preview

Welcome to the markdown preview tool!

## Features

- **Bold text** and *italic text*
- [Links](https://example.com)
- \`Inline code\` and code blocks
- Lists and more!

### Code Example

\`\`\`javascript
function helloWorld() {
  console.log("Hello, world!");
}
\`\`\`

> Blockquotes are also supported.
`;

export default function MarkdownPreviewTool({ onBack }: MarkdownPreviewToolProps) {
  const [input, setInput] = useState(DEFAULT_MARKDOWN);

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
        <div className="w-full max-w-full lg:max-w-[1400px] flex flex-col gap-6 animate-in fade-in duration-300">
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <Edit3 className="w-5 h-5 text-primary" />
              </div>
              <h1 className="font-heading text-2xl font-semibold tracking-tight">Markdown Editor</h1>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6 min-h-[600px] h-[calc(100vh-250px)]">
             {/* Input Area */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">Markdown Input</span>
                </div>
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type markdown here..."
                  className="flex-grow w-full bg-transparent p-5 outline-none font-mono text-[14px] leading-relaxed text-on-surface resize-none placeholder:text-outline"
                  spellCheck="false"
                />
                <div className="h-12 border-t border-outline-variant bg-surface-container-lowest flex items-center justify-between px-4">
                  <button 
                    onClick={() => setInput('')} 
                    className="p-1.5 text-on-surface-variant hover:text-error transition-colors flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span className="font-mono text-[10px] uppercase tracking-wider">Clear</span>
                  </button>
                  <span className="font-mono text-[10px] text-outline uppercase tracking-wider">{input.length} chars</span>
                </div>
             </div>

             {/* Output Area */}
             <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-full">
                <div className="h-12 border-b border-outline-variant bg-surface-container flex items-center px-4">
                  <span className="font-mono text-xs text-outline uppercase tracking-widest">Preview</span>
                </div>
                <div className="flex-grow overflow-auto p-8 bg-white text-gray-900 markdown-body">
                  {input ? (
                    <Markdown>{input}</Markdown>
                  ) : (
                    <p className="text-gray-400 italic font-mono text-sm">Nothing to preview. Start typing...</p>
                  )}
                </div>
             </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
