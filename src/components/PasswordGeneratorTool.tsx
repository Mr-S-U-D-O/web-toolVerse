import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, RefreshCw, Key, Settings, Layers } from 'lucide-react';

function calculateEntropy(length: number, poolSize: number): number {
  if (length === 0 || poolSize === 0) return 0;
  return Math.round(length * Math.log2(poolSize));
}

function getStrength(entropy: number) {
  if (entropy < 40) return { label: 'Weak', color: 'bg-red-500', text: 'text-red-400' };
  if (entropy < 65) return { label: 'Fair', color: 'bg-amber-500', text: 'text-amber-400' };
  if (entropy < 85) return { label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-400' };
  return { label: 'Very Strong', color: 'bg-teal-400', text: 'text-teal-400' };
}

export default function PasswordGeneratorTool({ onBack }: { onBack?: () => void }) {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(true);
  const [batchCount, setBatchCount] = useState(5);

  const [passwords, setPasswords] = useState<string[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedMain, setCopiedMain] = useState(false);

  const generatePasswords = () => {
    let lowerPool = 'abcdefghijklmnopqrstuvwxyz';
    let upperPool = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let numberPool = '0123456789';
    let symbolPool = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    if (excludeSimilar) {
      lowerPool = lowerPool.replace(/[il]/g, '');
      upperPool = upperPool.replace(/[O]/g, '');
      numberPool = numberPool.replace(/[01]/g, '');
    }

    let fullPool = '';
    if (useLower) fullPool += lowerPool;
    if (useUpper) fullPool += upperPool;
    if (useNumbers) fullPool += numberPool;
    if (useSymbols) fullPool += symbolPool;

    if (!fullPool) {
      setPasswords([]);
      return;
    }

    const poolSize = fullPool.length;
    const generated: string[] = [];

    // Crypto-secure random generator
    for (let b = 0; b < batchCount; b++) {
      let pwd = '';
      const randomValues = new Uint32Array(length);
      window.crypto.getRandomValues(randomValues);
      for (let i = 0; i < length; i++) {
        pwd += fullPool[randomValues[i] % poolSize];
      }
      generated.push(pwd);
    }
    setPasswords(generated);
  };

  useEffect(() => {
    generatePasswords();
  }, [length, useLower, useUpper, useNumbers, useSymbols, excludeSimilar, batchCount]);

  const handleCopyMain = async () => {
    if (passwords.length === 0) return;
    try {
      await navigator.clipboard.writeText(passwords[0]);
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyBatch = async (pwd: string, index: number) => {
    try {
      await navigator.clipboard.writeText(pwd);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Determine pool size for strength analysis
  let activePoolSize = 0;
  if (useLower) activePoolSize += excludeSimilar ? 24 : 26;
  if (useUpper) activePoolSize += excludeSimilar ? 25 : 26;
  if (useNumbers) activePoolSize += excludeSimilar ? 8 : 10;
  if (useSymbols) activePoolSize += 26;

  const entropy = calculateEntropy(length, activePoolSize);
  const strengthInfo = getStrength(entropy);

  return (
    <div className="min-h-screen bg-background text-on-surface w-full pb-20 animate-in fade-in duration-300">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <button
            onClick={onBack}
            className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">Password Generator</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#008cff]/10 border border-[#008cff]/20 text-[10px] font-mono uppercase tracking-wider text-[#008cff]">
              <Shield className="w-3 h-3" />
              On-Device Cryptography
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10 w-full">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Password Generator</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Generate high-entropy, customizable passwords on your local device. Employs cryptographically secure pseudo-random generators (`window.crypto`).
          </p>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls Panel (Left) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Primary Settings */}
            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-5">
              <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-[#008cff]" />
                Generator Rules
              </h3>

              {/* Length Slider */}
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                  <span>Password Length</span>
                  <span className="text-[#008cff] font-semibold">{length} characters</span>
                </div>
                <input
                  type="range"
                  min="6"
                  max="64"
                  value={length}
                  onChange={(e) => setLength(parseInt(e.target.value))}
                  className="w-full accent-[#008cff] bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Pool toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useLower}
                    onChange={(e) => setUseLower(e.target.checked)}
                    className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                  />
                  <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                    Lowercase Letters (a-z)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useUpper}
                    onChange={(e) => setUseUpper(e.target.checked)}
                    className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                  />
                  <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                    Uppercase Letters (A-Z)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useNumbers}
                    onChange={(e) => setUseNumbers(e.target.checked)}
                    className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                  />
                  <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                    Numbers (0-9)
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={useSymbols}
                    onChange={(e) => setUseSymbols(e.target.checked)}
                    className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                  />
                  <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                    Symbols (!@#$%^&*)
                  </span>
                </label>
              </div>

              <hr className="border-outline-variant/60" />

              {/* Exclusion toggle */}
              <label className="flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                  className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                />
                <div className="flex flex-col">
                  <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                    Exclude Similar Characters
                  </span>
                  <span className="text-[10px] text-outline">
                    Strips characters like: i, l, o, 1, 0, O
                  </span>
                </div>
              </label>
            </div>

            {/* Batch Options */}
            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-4">
              <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#008cff]" />
                Batch Creation
              </h3>
              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                  <span>Candidate Passwords Count</span>
                  <span className="text-[#008cff] font-semibold">{batchCount} options</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={batchCount}
                  onChange={(e) => setBatchCount(parseInt(e.target.value))}
                  className="w-full accent-[#008cff] bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>

          </div>

          {/* Results Panel (Right) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            {/* Primary Passwords Displays */}
            <div className="bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-5 sticky top-[80px]">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                    Generated Core Password
                  </span>
                  <button
                    onClick={generatePasswords}
                    className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#008cff] hover:text-[#0070cc] transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Regenerate
                  </button>
                </div>
                
                {/* Main display */}
                <div className="flex items-center justify-between p-4 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden group">
                  <span className="font-mono text-lg font-bold text-white tracking-wide truncate pr-4 select-all">
                    {passwords[0] || 'Configure rules to generate...'}
                  </span>
                  {passwords[0] && (
                    <button
                      onClick={handleCopyMain}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                        copiedMain
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-[#008cff] text-white hover:bg-[#0070cc] shadow-sm'
                      }`}
                    >
                      {copiedMain ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      {copiedMain ? 'Copied' : 'Copy'}
                    </button>
                  )}
                </div>
              </div>

              {/* Entropy strength meter */}
              <div>
                <div className="flex justify-between font-mono text-[11px] text-on-surface-variant mb-1.5">
                  <span>Cryptographic Entropy: {entropy} bits</span>
                  <span className={`${strengthInfo.text} font-bold`}>{strengthInfo.label}</span>
                </div>
                <div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${strengthInfo.color} transition-all duration-500`}
                    style={{ width: `${Math.min(100, (entropy / 120) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Batch List */}
              {passwords.length > 1 && (
                <div>
                  <span className="font-mono text-xs uppercase tracking-wider text-on-surface-variant block mb-3">
                    Alternative Choices
                  </span>
                  <div className="flex flex-col gap-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                    {passwords.slice(1).map((pwd, idx) => {
                      const realIndex = idx + 1;
                      const isCopied = copiedIndex === realIndex;
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between p-3 bg-surface-container rounded-lg border border-outline-variant/40 hover:border-outline-variant transition-colors"
                        >
                          <span className="font-mono text-sm text-on-surface truncate pr-4">
                            {pwd}
                          </span>
                          <button
                            onClick={() => handleCopyBatch(pwd, realIndex)}
                            className={`p-1.5 rounded-lg border bg-surface-container-low transition-colors ${
                              isCopied
                                ? 'border-emerald-500/30 text-emerald-400'
                                : 'border-outline-variant hover:border-[#008cff] text-on-surface-variant hover:text-[#008cff]'
                            }`}
                          >
                            {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
