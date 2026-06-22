import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';

interface SlugGeneratorToolProps {
  onBack: () => void;
}

export default function SlugGeneratorTool({ onBack }: SlugGeneratorToolProps) {
  const [text, setText] = useState('An example of a great blog post title!');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const s = text
      .toLowerCase()
      .trim()
      .replace(/[\\s_]+/g, '-') // replace spaces and underscores with hyphens
      .replace(/[^a-z0-9-]/g, '')   // remove all non-alphanumeric and non-hyphen characters
      .replace(/-+/g, '-')          // remove multiple consecutive hyphens
      .replace(/^-+|-+$/g, '');     // trim hyphens from start and end
    setSlug(s);
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(slug);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">URL Slug Generator</h1>
        <p className="text-on-surface-variant mb-8">Convert any text into a URL-friendly slug instantly.</p>

        <div className="space-y-6">
          <div className="bg-surface rounded-xl p-6 border border-outline">
            <label className="block font-bold mb-4">Input Text</label>
            <textarea
              className="w-full h-32 bg-background border border-outline rounded-lg p-4 font-sans text-lg focus:outline-none focus:border-primary resize-y"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your title or text here..."
            />
          </div>

          <div className="bg-surface rounded-xl p-6 border border-outline">
            <label className="block font-bold mb-4">Generated Slug</label>
            <div className="flex bg-background border border-outline rounded-lg overflow-hidden relative">
              <input
                type="text"
                readOnly
                value={slug}
                className="w-full bg-transparent p-4 font-mono focus:outline-none"
              />
              <button 
                onClick={handleCopy}
                disabled={!slug}
                className="flex items-center justify-center gap-2 bg-primary text-on-primary px-6 font-bold hover:bg-surface-tint transition-colors disabled:opacity-50"
              >
                {copied ? <Check size={18} /> : <Copy size={18} />} Copy
              </button>
            </div>
            {slug && (
              <div className="mt-4 text-sm text-on-surface-variant break-all">
                <strong>Preview:</strong> https://example.com/blog/<strong>{slug}</strong>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
