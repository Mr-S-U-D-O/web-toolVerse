import React, { useState, useMemo } from 'react';
import { Search, ArrowRight, Headphones } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ALL_TOOLS } from '../data/toolsManifest';

// @ts-ignore

function getRelevanceScore(tool: typeof ALL_TOOLS[0], query: string) {
  const qStr = query.toLowerCase().trim();
  if (!qStr) return 0;
  
  const queryTokens = qStr.split(/\s+/).filter(t => t.length > 0);
  let score = 0;
  
  const toolName = tool.name.toLowerCase();
  const catName = tool.category.toLowerCase();
  
  // 1. Exact Match string for highest relevance
  if (toolName === qStr) score += 1000;
  
  // 2. Starts with query
  if (toolName.startsWith(qStr)) score += 500;
  
  // 3. Exact Substring in name
  if (toolName.includes(qStr)) score += 200;
  
  // 4. Category Match
  if (catName === qStr) score += 150;
  else if (catName.includes(qStr)) score += 50;

  // 5. Token Level matching (highly robust for partials and scattered keywords)
  queryTokens.forEach(token => {
    // Name checks
    const toolTokens = toolName.split(/\s+/);
    if (toolTokens.includes(token)) score += 100;
    else if (toolTokens.some(t => t.startsWith(token))) score += 40;
    else if (toolName.includes(token)) score += 15;

    // Category checks
    if (catName.includes(token)) score += 15;
  });

  return score;
}

export default function LandingPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  
  const filteredTools = useMemo(() => {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2) return [];

    return ALL_TOOLS
      .map(tool => ({ tool, score: getRelevanceScore(tool, cleanQuery) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.tool);
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-hidden bg-background text-on-surface">
      
      {/* Main Content */}
      <main className="relative flex-grow flex flex-col items-center px-6 text-center w-full max-w-[1280px] mx-auto pt-16">
        <div className="absolute top-6 left-6 lg:left-12 right-6 lg:right-12 flex items-center justify-between">
          <div className="text-xl font-bold font-heading tracking-tight text-[#008cff]">
            web-toolVerse
          </div>
          <div className="flex items-center rounded-full border border-outline-variant bg-surface-container-low shadow-sm overflow-hidden h-9">
            <div className="flex items-center gap-2.5 px-4 h-full bg-surface-container-low">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 relative">
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-on-surface font-medium">
                {ALL_TOOLS.length} Functional Tool{ALL_TOOLS.length === 1 ? '' : 's'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center w-full">
          <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-bold font-heading tracking-tight leading-[1.1] mb-6 max-w-4xl text-[#008cff]">
            Every Free Tool You Could Ever Need.<br />In One Place.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-12 font-sans font-normal">
            Precision-engineered micro-utilities designed for maximum efficiency. No bloat, no ads, just instant execution.
          </p>
          
          {/* Search */}
          <div 
            className="w-full max-w-3xl flex items-center bg-surface-container-low rounded-full border border-outline-variant px-6 py-5 mb-16 hover:border-outline focus-within:border-[#008cff] focus-within:ring-1 focus-within:ring-[#008cff] transition-all group shadow-2xl relative z-20"
          >
            <Search className="w-5 h-5 text-outline mr-4 group-focus-within:text-[#008cff] transition-colors" />
            <input 
              type="text" 
              placeholder="e.g., image cropper, HTML minifier..." 
              className="flex-grow bg-transparent border-none outline-none text-on-surface placeholder:text-outline font-sans text-lg w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full max-w-3xl min-h-[300px] flex flex-col items-center transition-all duration-300">
            {query.trim().length >= 2 ? (
               <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 relative z-10">
                  {/* Search Results List */}
                  {filteredTools.length > 0 ? (
                    <div className="w-full flex flex-col items-start text-left border border-outline-variant rounded-2xl bg-surface-container-low overflow-hidden shadow-2xl">
                       {filteredTools.map((tool, index) => (
                         <button
                           key={tool.id}
                           onClick={() => navigate(`/tools/${tool.id}`)}
                           className={`w-full flex items-center justify-between px-6 py-4 hover:bg-surface-container transition-colors ${index !== filteredTools.length - 1 ? 'border-b border-outline-variant' : ''}`}
                         >
                           <div>
                             <div className="text-on-surface font-sans text-lg font-medium">{tool.name}</div>
                             <div className="text-outline font-mono text-[11px] tracking-wider uppercase mt-1">{tool.category}</div>
                           </div>
                           <ArrowRight className="w-5 h-5 text-outline group-hover:text-[#008cff] transition-colors" />
                         </button>
                       ))}
                    </div>
                  ) : (
                    <div className="text-on-surface-variant py-8 font-sans">
                       No tools found matching "{query}"
                    </div>
                  )}
               </div>
            ) : (
               <div className="flex flex-col items-center animate-in fade-in duration-300 relative z-10">
                  <h2 className="text-2xl font-semibold font-heading mb-8">Whatever you need, just search it.</h2>
                  
                  {/* Tag Cloud */}
                  <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
                     {Array.from(new Set(ALL_TOOLS.map(t => t.category))).sort().map(tag => (
                       <button 
                          key={tag} 
                          onClick={() => setQuery(tag)}
                          className="px-5 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest/50 hover:bg-surface-container hover:border-outline focus:border-[#008cff] hover:text-[#008cff] text-[13px] font-mono text-on-surface transition-all whitespace-nowrap shadow-sm group"
                       >
                         {tag}
                       </button>
                     ))}
                  </div>
               </div>
            )}
          </div>
        </div>
      </main>
      
    </div>
  );
}

