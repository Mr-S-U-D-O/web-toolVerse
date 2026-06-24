const fs = require('fs');
const path = require('path');

const files = [
  'PdfSignatureStudioTool.tsx',
  'BarcodeSuiteTool.tsx',
  'PdfConversionEngineTool.tsx',
  'DocumentExtractorTool.tsx',
  'WhatsappLinkGeneratorTool.tsx',
  'PdfStudioTool.tsx',
  'ExifScrubberTool.tsx',
  'LatexSandboxTool.tsx',
  'FlashcardEngineTool.tsx'
];

const dir = 'c:/Users/launc/Documents/GitHub/web-toolVerse/src/components';

const toolData = {
  'PdfSignatureStudioTool.tsx': { name: 'PDF Signature Studio', desc: 'Draw and stamp your signature onto PDF documents securely. 100% offline, keeping sensitive contracts private.' },
  'BarcodeSuiteTool.tsx': { name: 'Barcode Generator & Scanner', desc: 'Create professional retail barcodes (UPC, EAN, Code128) or scan inventory locally using your web camera.' },
  'PdfConversionEngineTool.tsx': { name: 'PDF Conversion Engine', desc: 'Extract high-resolution JPG images from PDF pages, or convert raw HTML code directly into a formatted PDF document.' },
  'DocumentExtractorTool.tsx': { name: 'PDF Text Extractor', desc: 'Instantly strip and extract all readable text from any PDF document. 100% offline, preserving data privacy.' },
  'WhatsappLinkGeneratorTool.tsx': { name: 'WhatsApp Chat Link Generator', desc: 'Generate custom click-to-chat WhatsApp links with pre-filled text lines to capture sales leads instantly.' },
  'PdfStudioTool.tsx': { name: 'PDF Studio', desc: 'Merge multiple PDFs, split page bounds by range, set structural passwords, and strip restrictions client-side.' },
  'ExifScrubberTool.tsx': { name: 'Photo EXIF & GPS Scrubber', desc: 'Permanently delete hidden GPS coordinates, camera data, and EXIF metadata from your photos offline.' },
  'LatexSandboxTool.tsx': { name: 'LaTeX Equation Sandbox', desc: 'Type math equations using simple shorthand and instantly render them into textbook-quality PNGs for your homework.' },
  'FlashcardEngineTool.tsx': { name: 'Offline Flashcard Engine', desc: 'Create, flip, and memorize flashcards using spaced repetition. 100% offline, no paywalls, saves locally.' },
};

files.forEach(file => {
  const filepath = path.join(dir, file);
  if (!fs.existsSync(filepath)) return;
  
  let content = fs.readFileSync(filepath, 'utf8');
  
  // 1. Inject lucide-react imports if not there
  if (!content.includes('ArrowLeft')) {
    content = content.replace(/import React/, "import { ArrowLeft, Shield } from 'lucide-react';\nimport React");
  }

  // 2. Remove [ TEXT ] brackets inside JSX.
  content = content.replace(/\[\s+([A-Z0-9\s<>]+)\s+\]/gi, (match, p1) => {
     return p1.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
  });
  
  // 3. Normalize brutalist fonts.
  content = content.replace(/font-black/g, 'font-bold');
  content = content.replace(/tracking-widest/g, 'tracking-wide');

  // 4. Fix the layout header.
  const returnRegex = /return\s*\(\s*<div[^>]*>([\s\S]*?)<main[^>]*>([\s\S]*?)<div[^>]*>[\s\S]*?<h1[^>]*>([\s\S]*?)<\/h1>[\s\S]*?<p[^>]*>([\s\S]*?)<\/p>\s*<\/div>/i;
  
  const tData = toolData[file];
  if (tData) {
    const standardHeader = `return (
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
            <div className="font-sans text-sm font-medium text-on-surface">${tData.name}</div>
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
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">${tData.name}</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              ${tData.desc}
            </p>
          </div>
        </div>`;

    content = content.replace(returnRegex, standardHeader);
  }
  
  fs.writeFileSync(filepath, content, 'utf8');
  console.log('Processed', file);
});
