import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, HelpCircle } from 'lucide-react';

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const TEENS = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
const SCALES = ['', 'thousand', 'million', 'billion', 'trillion'];

function numberToWords(num: number, useAnd: boolean = true): string {
  if (num === 0) return 'zero';
  
  let words = '';
  let tempNum = Math.abs(num);
  let scaleIndex = 0;
  
  while (tempNum > 0) {
    const chunk = tempNum % 1000;
    if (chunk > 0) {
      const chunkWords = chunkToWords(chunk, useAnd);
      const scale = SCALES[scaleIndex];
      words = chunkWords + (scale ? ' ' + scale : '') + (words ? ' ' + words : '');
    }
    tempNum = Math.floor(tempNum / 1000);
    scaleIndex++;
  }
  
  return (num < 0 ? 'minus ' : '') + words.trim();
}

function chunkToWords(num: number, useAnd: boolean): string {
  let words = '';
  const hundreds = Math.floor(num / 100);
  const remainder = num % 100;
  
  if (hundreds > 0) {
    words += ONES[hundreds] + ' hundred';
    if (remainder > 0 && useAnd) {
      words += ' and';
    }
  }
  
  if (remainder > 0) {
    if (words) words += ' ';
    if (remainder < 10) {
      words += ONES[remainder];
    } else if (remainder < 20) {
      words += TEENS[remainder - 10];
    } else {
      const tens = Math.floor(remainder / 10);
      const ones = remainder % 10;
      words += TENS[tens];
      if (ones > 0) {
        words += '-' + ONES[ones];
      }
    }
  }
  
  return words;
}

export default function NumberToWordConverterTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('12345.67');
  const [outputText, setOutputText] = useState('');
  
  // Configs
  const [format, setFormat] = useState<'standard' | 'title' | 'currency'>('standard');
  const [useAnd, setUseAnd] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Clean input and extract float
    const trimmed = inputText.trim();
    if (!trimmed) {
      setOutputText('');
      return;
    }

    const num = parseFloat(trimmed);
    if (isNaN(num)) {
      setOutputText('Invalid number input');
      return;
    }

    // Limit to trillions
    if (Math.abs(num) >= 1e15) {
      setOutputText('Number too large (maximum 999 Trillion)');
      return;
    }

    // Handle integer part
    const intPart = Math.floor(Math.abs(num)) * (num < 0 ? -1 : 1);
    const floatStr = num.toString();
    const decimalIndex = floatStr.indexOf('.');
    
    let words = '';

    if (format === 'currency') {
      // Dollars and cents format
      const dollarsText = numberToWords(intPart, useAnd);
      const centPart = Math.round((Math.abs(num) - Math.abs(intPart)) * 100);
      const centsText = centPart === 0 ? 'zero' : numberToWords(centPart, useAnd);
      
      const dollarUnit = Math.abs(intPart) === 1 ? 'dollar' : 'dollars';
      const centUnit = centPart === 1 ? 'cent' : 'cents';
      
      words = `${dollarsText} ${dollarUnit} and ${centsText} ${centUnit}`;
    } else {
      // Standard spelling
      const intWords = numberToWords(intPart, useAnd);
      words = intWords;
      
      if (decimalIndex !== -1) {
        const decPartStr = floatStr.substring(decimalIndex + 1);
        let decWords = '';
        for (let i = 0; i < decPartStr.length; i++) {
          const digit = parseInt(decPartStr.charAt(i));
          decWords += ' ' + (digit === 0 ? 'zero' : ONES[digit]);
        }
        words += ' point' + decWords;
      }
    }

    // Apply Case Formatting
    if (format === 'title') {
      words = words.split(/(\s+|-)/).map(word => {
        if (word.trim().length === 0 || word === '-') return word;
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      }).join('');
    } else if (format === 'currency') {
      // Capitalize first letter of currency phrase
      words = words.charAt(0).toUpperCase() + words.slice(1);
    }

    setOutputText(words);
  }, [inputText, format, useAnd]);

  const handleCopy = async () => {
    if (!outputText || outputText.startsWith('Invalid') || outputText.startsWith('Number too')) return;
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
            <div className="font-sans text-sm font-medium text-on-surface">Number to Word Converter</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Number to Word Converter</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Convert standard numerical digits into detailed English words. Useful for writing checks, mathematical learning, financial documentation, and invoice descriptions.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Configurations (Left) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Input box */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Numeric Digits Input
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
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value.replace(/[^0-9.-]/g, ''))} // allow only numbers, decimal points, and minus
                placeholder="e.g. 123456.78"
                className="w-full bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-lg text-on-surface focus:outline-none focus:border-[#008cff] transition-colors placeholder:text-outline"
              />
            </div>

            {/* Config Panel */}
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
              <h2 className="font-heading font-semibold text-base mb-4 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#008cff]" />
                Spelling Options
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Format selection */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Output Style
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as any)}
                    className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                  >
                    <option value="standard">Standard (lowercase)</option>
                    <option value="title">Title Case (e.g. One Hundred)</option>
                    <option value="currency">Financial (e.g. Dollars and Cents)</option>
                  </select>
                </div>

                {/* Checklist options */}
                <div className="flex flex-col gap-3 justify-center sm:pl-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={useAnd}
                      onChange={(e) => setUseAnd(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      Include grammatical "and"
                    </span>
                  </label>
                </div>

              </div>
            </div>

          </div>

          {/* Spelling Output (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant sticky top-[80px]">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Spelled Words Output
                </label>
                {outputText && !outputText.includes('Invalid') && !outputText.includes('too large') && (
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
                placeholder="Spelled-out words will appear here..."
                className="w-full h-48 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-sans text-sm text-on-surface leading-relaxed focus:outline-none resize-none placeholder:text-outline/70"
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
