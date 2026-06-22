import React, { useState } from 'react';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import cronstrue from 'cronstrue';

interface CronParserToolProps {
  onBack: () => void;
}

export default function CronParserTool({ onBack }: CronParserToolProps) {
  const [cronExp, setCronExp] = useState('0 15 10 * * ?');
  const [copied, setCopied] = useState(false);

  let explanation = '';
  let error = '';

  try {
    if (cronExp.trim()) {
      explanation = cronstrue.toString(cronExp, { throwExceptionOnParseError: true });
    }
  } catch (e: any) {
    error = e.toString();
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(explanation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-3xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Cron Expression Parser</h1>
        <p className="text-on-surface-variant mb-8">Translate Cron expressions into human-readable descriptions.</p>

        <div className="bg-surface rounded-xl p-6 border border-outline space-y-6">
          
          <div>
            <label className="block text-sm font-bold mb-2">Cron Expression</label>
            <input
              type="text"
              className="w-full bg-background border border-outline rounded-lg px-4 py-3 font-mono focus:outline-none focus:border-primary text-lg"
              value={cronExp}
              onChange={(e) => setCronExp(e.target.value)}
              placeholder="* * * * *"
            />
          </div>

          <div className="grid grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2 text-center text-xs text-on-surface-variant font-mono mt-2 opacity-70">
             <div>Sec</div>
             <div>Min</div>
             <div>Hour</div>
             <div>DOM</div>
             <div>Month</div>
             <div className="hidden md:block">DOW</div>
             <div className="hidden lg:block">Year</div>
          </div>

          <div className={`p-6 rounded-xl border flex justify-between items-center gap-4 ${error ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20'}`}>
            <div className={`font-bold text-lg ${error ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
              {error ? error : explanation || 'Empty expression'}
            </div>
            {!error && explanation && (
              <button onClick={handleCopy} className="text-primary hover:bg-primary/10 p-2 rounded-lg transition-colors flex-shrink-0">
                 {copied ? <Check size={20} /> : <Copy size={20} />}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
