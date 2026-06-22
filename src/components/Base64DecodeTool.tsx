import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, FileText, Download, Trash2, AlertCircle } from 'lucide-react';

function base64ToUtf8(str: string): string {
  let cleanStr = str.trim();
  if (cleanStr.includes(';base64,')) {
    cleanStr = cleanStr.substring(cleanStr.indexOf(';base64,') + 8);
  }
  cleanStr = cleanStr.replace(/\s/g, '');
  
  const binString = atob(cleanStr);
  const bytes = Uint8Array.from(binString, (m) => m.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

// Inspect base64 string or binary bytes to detect file signature
function detectFileType(base64Str: string): { mime: string; ext: string } {
  const clean = base64Str.trim().replace(/\s/g, '');
  
  // Try to parse standard Data URL prefix
  const match = clean.match(/^data:([^;]+);base64,/);
  if (match) {
    const mime = match[1];
    const parts = mime.split('/');
    const ext = parts[1] || 'bin';
    return { mime, ext };
  }

  // Check magic bytes headers from raw base64 prefix
  const prefix = clean.substring(0, 16);
  if (prefix.startsWith('iVBORw0KGg')) return { mime: 'image/png', ext: 'png' };
  if (prefix.startsWith('/9j/')) return { mime: 'image/jpeg', ext: 'jpg' };
  if (prefix.startsWith('R0lGOD')) return { mime: 'image/gif', ext: 'gif' };
  if (prefix.startsWith('JVBERi')) return { mime: 'application/pdf', ext: 'pdf' };
  if (prefix.startsWith('UEsDBB')) return { mime: 'application/zip', ext: 'zip' };
  if (prefix.startsWith('ey')) return { mime: 'application/json', ext: 'json' };
  if (prefix.startsWith('PD94bWw')) return { mime: 'application/xml', ext: 'xml' };

  return { mime: 'application/octet-stream', ext: 'bin' };
}

export default function Base64DecodeTool({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  
  // Text Decoder state
  const [inputText, setInputText] = useState('SGVsbG8sIFdlYi1Ub29sVmVyc2UhIPCfm4k=');
  const [outputText, setOutputText] = useState('');
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [copiedText, setCopiedText] = useState(false);

  // File Decoder state
  const [inputFileBase64, setInputFileBase64] = useState('');
  const [fileMime, setFileMime] = useState('application/octet-stream');
  const [fileExt, setFileExt] = useState('bin');
  const [fileName, setFileName] = useState('decoded-file');
  const [fileError, setFileError] = useState<string | null>(null);

  // Auto-decode text
  useEffect(() => {
    if (activeTab === 'text') {
      setDecodeError(null);
      if (!inputText.trim()) {
        setOutputText('');
        return;
      }
      try {
        setOutputText(base64ToUtf8(inputText));
      } catch (err) {
        setDecodeError('Failed to decode: Invalid Base64 character sequence or encoding format.');
        setOutputText('');
      }
    }
  }, [inputText, activeTab]);

  // Auto-detect file type in file tab
  useEffect(() => {
    if (activeTab === 'file' && inputFileBase64.trim()) {
      setFileError(null);
      try {
        const typeInfo = detectFileType(inputFileBase64);
        setFileMime(typeInfo.mime);
        setFileExt(typeInfo.ext);
      } catch (err) {
        console.error(err);
      }
    }
  }, [inputFileBase64, activeTab]);

  const handleCopyText = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadFile = () => {
    setFileError(null);
    if (!inputFileBase64.trim()) {
      setFileError('Please input a base64 string to download.');
      return;
    }

    try {
      let cleanStr = inputFileBase64.trim();
      if (cleanStr.includes(';base64,')) {
        cleanStr = cleanStr.substring(cleanStr.indexOf(';base64,') + 8);
      }
      cleanStr = cleanStr.replace(/\s/g, '');

      // Convert Base64 string to Uint8Array
      const binString = atob(cleanStr);
      const len = binString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binString.charCodeAt(i);
      }

      // Create blob and trigger download
      const blob = new Blob([bytes.buffer as ArrayBuffer], { type: fileMime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${fileName}.${fileExt}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setFileError('Download failed. Double check that the input string is a valid base64 payload.');
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
            <div className="font-sans text-sm font-medium text-on-surface">Base64 Decode</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Base64 Decode</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Decode standard Base64 representation back to human-readable UTF-8 plain text or download binary files directly in your browser.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-outline-variant mb-8">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'text'
                ? 'border-[#008cff] text-[#008cff]'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Text Decoder
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'file'
                ? 'border-[#008cff] text-[#008cff]'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            File Reconstructor
          </button>
        </div>

        {activeTab === 'text' ? (
          /* TEXT DECODER PANEL */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Input Base64 Panel */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Source Base64 String
                </label>
                {inputText && (
                  <button
                    onClick={() => setInputText('')}
                    className="flex items-center gap-1 text-xs font-mono uppercase tracking-wider text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Clear
                  </button>
                )}
              </div>
              
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Paste base64 encoded string here..."
                className="w-full h-72 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
              />
              
              <div className="mt-2 text-[11px] font-mono text-on-surface-variant flex justify-between">
                <span>Input Length: {inputText.length} chars</span>
              </div>
            </div>

            {/* Output Plain Text Panel */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Decoded UTF-8 Text
                </label>
                {outputText && !decodeError && (
                  <button
                    onClick={handleCopyText}
                    className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                      copiedText ? 'text-emerald-400' : 'text-on-surface-variant hover:text-on-surface'
                    }`}
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedText ? 'Copied' : 'Copy'}
                  </button>
                )}
              </div>
              
              {decodeError ? (
                <div className="w-full h-72 bg-red-500/5 border border-red-500/20 rounded-xl p-6 flex flex-col items-center justify-center text-center gap-3">
                  <AlertCircle className="w-8 h-8 text-red-400" />
                  <p className="font-sans text-sm font-semibold text-red-400">Decoding Error</p>
                  <p className="font-sans text-xs text-on-surface-variant max-w-xs leading-relaxed">
                    {decodeError}
                  </p>
                </div>
              ) : (
                <textarea
                  readOnly
                  value={outputText}
                  placeholder="Decoded plain text will display here..."
                  className="w-full h-72 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-[#008cff] focus:outline-none resize-none placeholder:text-outline/70"
                />
              )}

              <div className="mt-2 text-[11px] font-mono text-on-surface-variant flex justify-between">
                <span>Decoded Length: {outputText.length} chars</span>
              </div>
            </div>

          </div>
        ) : (
          /* FILE RECONSTRUCTOR PANEL */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Input Panel */}
            <div className="lg:col-span-7 bg-surface-container-low p-6 rounded-2xl border border-outline-variant flex flex-col gap-6">
              <div>
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant block mb-3">
                  Paste Base64 File Payload (Supports Raw string or Data URL prefix)
                </label>
                <textarea
                  value={inputFileBase64}
                  onChange={(e) => setInputFileBase64(e.target.value)}
                  placeholder="Paste file base64 data string (e.g. data:image/png;base64,iVBORw0KGgo...)"
                  className="w-full h-64 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-xs text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
                />
              </div>

              {inputFileBase64 && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      File Name
                    </label>
                    <input
                      type="text"
                      value={fileName}
                      onChange={(e) => setFileName(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#008cff]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      Extension
                    </label>
                    <input
                      type="text"
                      value={fileExt}
                      onChange={(e) => setFileExt(e.target.value)}
                      placeholder="e.g. png, pdf, zip"
                      className="w-full bg-surface-container border border-outline-variant rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-[#008cff]"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] uppercase tracking-wider text-on-surface-variant block mb-1.5">
                      Detected MIME Type
                    </label>
                    <div className="bg-surface-container-high border border-outline-variant rounded-lg px-3 py-2 text-xs text-on-surface-variant h-[38px] flex items-center overflow-x-auto whitespace-nowrap">
                      {fileMime}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Actions / Download Card */}
            <div className="lg:col-span-5 bg-surface-container-low p-6 rounded-2xl border border-outline-variant sticky top-[80px] flex flex-col gap-6">
              <h3 className="font-heading font-semibold text-sm text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#008cff]" />
                File Reconstruction
              </h3>

              {inputFileBase64.trim() ? (
                <div className="flex flex-col gap-4">
                  <div className="p-4 bg-surface-container-high rounded-xl border border-outline-variant">
                    <p className="text-xs text-on-surface-variant mb-1">Target File</p>
                    <p className="text-sm font-semibold text-white font-mono truncate">
                      {fileName}.{fileExt}
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-1.5">
                      Estimated payload: {(inputFileBase64.length * 0.75 / 1024).toFixed(1)} KB
                    </p>
                  </div>

                  {fileError && (
                    <div className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-start gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                      <span>{fileError}</span>
                    </div>
                  )}

                  <button
                    onClick={handleDownloadFile}
                    className="w-full flex items-center justify-center gap-2 bg-[#008cff] hover:bg-[#0070cc] text-white font-mono text-sm tracking-wider uppercase py-3 rounded-xl transition-all shadow-md active:scale-95"
                  >
                    <Download className="w-4 h-4" />
                    Download Decoded File
                  </button>
                </div>
              ) : (
                <div className="text-center py-10 font-sans text-xs text-on-surface-variant">
                  Paste a base64 sequence in the input to configure and reconstruct the file download.
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
