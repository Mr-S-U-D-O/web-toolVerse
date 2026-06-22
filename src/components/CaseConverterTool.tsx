import React, { useState, useMemo } from 'react';
import { ArrowLeft, Copy, RefreshCw, Check } from 'lucide-react';

interface CaseConverterToolProps {
  onBack: () => void;
}

export default function CaseConverterTool({ onBack }: CaseConverterToolProps) {
  const [input, setInput] = useState<string>('hello world example');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  const getWords = (str: string) => {
    return str
      .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
      .replace(/[\W_]+/g, ' ')             // remove non-alphanumeric (hyphens, underscores)
      .trim()
      .split(/\s+/);                       // split by spaces
  };

  const conversions = useMemo(() => {
    if (!input) return [];
    
    const words = getWords(input);
    if (words.length === 0 || words[0] === '') return [];

    const lowerWords = words.map(w => w.toLowerCase());
    
    const camel = lowerWords[0] + lowerWords.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    const pascal = lowerWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    const snake = lowerWords.join('_');
    const screamingSnake = lowerWords.map(w => w.toUpperCase()).join('_');
    const kebab = lowerWords.join('-');
    const constant = screamingSnake;
    const train = lowerWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
    const originalLower = input.toLowerCase();
    const originalUpper = input.toUpperCase();
    const title = lowerWords.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    return [
      { name: 'camelCase', value: camel },
      { name: 'PascalCase', value: pascal },
      { name: 'snake_case', value: snake },
      { name: 'SCREAMING_SNAKE_CASE', value: screamingSnake },
      { name: 'kebab-case', value: kebab },
      { name: 'Train-Case', value: train },
      { name: 'lowercase', value: originalLower },
      { name: 'UPPERCASE', value: originalUpper },
      { name: 'Title Case', value: title }
    ];
  }, [input]);

  const handleCopy = (text: string, name: string) => {
    navigator.clipboard.writeText(text);
    setCopiedFormat(name);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Case Converter</h1>
        <p className="text-on-surface-variant mb-8">Convert regular text or variable names between various coding cases.</p>

        <div className="mb-8">
          <label className="block text-sm font-bold mb-2">Input String</label>
          <textarea
            className="w-full bg-surface border border-outline rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:border-primary font-mono min-h-[100px] resize-y"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type or paste your text here..."
          />
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {conversions.map((conv) => (
            <div key={conv.name} className="bg-surface p-4 rounded-xl border border-outline relative group flex flex-col h-full">
              <div className="text-sm font-bold text-on-surface-variant mb-2">{conv.name}</div>
              <div className="font-mono text-sm break-all flex-grow p-2 bg-background rounded border border-outline">
                {conv.value || '-'}
              </div>
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => handleCopy(conv.value, conv.name)}
                  className="text-primary hover:scale-110 transition-transform opacity-0 group-hover:opacity-100"
                  title="Copy"
                >
                  {copiedFormat === conv.name ? <Check size={18} /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          ))}
          {conversions.length === 0 && (
            <div className="col-span-full py-12 text-center text-on-surface-variant bg-surface rounded-xl border border-outline border-dashed">
              Type some text to see formatting options.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
