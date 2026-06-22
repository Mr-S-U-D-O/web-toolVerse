import { useState, useCallback } from 'react';

// Free Dictionary API Types
export interface Phonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
}

export interface Definition {
  definition: string;
  synonyms: string[];
  antonyms: string[];
  example?: string;
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  sourceUrls?: string[];
}

export type DictionaryResponse = DictionaryEntry[];

// Datamuse API Types
export interface DatamuseWord {
  word: string;
  score: number;
  tags?: string[];
  defs?: string[];
}

export type DatamuseResponse = DatamuseWord[];

const CACHE_DICT_KEY = 'toolverse_dict_cache_v1';
const CACHE_REVERSE_KEY = 'toolverse_dict_reverse_cache_v1';
const HISTORY_KEY = 'toolverse_dict_history_v1';

// Helper to get cache map from localStorage
function getCacheMap(storageKey: string): Record<string, any> {
  try {
    const item = localStorage.getItem(storageKey);
    return item ? JSON.parse(item) : {};
  } catch (e) {
    return {};
  }
}

// Helper to save cache map to localStorage
function saveCacheMap(storageKey: string, map: Record<string, any>) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(map));
  } catch (e) {
    // If full, clear cache and retry
    try {
      localStorage.removeItem(storageKey);
      localStorage.setItem(storageKey, JSON.stringify(map));
    } catch (e2) {
      console.warn('LocalStorage is disabled or full');
    }
  }
}

export function useDictionary() {
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // State results
  const [dictResult, setDictResult] = useState<DictionaryResponse | null>(null);
  const [reverseResult, setReverseResult] = useState<DatamuseResponse | null>(null);
  
  // History state
  const [history, setHistory] = useState<string[]>(() => {
    try {
      const items = localStorage.getItem(HISTORY_KEY);
      return items ? JSON.parse(items) : [];
    } catch (e) {
      return [];
    }
  });

  const addToHistory = useCallback((term: string) => {
    const cleanTerm = term.trim().toLowerCase();
    if (!cleanTerm) return;

    setHistory((prev) => {
      const filtered = prev.filter((item) => item !== cleanTerm);
      const updated = [cleanTerm, ...filtered].slice(0, 10);
      try {
        localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Failed to save history to localStorage');
      }
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.warn('Failed to clear history');
    }
    setHistory([]);
  }, []);

  // Standard Dictionary Lookup
  const lookupWord = useCallback(async (word: string) => {
    const cleanWord = word.trim().toLowerCase();
    if (!cleanWord) return;

    setLoading(true);
    setErrorMsg(null);
    setDictResult(null);

    // 1. Check local cache
    const cache = getCacheMap(CACHE_DICT_KEY);
    if (cache[cleanWord]) {
      setDictResult(cache[cleanWord]);
      addToHistory(cleanWord);
      setLoading(false);
      return;
    }

    // 2. Fetch from Public API
    try {
      const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(cleanWord)}`);
      
      if (res.status === 404) {
        throw new Error(`Word "${word}" not found in dictionary database.`);
      }
      if (!res.ok) {
        throw new Error('Dictionary service is temporarily unavailable.');
      }

      const data: DictionaryResponse = await res.json();
      
      // Save to cache
      cache[cleanWord] = data;
      saveCacheMap(CACHE_DICT_KEY, cache);

      setDictResult(data);
      addToHistory(cleanWord);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while fetching definition.');
    } finally {
      setLoading(false);
    }
  }, [addToHistory]);

  // Reverse Dictionary conceptual search
  const lookupPhrase = useCallback(async (phrase: string) => {
    const cleanPhrase = phrase.trim().toLowerCase();
    if (!cleanPhrase) return;

    setLoading(true);
    setErrorMsg(null);
    setReverseResult(null);

    // 1. Check local cache
    const cache = getCacheMap(CACHE_REVERSE_KEY);
    if (cache[cleanPhrase]) {
      setReverseResult(cache[cleanPhrase]);
      addToHistory(cleanPhrase);
      setLoading(false);
      return;
    }

    // 2. Fetch from Public API (Datamuse ml = means like, md = metadata request d = definitions)
    try {
      const res = await fetch(`https://api.datamuse.com/words?ml=${encodeURIComponent(cleanPhrase)}&md=d`);
      
      if (!res.ok) {
        throw new Error('Reverse dictionary search is temporarily unavailable.');
      }

      const data: DatamuseResponse = await res.json();
      
      // Save to cache
      cache[cleanPhrase] = data;
      saveCacheMap(CACHE_REVERSE_KEY, cache);

      setReverseResult(data);
      addToHistory(cleanPhrase);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred during conceptual search.');
    } finally {
      setLoading(false);
    }
  }, [addToHistory]);

  return {
    loading,
    errorMsg,
    dictResult,
    reverseResult,
    history,
    lookupWord,
    lookupPhrase,
    clearHistory,
  };
}
