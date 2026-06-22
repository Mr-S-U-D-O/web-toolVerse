import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Square, RefreshCw, Hand, Briefcase } from 'lucide-react';

interface PomodoroTimerToolProps {
  onBack: () => void;
}

const WORK_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function PomodoroTimerTool({ onBack }: PomodoroTimerToolProps) {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            const nextMode = mode === 'work' ? 'break' : 'work';
            setMode(nextMode);
            return nextMode === 'work' ? WORK_TIME : BREAK_TIME;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(mode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const switchMode = (newMode: 'work' | 'break') => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(newMode === 'work' ? WORK_TIME : BREAK_TIME);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Pomodoro Timer</h1>
        <p className="text-on-surface-variant mb-8">Boost your productivity with timed work sprints and short breaks.</p>

        <div className="bg-surface border border-outline rounded-2xl p-8 flex flex-col items-center">
          
          <div className="flex gap-2 rounded-full bg-background p-1 mb-10 border border-outline-variant">
            <button 
              onClick={() => switchMode('work')}
              className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${mode === 'work' ? 'bg-primary text-on-primary shadow-md' : 'text-on-surface-variant hover:bg-surface'}`}
            >
              <Briefcase size={16} /> Work (25m)
            </button>
            <button 
              onClick={() => switchMode('break')}
              className={`px-6 py-2 rounded-full font-bold flex items-center gap-2 transition-all ${mode === 'break' ? 'bg-secondary text-on-secondary shadow-md' : 'text-on-surface-variant hover:bg-surface'}`}
            >
              <Hand size={16} /> Break (5m)
            </button>
          </div>

          <div className="text-[100px] sm:text-[140px] font-bold font-mono tracking-tighter leading-none mb-12" style={{ color: mode === 'work' ? 'var(--color-primary)' : 'var(--color-secondary)' }}>
            {formatTime(timeLeft)}
          </div>

          <div className="flex gap-4 w-full">
            <button 
              onClick={toggleTimer} 
              className={`flex-1 py-4 text-xl font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-95 ${isRunning ? 'bg-red-500 text-white' : 'bg-primary text-on-primary hover:bg-surface-tint'}`}
            >
              {isRunning ? <><Square size={24} /> Pause</> : <><Play size={24} fill="currentColor" /> Start</>}
            </button>
            <button 
              onClick={resetTimer}
              className="px-8 py-4 bg-background border border-outline hover:border-outline-variant font-bold text-on-surface-variant rounded-xl flex items-center justify-center gap-2 transition-all"
            >
              <RefreshCw size={20} /> Reset
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
