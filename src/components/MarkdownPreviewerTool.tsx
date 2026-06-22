import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import Markdown from 'react-markdown';

interface MarkdownPreviewerToolProps {
  onBack: () => void;
}

export default function MarkdownPreviewerTool({ onBack }: MarkdownPreviewerToolProps) {
  const [markdown, setMarkdown] = useState('# Hello World\\n\\nWelcome to the **Markdown Previewer**!\\n\\n- List item 1\\n- List item 2\\n\\n> This is a blockquote.\\n\\n```\\n// This is code\\nconsole.log("Hello");\\n```');

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6 shrink-0 w-fit">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2 shrink-0">Markdown Previewer</h1>
        <p className="text-on-surface-variant mb-6 shrink-0">Write markdown on the left and see it rendered on the right instantly.</p>

        <div className="grid md:grid-cols-2 gap-6 flex-1 min-h-0">
          <div className="bg-surface rounded-xl border border-outline flex flex-col h-full overflow-hidden">
             <div className="p-4 bg-background border-b border-outline font-bold text-sm shrink-0">Markdown Input</div>
             <textarea 
               className="flex-1 w-full bg-transparent p-4 focus:outline-none resize-none font-mono text-sm"
               value={markdown}
               onChange={(e) => setMarkdown(e.target.value)}
               spellCheck={false}
             />
          </div>

          <div className="bg-surface rounded-xl border border-outline flex flex-col h-full overflow-hidden">
             <div className="p-4 bg-background border-b border-outline font-bold text-sm shrink-0">Preview</div>
             <div className="flex-1 p-6 overflow-y-auto">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <Markdown>{markdown}</Markdown>
                </div>
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}
