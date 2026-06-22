import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, RefreshCw } from 'lucide-react';
import bcrypt from 'bcryptjs';

interface BcryptGeneratorToolProps {
  onBack: () => void;
}

export default function BcryptGeneratorTool({ onBack }: BcryptGeneratorToolProps) {
  const [input, setInput] = useState('password123');
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState('');
  const [isHashing, setIsHashing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [verifyInput, setVerifyInput] = useState('');
  const [verifyHash, setVerifyHash] = useState('');
  const [verifyResult, setVerifyResult] = useState<boolean | null>(null);

  const generateHash = () => {
    if (!input) return;
    setIsHashing(true);
    setTimeout(() => {
      const salt = bcrypt.genSaltSync(rounds);
      const res = bcrypt.hashSync(input, salt);
      setHash(res);
      setIsHashing(false);
    }, 50); // slight delay to allow UI to update to loading state if rounds is high
  };

  const verify = () => {
    if (!verifyInput || !verifyHash) return;
    try {
      const res = bcrypt.compareSync(verifyInput, verifyHash);
      setVerifyResult(res);
    } catch {
      setVerifyResult(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Bcrypt Generator</h1>
        <p className="text-on-surface-variant mb-8">Generate and verify bcrypt password hashes.</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl p-6 border border-outline">
            <h2 className="text-xl font-bold mb-4">Generate Hash</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">String to Hash</label>
                <input
                  type="text"
                  className="w-full bg-background border border-outline rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Salt Rounds ({rounds})</label>
                <input
                  type="range"
                  min="4"
                  max="16"
                  className="w-full accent-primary"
                  value={rounds}
                  onChange={(e) => setRounds(parseInt(e.target.value))}
                />
              </div>
              <button
                onClick={generateHash}
                disabled={isHashing || !input}
                className="w-full bg-primary text-on-primary py-2 rounded-lg font-bold hover:bg-surface-tint disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isHashing ? <RefreshCw className="animate-spin" size={18} /> : null}
                {isHashing ? 'Hashing...' : 'Generate Hash'}
              </button>
              
              {hash && (
                <div className="mt-4 p-4 bg-background border border-outline rounded-lg relative break-all font-mono text-sm leading-relaxed">
                  {hash}
                  <button onClick={handleCopy} className="absolute top-2 right-2 p-2 bg-surface rounded hover:text-primary">
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="bg-surface rounded-xl p-6 border border-outline h-fit">
            <h2 className="text-xl font-bold mb-4">Verify Hash</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold mb-2">String to Verify</label>
                <input
                  type="text"
                  className="w-full bg-background border border-outline rounded-lg px-4 py-2 focus:border-primary focus:outline-none"
                  value={verifyInput}
                  onChange={(e) => setVerifyInput(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-bold mb-2">Bcrypt Hash</label>
                <input
                  type="text"
                  className="w-full bg-background border border-outline rounded-lg px-4 py-2 focus:border-primary focus:outline-none font-mono text-xs"
                  value={verifyHash}
                  onChange={(e) => setVerifyHash(e.target.value)}
                  placeholder="$2a$10$..."
                />
              </div>
              <button
                onClick={verify}
                disabled={!verifyInput || !verifyHash}
                className="w-full border-2 border-primary text-primary py-2 rounded-lg font-bold hover:bg-primary/10 disabled:opacity-50"
              >
                Verify
              </button>
              {verifyResult !== null && (
                <div className={`mt-4 p-4 rounded-lg text-center font-bold ${verifyResult ? 'bg-green-500/20 text-green-600 dark:text-green-400' : 'bg-red-500/20 text-red-600 dark:text-red-400'}`}>
                  {verifyResult ? 'Hash Matches!' : 'No Match'}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
