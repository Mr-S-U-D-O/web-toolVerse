import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, XCircle } from 'lucide-react';
import bcrypt from 'bcryptjs';

interface BcryptValidatorToolProps {
  onBack: () => void;
}

export default function BcryptValidatorTool({ onBack }: BcryptValidatorToolProps) {
  const [plainText, setPlainText] = useState('password123');
  const [hashBox, setHashBox] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    if (!plainText || !hashBox) {
      setIsValid(null);
      return;
    }
    
    // Bcrypt hashes usually start with $2a$, $2x$, $2y$, or $2b$ and are 60 chars long
    if (hashBox.length !== 60 || !hashBox.startsWith('$2')) {
       setIsValid(false);
       return;
    }

    try {
      const match = bcrypt.compareSync(plainText, hashBox);
      setIsValid(match);
    } catch {
      setIsValid(false);
    }
  }, [plainText, hashBox]);

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Bcrypt Validator</h1>
        <p className="text-on-surface-variant mb-8">Test if a given string matches a bcrypt hash.</p>

        <div className="space-y-6">
           <div className="bg-surface border border-outline rounded-xl p-6 shadow-sm">
             <label className="block text-sm font-bold mb-2">Plain Text</label>
             <input
               type="text"
               value={plainText}
               onChange={(e) => setPlainText(e.target.value)}
               className="w-full bg-background border border-outline rounded-lg p-3 focus:outline-none focus:border-primary"
               placeholder="Enter the plain text..."
             />
           </div>

           <div className="bg-surface border border-outline rounded-xl p-6 shadow-sm relative">
             <label className="block text-sm font-bold mb-2">Bcrypt Hash</label>
             <input
               type="text"
               value={hashBox}
               onChange={(e) => setHashBox(e.target.value)}
               className="w-full bg-background border border-outline rounded-lg p-3 font-mono text-sm focus:outline-none focus:border-primary"
               placeholder="$2a$10$..."
             />
           </div>

           <div className="flex justify-center items-center py-12">
              {isValid === null ? (
                 <div className="text-center bg-surface-container-highest px-8 py-4 rounded-xl border border-outline-variant font-medium text-on-surface-variant">
                    Enter both values to validate.
                 </div>
              ) : isValid === true ? (
                 <div className="flex animate-in zoom-in items-center gap-4 text-emerald-500 bg-emerald-500/10 px-8 py-6 rounded-xl border border-emerald-500/30">
                    <CheckCircle size={48} />
                    <span className="text-3xl font-bold">Hash Matches Text!</span>
                 </div>
              ) : (
                 <div className="flex animate-in zoom-in items-center gap-4 text-red-500 bg-red-500/10 px-8 py-6 rounded-xl border border-red-500/30">
                    <XCircle size={48} />
                    <span className="text-3xl font-bold">Does Not Match.</span>
                 </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}
