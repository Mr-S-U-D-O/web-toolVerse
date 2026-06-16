import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  onNavigate: (toolId: string) => void;
}

const ALL_TOOLS = [
  { 
    id: 'image-cropper', 
    name: 'Image Cropper', 
    category: 'Image Tools',
    tags: ['image', 'crop', 'cut', 'trim', 'resize', 'photo', 'picture', 'edit']
  },
  { 
    id: 'image-compressor', 
    name: 'Image Compressor', 
    category: 'Image Tools',
    tags: ['image', 'compress', 'reduce', 'size', 'shrink', 'optimize', 'photo', 'picture', 'jpeg', 'jpg', 'png']
  },
  { 
    id: 'image-resizer', 
    name: 'Image Resizer', 
    category: 'Image Tools',
    tags: ['image', 'resize', 'scale', 'dimension', 'photo', 'picture', 'width', 'height']
  },
  { 
    id: 'video-downloader', 
    name: 'Video Downloader', 
    category: 'Video Tools',
    tags: ['video', 'download', 'save', 'mp4', 'youtube', 'instagram', 'clip']
  },
  { 
    id: 'pdf-to-word', 
    name: 'PDF to Word', 
    category: 'PDF Utilities',
    tags: ['pdf', 'word', 'convert', 'document', 'doc', 'docx']
  },
  { 
    id: 'text-formatter', 
    name: 'Text Formatter', 
    category: 'Text Formatters',
    tags: ['text', 'format', 'case', 'uppercase', 'lowercase', 'string', 'words']
  },
];

function getRelevanceScore(tool: typeof ALL_TOOLS[0], query: string) {
  const q = query.toLowerCase().trim();
  let score = 0;
  
  const name = tool.name.toLowerCase();
  if (name === q) score += 100;
  else if (name.startsWith(q)) score += 50;
  else if (name.includes(q)) score += 20;

  tool.tags.forEach(tag => {
    const t = tag.toLowerCase();
    if (t === q) score += 30;
    else if (t.startsWith(q)) score += 10;
    else if (t.includes(q)) score += 5;
  });

  return score;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [query, setQuery] = useState('');
  
  const filteredTools = query.length >= 3 
    ? ALL_TOOLS
        .map(tool => ({ tool, score: getRelevanceScore(tool, query) }))
        .filter(item => item.score > 0)
        .sort((a, b) => b.score - a.score)
        .map(item => item.tool)
    : [];

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-hidden bg-background text-on-surface">
      
      {/* Main Content */}
      <main className="relative flex-grow flex flex-col items-center px-6 text-center w-full max-w-[1280px] mx-auto pt-16">
        <div className="absolute top-6 left-6 lg:left-12 text-xl font-bold font-heading tracking-tight text-primary">
          web-toolVerse
        </div>

        <div className="mt-20 flex flex-col items-center w-full">
          <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-bold font-heading tracking-tight leading-[1.1] mb-6 max-w-4xl text-primary">
            Every Free Tool You Could Ever Need.<br />In One Place.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-12 font-sans font-normal">
            Precision-engineered micro-utilities designed for maximum efficiency. No bloat, no ads, just instant execution.
          </p>
          
          {/* Search */}
          <div 
            className="w-full max-w-3xl flex items-center bg-surface-container-low rounded-full border border-outline-variant px-6 py-5 mb-16 hover:border-outline focus-within:border-primary transition-colors group shadow-2xl relative z-20"
          >
            <Search className="w-5 h-5 text-outline mr-4 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="e.g., image cropper, instagram downloader..." 
              className="flex-grow bg-transparent border-none outline-none text-on-surface placeholder:text-outline font-sans text-lg w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full max-w-3xl min-h-[300px] flex flex-col items-center transition-all duration-300">
            {query.length >= 3 ? (
               <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 relative z-10">
                  {/* Search Results List */}
                  {filteredTools.length > 0 ? (
                    <div className="w-full flex flex-col items-start text-left border border-outline-variant rounded-2xl bg-surface-container-low overflow-hidden shadow-2xl">
                       {filteredTools.map((tool, index) => (
                         <button
                           key={tool.id}
                           onClick={() => onNavigate(tool.id)}
                           className={`w-full flex items-center justify-between px-6 py-4 hover:bg-surface-container transition-colors ${index !== filteredTools.length - 1 ? 'border-b border-outline-variant' : ''}`}
                         >
                           <div>
                             <div className="text-on-surface font-sans text-lg font-medium">{tool.name}</div>
                             <div className="text-outline font-mono text-[11px] tracking-wider uppercase mt-1">{tool.category}</div>
                           </div>
                           <ArrowRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
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
                     {['Image Tools', 'Video', 'Text', 'PDF Utilities'].map(tag => (
                       <button 
                          key={tag} 
                          onClick={() => setQuery(tag)}
                          className="px-5 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest/50 hover:bg-surface-container hover:border-outline text-[13px] font-mono text-on-surface transition-all whitespace-nowrap shadow-sm"
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

