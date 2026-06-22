import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Copy, Check, Shield, RefreshCw, Sparkles } from 'lucide-react';

const DICTIONARY = {
  nouns: [
    'apple', 'backpack', 'guitar', 'ocean', 'mountain', 'coffee', 'forest', 'planet', 'rocket', 'diamond', 
    'umbrella', 'bicycle', 'sunlight', 'journey', 'kingdom', 'whisper', 'shadow', 'canyon', 'volcano', 'castle', 
    'pyramid', 'crystal', 'harmony', 'compass', 'telescope', 'lantern', 'feather', 'mirage', 'glacier', 'meadow', 
    'oasis', 'pebble', 'shelter', 'monument', 'sculpture', 'portrait', 'canvas', 'horizon', 'nebula', 'galaxy', 
    'meteor', 'mammoth', 'dinosaur', 'fossils', 'captain', 'soldier', 'wizard', 'engine', 'computer', 'keyboard', 
    'circuit', 'magnet', 'village', 'harbor', 'island', 'valley', 'fountain', 'monastery', 'library', 'station', 
    'airport', 'bridge', 'palace', 'temple', 'garden', 'orchard', 'vineyard', 'pasture', 'desert', 'tundra', 
    'savanna', 'jungle', 'swamp', 'monsoon', 'hurricane', 'tornado', 'blizzard', 'avalanche'
  ],
  verbs: [
    'discover', 'explore', 'create', 'ponder', 'wander', 'resonate', 'amplify', 'transcend', 'navigate', 'illuminate', 
    'reflect', 'conquer', 'journey', 'whisper', 'spark', 'breathe', 'transform', 'shimmer', 'radiate', 'capture', 
    'climb', 'design', 'envision', 'innovate', 'synthesize', 'engineer', 'construct', 'cultivate', 'flourish', 'thrive', 
    'prosper', 'vanish', 'materialize', 'accelerate', 'decelerate', 'rotate', 'ascend', 'descend', 'float', 'drift', 
    'soar', 'glide', 'dive', 'plunge', 'gallop', 'sprint', 'stride', 'march', 'roam', 'traverse', 'circumnavigate', 
    'inquire', 'investigate', 'analyze', 'observe', 'scrutinize', 'decipher', 'translate', 'interpret', 'communicate', 
    'articulate', 'collaborate', 'cooperate', 'unite', 'harmonize', 'orchestrate'
  ],
  adjectives: [
    'vibrant', 'luminous', 'mystical', 'ancient', 'infinite', 'serene', 'glorious', 'majestic', 'harmonious', 'brilliant', 
    'resilient', 'dynamic', 'stellar', 'ethereal', 'cozy', 'sublime', 'exquisite', 'valiant', 'audacious', 'solitary', 
    'panoramic', 'symmetrical', 'organic', 'abstract', 'enigmatic', 'cryptic', 'obscure', 'radiant', 'gleaming', 'dazzling', 
    'sparkling', 'shimmering', 'glowing', 'lustrous', 'translucent', 'transparent', 'opaque', 'rugged', 'smooth', 'velvety', 
    'silky', 'metallic', 'wooden', 'stony', 'fertile', 'barren', 'arid', 'tropical', 'polar', 'alpine', 'volcanic', 
    'magnetic', 'electric', 'acoustic', 'synthetic', 'digital', 'analog', 'vintage', 'futuristic', 'modern', 'prehistoric', 
    'medieval', 'galactic', 'cosmic', 'universal'
  ]
};

