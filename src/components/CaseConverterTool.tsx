import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, Type } from 'lucide-react';

type CaseType = 
  | 'upper' 
  | 'lower' 
  | 'title' 
  | 'sentence' 
  | 'camel' 
  | 'snake' 
  | 'kebab' 
  | 'pascal' 
  | 'alternating';

export default function CaseConverterTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedCase, setSelectedCase] = useState<CaseType>('upper');
  const [copied, setCopied] = useState(false);

  const caseOptions: { value: CaseType; label: string; description: string; example: string }[] = [
    { value: 'upper', label: 'UPPERCASE', description: 'Capitalizes all characters', example: 'THE QUICK BROWN FOX' },
    { value: 'lower', label: 'lowercase', description: 'Converts all letters to lowercase', example: 'the quick brown fox' },
    { value: 'title', label: 'Title Case', description: 'Capitalizes first letter of each word', example: 'The Quick Brown Fox' },
    { value: 'sentence', label: 'Sentence case', description: 'Capitalizes first letter of each sentence', example: 'The quick brown fox. It jumps.' },
    { value: 'camel', label: 'camelCase', description: 'Lowercase first word, capitalizes following words', example: 'theQuickBrownFox' },
    { value: 'pascal', label: 'PascalCase', description: 'Capitalizes first letter of all words', example: 'TheQuickBrownFox' },
    { value: 'snake', label: 'snake_case', description: 'Lowercase words separated by underscores', example: 'the_quick_brown_fox' },
    { value: 'kebab', label: 'kebab-case', description: 'Lowercase words separated by hyphens', example: 'the-quick-brown-fox' },
    { value: 'alternating', label: 'AlTeRnAtInG CaSe', description: 'Alternates uppercase and lowercase', example: 'tHe QuIcK bRoWn FoX' }
  ];

  useEffect(() => {
    if (!inputText) {
      setOutputText('');
      return;
    }

    let converted = '';

    switch (selectedCase) {
      case 'upper':
        converted = inputText.toUpperCase();
        break;
      case 'lower':
        converted = inputText.toLowerCase();
        break;
      case 'title':
        converted = inputText.split(/(\s+)/).map(word => {
          if (word.trim().length === 0) return word;
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
        break;
      case 'sentence':
        converted = inputText.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
        break;
      case 'camel': {
        const words = inputText.toLowerCase().replace(/[^a-zA-Z0-9\s-_]/g, '').trim().split(/[\s-_]+/);
        converted = words.map((w, idx) => idx === 0 ? w : w.charAt(0).toUpperCase() + w.slice(1)).join('');
        break;
      }
      case 'pascal': {
        const words = inputText.toLowerCase().replace(/[^a-zA-Z0-9\s-_]/g, '').trim().split(/[\s-_]+/);
        converted = words.map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
        break;
      }
      case 'snake': {
        converted = inputText.toLowerCase().replace(/[^a-zA-Z0-9\s-_]/g, '').trim().split(/[\s-_]+/).join('_');
        break;
      }
      case 'kebab': {
        converted = inputText.toLowerCase().replace(/[^a-zA-Z0-9\s-_]/g, '').trim().split(/[\s-_]+/).join('-');
        break;
      }
      case 'alternating':
        converted = inputText.split('').map((char, idx) => idx % 2 === 0 ? char.toLowerCase() : char.toUpperCase()).join('');
        break;
      default:
        converted = inputText;
    }

    setOutputText(converted);
  }, [inputText, selectedCase]);

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleClear = () => {
    setInputText('');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface w-full pb-20">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest">Tool Cabinet</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">Case Converter</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#008cff]/10 border border-[#008cff]/20 text-[10px] font-mono uppercase tracking-wider text-[#008cff]">
              <Shield className="w-3 h-3" />
              100% Client-Side
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10 w-full">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Case Converter</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Instantly format text case. Select from programming styles like camelCase or snake_case, standard publishing layouts like Sentence case or Title Case, or uppercase/lowercase commands.
          </p>
        </div>

        {/* Two-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input & Configurations (Left) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Input box */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Input Text
                </label>
                {inputText && (
                  <button
                    onClick={handleClear}
                    className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your text here..."
                className="w-full h-64 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-y placeholder:text-outline"
              />
              <div className="mt-2 flex justify-between text-[11px] font-mono text-on-surface-variant">
                <span>Words: {inputText.trim() ? inputText.trim().split(/\s+/).length : 0}</span>
                <span>Length: {inputText.length} chars</span>
              </div>
            </div>

            {/* Config Panel */}
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
              <h2 className="font-heading font-semibold text-base mb-4 flex items-center gap-2">
                <Type className="w-4 h-4 text-[#008cff]" />
                Select Case Style
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {caseOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedCase(opt.value)}
                    className={`p-4 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      selectedCase === opt.value
                        ? 'border-[#008cff] bg-[#008cff]/10 ring-1 ring-[#008cff]'
                        : 'border-outline-variant bg-surface-container hover:bg-surface-container-high'
                    }`}
                  >
                    <span className="font-sans font-semibold text-sm text-on-surface">
                      {opt.label}
                    </span>
                    <span className="text-[10px] text-outline font-mono mt-1 block truncate">
                      {opt.example}
                    </span>
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Output (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant sticky top-[80px]">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Converted Output
                </label>
                {outputText && (
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                      copied
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#008cff] text-white hover:bg-[#0070cc] shadow-sm'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Result
                      </>
                    )}
                  </button>
                )}
              </div>
              <textarea
                readOnly
                value={outputText}
                placeholder="Converted text will appear here..."
                className="w-full h-80 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none resize-none placeholder:text-outline/70"
              />
              <div className="mt-2 flex justify-between text-[11px] font-mono text-on-surface-variant">
                <span>Words: {outputText ? outputText.trim().split(/\s+/).length : 0}</span>
                <span>Length: {outputText.length} chars</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
