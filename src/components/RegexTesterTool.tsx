import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Editor from '@monaco-editor/react';
import { ArrowLeft, Regex, AlertCircle, Code2, CheckSquare2, Square, Copy, CheckCheck } from 'lucide-react';

interface MatchResult {
  id: string;
  fullMatch: string;
  index: number;
  groups: string[];
}

export default function RegexTesterTool({ onBack }: { onBack?: () => void }) {
  // Top Bar State
  const [pattern, setPattern] = useState('([A-Z])\\w+');
  const [flags, setFlags] = useState({ g: true, i: false, m: true });
  
  // Editor State
  const [testString, setTestString] = useState('Hello World! This is a Test String.\nWelcome to the Regex Tester Studio.');
  
  // Execution State
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [regexError, setRegexError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Debounced execution
  useEffect(() => {
    const executeRegex = () => {
      setRegexError(null);
      setMatches([]);

      if (!pattern) return;

      let flagStr = '';
      if (flags.g) flagStr += 'g';
      if (flags.i) flagStr += 'i';
      if (flags.m) flagStr += 'm';

      try {
        const regex = new RegExp(pattern, flagStr);
        const newMatches: MatchResult[] = [];
        
        if (flags.g) {
          let match;
          let iterations = 0;
          // Prevent true infinite loops if user writes an empty matching regex like /.*/g 
          // that could stall if exec returns 0 length and doesn't advance lastIndex.
          // In JS, exec handles empty matches by advancing lastIndex, but it's good to cap iterations.
          while ((match = regex.exec(testString)) !== null) {
            newMatches.push({
              id: `${match.index}-${iterations}`,
              fullMatch: match[0],
              index: match.index,
              groups: match.slice(1)
            });
            iterations++;
            if (iterations > 10000) {
               throw new Error("Execution halted: Too many matches found.");
            }
            if (match[0].length === 0) {
              regex.lastIndex++;
            }
          }
        } else {
          const match = regex.exec(testString);
          if (match) {
            newMatches.push({
              id: `${match.index}-0`,
              fullMatch: match[0],
              index: match.index,
              groups: match.slice(1)
            });
          }
        }
        
        setMatches(newMatches);
      } catch (error: any) {
        setRegexError(error.message || 'Invalid Regular Expression');
      }
    };

    const handler = setTimeout(() => {
      executeRegex();
    }, 300);

    return () => clearTimeout(handler);
  }, [pattern, flags, testString]);

  const toggleFlag = (flag: 'g' | 'i' | 'm') => {
    setFlags(prev => ({ ...prev, [flag]: !prev[flag] }));
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col relative z-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
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
            <Regex className="w-6 h-6 text-[#008cff]" />
            Regex Tester Studio
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">Test regular expressions securely and completely offline.</p>
        </div>
      </div>

      <div className="flex flex-col gap-6 h-[calc(100vh-14rem)] min-h-[600px]">
        
        {/* Top Pane: The Expression */}
        <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-4 shadow-sm flex flex-col gap-2 flex-shrink-0">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Input Wrapper */}
            <div className="flex-1 relative flex items-center font-mono text-lg bg-surface-container border border-outline-variant rounded-xl overflow-hidden shadow-inner focus-within:ring-2 focus-within:ring-[#008cff] focus-within:border-transparent transition-all">
              <span className="pl-4 pr-1 text-on-surface-variant select-none">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => setPattern(e.target.value)}
                className="flex-1 bg-transparent py-3 px-2 text-on-surface focus:outline-none w-full"
                placeholder="Enter regular expression..."
                spellCheck="false"
              />
              <span className="pr-4 pl-1 text-on-surface-variant select-none">/</span>
            </div>

            {/* Flags */}
            <div className="flex items-center gap-2 bg-surface-container border border-outline-variant rounded-xl p-2 sm:p-1 overflow-x-auto">
              {[
                { id: 'g', label: 'global', desc: 'Global Match' },
                { id: 'i', label: 'ignore', desc: 'Ignore Case' },
                { id: 'm', label: 'multi', desc: 'Multiline' }
              ].map(flag => {
                const isActive = flags[flag.id as 'g'|'i'|'m'];
                return (
                  <button
                    key={flag.id}
                    onClick={() => toggleFlag(flag.id as 'g'|'i'|'m')}
                    title={flag.desc}
                    className={`flex items-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg text-sm font-medium font-mono transition-all select-none ${
                      isActive 
                        ? 'bg-[#008cff]/10 text-[#008cff]' 
                        : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest'
                    }`}
                  >
                    <span className="opacity-70">{flag.id}</span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Error Boundary Display */}
          {regexError ? (
            <div className="flex items-center gap-2 text-red-500 text-sm font-medium mt-1 px-1 animate-in fade-in">
              <AlertCircle className="w-4 h-4" />
              {regexError}
            </div>
          ) : (
            <div className="flex items-center gap-2 text-emerald-500 text-sm font-medium mt-1 px-1 animate-in fade-in">
              <CheckSquare2 className="w-4 h-4" />
              Valid Regular Expression
            </div>
          )}
        </div>

        {/* Middle & Bottom Layout */}
        <div className="flex-1 flex flex-col lg:flex-row gap-6 min-h-0">
          
          {/* Middle Pane: Test String Editor */}
          <div className="w-full lg:w-2/3 bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[300px]">
            <div className="h-11 border-b border-outline-variant bg-surface-container-lowest flex items-center px-4 justify-between select-none">
              <div className="flex items-center gap-2 font-medium text-xs uppercase tracking-wider text-on-surface-variant">
                <Code2 size={14} className="text-[#008cff]" />
                Test String
              </div>
              <div className="text-xs text-on-surface-variant font-medium">
                {testString.length} chars
              </div>
            </div>
            <div className="flex-1 relative bg-[#1e1e1e]">
              <Editor
                height="100%"
                language="plaintext"
                theme="vs-dark"
                value={testString}
                onChange={(val) => setTestString(val || '')}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  padding: { top: 16, bottom: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
                  overviewRulerLanes: 0,
                  hideCursorInOverviewRuler: true,
                  scrollbar: {
                    vertical: 'hidden',
                    horizontal: 'hidden'
                  }
                }}
              />
            </div>
          </div>

          {/* Right/Bottom Pane: Matches List */}
          <div className="w-full lg:w-1/3 bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[300px]">
            <div className="h-11 border-b border-outline-variant bg-surface-container-lowest flex items-center px-4 justify-between select-none shrink-0">
              <div className="flex items-center gap-2 font-medium text-xs uppercase tracking-wider text-on-surface-variant">
                <CheckSquare2 size={14} className="text-emerald-500" />
                Match Results
              </div>
              <div className="text-xs font-bold bg-[#008cff]/10 text-[#008cff] px-2 py-0.5 rounded-full">
                {matches.length} Matches
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto bg-surface-container-lowest p-4 scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
              {regexError ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant gap-3 opacity-50">
                  <AlertCircle size={32} />
                  <p className="text-sm font-medium">Fix pattern errors to see matches</p>
                </div>
              ) : matches.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-on-surface-variant gap-3 opacity-50">
                  <Square size={32} className="stroke-[1.5]" />
                  <p className="text-sm font-medium">No matches found</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {matches.map((match, i) => (
                    <div key={match.id} className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
                      {/* Match Header */}
                      <div className="bg-surface-container-highest px-3 py-2 flex items-center justify-between border-b border-outline-variant">
                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                          Match {i + 1}
                        </span>
                        <span className="text-xs text-on-surface-variant font-mono">
                          Index: {match.index}
                        </span>
                      </div>
                      
                      {/* Full Match */}
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-3 group">
                          <div className="font-mono text-sm text-[#008cff] bg-[#008cff]/5 px-2 py-1 rounded w-full break-all whitespace-pre-wrap">
                            {match.fullMatch}
                          </div>
                          <button 
                            onClick={() => copyToClipboard(match.fullMatch, match.id)}
                            className="text-on-surface-variant hover:text-[#008cff] transition-colors shrink-0 p-1"
                            title="Copy Match"
                          >
                            {copiedId === match.id ? <CheckCheck size={16} className="text-emerald-500" /> : <Copy size={16} />}
                          </button>
                        </div>

                        {/* Capture Groups */}
                        {match.groups.length > 0 && (
                          <div className="mt-3 flex flex-col gap-1.5 border-t border-outline-variant pt-3">
                            <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-0.5">
                              Capture Groups
                            </span>
                            {match.groups.map((group, gIdx) => (
                              <div key={gIdx} className="flex gap-2 text-xs font-mono">
                                <span className="text-on-surface-variant/70 shrink-0">Group {gIdx + 1}:</span>
                                <span className="text-emerald-500 break-all">{group !== undefined ? group : '<undefined>'}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
