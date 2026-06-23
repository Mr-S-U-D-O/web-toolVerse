import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Download, Code2, Calculator, Settings, Eye, CheckCircle2, AlertCircle } from 'lucide-react';
import katex from 'katex';
import 'katex/dist/katex.min.css';
import { toPng } from 'html-to-image';

const QUICK_INSERTS = [
  { label: 'Fraction', text: '\\frac{a}{b}' },
  { label: 'Square Root', text: '\\sqrt{x}' },
  { label: 'Integral', text: '\\int_{a}^{b} x^2 dx' },
  { label: 'Summation', text: '\\sum_{i=1}^{n} i' },
  { label: 'Matrix', text: '\\begin{bmatrix} a & b \\\\ c & d \\end{bmatrix}' },
  { label: 'Limit', text: '\\lim_{x \\to \\infty} f(x)' },
  { label: 'Alpha', text: '\\alpha' },
  { label: 'Pi', text: '\\pi' },
  { label: 'Infinity', text: '\\infty' },
  { label: 'Therefore', text: '\\therefore' },
];

export default function LatexSandboxTool({ onBack }: { onBack?: () => void }) {
  const [latex, setLatex] = useState('f(x) = \\int_{-\\infty}^{\\infty} \\hat{f}(\\xi)\\,e^{2 \\pi i \\xi x} \\,d\\xi');
  const [htmlOutput, setHtmlOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const renderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const html = katex.renderToString(latex || '\\text{Enter Equation}', {
        throwOnError: true,
        displayMode: true,
        strict: false
      });
      setHtmlOutput(html);
      setError(null);
    } catch (e: any) {
      // Fallback to displaying error text if parse fails, but we don't crash
      setError(e.message || "Invalid LaTeX syntax");
      try {
        const fallbackHtml = katex.renderToString(latex, {
          throwOnError: false,
          displayMode: true,
        });
        setHtmlOutput(fallbackHtml);
      } catch (err) {
        setHtmlOutput('');
      }
    }
  }, [latex]);

  const handleInsert = (insertText: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = latex.substring(0, start) + insertText + latex.substring(end);
    setLatex(newValue);
    
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + insertText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const handleDownload = async () => {
    if (!renderRef.current) return;
    setIsExporting(true);
    
    try {
      // Using html-to-image to generate a transparent PNG
      // We apply temporary styles if needed, but KaTeX naturally has transparent background
      const dataUrl = await toPng(renderRef.current, {
        cacheBust: true,
        backgroundColor: 'transparent',
        style: {
          padding: '24px',
          color: '#000000' // Force black color for textbook-quality export regardless of dark mode UI
        },
        pixelRatio: 3 // High resolution
      });
      
      const a = document.createElement('a');
      a.download = `latex-equation-${Date.now()}.png`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to export equation', err);
      alert('Failed to export equation as image.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col relative z-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        {onBack && (
          <button 
            onClick={onBack}
            className="p-2 -ml-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
            title="Back to Directory"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
        <div>
          <h1 className="text-2xl font-bold font-heading tracking-tight text-on-surface flex items-center gap-2">
            <Calculator className="w-6 h-6 text-[#008cff]" />
            LaTeX Equation Sandbox
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">Type math equations simply and instantly render them to high-res PNGs.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-14rem)] min-h-[600px]">
        
        {/* Left Pane: Input */}
        <div className="w-full lg:w-1/2 flex flex-col bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
          <div className="h-12 border-b border-outline-variant bg-surface-container-lowest flex items-center px-4 justify-between shrink-0">
            <div className="flex items-center gap-2 font-medium text-sm text-on-surface">
              <Code2 className="w-4 h-4 text-[#008cff]" />
              LaTeX Input
            </div>
          </div>
          
          {/* Quick Insert Toolbar */}
          <div className="p-3 border-b border-outline-variant bg-surface-container flex flex-wrap gap-2 shrink-0">
            {QUICK_INSERTS.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleInsert(item.text)}
                className="px-2.5 py-1.5 bg-surface hover:bg-surface-container-highest border border-outline-variant rounded-lg text-xs font-mono font-medium text-on-surface-variant hover:text-on-surface transition-colors whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex-1 relative bg-[#1e1e1e] p-4">
            <textarea
              ref={textareaRef}
              value={latex}
              onChange={(e) => setLatex(e.target.value)}
              className="w-full h-full bg-transparent text-slate-200 font-mono text-sm leading-relaxed resize-none focus:outline-none"
              placeholder="Type your LaTeX formula here... e.g. \frac{1}{2}"
              spellCheck="false"
            />
            {error && (
              <div className="absolute bottom-4 left-4 right-4 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-mono p-3 rounded-xl flex items-start gap-2 shadow-sm animate-in slide-in-from-bottom-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="break-all">{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Output */}
        <div className="w-full lg:w-1/2 flex flex-col gap-6">
          <div className="flex-1 flex flex-col bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
            <div className="h-12 border-b border-outline-variant bg-surface-container-lowest flex items-center px-4 justify-between shrink-0">
              <div className="flex items-center gap-2 font-medium text-sm text-on-surface">
                <Eye className="w-4 h-4 text-emerald-500" />
                Live Render
              </div>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  KaTeX Live
                </span>
              </div>
            </div>
            
            {/* The Render Window */}
            <div className="flex-1 relative flex items-center justify-center p-8 bg-surface pattern-dots pattern-outline-variant pattern-bg-surface pattern-size-4 pattern-opacity-40 overflow-auto">
              <div 
                ref={renderRef}
                className="inline-block text-on-surface transition-colors"
                style={{ fontSize: '1.5rem' }}
                dangerouslySetInnerHTML={{ __html: htmlOutput }}
              />
            </div>
          </div>

          {/* Download Action */}
          <button
            onClick={handleDownload}
            disabled={!latex.trim() || isExporting}
            className={`h-16 flex items-center justify-center gap-3 rounded-2xl font-bold tracking-wide transition-all shadow-sm ${
              downloadSuccess 
                ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                : 'bg-[#008cff] text-white hover:bg-[#0070cc] disabled:bg-surface-container-highest disabled:text-on-surface-variant disabled:cursor-not-allowed'
            }`}
          >
            {isExporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Exporting High-Res PNG...
              </>
            ) : downloadSuccess ? (
              <>
                <CheckCircle2 className="w-6 h-6" />
                Equation Downloaded!
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Download Equation (PNG)
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
