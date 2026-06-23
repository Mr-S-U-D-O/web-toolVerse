import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, BrainCircuit, Upload, Download, Plus, Layers, ArrowRight, RotateCcw, Frown, Smile, Zap, RefreshCw } from 'lucide-react';

interface Flashcard {
  id: string;
  front: string;
  back: string;
  box: number; // Leitner system box
  nextReview: number; // Timestamp
}

interface Deck {
  cards: Flashcard[];
}

export default function FlashcardEngineTool({ onBack }: { onBack?: () => void }) {
  const [mode, setMode] = useState<'build' | 'study'>('build');
  const [deck, setDeck] = useState<Deck>({ cards: [] });
  
  // Builder state
  const [rawInput, setRawInput] = useState('Term 1 - Definition 1\nTerm 2 - Definition 2\nPhotosynthesis - The process by which plants use sunlight to synthesize foods.');
  
  // Study state
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [dueCards, setDueCards] = useState<Flashcard[]>([]);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('toolverse_flashcards_deck');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.cards) {
          setDeck(parsed);
          setMode(parsed.cards.length > 0 ? 'study' : 'build');
        }
      } catch (e) {
        console.error("Failed to parse deck from local storage");
      }
    }
  }, []);

  // Save to localStorage when deck changes
  useEffect(() => {
    localStorage.setItem('toolverse_flashcards_deck', JSON.stringify(deck));
  }, [deck]);

  // Prepare study session
  useEffect(() => {
    if (mode === 'study') {
      const now = Date.now();
      // Filter cards due for review (or new cards with nextReview = 0)
      const due = deck.cards.filter(c => c.nextReview <= now).sort((a, b) => a.nextReview - b.nextReview);
      
      setDueCards(due);
      setActiveCardIndex(0);
      setIsFlipped(false);
      setSessionCompleted(due.length === 0);
    }
  }, [mode, deck.cards]);

  const handleParseCards = () => {
    const lines = rawInput.split('\n');
    const newCards: Flashcard[] = lines
      .map(line => {
        // Support "-" or ":" or tab separators
        const parts = line.split(/[-:\t]/);
        if (parts.length >= 2) {
          const front = parts[0].trim();
          const back = parts.slice(1).join('-').trim();
          if (front && back) {
            return {
              id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString() + Math.random(),
              front,
              back,
              box: 0,
              nextReview: 0
            };
          }
        }
        return null;
      })
      .filter(Boolean) as Flashcard[];

    if (newCards.length > 0) {
      setDeck(prev => ({
        cards: [...prev.cards, ...newCards]
      }));
      setRawInput('');
    }
  };

  const handleReview = (quality: 'hard' | 'good' | 'easy') => {
    if (dueCards.length === 0) return;

    const activeCard = dueCards[activeCardIndex];
    const now = Date.now();
    
    let newBox = activeCard.box;
    let nextReviewDelay = 0; // ms

    if (quality === 'hard') {
      newBox = 0; // Reset
      nextReviewDelay = 1000 * 60 * 5; // 5 mins
    } else if (quality === 'good') {
      newBox += 1;
      // Exponential intervals: 1d, 3d, 7d, 14d, 30d
      const days = newBox === 1 ? 1 : newBox === 2 ? 3 : newBox === 3 ? 7 : newBox === 4 ? 14 : 30;
      nextReviewDelay = 1000 * 60 * 60 * 24 * days;
    } else if (quality === 'easy') {
      newBox += 2;
      const days = newBox === 2 ? 4 : newBox === 3 ? 10 : newBox >= 4 ? 21 : 30;
      nextReviewDelay = 1000 * 60 * 60 * 24 * days;
    }

    const updatedCard = {
      ...activeCard,
      box: newBox,
      nextReview: now + nextReviewDelay
    };

    // Update main deck
    setDeck(prev => ({
      ...prev,
      cards: prev.cards.map(c => c.id === updatedCard.id ? updatedCard : c)
    }));

    // Move to next card
    if (activeCardIndex < dueCards.length - 1) {
      setIsFlipped(false);
      setTimeout(() => setActiveCardIndex(prev => prev + 1), 150);
    } else {
      setSessionCompleted(true);
    }
  };

  const exportDeck = () => {
    const blob = new Blob([JSON.stringify(deck, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `flashcards_deck_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importDeck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const parsed = JSON.parse(e.target?.result as string);
          if (parsed && parsed.cards && Array.isArray(parsed.cards)) {
            setDeck(parsed);
          }
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const activeCard = dueCards[activeCardIndex];

  return (
    <div className="flex-grow w-full max-w-5xl mx-auto px-6 py-8 flex flex-col relative z-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          {onBack && (
            <button 
              onClick={onBack}
              className="p-2 -ml-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
              title="Back to Directory"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}
          <div>
            <h1 className="text-2xl font-bold font-heading tracking-tight text-on-surface flex items-center gap-2">
              <BrainCircuit className="w-6 h-6 text-[#008cff]" />
              Offline Flashcard Engine
            </h1>
            <p className="text-sm text-on-surface-variant mt-0.5">Spaced repetition without paywalls. Your progress saves locally.</p>
          </div>
        </div>
        
        {/* Mode Toggles */}
        <div className="flex bg-surface-container-low border border-outline-variant p-1 rounded-xl">
          <button
            onClick={() => setMode('build')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              mode === 'build' ? 'bg-surface shadow-sm text-[#008cff]' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <Layers className="w-4 h-4" /> Builder
          </button>
          <button
            onClick={() => setMode('study')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
              mode === 'study' ? 'bg-surface shadow-sm text-[#008cff]' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            <RefreshCw className="w-4 h-4" /> Study
          </button>
        </div>
      </div>

      {mode === 'build' && (
        <div className="flex flex-col gap-6 animate-in fade-in">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <h2 className="text-lg font-bold text-on-surface">Import & Export</h2>
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 bg-surface hover:bg-surface-container-highest border border-outline-variant px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm font-medium">
                <Upload className="w-4 h-4" /> Import Deck (.json)
                <input type="file" accept=".json" onChange={importDeck} className="hidden" />
              </label>
              <button 
                onClick={exportDeck}
                disabled={deck.cards.length === 0}
                className="flex items-center gap-2 bg-surface hover:bg-surface-container-highest border border-outline-variant disabled:opacity-50 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                <Download className="w-4 h-4" /> Export Deck (.json)
              </button>
              
              <div className="ml-auto flex items-center gap-2 text-sm text-on-surface-variant bg-surface-container px-3 py-1.5 rounded-full">
                <strong>{deck.cards.length}</strong> total cards
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div>
                <h2 className="text-lg font-bold text-on-surface mb-1">Bulk Add Cards</h2>
                <p className="text-sm text-on-surface-variant">Paste your list. Use a hyphen <code className="bg-surface-container px-1 py-0.5 rounded">-</code> or tab to separate terms and definitions.</p>
              </div>
            </div>
            
            <textarea
              value={rawInput}
              onChange={(e) => setRawInput(e.target.value)}
              className="w-full h-64 bg-[#1e1e1e] text-slate-200 p-4 rounded-xl font-mono text-sm border border-outline-variant focus:outline-none focus:ring-2 focus:ring-[#008cff] shadow-inner resize-y"
              placeholder="Term 1 - Definition 1&#10;Term 2 - Definition 2"
            />
            
            <button 
              onClick={handleParseCards}
              disabled={!rawInput.trim()}
              className="self-end flex items-center gap-2 bg-[#008cff] text-white hover:bg-[#0070cc] disabled:bg-surface-container-highest disabled:text-on-surface-variant px-6 py-3 rounded-xl font-bold transition-all shadow-sm"
            >
              <Plus className="w-5 h-5" /> Parse & Add to Deck
            </button>
          </div>
        </div>
      )}

      {mode === 'study' && (
        <div className="flex flex-col items-center justify-center min-h-[500px] animate-in fade-in">
          {sessionCompleted ? (
            <div className="flex flex-col items-center text-center p-8 bg-surface-container-low border border-outline-variant rounded-3xl shadow-sm max-w-md w-full">
              <div className="w-20 h-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mb-6">
                <BrainCircuit className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-on-surface mb-2">You're all caught up!</h2>
              <p className="text-on-surface-variant mb-8">You've reviewed all due cards for now. Great job maintaining your streak!</p>
              <button 
                onClick={() => setMode('build')}
                className="w-full bg-surface-container hover:bg-surface-container-highest border border-outline-variant text-on-surface font-bold py-3 px-6 rounded-xl transition-all"
              >
                Manage Deck
              </button>
            </div>
          ) : activeCard ? (
            <div className="w-full max-w-2xl flex flex-col items-center">
              {/* Progress */}
              <div className="w-full flex items-center justify-between mb-6 text-sm font-bold text-on-surface-variant uppercase tracking-wider">
                <span>Reviewing {activeCardIndex + 1} of {dueCards.length}</span>
                <span className="flex items-center gap-1">
                  Box {activeCard.box} <div className={`w-2 h-2 rounded-full ${activeCard.box === 0 ? 'bg-red-400' : activeCard.box < 3 ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                </span>
              </div>

              {/* 3D Flashcard */}
              <div className="perspective-1000 w-full mb-10" style={{ perspective: '1000px' }}>
                <motion.div
                  animate={{ rotateX: isFlipped ? 180 : 0 }}
                  transition={{ duration: 0.6, type: 'spring', stiffness: 260, damping: 20 }}
                  style={{ transformStyle: 'preserve-3d' }}
                  className="relative w-full h-80 sm:h-96 cursor-pointer"
                  onClick={() => setIsFlipped(!isFlipped)}
                >
                  {/* Front */}
                  <div 
                    className="absolute inset-0 bg-surface-container-low border border-outline-variant rounded-3xl shadow-md flex items-center justify-center p-8 sm:p-12"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="absolute top-4 left-4 text-xs font-bold text-on-surface-variant/50 uppercase tracking-widest">Front</div>
                    <p className="text-2xl sm:text-3xl font-bold text-on-surface text-center leading-tight">
                      {activeCard.front}
                    </p>
                    <div className="absolute bottom-6 text-xs font-medium text-on-surface-variant/50 flex items-center gap-1">
                      Click to flip <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>

                  {/* Back */}
                  <div 
                    className="absolute inset-0 bg-surface border border-[#008cff]/20 rounded-3xl shadow-xl flex items-center justify-center p-8 sm:p-12"
                    style={{ backfaceVisibility: 'hidden', transform: 'rotateX(180deg)' }}
                  >
                    <div className="absolute top-4 left-4 text-xs font-bold text-[#008cff]/50 uppercase tracking-widest">Back</div>
                    <p className="text-xl sm:text-2xl text-on-surface text-center leading-relaxed">
                      {activeCard.back}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Controls */}
              <AnimatePresence>
                {isFlipped ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-wrap items-center justify-center gap-3 w-full"
                  >
                    <button 
                      onClick={() => handleReview('hard')}
                      className="flex-1 min-w-[120px] flex flex-col items-center gap-1 py-3 px-4 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-xl transition-colors"
                    >
                      <RotateCcw className="w-5 h-5 mb-1" />
                      <span className="font-bold">Hard</span>
                      <span className="text-[10px] opacity-70 uppercase tracking-wider">&lt; 5m</span>
                    </button>
                    <button 
                      onClick={() => handleReview('good')}
                      className="flex-1 min-w-[120px] flex flex-col items-center gap-1 py-3 px-4 bg-[#008cff]/10 hover:bg-[#008cff]/20 text-[#008cff] border border-[#008cff]/20 rounded-xl transition-colors"
                    >
                      <Smile className="w-5 h-5 mb-1" />
                      <span className="font-bold">Good</span>
                      <span className="text-[10px] opacity-70 uppercase tracking-wider">{activeCard.box === 0 ? '1d' : `${activeCard.box * 2}d`}</span>
                    </button>
                    <button 
                      onClick={() => handleReview('easy')}
                      className="flex-1 min-w-[120px] flex flex-col items-center gap-1 py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/20 rounded-xl transition-colors"
                    >
                      <Zap className="w-5 h-5 mb-1" />
                      <span className="font-bold">Easy</span>
                      <span className="text-[10px] opacity-70 uppercase tracking-wider">4d+</span>
                    </button>
                  </motion.div>
                ) : (
                  <div className="h-[76px] flex items-center justify-center text-on-surface-variant text-sm font-medium">
                    Think of the answer, then flip the card to check.
                  </div>
                )}
              </AnimatePresence>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
