import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

interface KeycodeInfoToolProps {
  onBack: () => void;
}

export default function KeycodeInfoTool({ onBack }: KeycodeInfoToolProps) {
  const [keyEvent, setKeyEvent] = useState<KeyboardEvent | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      setKeyEvent(e);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Javascript Keycode Info</h1>
        <p className="text-on-surface-variant mb-8">Press any key to capture its Javascript event properties.</p>

        <div className="flex-1 flex flex-col items-center justify-center min-h-[400px]">
          {!keyEvent ? (
            <div className="text-center p-12 bg-surface border-2 border-dashed border-outline-variant rounded-xl animate-pulse">
               <h2 className="text-2xl font-bold text-on-surface-variant">Press any key...</h2>
            </div>
          ) : (
            <div className="w-full space-y-6 animate-in fade-in zoom-in duration-300">
               <div className="text-center mb-8">
                  <div className="text-[120px] leading-none font-bold text-primary font-mono drop-shadow-md">
                    {keyEvent.which || keyEvent.keyCode}
                  </div>
               </div>

               <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                 
                 <div className="bg-surface p-4 rounded-xl border border-outline text-center">
                    <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Event.key</div>
                    <div className="font-mono text-xl">{keyEvent.key === ' ' ? '(Space character)' : keyEvent.key}</div>
                 </div>

                 <div className="bg-surface p-4 rounded-xl border border-outline text-center">
                    <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Event.code</div>
                    <div className="font-mono text-xl">{keyEvent.code}</div>
                 </div>

                 <div className="bg-surface p-4 rounded-xl border border-outline text-center">
                    <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Event.which</div>
                    <div className="font-mono text-xl">{keyEvent.which}</div>
                 </div>
                 
                 <div className="bg-surface p-4 rounded-xl border border-outline text-center">
                    <div className="text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-2">Modifiers</div>
                    <div className="font-mono text-sm uppercase flex justify-center gap-2 flex-wrap">
                       {keyEvent.ctrlKey && <span className="bg-primary/20 text-primary px-2 rounded">Ctrl</span>}
                       {keyEvent.shiftKey && <span className="bg-primary/20 text-primary px-2 rounded">Shift</span>}
                       {keyEvent.altKey && <span className="bg-primary/20 text-primary px-2 rounded">Alt</span>}
                       {keyEvent.metaKey && <span className="bg-primary/20 text-primary px-2 rounded">Meta</span>}
                       {!keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.altKey && !keyEvent.metaKey && <span className="text-on-surface-variant">None</span>}
                    </div>
                 </div>

               </div>
               <div className="text-center mt-8 text-on-surface-variant text-sm">
                  Press another key to instantly update.
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
