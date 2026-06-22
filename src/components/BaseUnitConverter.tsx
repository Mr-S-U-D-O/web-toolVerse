import React, { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Copy, Check, Shield, ArrowRightLeft } from 'lucide-react';

export interface UnitOption {
  value: string;
  label: string;
  symbol: string;
  toBase: (val: number) => number;
  fromBase: (val: number) => number;
}

interface BaseUnitConverterProps {
  title: string;
  description: string;
  units: UnitOption[];
  defaultFrom: string;
  defaultTo: string;
  onBack?: () => void;
}

function formatValue(value: number): string {
  if (value === 0) return '0';
  if (isNaN(value) || !isFinite(value)) return '';
  
  const absVal = Math.abs(value);
  
  // Use scientific notation for micro or macro values
  if (absVal < 0.00001 || absVal > 100000000) {
    // Keep 6 decimal places in scientific notation, clean up trailing zeros
    return value.toExponential(6).replace(/\.?0+(?=e)/, '');
  }
  
  // Format float with up to 8 decimal places, removing trailing zeros
  return parseFloat(value.toFixed(8)).toString();
}

export default function BaseUnitConverter({
  title,
  description,
  units,
  defaultFrom,
  defaultTo,
  onBack
}: BaseUnitConverterProps) {
  const [fromValue, setFromValue] = useState<string>('1');
  const [fromUnitVal, setFromUnitVal] = useState<string>(defaultFrom);
  const [toUnitVal, setToUnitVal] = useState<string>(defaultTo);
  
  const [copiedMain, setCopiedMain] = useState(false);
  const [copiedGridId, setCopiedGridId] = useState<string | null>(null);

  const fromUnit = useMemo(() => units.find(u => u.value === fromUnitVal) || units[0], [units, fromUnitVal]);
  const toUnit = useMemo(() => units.find(u => u.value === toUnitVal) || units[0], [units, toUnitVal]);

  // Convert input value to base unit
  const baseValue = useMemo(() => {
    const parsed = parseFloat(fromValue);
    if (isNaN(parsed)) return 0;
    return fromUnit.toBase(parsed);
  }, [fromValue, fromUnit]);

  // Compute main target output
  const toValue = useMemo(() => {
    if (fromValue === '') return '';
    const converted = toUnit.fromBase(baseValue);
    return formatValue(converted);
  }, [baseValue, toUnit, fromValue]);

  // Swap From and To Units
  const handleSwap = () => {
    setFromUnitVal(toUnitVal);
    setToUnitVal(fromUnitVal);
    if (toValue !== '') {
      setFromValue(toValue);
    }
  };

  const handleCopyMain = async () => {
    if (toValue === '') return;
    try {
      await navigator.clipboard.writeText(toValue);
      setCopiedMain(true);
      setTimeout(() => setCopiedMain(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  const handleCopyGrid = async (valStr: string, id: string) => {
    try {
      await navigator.clipboard.writeText(valStr);
      setCopiedGridId(id);
      setTimeout(() => setCopiedGridId(null), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

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
            <span className="font-mono text-[11px] uppercase tracking-widest">Tool Cabinet</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">{title}</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#008cff]/10 border border-[#008cff]/20 text-[10px] font-mono uppercase tracking-wider text-[#008cff]">
              <Shield className="w-3 h-3" />
              100% Offline Processing
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10 w-full">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">{title}</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">{description}</p>
        </div>

        {/* Dual Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center bg-surface-container-low p-6 rounded-2xl border border-outline-variant mb-10">
          
          {/* FROM Unit */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">From</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={fromValue}
                onChange={(e) => setFromValue(e.target.value)}
                placeholder="0"
                className="flex-grow bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-lg text-on-surface focus:outline-none focus:border-[#008cff] transition-colors w-1/2"
              />
              <select
                value={fromUnitVal}
                onChange={(e) => setFromUnitVal(e.target.value)}
                className="bg-surface-container border border-outline-variant rounded-xl px-4 py-4 text-sm font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors w-1/2"
              >
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Trigger (Overlay in absolute or simple col spacer on desktop, inline flex on mobile) */}
          <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2 flex items-center justify-center pointer-events-none">
            <button
              onClick={handleSwap}
              className="pointer-events-auto w-10 h-10 rounded-full bg-surface-container border border-outline-variant hover:border-[#008cff] text-on-surface-variant hover:text-[#008cff] flex items-center justify-center transition-all shadow-md active:scale-95"
              title="Swap units"
            >
              <ArrowRightLeft className="w-4 h-4" />
            </button>
          </div>

          {/* TO Unit */}
          <div className="flex flex-col gap-2">
            <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant flex justify-between items-center">
              <span>To</span>
              {toValue !== '' && (
                <button
                  onClick={handleCopyMain}
                  className={`flex items-center gap-1 text-[11px] font-mono uppercase tracking-wider transition-colors ${
                    copiedMain ? 'text-emerald-400' : 'text-on-surface-variant hover:text-[#008cff]'
                  }`}
                >
                  {copiedMain ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedMain ? 'Copied!' : 'Copy'}
                </button>
              )}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={toValue}
                placeholder="0"
                className="flex-grow bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-lg text-[#008cff] focus:outline-none w-1/2"
              />
              <select
                value={toUnitVal}
                onChange={(e) => setToUnitVal(e.target.value)}
                className="bg-surface-container border border-outline-variant rounded-xl px-4 py-4 text-sm font-sans text-on-surface focus:outline-none focus:border-[#008cff] transition-colors w-1/2"
              >
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label} ({unit.symbol})
                  </option>
                ))}
              </select>
            </div>
          </div>

        </div>

        {/* Matrix Grid of All Units */}
        <div>
          <h2 className="font-heading font-semibold text-lg mb-6 text-white flex items-center gap-2">
            Conversion Matrix Reference
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {units.map((unit) => {
              const convertedVal = fromValue === '' ? 0 : unit.fromBase(baseValue);
              const formattedValStr = fromValue === '' ? '0' : formatValue(convertedVal);
              const isCopied = copiedGridId === unit.value;

              return (
                <div
                  key={unit.value}
                  className="bg-surface-container-low border border-outline-variant hover:border-outline p-4 rounded-xl flex flex-col justify-between group transition-colors relative"
                >
                  {/* Copy overlay button */}
                  <button
                    onClick={() => handleCopyGrid(formattedValStr, unit.value)}
                    className={`absolute top-3 right-3 p-1.5 rounded-lg border bg-surface-container-lowest transition-colors opacity-0 group-hover:opacity-100 ${
                      isCopied
                        ? 'border-emerald-500/30 text-emerald-400'
                        : 'border-outline-variant hover:border-[#008cff] text-on-surface-variant hover:text-[#008cff]'
                    }`}
                    title="Copy value"
                  >
                    {isCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>

                  <span className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1">
                    {unit.label} ({unit.symbol})
                  </span>
                  
                  <span className="text-lg font-mono font-bold text-white break-all pr-6">
                    {formattedValStr}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
