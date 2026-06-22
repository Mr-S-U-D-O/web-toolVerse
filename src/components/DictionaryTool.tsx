import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Volume2, 
  History, 
  Sparkles, 
  Book, 
  X, 
  ArrowRight, 
  VolumeX,
  MessageSquareOff
} from 'lucide-react';
import { useDictionary, DictionaryEntry, DatamuseWord } from '../hooks/useDictionary';

export default function DictionaryTool({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'standard' | 'reverse'>('standard');
  const [query, setQuery] = useState('');
  const [audioPlaying, setAudioPlaying] = useState(false);

  const {
    loading,
    errorMsg,
    dictResult,
    reverseResult,
    history,
    lookupWord,
    lookupPhrase,
    clearHistory,
  } = useDictionary();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;

    if (activeTab === 'standard') {
      lookupWord(trimmed);
    } else {
      lookupPhrase(trimmed);
    }
  };

  const handleHistoryClick = (term: string) => {
    setQuery(term);
    if (activeTab === 'standard') {
      lookupWord(term);
    } else {
      // Let's guess if it's a single word or multiple. 
      // If single, search standard, else search reverse.
      if (term.includes(' ')) {
        setActiveTab('reverse');
        lookupPhrase(term);
      } else {
        setActiveTab('standard');
        lookupWord(term);
      }
    }
  };

  const handleWordClick = (word: string) => {
    setActiveTab('standard');
    setQuery(word);
    lookupWord(word);
  };

  const playAudio = (entry: DictionaryEntry) => {
    // Find first phonetic with audio URL
    const phoneticWithAudio = entry.phonetics.find(p => p.audio && p.audio.trim() !== '');
    if (!phoneticWithAudio?.audio) return;

    setAudioPlaying(true);
    const audio = new Audio(phoneticWithAudio.audio);
    audio.play()
      .catch(err => console.error('Audio play failed', err))
      .finally(() => {
        setTimeout(() => setAudioPlaying(false), 1000);
      });
  };

  // Helper to parse Datamuse defs (format is "partOfSpeech\tdefinition")
  const formatDatamuseDef = (defStr?: string) => {
    if (!defStr) return '';
    const parts = defStr.split('\t');
    if (parts.length > 1) {
      return (
        <span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#008cff] mr-2">({parts[0]})</span>
          {parts[1]}
        </span>
      );
    }
    return defStr;
  };

  return (
    <div className="min-h-screen bg-background text-on-surface w-full pb-20 animate-in fade-in duration-300">
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full border-b-2 border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest">Tool Cabinet</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-semibold uppercase tracking-wider text-on-surface">Dictionary Studio</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#008cff]/10 border border-[#008cff]/20 text-[10px] font-mono uppercase tracking-wider text-[#008cff]">
              100% Client-Side
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1200px] mx-auto px-6 py-12 w-full">
        {/* Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-[#008cff]">Dictionary Studio</h1>
          <p className="text-on-surface-variant mt-3 text-sm font-sans max-w-2xl leading-relaxed">
            Search detailed definitions, phonetic spellings, and pronunciations directly from public databases, or perform conceptual reverse dictionary lookups.
          </p>
        </div>

        {/* Outer Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Sidebar: Search History (Left Column) */}
          <div className="lg:col-span-3 bg-surface-container-low border-2 border-outline-variant rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex justify-between items-center pb-2 border-b border-outline-variant/60">
              <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex items-center gap-2 font-bold">
                <History className="w-3.5 h-3.5 text-[#008cff]" />
                Recent Queries
              </span>
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="font-mono text-[9px] uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {history.length > 0 ? (
              <div className="flex flex-wrap lg:flex-col gap-2 max-h-48 lg:max-h-none overflow-y-auto pr-1">
                {history.map((term, index) => (
                  <button
                    key={index}
                    onClick={() => handleHistoryClick(term)}
                    className="text-left px-3 py-2 border border-outline-variant/50 hover:border-[#008cff] bg-surface-container-high/30 hover:bg-[#008cff]/5 rounded-xl text-xs font-mono text-on-surface transition-all truncate w-auto lg:w-full select-all"
                  >
                    {term}
                  </button>
                ))}
              </div>
            ) : (
              <span className="font-sans text-[11px] text-outline text-center py-6">
                No recent searches.
              </span>
            )}
          </div>

          {/* Main Panel (Right Column) */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            
            {/* Tabs & Search Box container */}
            <div className="bg-surface-container-low border-2 border-outline-variant rounded-2xl p-6 flex flex-col gap-6">
              
              {/* Tab Selector */}
              <div className="flex border-b border-outline-variant/60">
                <button
                  onClick={() => { setActiveTab('standard'); setQuery(''); }}
                  className={`px-5 py-3 font-mono text-xs uppercase tracking-wider border-b-2 -mb-px transition-all flex items-center gap-2 font-bold ${
                    activeTab === 'standard'
                      ? 'border-[#008cff] text-[#008cff]'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Book className="w-3.5 h-3.5" />
                  Standard Dictionary
                </button>
                <button
                  onClick={() => { setActiveTab('reverse'); setQuery(''); }}
                  className={`px-5 py-3 font-mono text-xs uppercase tracking-wider border-b-2 -mb-px transition-all flex items-center gap-2 font-bold ${
                    activeTab === 'reverse'
                      ? 'border-[#008cff] text-[#008cff]'
                      : 'border-transparent text-on-surface-variant hover:text-on-surface'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Reverse Dictionary
                </button>
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={
                    activeTab === 'standard' 
                      ? "Search a word... (e.g. ephemeral)" 
                      : "Describe a concept... (e.g. lasting for a very short time)"
                  }
                  className="flex-grow bg-surface-container border-2 border-outline-variant rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[#008cff] transition-all font-sans"
                />
                <button
                  type="submit"
                  disabled={!query.trim() || loading}
                  className="flex items-center justify-center gap-2 bg-[#008cff] hover:bg-[#0070cc] disabled:opacity-50 text-white font-mono text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all shadow-sm flex-shrink-0 cursor-pointer font-semibold"
                >
                  <Search className="w-4 h-4" />
                  {loading ? 'Searching...' : 'Lookup'}
                </button>
              </form>

            </div>

            {/* Loading / Error States */}
            {loading && (
              <div className="py-20 flex flex-col items-center justify-center gap-4 bg-surface-container-low border-2 border-outline-variant rounded-2xl">
                <div className="w-8 h-8 rounded-full border-4 border-[#008cff] border-t-transparent animate-spin"></div>
                <p className="font-mono text-xs uppercase tracking-wider text-outline">Querying Database...</p>
              </div>
            )}

            {errorMsg && !loading && (
              <div className="bg-red-500/10 border-2 border-red-500/30 text-red-400 p-6 rounded-2xl flex items-start gap-3.5">
                <MessageSquareOff className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div className="flex flex-col">
                  <span className="font-sans text-sm font-semibold">Search Failed</span>
                  <span className="font-sans text-xs text-on-surface-variant mt-1">{errorMsg}</span>
                </div>
              </div>
            )}

            {/* RESULTS CONTAINER */}
            {!loading && !errorMsg && (
              <div className="flex flex-col gap-6">
                
                {/* 1. STANDARD DICTIONARY RESULTS */}
                {activeTab === 'standard' && dictResult && (
                  <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                    {dictResult.map((entry, idx) => {
                      const phoneticWithAudio = entry.phonetics.find(p => p.audio && p.audio.trim() !== '');
                      return (
                        <div key={idx} className="bg-surface-container-low border-2 border-outline-variant rounded-2xl p-6 flex flex-col gap-6">
                          
                          {/* Heading: Word, Audio, Phonetic */}
                          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b-2 border-outline-variant/60">
                            <div className="flex items-baseline gap-4">
                              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white select-all">
                                {entry.word}
                              </h2>
                              {entry.phonetic && (
                                <span className="font-mono text-sm text-[#008cff]">
                                  {entry.phonetic}
                                </span>
                              )}
                            </div>

                            {/* Pronunciation button */}
                            {phoneticWithAudio?.audio ? (
                              <button
                                onClick={() => playAudio(entry)}
                                disabled={audioPlaying}
                                className={`flex items-center gap-2 px-4 py-2 border-2 border-outline-variant hover:border-[#008cff] bg-surface-container hover:bg-[#008cff]/5 rounded-xl text-xs font-mono uppercase tracking-wider text-on-surface transition-all select-none ${
                                  audioPlaying ? 'text-[#008cff] border-[#008cff]' : ''
                                }`}
                              >
                                <Volume2 className={`w-4 h-4 ${audioPlaying ? 'animate-bounce text-[#008cff]' : ''}`} />
                                Listen
                              </button>
                            ) : (
                              <div className="flex items-center gap-2 px-4 py-2 border-2 border-outline-variant/40 bg-surface-container/20 rounded-xl text-[10px] font-mono uppercase tracking-wider text-outline select-none">
                                <VolumeX className="w-3.5 h-3.5" />
                                No Audio
                              </div>
                            )}
                          </div>

                          {/* Meanings Loop */}
                          <div className="flex flex-col gap-8">
                            {entry.meanings.map((meaning, mIdx) => (
                              <div key={mIdx} className="flex flex-col gap-4">
                                <div className="flex items-center gap-3">
                                  <span className="font-serif italic text-lg font-bold text-white capitalize">
                                    {meaning.partOfSpeech}
                                  </span>
                                  <div className="flex-grow h-px bg-outline-variant/60"></div>
                                </div>

                                {/* Definitions */}
                                <ol className="list-decimal pl-5 flex flex-col gap-4 font-sans text-sm text-on-surface-variant leading-relaxed">
                                  {meaning.definitions.map((def, dIdx) => (
                                    <li key={dIdx} className="pl-1">
                                      <p className="text-white select-all inline font-sans">{def.definition}</p>
                                      {def.example && (
                                        <p className="text-outline text-xs italic mt-1.5 font-sans">
                                          "{def.example}"
                                        </p>
                                      )}
                                      
                                      {/* Nested definition synonyms */}
                                      {def.synonyms && def.synonyms.length > 0 && (
                                        <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                          <span className="text-[10px] font-mono uppercase tracking-wider text-[#008cff]">Synonyms:</span>
                                          {def.synonyms.map((syn, sIdx) => (
                                            <button
                                              key={sIdx}
                                              onClick={() => handleWordClick(syn)}
                                              className="px-2 py-0.5 border border-[#008cff]/30 rounded hover:border-[#008cff] hover:bg-[#008cff]/5 text-xs text-[#008cff] font-sans transition-colors"
                                            >
                                              {syn}
                                            </button>
                                          ))}
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ol>

                                {/* Shared synonyms/antonyms under part of speech */}
                                {meaning.synonyms && meaning.synonyms.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-2 mt-2 bg-surface-container-high/20 p-3 rounded-xl border border-outline-variant/50">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-[#008cff] font-bold">Synonyms:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {meaning.synonyms.map((syn, sIdx) => (
                                        <button
                                          key={sIdx}
                                          onClick={() => handleWordClick(syn)}
                                          className="px-2.5 py-0.5 border border-[#008cff]/30 hover:border-[#008cff] hover:bg-[#008cff]/5 rounded-md text-xs text-[#008cff] font-sans transition-all"
                                        >
                                          {syn}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {meaning.antonyms && meaning.antonyms.length > 0 && (
                                  <div className="flex flex-wrap items-center gap-2 bg-surface-container-high/20 p-3 rounded-xl border border-outline-variant/50">
                                    <span className="font-mono text-[10px] uppercase tracking-wider text-amber-500 font-bold">Antonyms:</span>
                                    <div className="flex flex-wrap gap-1.5">
                                      {meaning.antonyms.map((ant, aIdx) => (
                                        <button
                                          key={aIdx}
                                          onClick={() => handleWordClick(ant)}
                                          className="px-2.5 py-0.5 border border-amber-500/30 hover:border-amber-500 hover:bg-amber-500/5 rounded-md text-xs text-amber-400 font-sans transition-all"
                                        >
                                          {ant}
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                )}

                              </div>
                            ))}
                          </div>

                        </div>
                      );
                    })}
                  </div>
                )}

                {/* 2. REVERSE DICTIONARY RESULTS */}
                {activeTab === 'reverse' && reverseResult && (
                  <div className="bg-surface-container-low border-2 border-outline-variant rounded-2xl p-6 flex flex-col gap-5 animate-in fade-in duration-300">
                    <div className="flex items-center justify-between pb-3 border-b-2 border-outline-variant/60">
                      <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant font-bold">
                        Matching Results Found: {reverseResult.length}
                      </span>
                    </div>

                    {reverseResult.length > 0 ? (
                      <div className="divide-y-2 divide-outline-variant/40 flex flex-col">
                        {reverseResult.map((item, index) => {
                          const percentage = Math.min(100, Math.round((item.score / 1500) * 100)); // Estimate matching pct
                          return (
                            <div
                              key={index}
                              onClick={() => handleWordClick(item.word)}
                              className="py-4 hover:px-2 rounded-lg cursor-pointer hover:bg-surface-container/40 transition-all flex items-center justify-between group"
                            >
                              <div className="flex flex-col gap-1 overflow-hidden pr-4">
                                <div className="flex items-baseline gap-3">
                                  <span className="font-sans text-lg font-bold text-white group-hover:text-[#008cff] transition-colors select-all">
                                    {item.word}
                                  </span>
                                  {percentage > 0 && (
                                    <span className="font-mono text-[10px] text-emerald-400">
                                      {percentage}% Match
                                    </span>
                                  )}
                                </div>

                                {item.defs && item.defs.length > 0 && (
                                  <div className="font-sans text-xs text-on-surface-variant truncate max-w-lg md:max-w-2xl leading-relaxed">
                                    {formatDatamuseDef(item.defs[0])}
                                  </div>
                                )}
                              </div>

                              <ArrowRight className="w-4 h-4 text-outline group-hover:text-[#008cff] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12 font-sans text-xs text-on-surface-variant">
                        No matches found for that description. Try describing the concept in different terms.
                      </div>
                    )}

                  </div>
                )}

              </div>
            )}

          </div>

        </div>
      </main>
    </div>
  );
}
