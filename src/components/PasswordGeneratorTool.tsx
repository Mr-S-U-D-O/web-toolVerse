import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, RefreshCw, KeyRound, Check } from 'lucide-react';

interface PasswordGeneratorToolProps {
  onBack: () => void;
}

export default function PasswordGeneratorTool({ onBack }: PasswordGeneratorToolProps) {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(16);
  const [hasUpper, setHasUpper] = useState(true);
  const [hasLower, setHasLower] = useState(true);
  const [hasNumbers, setHasNumbers] = useState(true);
  const [hasSymbols, setHasSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    const caps = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lower = 'abcdefghijklmnopqrstuvwxyz';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+~`|}{[]:;?><,./-=';
    
    let chars = '';
    if (hasUpper) chars += caps;
    if (hasLower) chars += lower;
    if (hasNumbers) chars += numbers;
    if (hasSymbols) chars += symbols;

    if (!chars) {
      setPassword('');
      return;
    }

    let pass = '';
    for (let i = 0; i < length; i++) {
       const randomIndex = Math.floor(Math.random() * chars.length);
       pass += chars[randomIndex];
    }
    setPassword(pass);
  };

  useEffect(() => {
    generatePassword();
  }, [length, hasUpper, hasLower, hasNumbers, hasSymbols]);

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getEntropyScore = () => {
     let pool = 0;
     if (hasUpper) pool += 26;
     if (hasLower) pool += 26;
     if (hasNumbers) pool += 10;
     if (hasSymbols) pool += 30;
     
     if (pool === 0) return 0;
     const entropy = length * Math.log2(pool);
     
     if (entropy > 80) return 4;
     if (entropy > 60) return 3;
     if (entropy > 40) return 2;
     if (entropy > 20) return 1;
     return 0;
  };

  const strength = getEntropyScore();
  const strengthLabels = ['Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const strengthColors = ['bg-error', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500', 'bg-emerald-400'];

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">
      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
        <div className="w-full max-w-xl flex flex-col gap-8 animate-in fade-in duration-300">
          
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
               <KeyRound className="w-5 h-5 text-primary" />
            </div>
            <h1 className="font-heading text-2xl font-semibold tracking-tight">Password Generator</h1>
          </div>
          
          {/* Output Display */}
          <div className="relative group bg-surface-container border-2 border-outline-variant hover:border-primary transition-colors rounded-xl p-6 flex flex-col items-center">
            <div className="w-full relative">
               <input
                 type="text"
                 value={password}
                 readOnly
                 className="w-full bg-transparent text-center font-mono text-2xl md:text-3xl text-primary outline-none tracking-widest px-8"
               />
               <div className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center gap-2">
                 <button onClick={generatePassword} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    <RefreshCw className="w-5 h-5" />
                 </button>
                 <button onClick={handleCopy} className="p-2 text-on-surface-variant hover:text-primary transition-colors">
                    {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                 </button>
               </div>
            </div>
            
            {/* Strength Meter */}
            <div className="w-full mt-6 space-y-2">
               <div className="flex justify-between items-center px-1">
                 <span className="font-mono text-[11px] text-outline uppercase tracking-wider">Strength</span>
                 <span className="font-mono text-[11px] font-semibold uppercase tracking-wider" style={{ color: strength === 4 ? '#34d399' : strength === 3 ? '#22c55e' : strength === 2 ? '#eab308' : '#ef4444' }}>
                   {strengthLabels[strength]}
                 </span>
               </div>
               <div className="flex gap-2 w-full h-1.5">
                 {[1, 2, 3, 4].map(level => (
                    <div 
                      key={level} 
                      className={`flex-1 rounded-full transition-all duration-300 ${level <= strength ? strengthColors[strength] : 'bg-surface-container-highest'}`}
                    />
                 ))}
               </div>
            </div>
          </div>

          {/* Controls */}
          <div className="bg-surface-container-low border border-outline-variant rounded-xl p-6 shadow-sm flex flex-col gap-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="font-mono text-[13px] text-on-surface uppercase tracking-widest font-semibold">Password Length</span>
                <span className="font-mono text-lg text-primary tabular-nums font-semibold">{length}</span>
              </div>
              <input 
                type="range" 
                min="8" max="64" 
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="w-full h-1.5 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary" 
              />
            </div>
            
            <div className="border-t border-outline-variant my-2" />
            
            <div className="flex flex-col gap-4">
               <ToggleOption label="Uppercase letters (A-Z)" checked={hasUpper} onChange={setHasUpper} disabled={!hasLower && !hasNumbers && !hasSymbols && hasUpper} />
               <ToggleOption label="Lowercase letters (a-z)" checked={hasLower} onChange={setHasLower} disabled={!hasUpper && !hasNumbers && !hasSymbols && hasLower} />
               <ToggleOption label="Numbers (0-9)" checked={hasNumbers} onChange={setHasNumbers} disabled={!hasUpper && !hasLower && !hasSymbols && hasNumbers} />
               <ToggleOption label="Symbols (!@#$)" checked={hasSymbols} onChange={setHasSymbols} disabled={!hasUpper && !hasLower && !hasNumbers && hasSymbols} />
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}

function ToggleOption({ label, checked, onChange, disabled }: { label: string, checked: boolean, onChange: (v: boolean) => void, disabled: boolean }) {
  return (
    <label className={`flex items-center justify-between cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : 'group'}`}>
      <span className="font-sans text-[15px] group-hover:text-primary transition-colors">{label}</span>
      <div className={`w-12 h-6 rounded-full relative transition-colors ${checked ? 'bg-primary' : 'bg-surface-container-highest border border-outline-variant'}`}>
        <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 rounded-full transition-all duration-200 ${checked ? 'bg-on-primary left-7' : 'bg-outline left-1'}`} />
      </div>
      <input type="checkbox" className="hidden" checked={checked} onChange={(e) => !disabled && onChange(e.target.checked)} disabled={disabled} />
    </label>
  );
}
