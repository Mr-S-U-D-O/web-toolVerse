import React, { useState } from 'react';
import { ArrowLeft, Play, AlertCircle } from 'lucide-react';

interface RegexTesterToolProps {
  onBack: () => void;
}

export default function RegexTesterTool({ onBack }: RegexTesterToolProps) {
  const [regexStr, setRegexStr] = useState<string>('[A-Z]\\w+');
  const [flags, setFlags] = useState<string>('g');
  const [testString, setTestString] = useState<string>('Hello World! This is a Test String.');
  const [error, setError] = useState<string | null>(null);

  const getResults = () => {
    try {
      if (!regexStr) return { matches: [], error: null };
      const regex = new RegExp(regexStr, flags);
      const matches = [];
      let match;
      
      if (!flags.includes('g')) {
        match = regex.exec(testString);
        if (match) matches.push({ text: match[0], index: match.index, length: match[0].length });
      } else {
        // Global matching
        while ((match = regex.exec(testString)) !== null) {
          matches.push({ text: match[0], index: match.index, length: match[0].length });
          // Prevent infinite loop on empty match
          if (match.index === regex.lastIndex) {
            regex.lastIndex++;
          }
        }
      }
      return { matches, error: null };
    } catch (e: any) {
      return { matches: [], error: e.message };
    }
  };

  const { matches, error: regexError } = getResults();

  // Helper to highlight text
  const renderHighlightedText = () => {
    if (regexError || !regexStr || matches.length === 0) {
      return <span>{testString}</span>;
    }

    const result = [];
    let lastIndex = 0;

    matches.forEach((m, idx) => {
      // Add text before match
      if (m.index > lastIndex) {
        result.push(<span key={`text-${idx}`}>{testString.substring(lastIndex, m.index)}</span>);
      }
      // Add highlighted match
      result.push(
        <span key={`match-${idx}`} className="bg-primary/30 text-primary font-bold rounded px-[2px]">
          {m.text}
        </span>
      );
      lastIndex = m.index + m.length;
    });

    // Add remaining text
    if (lastIndex < testString.length) {
      result.push(<span key="text-end">{testString.substring(lastIndex)}</span>);
    }

    return result;
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

        <h1 className="text-3xl font-bold font-heading mb-2">Regex Tester</h1>
        <p className="text-on-surface-variant mb-8">Test and debug Regular Expressions in real-time.</p>

        <div className="bg-surface rounded-xl p-6 border border-outline flex flex-col gap-6">
          
          <div>
            <label className="block text-sm font-bold mb-2">Regular Expression</label>
            <div className="flex bg-background border border-outline rounded-lg overflow-hidden focus-within:border-primary">
              <span className="px-4 py-3 bg-surface border-r border-outline text-on-surface-variant font-mono">/</span>
              <input
                type="text"
                className="w-full bg-background px-4 py-3 font-mono focus:outline-none"
                value={regexStr}
                onChange={(e) => setRegexStr(e.target.value)}
                placeholder="pattern"
              />
              <span className="px-4 py-3 bg-surface border-l border-outline text-on-surface-variant font-mono">/</span>
              <input
                type="text"
                className="w-16 bg-background px-4 py-3 font-mono focus:outline-none placeholder:text-on-surface-variant/50"
                value={flags}
                onChange={(e) => setFlags(e.target.value)}
                placeholder="flags"
              />
            </div>
            {regexError && (
              <div className="text-red-500 text-sm mt-2 flex items-center gap-1">
                <AlertCircle size={14} /> {regexError}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Test String</label>
            <textarea
              className="w-full bg-background border border-outline rounded-xl px-4 py-3 font-mono focus:outline-none focus:border-primary min-h-[150px] resize-y leading-relaxed"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="Paste text to test against here..."
              spellCheck={false}
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2">Result Highlight</label>
            <div className="w-full bg-background border border-outline rounded-xl px-4 py-3 font-mono min-h-[150px] leading-relaxed whitespace-pre-wrap break-all relative">
              {renderHighlightedText()}
            </div>
          </div>
          
          <div className="border border-outline rounded-xl overflow-hidden">
             <div className="p-3 bg-background border-b border-outline text-sm font-bold flex justify-between">
               <span>Matches: {matches.length}</span>
             </div>
             <div className="max-h-[200px] overflow-y-auto bg-surface">
                {matches.length === 0 ? (
                  <div className="p-4 text-center text-on-surface-variant text-sm">No matches found.</div>
                ) : (
                  <table className="w-full text-sm text-left">
                    <thead className="bg-background">
                      <tr>
                        <th className="px-4 py-2 border-b border-outline font-medium w-16">#</th>
                        <th className="px-4 py-2 border-b border-outline font-medium">Match</th>
                        <th className="px-4 py-2 border-b border-outline font-medium w-24">Index</th>
                      </tr>
                    </thead>
                    <tbody>
                      {matches.map((m, idx) => (
                        <tr key={idx} className="border-b border-outline/50 hover:bg-background/50">
                          <td className="px-4 py-2 text-on-surface-variant">{idx + 1}</td>
                          <td className="px-4 py-2 font-mono break-all">{m.text}</td>
                          <td className="px-4 py-2 font-mono">{m.index}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}
