import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Type, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const LATIN_DICTIONARY = [
  "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit",
  "sed", "do", "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore",
  "magna", "aliqua", "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation",
  "ullamco", "laboris", "nisi", "aliquip", "ex", "ea", "commodo", "consequat", "duis",
  "aute", "irure", "in", "reprehenderit", "voluptate", "velit", "esse", "cillum", "eu",
  "fugiat", "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non",
  "proident", "sunt", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum",
  "cursus", "mattis", "molestie", "a", "iaculis", "at", "erat", "pellentesque", "rhoncus", "dictum", 
  "viverra", "justo", "nec", "ultrices", "dui", "sapien", "eget", "mi", "integer", "fermentum"
];

function generateAccurateLoremIpsum(type: 'paragraphs' | 'sentences' | 'words', count: number): string {
    const safeCount = Math.max(1, count);
    
    if (type === 'words') {
        const words = [];
        for (let i = 0; i < safeCount; i++) {
            words.push(LATIN_DICTIONARY[Math.floor(Math.random() * LATIN_DICTIONARY.length)]);
        }
        return (words.join(" ")).charAt(0).toUpperCase() + (words.join(" ")).slice(1) + ".";
    }

    if (type === 'sentences') {
        return generateSentences(safeCount).join(" ");
    }

    if (type === 'paragraphs') {
        const paragraphs = [];
        for (let i = 0; i < safeCount; i++) {
            // Standard paragraph has ~4 to 7 sentences
            const sentencesInPara = Math.floor(Math.random() * 4) + 4;
            paragraphs.push(generateSentences(sentencesInPara).join(" "));
        }
        return paragraphs.join("\n\n");
    }

    return '';
}

function generateSentences(count: number): string[] {
    const sentences = [];
    for (let i = 0; i < count; i++) {
        // Standard sentence has ~8 to 15 words
        const wordCount = Math.floor(Math.random() * 8) + 8;
        const words = [];
        for (let j = 0; j < wordCount; j++) {
            words.push(LATIN_DICTIONARY[Math.floor(Math.random() * LATIN_DICTIONARY.length)]);
        }
        
        let sentence = words.join(" ");
        sentence = sentence.charAt(0).toUpperCase() + sentence.slice(1);
        
        // Occasionally add comma
        if (wordCount > 10 && Math.random() > 0.5) {
             const commaPos = Math.floor(wordCount / 2);
             const parts = sentence.split(" ");
             parts[commaPos] += ",";
             sentence = parts.join(" ");
        }
        
        sentences.push(sentence + ".");
    }
    return sentences;
}

export default function LoremIpsumGeneratorTool() {
  const navigate = useNavigate();
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words'>('paragraphs');
  const [count, setCount] = useState<number>(3);
  const [output, setOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    handleGenerate();
  }, [type, count]);

  const handleGenerate = () => {
     setOutput(generateAccurateLoremIpsum(type, count));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">
      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <button onClick={() => navigate('/')} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex justify-center w-full max-w-[1280px] mx-auto p-6 lg:p-12 relative pt-12 md:pt-16">
        <div className="w-full max-w-5xl flex flex-col gap-8 animate-in fade-in duration-300">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                 <Type className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="font-heading text-3xl font-semibold tracking-tight">Lorem Ipsum Generator</h1>
                <p className="text-on-surface-variant mt-1 text-sm">Procedurally generate dummy text for your mockups and designs.</p>
              </div>
            </div>
            
            <button 
              onClick={handleGenerate}
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover text-on-primary px-5 py-2.5 rounded-lg font-mono text-xs uppercase tracking-wider transition-colors shadow-sm whitespace-nowrap"
            >
              <RefreshCw className="w-4 h-4" /> Regenerate
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-[250px_1fr] gap-6">
             {/* Controls */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 h-fit flex flex-col gap-6 shadow-sm">
                <div>
                  <label className="block font-mono text-[10px] text-outline font-semibold uppercase tracking-wider mb-2">Format</label>
                  <select
                    className="w-full bg-background border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none font-sans text-sm transition-colors"
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                  >
                    <option value="paragraphs">Paragraphs</option>
                    <option value="sentences">Sentences</option>
                    <option value="words">Words</option>
                  </select>
                </div>
                
                <div>
                  <label className="block font-mono text-[10px] text-outline font-semibold uppercase tracking-wider mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    max={type === 'paragraphs' ? 100 : type === 'sentences' ? 500 : 2000}
                    className="w-full bg-background border border-outline-variant rounded-lg px-4 py-2.5 focus:border-primary focus:outline-none font-sans text-sm transition-colors"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value) || 1)}
                  />
                </div>
                
                <div className="border-t border-outline-variant pt-4 mt-2">
                  <div className="bg-primary/5 p-4 rounded border border-primary/10">
                     <p className="text-xs text-on-surface-variant leading-relaxed">
                       Generated algorithmically from a curated Latin dictionary to create natural grammatical flow and lengths.
                     </p>
                  </div>
                </div>
             </div>

             {/* Output Area */}
             <div className="bg-surface-container-low border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col h-[500px]">
                <div className="h-14 border-b border-outline-variant bg-surface-container/50 flex items-center justify-between px-5">
                  <span className="font-mono text-xs text-outline font-semibold uppercase tracking-widest">Generated Output</span>
                  <button 
                    onClick={handleCopy}
                    className="p-1 text-primary hover:text-primary-hover transition-colors flex items-center gap-2 group"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                    <span className="font-mono text-[10px] uppercase tracking-wider font-semibold">
                      {copied ? 'Copied' : 'Copy'}
                    </span>
                  </button>
                </div>
                
                <div className="flex-grow w-full bg-transparent p-6 outline-none font-sans text-sm md:text-base leading-relaxed text-on-surface overflow-y-auto whitespace-pre-wrap">
                  {output}
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
