import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Hash } from 'lucide-react';

interface ColorPaletteGeneratorToolProps {
  onBack: () => void;
}

export default function ColorPaletteGeneratorTool({ onBack }: ColorPaletteGeneratorToolProps) {
  const [baseColor, setBaseColor] = useState('#3B82F6');
  const [copiedColor, setCopiedColor] = useState<string | null>(null);

  // Simple Hex to HSL and back conversions for palette generation
  const hexToHSL = (hex: string) => {
    let r = 0, g = 0, b = 0;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else if (hex.length === 7) {
      r = parseInt(hex.substring(1, 3), 16);
      g = parseInt(hex.substring(3, 5), 16);
      b = parseInt(hex.substring(5, 7), 16);
    }
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
  };

  const hslToHex = (h: number, s: number, l: number) => {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = (n: number) => {
      const k = (n + h / 30) % 12;
      const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
  };

  const getPalettes = () => {
    try {
      const { h, s, l } = hexToHSL(baseColor);
      
      const monoshades = [
        hslToHex(h, s, Math.min(100, l + 40)),
        hslToHex(h, s, Math.min(100, l + 20)),
        hslToHex(h, s, l),
        hslToHex(h, s, Math.max(0, l - 20)),
        hslToHex(h, s, Math.max(0, l - 40)),
      ];

      const analogous = [
        hslToHex((h - 60 + 360) % 360, s, l),
        hslToHex((h - 30 + 360) % 360, s, l),
        hslToHex(h, s, l),
        hslToHex((h + 30) % 360, s, l),
        hslToHex((h + 60) % 360, s, l),
      ];

      const complementary = [
        hslToHex(h, s, Math.min(100, l + 20)),
        hslToHex(h, s, l),
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 180) % 360, s, Math.max(0, l - 20)),
      ];
      
      const tetradic = [
        hslToHex(h, s, l),
        hslToHex((h + 90) % 360, s, l),
        hslToHex((h + 180) % 360, s, l),
        hslToHex((h + 270) % 360, s, l),
      ];

      return { monoshades, analogous, complementary, tetradic };
    } catch {
      return { monoshades: [], analogous: [], complementary: [], tetradic: [] };
    }
  };

  const palettes = getPalettes();

  const handleCopy = (color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 2000);
  };

  const ColorStrip = ({ colors, title }: { colors: string[], title: string }) => (
    <div className="mb-8">
      <h3 className="font-bold mb-3 text-sm text-on-surface-variant flex items-center gap-2">
        <Hash size={16} /> {title}
      </h3>
      <div className="flex h-24 rounded-lg overflow-hidden shadow-sm">
        {colors.map((c, i) => (
          <div 
            key={i} 
            onClick={() => handleCopy(c)}
            className="flex-1 transition-all hover:flex-[1.5] cursor-pointer relative group flex items-end justify-center pb-2"
            style={{ backgroundColor: c }}
          >
            <div className="bg-background/80 backdrop-blur text-on-surface px-2 py-1 rounded text-xs font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              {copiedColor === c ? 'Copied' : c}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6">
          <ArrowLeft size={20} /><span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Color Palette Generator</h1>
        <p className="text-on-surface-variant mb-8">Generate harmonious color palettes based on a root color.</p>

        <div className="bg-surface rounded-xl p-6 border border-outline mb-8">
          <label className="block text-sm font-bold mb-2">Base Color</label>
          <div className="flex gap-4">
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="h-12 w-24 rounded cursor-pointer border-none p-0"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => {
                const val = e.target.value;
                setBaseColor(val);
              }}
              className="flex-1 bg-background border border-outline rounded-lg px-4 font-mono font-bold focus:outline-none focus:border-primary uppercase uppercase"
            />
          </div>
        </div>

        <div className="bg-surface rounded-xl p-6 border border-outline">
          <ColorStrip colors={palettes.monoshades} title="Monochromatic" />
          <ColorStrip colors={palettes.analogous} title="Analogous" />
          <ColorStrip colors={palettes.complementary} title="Complementary" />
          <ColorStrip colors={palettes.tetradic} title="Tetradic (Square)" />
        </div>
      </div>
    </div>
  );
}
