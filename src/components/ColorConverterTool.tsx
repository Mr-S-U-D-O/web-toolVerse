import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Sliders } from 'lucide-react';

// Math/conversion helpers
interface ColorState {
  hex: string; // e.g., #008cff
  r: number; // 0-255
  g: number;
  b: number;
  h: number; // 0-360
  s: number; // 0-100
  l: number; // 0-100
  c: number; // 0-100
  m: number;
  y: number;
  k: number;
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace(/^#/, '');
  if (clean.length !== 3 && clean.length !== 6) return null;
  
  let r, g, b;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  return isNaN(r) || isNaN(g) || isNaN(b) ? null : { r, g, b };
}

function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));
  const componentToHex = (c: number) => {
    const hex = clamp(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${componentToHex(r)}${componentToHex(g)}${componentToHex(b)}`;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h /= 360;
  s /= 100;
  l /= 100;
  let r = l;
  let g = l;
  let b = l;

  if (s !== 0) {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
  };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const k = 1 - Math.max(rNorm, gNorm, bNorm);
  
  if (k === 1) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  const c = Math.round(((1 - rNorm - k) / (1 - k)) * 100);
  const m = Math.round(((1 - gNorm - k) / (1 - k)) * 100);
  const y = Math.round(((1 - bNorm - k) / (1 - k)) * 100);
  
  return {
    c,
    m,
    y,
    k: Math.round(k * 100)
  };
}

function cmykToRgb(c: number, m: number, y: number, k: number): { r: number; g: number; b: number } {
  c /= 100;
  m /= 100;
  y /= 100;
  k /= 100;

  const r = Math.round(255 * (1 - c) * (1 - k));
  const g = Math.round(255 * (1 - m) * (1 - k));
  const b = Math.round(255 * (1 - y) * (1 - k));

  return { r, g, b };
}

function getRelativeLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export default function ColorConverterTool({ onBack }: { onBack?: () => void }) {
  // Start with a premium cyan-blue color
  const [color, setColor] = useState<ColorState>({
    hex: '#008cff',
    r: 0,
    g: 140,
    b: 255,
    h: 207,
    s: 100,
    l: 50,
    c: 100,
    m: 45,
    y: 0,
    k: 0
  });

  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Sync helpers when one component edits
  const updateFromRgb = (r: number, g: number, b: number) => {
    const hex = rgbToHex(r, g, b);
    const hsl = rgbToHsl(r, g, b);
    const cmyk = rgbToCmyk(r, g, b);
    setColor({ hex, r, g, b, ...hsl, ...cmyk });
  };

  const updateFromHex = (hexStr: string) => {
    const rgb = hexToRgb(hexStr);
    if (rgb) {
      const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
      const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
      setColor({ hex: hexStr, ...rgb, ...hsl, ...cmyk });
    } else {
      setColor(prev => ({ ...prev, hex: hexStr }));
    }
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const cmyk = rgbToCmyk(rgb.r, rgb.g, rgb.b);
    setColor({ hex, ...rgb, h, s, l, ...cmyk });
  };

  const updateFromCmyk = (c: number, m: number, y: number, k: number) => {
    const rgb = cmykToRgb(c, m, y, k);
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    setColor({ hex, ...rgb, ...hsl, c, m, y, k });
  };

  const handleCopy = async (text: string, formatId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(formatId);
      setTimeout(() => setCopiedFormat(null), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  // Contrast calculation
  const luminance = getRelativeLuminance(color.r, color.g, color.b);
  const textContrastColor = luminance > 0.45 ? '#000000' : '#ffffff';
  
  // Format strings
  const rgbString = `rgb(${color.r}, ${color.g}, ${color.b})`;
  const hslString = `hsl(${color.h}, ${color.s}%, ${color.l}%)`;
  const cmykString = `cmyk(${color.c}%, ${color.m}%, ${color.y}%, ${color.k}%)`;

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
            <div className="font-sans text-sm font-medium text-on-surface">Color Converter</div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#008cff]/10 border border-[#008cff]/20 text-[10px] font-mono uppercase tracking-wider text-[#008cff]">
              <Shield className="w-3 h-3" />
              100% Client-Side
            </div>
          </div>
          <div className="w-[120px]" />
        </div>
      </header>

      <main className="max-w-[1280px] mx-auto px-6 py-10 w-full">
        {/* Title */}
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Color Converter</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Convert color representations dynamically between HEX, RGB, HSL, and CMYK formats. Adjust channels with precision sliders and test contrast.
          </p>
        </div>

        {/* Dual Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Visual Picker and Output Formats */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            
            {/* Color Preview Block */}
            <div
              className="w-full h-56 rounded-2xl border border-outline-variant flex flex-col items-center justify-center relative overflow-hidden transition-all duration-300 shadow-lg"
              style={{ backgroundColor: color.hex }}
            >
              <div
                className="font-mono text-2xl font-bold tracking-wider px-4 py-2 rounded-xl bg-black/10 backdrop-blur-xs select-all text-center"
                style={{ color: textContrastColor }}
              >
                {color.hex.toUpperCase()}
              </div>
              <div
                className="font-sans text-xs mt-2 font-medium bg-black/10 px-3 py-1 rounded-full backdrop-blur-xs"
                style={{ color: textContrastColor }}
              >
                Contrast Suggestions: Use {textContrastColor === '#ffffff' ? 'White' : 'Black'} Text
              </div>

              {/* Secret Color Input overlay */}
              <label className="absolute bottom-4 right-4 bg-background/85 hover:bg-background border border-outline-variant px-3 py-1.5 rounded-xl text-xs font-mono uppercase tracking-wider cursor-pointer flex items-center gap-1.5 text-white transition-all shadow-sm">
                Picker
                <input
                  type="color"
                  value={color.hex}
                  onChange={(e) => updateFromHex(e.target.value)}
                  className="w-5 h-5 rounded-md border-0 p-0 cursor-pointer overflow-hidden bg-transparent"
                />
              </label>
            </div>

            {/* Quick Copies */}
            <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-5 flex flex-col gap-4">
              <h3 className="font-heading font-semibold text-sm text-white">Color Formats</h3>
              
              {/* HEX */}
              <div className="flex items-center justify-between bg-surface-container rounded-xl p-3 border border-outline-variant">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#008cff] block mb-0.5">HEX</span>
                  <input
                    type="text"
                    value={color.hex}
                    onChange={(e) => updateFromHex(e.target.value)}
                    className="font-mono text-sm bg-transparent border-0 p-0 text-white focus:ring-0 focus:outline-none w-28"
                  />
                </div>
                <button
                  onClick={() => handleCopy(color.hex, 'hex')}
                  className={`flex items-center gap-1 p-2 rounded-lg transition-colors ${
                    copiedFormat === 'hex' ? 'text-emerald-400' : 'text-on-surface-variant hover:text-[#008cff]'
                  }`}
                >
                  {copiedFormat === 'hex' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* RGB */}
              <div className="flex items-center justify-between bg-surface-container rounded-xl p-3 border border-outline-variant">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#008cff] block mb-0.5">RGB</span>
                  <span className="font-mono text-sm text-white">{rgbString}</span>
                </div>
                <button
                  onClick={() => handleCopy(rgbString, 'rgb')}
                  className={`flex items-center gap-1 p-2 rounded-lg transition-colors ${
                    copiedFormat === 'rgb' ? 'text-emerald-400' : 'text-on-surface-variant hover:text-[#008cff]'
                  }`}
                >
                  {copiedFormat === 'rgb' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* HSL */}
              <div className="flex items-center justify-between bg-surface-container rounded-xl p-3 border border-outline-variant">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#008cff] block mb-0.5">HSL</span>
                  <span className="font-mono text-sm text-white">{hslString}</span>
                </div>
                <button
                  onClick={() => handleCopy(hslString, 'hsl')}
                  className={`flex items-center gap-1 p-2 rounded-lg transition-colors ${
                    copiedFormat === 'hsl' ? 'text-emerald-400' : 'text-on-surface-variant hover:text-[#008cff]'
                  }`}
                >
                  {copiedFormat === 'hsl' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* CMYK */}
              <div className="flex items-center justify-between bg-surface-container rounded-xl p-3 border border-outline-variant">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-[#008cff] block mb-0.5">CMYK</span>
                  <span className="font-mono text-sm text-white">{cmykString}</span>
                </div>
                <button
                  onClick={() => handleCopy(cmykString, 'cmyk')}
                  className={`flex items-center gap-1 p-2 rounded-lg transition-colors ${
                    copiedFormat === 'cmyk' ? 'text-emerald-400' : 'text-on-surface-variant hover:text-[#008cff]'
                  }`}
                >
                  {copiedFormat === 'cmyk' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

            </div>

          </div>

          {/* Right Column: Precise Sliders */}
          <div className="lg:col-span-7 bg-surface-container-low border border-outline-variant p-6 rounded-2xl flex flex-col gap-6">
            
            {/* RGB Sliders */}
            <div>
              <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-[#008cff]" />
                RGB Color Channels
              </h3>
              <div className="flex flex-col gap-4">
                {/* RED */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Red</span>
                    <span>{color.r} / 255</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={color.r}
                    onChange={(e) => updateFromRgb(parseInt(e.target.value), color.g, color.b)}
                    className="w-full accent-red-500 bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* GREEN */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Green</span>
                    <span>{color.g} / 255</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={color.g}
                    onChange={(e) => updateFromRgb(color.r, parseInt(e.target.value), color.b)}
                    className="w-full accent-emerald-500 bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* BLUE */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Blue</span>
                    <span>{color.b} / 255</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={color.b}
                    onChange={(e) => updateFromRgb(color.r, color.g, parseInt(e.target.value))}
                    className="w-full accent-[#008cff] bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <hr className="border-outline-variant" />

            {/* HSL Sliders */}
            <div>
              <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-[#008cff]" />
                HSL Adjustments
              </h3>
              <div className="flex flex-col gap-4">
                {/* HUE */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Hue</span>
                    <span>{color.h}° / 360°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={color.h}
                    onChange={(e) => updateFromHsl(parseInt(e.target.value), color.s, color.l)}
                    className="w-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-red-500 h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* SATURATION */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Saturation</span>
                    <span>{color.s}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={color.s}
                    onChange={(e) => updateFromHsl(color.h, parseInt(e.target.value), color.l)}
                    className="w-full accent-[#008cff] bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* LIGHTNESS */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Lightness</span>
                    <span>{color.l}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={color.l}
                    onChange={(e) => updateFromHsl(color.h, color.s, parseInt(e.target.value))}
                    className="w-full accent-white bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <hr className="border-outline-variant" />

            {/* CMYK Sliders */}
            <div>
              <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-[#008cff]" />
                CMYK Print Color Channels
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Cyan */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Cyan</span>
                    <span>{color.c}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={color.c}
                    onChange={(e) => updateFromCmyk(parseInt(e.target.value), color.m, color.y, color.k)}
                    className="w-full accent-cyan-500 bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Magenta */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Magenta</span>
                    <span>{color.m}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={color.m}
                    onChange={(e) => updateFromCmyk(color.c, parseInt(e.target.value), color.y, color.k)}
                    className="w-full accent-fuchsia-500 bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Yellow */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Yellow</span>
                    <span>{color.y}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={color.y}
                    onChange={(e) => updateFromCmyk(color.c, color.m, parseInt(e.target.value), color.k)}
                    className="w-full accent-yellow-500 bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Key (Black) */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between font-mono text-xs text-on-surface-variant">
                    <span>Key (Black)</span>
                    <span>{color.k}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={color.k}
                    onChange={(e) => updateFromCmyk(color.c, color.m, color.y, parseInt(e.target.value))}
                    className="w-full accent-neutral-800 bg-surface-container h-1.5 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
