import React, { useState, useMemo } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, BarChart3, Clock } from 'lucide-react';

const COMMON_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 
  'of', 'is', 'are', 'was', 'were', 'it', 'this', 'that', 'these', 'those', 'they', 
  'he', 'she', 'we', 'i', 'you', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 
  'its', 'their', 'our', 'as', 'has', 'have', 'had', 'do', 'does', 'did', 'be', 'been'
]);

export default function WordCounterTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState('');
  const [ignoreCommon, setIgnoreCommon] = useState(true);
  const [copied, setCopied] = useState(false);

  // Compute text statistics
  const stats = useMemo(() => {
    const text = inputText.trim();
    if (!text) {
      return {
        charsWithSpaces: 0,
        charsNoSpaces: 0,
        words: 0,
        lines: 0,
        sentences: 0,
        paragraphs: 0,
        readingTime: 0,
        speakingTime: 0
      };
    }

    const charsWithSpaces = inputText.length;
    const charsNoSpaces = inputText.replace(/\s/g, '').length;
    const words = text.split(/\s+/).length;
    const lines = inputText.split(/\r?\n/).length;
    
    // Split sentences by . ! ?
    const sentences = inputText.split(/[.!?]+(\s+|$)/).filter(s => s && s.trim().length > 0).length;
    
    // Split paragraphs by blank lines
    const paragraphs = inputText.split(/\n\s*\n/).filter(p => p && p.trim().length > 0).length;

    // Reading time: average 200 WPM
    const readingTime = Math.ceil(words / 200);
    // Speaking time: average 130 WPM
    const speakingTime = Math.ceil(words / 130);

    return {
      charsWithSpaces,
      charsNoSpaces,
      words,
      lines,
      sentences,
      paragraphs,
      readingTime,
      speakingTime
    };
  }, [inputText]);

  // Compute keyword density
  const keywordDensity = useMemo(() => {
    const text = inputText.trim().toLowerCase();
    if (!text) return [];

    // Clean punctuation and get word list
    const wordsList = text
      .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?|[\]"']/g, '')
      .split(/\s+/)
      .filter(w => w.length > 1); // skip single-letter characters unless necessary

    const totalFilteredCount = wordsList.length;
    if (totalFilteredCount === 0) return [];

    const freqMap: Record<string, number> = {};
    wordsList.forEach(word => {
      if (ignoreCommon && COMMON_WORDS.has(word)) return;
      freqMap[word] = (freqMap[word] || 0) + 1;
    });

    const densityList = Object.entries(freqMap)
      .map(([word, count]) => ({
        word,
        count,
        density: ((count / totalFilteredCount) * 100).toFixed(1)
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return densityList;
  }, [inputText, ignoreCommon]);

  const handleCopy = async () => {
    if (!inputText) return;
    try {
      await navigator.clipboard.writeText(inputText);
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
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">Word Counter</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Word Counter</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Analyze word count, character lengths, lines, and sentences in real-time. Displays estimated speech timings and key word densities for copywriting, blogging, and editor SEO audits.
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Input Text Box (Left) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Text Input
                </label>
                <div className="flex items-center gap-3">
                  {inputText && (
                    <>
                      <button
                        onClick={handleCopy}
                        className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                          copied ? 'text-emerald-400' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy All'}
                      </button>
                      <span className="w-px h-3 bg-outline-variant" />
                      <button
                        onClick={handleClear}
                        className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Clear
                      </button>
                    </>
                  )}
                </div>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Type or paste your content here for a comprehensive real-time analysis..."
                className="w-full h-96 bg-surface-container border border-outline-variant rounded-xl p-4 font-sans text-sm text-on-surface leading-relaxed focus:outline-none focus:border-[#008cff] transition-colors resize-y placeholder:text-outline"
              />
            </div>

            {/* Dashboard / Mini Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Words', val: stats.words },
                { label: 'Characters', val: stats.charsWithSpaces },
                { label: 'No Spaces', val: stats.charsNoSpaces },
                { label: 'Lines', val: stats.lines },
                { label: 'Sentences', val: stats.sentences },
                { label: 'Paragraphs', val: stats.paragraphs },
                { label: 'Reading Time', val: `${stats.readingTime}m`, icon: <Clock className="w-3.5 h-3.5 text-blue-400" /> },
                { label: 'Speaking Time', val: `${stats.speakingTime}m`, icon: <Clock className="w-3.5 h-3.5 text-emerald-400" /> }
              ].map((card, idx) => (
                <div key={idx} className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex flex-col justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant flex items-center justify-between">
                    {card.label}
                    {card.icon}
                  </span>
                  <span className="text-2xl font-bold font-heading mt-2 text-white">
                    {card.val}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Density Analysis Sidebar (Right) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant sticky top-[80px]">
              <div className="flex justify-between items-center mb-4 pb-2 border-b border-outline-variant">
                <h2 className="font-heading font-semibold text-sm flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-[#008cff]" />
                  Keyword Density
                </h2>
                
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={ignoreCommon}
                    onChange={(e) => setIgnoreCommon(e.target.checked)}
                    className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-3.5 h-3.5"
                  />
                  <span className="text-[10px] font-mono uppercase tracking-wider text-on-surface-variant hover:text-on-surface">
                    Filter Grammatical
                  </span>
                </label>
              </div>

              {keywordDensity.length > 0 ? (
                <div className="flex flex-col gap-3">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-outline-variant text-on-surface-variant font-mono">
                        <th className="pb-2">Keyword</th>
                        <th className="pb-2 text-right">Count</th>
                        <th className="pb-2 text-right">Density</th>
                      </tr>
                    </thead>
                    <tbody>
                      {keywordDensity.map((item, idx) => (
                        <tr key={idx} className="border-b border-outline-variant/30 last:border-b-0 hover:bg-surface-container/50 transition-colors">
                          <td className="py-2.5 font-sans font-medium text-white max-w-[120px] truncate">{item.word}</td>
                          <td className="py-2.5 text-right font-mono text-on-surface-variant">{item.count}</td>
                          <td className="py-2.5 text-right font-mono text-on-surface-variant">{item.density}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8 text-outline text-xs font-mono">
                  Input text to analyze word frequencies
                </div>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