export default function RandomWordGeneratorTool({ onBack }: { onBack?: () => void }) {
  const [wordType, setWordType] = useState<'any' | 'nouns' | 'verbs' | 'adjectives'>('any');
  const [count, setCount] = useState(10);
  const [minLength, setMinLength] = useState(2);
  const [maxLength, setMaxLength] = useState(15);
  const [startsWith, setStartsWith] = useState('');
  const [endsWith, setEndsWith] = useState('');
  const [contains, setContains] = useState('');
  const [format, setFormat] = useState<'space' | 'comma' | 'newline'>('space');
  const [capitalized, setCapitalized] = useState(false);
  
  const [generatedWords, setGeneratedWords] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(0);

  useEffect(() => {
    // 1. Determine active pool
    let pool: string[] = [];
    if (wordType === 'any') {
      pool = [...DICTIONARY.nouns, ...DICTIONARY.verbs, ...DICTIONARY.adjectives];
    } else {
      pool = [...DICTIONARY[wordType]];
    }

    // Remove duplicates from pool
    pool = Array.from(new Set(pool));

    // 2. Apply filters
    let filtered = pool.filter(word => {
      // Length check
      if (word.length < minLength || word.length > maxLength) return false;
      
      // Prefix check
      if (startsWith && !word.startsWith(startsWith.toLowerCase())) return false;
      
      // Suffix check
      if (endsWith && !word.endsWith(endsWith.toLowerCase())) return false;
      
      // Contains check
      if (contains && !word.includes(contains.toLowerCase())) return false;

      return true;
    });

    if (filtered.length === 0) {
      setGeneratedWords([]);
      return;
    }

    // 3. Generate requested count
    const result: string[] = [];
    for (let i = 0; i < count; i++) {
      const randIdx = Math.floor(Math.random() * filtered.length);
      let word = filtered[randIdx];
      if (capitalized) {
        word = word.charAt(0).toUpperCase() + word.slice(1);
      }
      result.push(word);
    }

    setGeneratedWords(result);
  }, [wordType, count, minLength, maxLength, startsWith, endsWith, contains, capitalized, seed]);

  const outputText = useMemo(() => {
    if (generatedWords.length === 0) return '';
    if (format === 'comma') return generatedWords.join(', ');
    if (format === 'newline') return generatedWords.join('\n');
    return generatedWords.join(' ');
  }, [generatedWords, format]);

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

  const triggerRegenerate = () => {
    setSeed(prev => prev + 1);
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
            <div className="font-sans text-sm font-medium text-on-surface">Random Word Generator</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Random Word Generator</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Generate random English nouns, verbs, and adjectives. Filter words by exact size, prefix, suffix, or inner character clusters. Ideal for brainstorming, testing, and creative writing.
          </p>
        </div>

        {/* Two-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Configurations (Left) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
              <h2 className="font-heading font-semibold text-base mb-6 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#008cff]" />
                Generator Options
              </h2>
              
              <div className="flex flex-col gap-6">
                
                {/* Part of Speech Selection */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-3">
                    Part of Speech
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { value: 'any', label: 'Any Word' },
                      { value: 'nouns', label: 'Nouns' },
                      { value: 'verbs', label: 'Verbs' },
                      { value: 'adjectives', label: 'Adjectives' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setWordType(opt.value as any)}
                        className={`py-2 px-3 text-xs font-mono uppercase rounded-lg border transition-colors ${
                          wordType === opt.value
                            ? 'border-[#008cff] bg-[#008cff]/10 text-white'
                            : 'border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Length Limits */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                      Min Length ({minLength})
                    </label>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={minLength}
                      onChange={(e) => setMinLength(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-[#008cff]"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                      Max Length ({maxLength})
                    </label>
                    <input
                      type="range"
                      min="6"
                      max="15"
                      value={maxLength}
                      onChange={(e) => setMaxLength(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-[#008cff]"
                    />
                  </div>
                </div>

                {/* Specific Filters (Prefix/Suffix/Contains) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-outline-variant pt-5">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                      Starts With
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={startsWith}
                      onChange={(e) => setStartsWith(e.target.value.trim())}
                      placeholder="e.g. s"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-sm font-mono text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                      Ends With
                    </label>
                    <input
                      type="text"
                      maxLength={3}
                      value={endsWith}
                      onChange={(e) => setEndsWith(e.target.value.trim())}
                      placeholder="e.g. y"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-sm font-mono text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                      Contains
                    </label>
                    <input
                      type="text"
                      maxLength={5}
                      value={contains}
                      onChange={(e) => setContains(e.target.value.trim())}
                      placeholder="e.g. an"
                      className="w-full bg-surface-container border border-outline-variant rounded-xl px-4 py-2 text-sm font-mono text-on-surface focus:outline-none focus:border-[#008cff] transition-colors"
                    />
                  </div>
                </div>

                {/* Output settings */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-outline-variant pt-5">
                  
                  {/* Format delimiter */}
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                      Output Separator
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'space', label: 'Space' },
                        { value: 'comma', label: 'Comma' },
                        { value: 'newline', label: 'Line' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormat(opt.value as any)}
                          className={`py-2 px-3 text-xs font-mono rounded-lg border transition-colors ${
                            format === opt.value
                              ? 'border-[#008cff] bg-[#008cff]/10 text-white'
                              : 'border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Options */}
                  <div className="flex flex-col gap-3 justify-center sm:pl-4">
                    <label className="flex items-center gap-3 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={capitalized}
                        onChange={(e) => setCapitalized(e.target.checked)}
                        className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                      />
                      <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                        Capitalize words
                      </span>
                    </label>
                  </div>

                </div>

                {/* Word count slider */}
                <div className="border-t border-outline-variant pt-5">
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Number of Words ({count})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-[#008cff]"
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Generated Words Display (Right) */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant sticky top-[80px]">
              
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Generated Words
                </label>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={triggerRegenerate}
                    className="p-2 rounded-lg border border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface transition-colors"
                    title="Regenerate"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                  </button>

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
              </div>

              {generatedWords.length > 0 ? (
                <div className="flex flex-col gap-4">
                  
                  {/* Grid layout for visual representation */}
                  {format !== 'newline' && (
                    <div className="flex flex-wrap gap-2 p-4 bg-surface-container-lowest border border-outline-variant rounded-xl max-h-40 overflow-y-auto">
                      {generatedWords.map((word, idx) => (
                        <span key={idx} className="px-2.5 py-1 bg-surface-container border border-outline-variant rounded-lg font-sans text-xs text-white">
                          {word}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Textarea for raw select copy */}
                  <textarea
                    readOnly
                    value={outputText}
                    placeholder="Click regenerate to generate words..."
                    className="w-full h-56 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none resize-none placeholder:text-outline/70"
                  />

                </div>
              ) : (
                <div className="text-center py-16 text-outline text-xs font-mono bg-surface-container-lowest border border-outline-variant rounded-xl">
                  No words matching your filters.<br />Try adjusting the criteria.
                </div>
              )}
              
              <div className="mt-2 text-[11px] font-mono text-on-surface-variant">
                <span>Count: {generatedWords.length}</span>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
