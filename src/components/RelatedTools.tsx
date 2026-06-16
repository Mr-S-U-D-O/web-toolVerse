import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ACTIVE_TOOLS } from './LandingPage';

export default function RelatedTools({ 
  currentToolId, 
  onNavigate 
}: { 
  currentToolId: string, 
  onNavigate: (id: string) => void 
}) {
  const currentTool = ACTIVE_TOOLS.find(t => t.id === currentToolId);
  
  if (!currentTool) return null;

  // Find tools in same category, excluding the current tool
  const related = ACTIVE_TOOLS.filter(t => 
    t.id !== currentToolId && 
    (t.category === currentTool.category || t.tags.some(tag => currentTool.tags.includes(tag)))
  ).slice(0, 4);

  if (related.length === 0) return null;

  return (
    <div className="w-full bg-surface py-12 lg:py-20 border-t border-outline-variant mt-12">
      <div className="max-w-[1280px] mx-auto px-6">
        <h2 className="font-heading text-xl font-medium tracking-tight mb-8">Related Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {related.map(tool => (
            <button
              key={tool.id}
              onClick={() => onNavigate(tool.id)}
              className="flex flex-col items-start p-5 bg-surface-container-low border border-outline-variant hover:border-primary/50 hover:bg-surface-container rounded-xl text-left transition-all group"
            >
              <h3 className="font-heading font-medium text-lg tracking-tight group-hover:text-primary transition-colors">
                {tool.name}
              </h3>
              <div className="mt-auto pt-6 flex items-center justify-between w-full">
                <span className="font-mono text-[10px] text-on-surface-variant uppercase tracking-wider">
                  {tool.category}
                </span>
                <ArrowRight className="w-4 h-4 text-outline group-hover:text-primary group-hover:translate-x-1 transition-all" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
