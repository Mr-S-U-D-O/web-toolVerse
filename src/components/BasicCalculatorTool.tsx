import React, { useState } from 'react';
import { ArrowLeft, Delete } from 'lucide-react';

interface BasicCalculatorToolProps {
  onBack: () => void;
}

export default function BasicCalculatorTool({ onBack }: BasicCalculatorToolProps) {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [isNewNumber, setIsNewNumber] = useState(true);

  const handleNum = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' && num !== '.' ? num : display + num);
    }
  };

  const handleOp = (op: string) => {
    setEquation(display + ' ' + op + ' ');
    setIsNewNumber(true);
  };

  const handleEqual = () => {
    try {
      const fullEq = equation + display;
      // using Function instead of eval for slight safety
      const output = new Function('return ' + fullEq)();
      setDisplay(String(output));
      setEquation('');
      setIsNewNumber(true);
    } catch {
      setDisplay('Error');
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setEquation('');
    setIsNewNumber(true);
  };

  const handleDelete = () => {
    if (isNewNumber) return;
    setDisplay(display.length > 1 ? display.slice(0, -1) : '0');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Basic Calculator</h1>
        <p className="text-on-surface-variant mb-8">A standard desktop calculator for quick math operations.</p>

        <div className="bg-surface border border-outline rounded-3xl p-6 shadow-xl max-w-sm mx-auto">
           <div className="bg-background border border-outline rounded-2xl p-4 mb-6 flex flex-col items-end min-h-[100px] justify-end relative shadow-inner">
             <div className="text-on-surface-variant text-sm tracking-widest min-h-[20px] mb-1 font-mono">{equation}</div>
             <div className="text-5xl font-bold font-mono tracking-tighter truncate w-full text-right">{display}</div>
           </div>

           <div className="grid grid-cols-4 gap-3">
              <button onClick={handleClear} className="col-span-2 bg-red-500/10 text-red-500 rounded-xl py-4 font-bold text-lg hover:bg-red-500/20 active:scale-95 transition-all">AC</button>
              <button onClick={handleDelete} className="bg-surface-container-highest rounded-xl py-4 flex justify-center items-center hover:bg-outline-variant active:scale-95 transition-all"><Delete size={20} /></button>
              <button onClick={() => handleOp('/')} className="bg-secondary text-on-secondary rounded-xl py-4 font-bold text-xl hover:bg-secondary/80 active:scale-95 transition-all">÷</button>

              <button onClick={() => handleNum('7')} className="bg-background border border-outline rounded-xl py-4 font-bold text-xl hover:border-primary hover:text-primary active:scale-95 transition-all">7</button>
              <button onClick={() => handleNum('8')} className="bg-background border border-outline rounded-xl py-4 font-bold text-xl hover:border-primary hover:text-primary active:scale-95 transition-all">8</button>
              <button onClick={() => handleNum('9')} className="bg-background border border-outline rounded-xl py-4 font-bold text-xl hover:border-primary hover:text-primary active:scale-95 transition-all">9</button>
              <button onClick={() => handleOp('*')} className="bg-secondary text-on-secondary rounded-xl py-4 font-bold text-xl hover:bg-secondary/80 active:scale-95 transition-all">×</button>

              <button onClick={() => handleNum('4')} className="bg-background border border-outline rounded-xl py-4 font-bold text-xl hover:border-primary hover:text-primary active:scale-95 transition-all">4</button>
              <button onClick={() => handleNum('5')} className="bg-background border border-outline rounded-xl py-4 font-bold text-xl hover:border-primary hover:text-primary active:scale-95 transition-all">5</button>
              <button onClick={() => handleNum('6')} className="bg-background border border-outline rounded-xl py-4 font-bold text-xl hover:border-primary hover:text-primary active:scale-95 transition-all">6</button>
              <button onClick={() => handleOp('-')} className="bg-secondary text-on-secondary rounded-xl py-4 font-bold text-xl hover:bg-secondary/80 active:scale-95 transition-all">−</button>

              <button onClick={() => handleNum('1')} className="bg-background border border-outline rounded-xl py-4 font-bold text-xl hover:border-primary hover:text-primary active:scale-95 transition-all">1</button>
              <button onClick={() => handleNum('2')} className="bg-background border border-outline rounded-xl py-4 font-bold text-xl hover:border-primary hover:text-primary active:scale-95 transition-all">2</button>
              <button onClick={() => handleNum('3')} className="bg-background border border-outline rounded-xl py-4 font-bold text-xl hover:border-primary hover:text-primary active:scale-95 transition-all">3</button>
              <button onClick={() => handleOp('+')} className="bg-secondary text-on-secondary rounded-xl py-4 font-bold text-xl hover:bg-secondary/80 active:scale-95 transition-all">+</button>

              <button onClick={() => handleNum('0')} className="col-span-2 bg-background border border-outline rounded-xl py-4 font-bold text-xl hover:border-primary hover:text-primary active:scale-95 transition-all">0</button>
              <button onClick={() => handleNum('.')} className="bg-background border border-outline rounded-xl py-4 font-bold text-xl hover:border-primary hover:text-primary active:scale-95 transition-all">.</button>
              <button onClick={handleEqual} className="bg-primary text-on-primary rounded-xl py-4 font-bold text-xl shadow-lg hover:bg-surface-tint shadow-primary/30 active:scale-95 transition-all">=</button>
           </div>
        </div>

      </div>
    </div>
  );
}
