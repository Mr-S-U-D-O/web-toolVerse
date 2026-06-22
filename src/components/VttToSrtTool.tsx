import React, { useState } from 'react';
import { ArrowLeft, Copy, Check, Shield, Upload, Download, Trash2, FileText } from 'lucide-react';

function convertVttToSrt(vttText: string): string {
  // Normalize line endings
  const lines = vttText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
  let srtContent = '';
  let cueIndex = 1;
  let inCue = false;
  let currentCueLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Skip WebVTT header and metadata
    if (line.startsWith('WEBVTT') || line.startsWith('Kind:') || line.startsWith('Language:') || line.startsWith('NOTE')) {
      continue;
    }

    // Skip empty lines or treat them as cue separators
    if (line === '') {
      if (inCue && currentCueLines.length > 0) {
        srtContent += `${cueIndex}\n${currentCueLines.join('\n')}\n\n`;
        cueIndex++;
        currentCueLines = [];
        inCue = false;
      }
      continue;
    }

    // Detect timestamp lines (e.g., "00:01.000 --> 00:04.000" or "00:00:01.000 --> 00:00:04.000")
    if (line.includes('-->')) {
      inCue = true;
      const parts = line.split('-->').map(p => p.trim());
      if (parts.length === 2) {
        // Convert timestamps to SRT format: comma instead of dot, ensure hours are present
        const formatSrtTimestamp = (ts: string) => {
          // Remove settings like "align:middle" or "line:90%" (separated by space)
          const cleanTs = ts.split(/\s+/)[0];
          let formatted = cleanTs.replace('.', ',');
          
          // Prepend hour if it is omitted (e.g., "00:00" -> "00:00:00")
          const timeParts = formatted.split(':');
          if (timeParts.length === 2) {
            formatted = `00:${formatted}`;
          }
          
          return formatted;
        };

        const start = formatSrtTimestamp(parts[0]);
        const end = formatSrtTimestamp(parts[1]);
        currentCueLines.push(`${start} --> ${end}`);
      }
    } else if (inCue) {
      currentCueLines.push(line);
    }
  }

  // Flush last cue
  if (currentCueLines.length > 0) {
    srtContent += `${cueIndex}\n${currentCueLines.join('\n')}\n\n`;
  }

  return srtContent.trim();
}

export default function VttToSrtTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState(`WEBVTT

1
00:00:01.000 --> 00:00:04.500 align:middle line:84%
Hello, welcome to Tool Cabinet!

2
00:00:05.200 --> 00:00:08.000
Enjoy our 100% client-side converters.`);

  const [outputText, setOutputText] = useState('');
  const [fileName, setFileName] = useState('subtitles.srt');
  const [copied, setCopied] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleConvert = () => {
    try {
      const converted = convertVttToSrt(inputText);
      setOutputText(converted);
    } catch (err) {
      console.error(err);
      alert('Failed to parse WebVTT. Please verify formatting.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Save default download name
    const baseName = file.name.replace(/\.[^/.]+$/, "");
    setFileName(`${baseName}.srt`);

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setInputText(text);
      setUploaded(true);
      
      // Auto convert
      try {
        const converted = convertVttToSrt(text);
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
            <div className="font-sans text-sm font-medium text-on-surface">VTT to SRT Converter</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">VTT to SRT Converter</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Convert WebVTT subtitle files (.vtt) into SubRip subtitle files (.srt) cleanly. Fixes milliseconds notation and parses subtitle cue configurations offline.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              id="file-vtt"
              accept=".vtt"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-vtt"
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-[#008cff] rounded-xl text-xs font-mono uppercase tracking-wider text-on-surface cursor-pointer transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload VTT File
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
          
          {/* VTT Input Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                WebVTT Source Text (.vtt)
              </label>
            </div>
            
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Paste WebVTT contents here..."
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
                Convert to SRT
              </button>
            </div>
          </div>

          {/* SRT Output Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                SubRip Output (.srt)
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
              placeholder="Converted SubRip text will load here..."
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
