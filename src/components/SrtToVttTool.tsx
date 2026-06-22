import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Shield, Upload, Download, Trash2, FileText } from 'lucide-react';

function convertSrtToVtt(srtText: string): string {
  // Normalize line endings
  const lines = srtText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  let vttContent = 'WEBVTT\n\n';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // If it's a numeric line alone, skip or keep it
    // In WebVTT, cue indices are optional. We can keep them or skip them.
    // Let's keep them if they are followed by a timestamp line.
    if (/^\d+$/.test(line)) {
      // Look ahead to check if next line contains "-->"
      const nextLine = lines[i + 1]?.trim() || '';
      if (nextLine.includes('-->')) {
        vttContent += `${line}\n`;
        continue;
      }
    }

    // Convert timestamps (replace comma with dot)
    if (line.includes('-->')) {
      const formattedLine = line.replace(/,/g, '.');
      vttContent += `${formattedLine}\n`;
    } else {
      vttContent += `${line}\n`;
    }
  }

  return vttContent.trim();
}

export default function SrtToVttTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState(`1
00:00:01,000 --> 00:00:04,500
Hello, welcome to Tool Cabinet!

2
00:00:05,200 --> 00:00:08,000
Enjoy our 100% client-side converters.`);

  const [outputText, setOutputText] = useState('');
  const [fileName, setFileName] = useState('subtitles.vtt');
  const [copied, setCopied] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleConvert = () => {
    try {
      const converted = convertSrtToVtt(inputText);
      setOutputText(converted);
    } catch (err) {
      console.error(err);
      alert('Failed to parse SRT. Please check formatting.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Save default download name
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    setFileName(`${baseName}.vtt`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      setUploaded(true);
      
      // Auto convert
      try {
        const converted = convertSrtToVtt(text);
        setOutputText(converted);
      } catch (err) {
        console.error(err);
      }
    };
    reader.readAsText(file);
  };

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClear = () => {
    setInputText('');
    setOutputText('');
    setUploaded(false);
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
            <div className="font-sans text-sm font-medium text-on-surface">SRT to VTT Converter</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">SRT to VTT Converter</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Convert SubRip subtitle files (.srt) into WebVTT subtitle files (.vtt) cleanly. Prepends WebVTT header blocks and updates decimal delimiters offline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              id="file-srt"
              accept=".srt"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-srt"
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-[#008cff] rounded-xl text-xs font-mono uppercase tracking-wider text-on-surface cursor-pointer transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload SRT File
            </label>

            {inputText && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Dual Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch mb-8">
          
          {/* SRT Input Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                SubRip Source Text (.srt)
              </label>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste SubRip contents here..."
              className="w-full h-80 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
            />
            
            <div className="mt-4 flex justify-between items-center">
              <span className="font-mono text-[10px] text-on-surface-variant">
                Lines: {inputText.split('\n').length}
              </span>
              <button
                onClick={handleConvert}
                className="bg-[#008cff] hover:bg-[#0070cc] text-white font-mono text-xs uppercase tracking-wider px-5 py-2 rounded-xl transition-all shadow-md active:scale-95"
              >
                Convert to VTT
              </button>
            </div>
          </div>

          {/* VTT Output Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                WebVTT Output (.vtt)
              </label>
              {outputText && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                      copied ? 'text-emerald-400' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy'}
                  </button>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-[#008cff] hover:text-[#0070cc] transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download
                  </button>
                </div>
              )}
            </div>

            <textarea
              readOnly
              value={outputText}
              placeholder="Converted WebVTT text will load here..."
              className="w-full h-80 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-[#008cff] focus:outline-none resize-none placeholder:text-outline/70"
            />

            <div className="mt-4 flex justify-between items-center">
              <span className="font-mono text-[10px] text-on-surface-variant">
                Lines: {outputText ? outputText.split('\n').length : 0}
              </span>
              {outputText && (
                <span className="font-sans text-[11px] text-[#008cff] font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5" />
                  {fileName}
                </span>
              )}
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
