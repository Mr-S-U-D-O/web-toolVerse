import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, Trash2, Download, Upload } from 'lucide-react';

function parseCsv(csvText: string): any[] {
  const lines: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let inQuotes = false;
  
  const text = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  // Delimiter auto-detection
  let delimiter = ',';
  const firstLine = text.split('\n')[0] || '';
  const commaCount = (firstLine.match(/,/g) || []).length;
  const semicolonCount = (firstLine.match(/;/g) || []).length;
  if (semicolonCount > commaCount) {
    delimiter = ';';
  }

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          cell += '"';
          i++; // Skip escaped quote
        } else {
          inQuotes = false;
        }
      } else {
        cell += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === delimiter) {
        row.push(cell.trim());
        cell = '';
      } else if (char === '\n') {
        row.push(cell.trim());
        lines.push(row);
        row = [];
        cell = '';
      } else {
        cell += char;
      }
    }
  }
  
  if (cell || row.length > 0) {
    row.push(cell.trim());
    lines.push(row);
  }

  const cleanLines = lines.filter(r => r.length > 0 && r.some(c => c !== ''));
  if (cleanLines.length < 2) return [];

  const headers = cleanLines[0].map(h => h.replace(/^["']|["']$/g, '').trim());
  const jsonArr: any[] = [];

  for (let i = 1; i < cleanLines.length; i++) {
    const currentRow = cleanLines[i];
    const item: Record<string, any> = {};
    headers.forEach((header, index) => {
      let val = (currentRow[index] || '').replace(/^["']|["']$/g, '').trim();
      
      // Auto-cast types if possible
      if (val.toLowerCase() === 'true') {
        item[header] = true;
      } else if (val.toLowerCase() === 'false') {
        item[header] = false;
      } else if (val !== '' && !isNaN(Number(val))) {
        item[header] = Number(val);
      } else {
        item[header] = val;
      }
    });
    jsonArr.push(item);
  }

  return jsonArr;
}

export default function CsvToJsonTool({ onBack }: { onBack?: () => void }) {
  const [inputText, setInputText] = useState(`name,role,experience,active
"Alex Mercer",Architect,12,true
"Jane Miller",Developer,8,false
"Bob Smith","Project Lead",5,true`);

  const [outputText, setOutputText] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setErrorMsg(null);
    if (!inputText.trim()) {
      setOutputText('');
      return;
    }
    try {
      const parsed = parseCsv(inputText);
      if (parsed.length === 0) {
        setErrorMsg('Could not detect headers or valid rows in the CSV input.');
        setOutputText('');
        return;
      }
      setOutputText(JSON.stringify(parsed, null, 2));
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to parse CSV.');
      setOutputText('');
    }
  }, [inputText]);

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

  const handleDownload = () => {
    if (!outputText) return;
    const blob = new Blob([outputText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'converted.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setInputText(event.target?.result as string);
    };
    reader.readAsText(file);
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
            <span className="font-mono text-[11px] uppercase tracking-widest">web-toolVerse</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="font-sans text-sm font-medium text-on-surface">CSV to JSON</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">CSV to JSON</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Convert comma-separated values (CSV) sheets or pasted text tables into formatted JSON objects arrays. Supports automatic delimiter detection and type casting.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <input
              type="file"
              id="file-csv"
              accept=".csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="file-csv"
              className="flex items-center gap-2 px-4 py-2 border border-outline-variant bg-surface-container hover:bg-surface-container-high hover:border-[#008cff] rounded-xl text-xs font-mono uppercase tracking-wider text-on-surface cursor-pointer transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              Upload CSV File
            </label>
          </div>
        </div>

        {/* Dual Panel Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* CSV Input Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                CSV Source Text
              </label>
              {inputText && (
                <button
                  onClick={() => setInputText('')}
                  className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Clear
                </button>
              )}
            </div>

            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="name,age,verified&#10;Alice,28,true&#10;Bob,35,false"
              className="w-full h-96 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
            />

            <div className="mt-2 text-[11px] font-mono text-on-surface-variant">
              Lines: {inputText.split('\n').filter(Boolean).length}
            </div>
          </div>

          {/* JSON Output Panel */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
            <div className="flex justify-between items-center mb-3">
              <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                JSON Output Array
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

            {errorMsg ? (
              <div className="w-full h-96 bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3">
                <div className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 font-mono text-xs font-semibold">
                  !
                </div>
                <p className="font-sans text-sm font-semibold text-red-400">CSV Parsing Failed</p>
                <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-relaxed font-mono">
                  {errorMsg}
                </p>
              </div>
            ) : (
              <textarea
                readOnly
                value={outputText}
                placeholder="JSON output array will display here..."
                className="w-full h-96 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-[#008cff] focus:outline-none resize-none placeholder:text-outline/70"
              />
            )}

            <div className="mt-2 text-[11px] font-mono text-on-surface-variant">
              Output Length: {outputText.length} chars
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
