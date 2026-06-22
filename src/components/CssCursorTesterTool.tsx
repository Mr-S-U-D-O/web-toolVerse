import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface CssCursorTesterToolProps {
  onBack: () => void;
}

const cursors = [
  'alias', 'all-scroll', 'auto', 'cell', 'col-resize', 'context-menu', 
  'copy', 'crosshair', 'default', 'e-resize', 'ew-resize', 'grab', 
  'grabbing', 'help', 'move', 'n-resize', 'ne-resize', 'nesw-resize', 
  'ns-resize', 'nw-resize', 'nwse-resize', 'no-drop', 'none', 'not-allowed', 
  'pointer', 'progress', 'row-resize', 's-resize', 'se-resize', 'sw-resize', 
  'text', 'vertical-text', 'w-resize', 'wait', 'zoom-in', 'zoom-out'
];

export default function CssCursorTesterTool({ onBack }: CssCursorTesterToolProps) {
  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">CSS Cursor Tester</h1>
        <p className="text-on-surface-variant mb-8">Hover over the boxes to preview native CSS cursor values.</p>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {cursors.map((cursor) => (
             <div 
               key={cursor} 
               className="bg-surface border border-outline rounded-xl p-6 flex items-center justify-center text-center shadow-sm hover:border-primary transition-colors select-none"
               style={{ cursor }}
             >
                <code className="text-sm font-bold opacity-80">{cursor}</code>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}
