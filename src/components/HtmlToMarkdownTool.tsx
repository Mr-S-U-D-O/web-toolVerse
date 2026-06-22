import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import TurndownService from 'turndown';

interface HtmlToMarkdownToolProps {
  onBack: () => void;
}

export default function HtmlToMarkdownTool({ onBack }: HtmlToMarkdownToolProps) {
  const [html, setHtml] = useState('<h1>Hello World</h1>\n<p>This is a <strong>bold</strong> statement.</p>');
  const [markdown, setMarkdown] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    try {
      const turndownService = new TurndownService({ headingStyle: 'atx' });
      const md = turndownService.turndown(html);
      setMarkdown(md);
    } catch {
      setMarkdown('');
    }
  }, [html]);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdown);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">HTML to Markdown</h1>
        <p className="text-on-surface-variant mb-8">Convert HTML code into clean Markdown instantly.</p>

        <div className="grid md:grid-cols-2 gap-6 min-h-[500px]">
          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden">
            <div className="p-4 bg-background border-b border-outline font-bold">HTML Input</div>
            <textarea
              className="w-full h-full bg-surface border-none p-4 font-mono text-sm focus:outline-none resize-none"
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              placeholder="Paste HTML here..."
            />
          </div>

          <div className="bg-surface rounded-xl border border-outline flex flex-col overflow-hidden">
            <div className="p-4 bg-background border-b border-outline flex items-center justify-between">
              <span className="font-bold">Markdown Output</span>
              <button
                onClick={handleCopy}
                disabled={!markdown}
                className="flex items-center gap-2 bg-primary text-on-primary px-3 py-1.5 text-sm rounded font-bold hover:bg-surface-tint disabled:opacity-50 transition-colors"
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                Copy
              </button>
            </div>
            <textarea
              className="w-full h-full bg-surface border-none p-4 font-mono text-sm focus:outline-none resize-none"
              value={markdown}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
