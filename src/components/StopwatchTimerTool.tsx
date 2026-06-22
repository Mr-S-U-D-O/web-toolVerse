import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Play, Square, RotateCcw, Flag } from 'lucide-react';

interface StopwatchTimerToolProps {
  onBack: () => void;
}

export default function StopwatchTimerTool({ onBack }: StopwatchTimerToolProps) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState<number[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = window.setInterval(() => {
        setTime((prevTime) => prevTime + 10);
      }, 10);
    } else if (!isRunning && timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  const handleStartStop = () => setIsRunning(!isRunning);
  
  const handleReset = () => {
    setIsRunning(false);
    setTime(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps((prev) => [...prev, time]);
  };

  const formatTime = (ms: number) => {
    const min = Math.floor((ms / 60000) % 60);
    const sec = Math.floor((ms / 1000) % 60);
    const milli = Math.floor((ms / 10) % 100);
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}.${milli.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-2xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Stopwatch Timer</h1>
        <p className="text-on-surface-variant mb-8">A precise digital stopwatch with lap functionality.</p>

        <div className="bg-surface rounded-xl p-8 border border-outline flex flex-col items-center shadow-sm mb-6">
          <div className="text-6xl sm:text-8xl font-mono font-bold text-primary tracking-wider mb-8 drop-shadow-sm">
            {formatTime(time)}
          </div>
          
          <div className="flex flex-wrap gap-4 justify-center w-full">
            <button 
              onClick={handleStartStop} 
              className={`flex-1 min-w-[120px] py-4 rounded-xl flex justify-center items-center gap-2 font-bold text-lg transition-colors ${isRunning ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20' : 'bg-primary text-on-primary hover:bg-surface-tint'}`}
            >
              {isRunning ? <><Square size={20} /> Stop</> : <><Play size={20} /> Start</>}
            </button>
            <button 
              onClick={handleLap} 
              disabled={!isRunning}
              className="flex-1 min-w-[120px] bg-secondary text-on-secondary py-4 rounded-xl flex justify-center items-center gap-2 font-bold text-lg hover:bg-secondary/80 disabled:opacity-50 transition-colors"
            >
              <Flag size={20} /> Lap
            </button>
            <button 
              onClick={handleReset} 
              className="flex-1 min-w-[120px] bg-surface-container-highest text-on-surface py-4 rounded-xl flex justify-center items-center gap-2 font-bold text-lg hover:bg-outline-variant transition-colors"
            >
              <RotateCcw size={20} /> Reset
            </button>
          </div>
        </div>

        {laps.length > 0 && (
          <div className="bg-surface border border-outline rounded-xl overflow-hidden shadow-sm">
            <div className="bg-background px-6 py-4 border-b border-outline font-bold">Laps</div>
            <ul className="max-h-[300px] overflow-y-auto">
              {laps.map((lap, index) => {
                const prevLap = index === 0 ? 0 : laps[index - 1];
                const split = lap - prevLap;
                return (
                  <li key={index} className="flex justify-between items-center px-6 py-4 border-b border-outline-variant last:border-b-0 hover:bg-surface-container-low transition-colors">
                    <span className="font-bold text-on-surface-variant">Lap {String(index + 1).padStart(2, '0')}</span>
                    <div className="flex gap-8 font-mono">
                      <span className="text-on-surface-variant">+{formatTime(split)}</span>
                      <span className="font-bold text-primary">{formatTime(lap)}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
