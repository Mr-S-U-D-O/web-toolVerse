import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, FileText, Upload, Trash2, ArrowRightLeft, Image as ImageIcon } from 'lucide-react';

function utf8ToBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    const binString = Array.from(bytes, (byte) => String.fromCharCode(byte)).join('');
    return btoa(binString);
  } catch (err) {
    console.error('Base64 encoding error:', err);
    return '';
  }
}

export default function Base64EncodeTool({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<'text' | 'file'>('text');
  
  // Text Mode State
  const [inputText, setInputText] = useState('Hello, Web-ToolVerse! 🚀');
  const [outputText, setOutputText] = useState('');
  const [copiedText, setCopiedText] = useState(false);
  
  // File Mode State
  const [file, setFile] = useState<File | null>(null);
  const [fileBase64, setFileBase64] = useState('');
  const [fileDataUrl, setFileDataUrl] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [copiedFileRaw, setCopiedFileRaw] = useState(false);
  const [copiedFileDataUrl, setCopiedFileDataUrl] = useState(false);
  const [loadingFile, setLoadingFile] = useState(false);

  // Auto-encode text
  useEffect(() => {
    if (activeTab === 'text') {
      setOutputText(utf8ToBase64(inputText));
    }
  }, [inputText, activeTab]);

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

  const handleCopyFileRaw = async () => {
    if (!fileBase64) return;
    try {
      await navigator.clipboard.writeText(fileBase64);
      setCopiedFileRaw(true);
      setTimeout(() => setCopiedFileRaw(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyFileDataUrl = async () => {
    if (!fileDataUrl) return;
    try {
      await navigator.clipboard.writeText(fileDataUrl);
      setCopiedFileDataUrl(true);
      setTimeout(() => setCopiedFileDataUrl(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const processFile = (selectedFile: File) => {
    setFile(selectedFile);
    setLoadingFile(true);
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setFileDataUrl(result);
      // Strip off the "data:*/*;base64," prefix for the raw base64 representation
      const commaIndex = result.indexOf(',');
      if (commaIndex !== -1) {
        setFileBase64(result.substring(commaIndex + 1));
      } else {
        setFileBase64(result);
      }
      setLoadingFile(false);
    };

    reader.onerror = () => {
      console.error('File reading failed');
      setLoadingFile(false);
    };

    reader.readAsDataURL(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const clearFile = () => {
    setFile(null);
    setFileBase64('');
    setFileDataUrl('');
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
            <div className="font-sans text-sm font-medium text-on-surface">Base64 Encode</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Base64 Encode</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Convert UTF-8 text strings or binary files into standard Base64 representation. Safe for URLs, data embedding, and offline transfers.
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
            Text Encoder
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`px-6 py-3 font-mono text-xs uppercase tracking-wider border-b-2 transition-all ${
              activeTab === 'file'
                ? 'border-[#008cff] text-[#008cff]'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            File to DataURL
          </button>
        </div>

        {activeTab === 'text' ? (
          /* TEXT ENCODER PANEL */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            
            {/* Input Text Panel */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Source UTF-8 Text
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
                placeholder="Type or paste plain text here to encode..."
                className="w-full h-72 bg-surface-container border border-outline-variant rounded-xl p-4 font-mono text-sm text-on-surface focus:outline-none focus:border-[#008cff] transition-colors resize-none placeholder:text-outline"
              />
              
              <div className="mt-2 text-[11px] font-mono text-on-surface-variant flex justify-between">
                <span>Characters: {inputText.length}</span>
                <span>Bytes (UTF-8): {new TextEncoder().encode(inputText).length}</span>
              </div>
            </div>

            {/* Output Base64 Panel */}
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant flex flex-col justify-between">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Base64 Encoded Output
                </label>
                {outputText && (
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
              
              <textarea
                readOnly
                value={outputText}
                placeholder="Encoded string will display here..."
                className="w-full h-72 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-mono text-sm text-[#008cff] focus:outline-none resize-none placeholder:text-outline/70"
              />
              
              <div className="mt-2 text-[11px] font-mono text-on-surface-variant flex justify-between">
                <span>Output Length: {outputText.length} chars</span>
              </div>
            </div>

          </div>
        ) : (
          /* FILE ENCODER PANEL */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Drag & Drop Dropzone */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                  isDragActive
                    ? 'border-[#008cff] bg-[#008cff]/5'
                    : 'border-outline-variant bg-surface-container-low hover:border-outline'
                }`}
              >
                <div className="w-12 h-12 rounded-xl bg-surface-container-high border border-outline-variant flex items-center justify-center mb-4 text-[#008cff]">
                  <Upload className="w-6 h-6" />
                </div>
                
                <p className="font-sans text-sm font-medium text-white mb-1">
                  Drag and drop file here
                </p>
                <p className="font-sans text-xs text-on-surface-variant mb-6">
                  Supports images, documents, PDFs up to 10MB
                </p>
                
                <input
                  type="file"
                  id="file-upload-b64"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <label
                  htmlFor="file-upload-b64"
                  className="px-4 py-2 bg-[#008cff] text-white hover:bg-[#0070cc] font-mono text-xs uppercase tracking-wider rounded-xl cursor-pointer transition-colors shadow-sm"
                >
                  Choose File
                </label>
              </div>

              {file && (
                <div className="bg-surface-container-low border border-outline-variant p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="p-2.5 bg-surface-container-high rounded-lg text-on-surface-variant flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-sm font-medium text-white truncate" title={file.name}>
                        {file.name}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {(file.size / 1024).toFixed(1)} KB • {file.type || 'unknown type'}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearFile}
                    className="p-2 text-on-surface-variant hover:text-red-400 transition-colors"
                    title="Remove file"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Encoded Results */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              {loadingFile ? (
                <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-12 flex flex-col items-center justify-center gap-4">
                  <div className="w-8 h-8 rounded-full border-4 border-[#008cff] border-t-transparent animate-spin"></div>
                  <p className="font-mono text-xs uppercase tracking-wider text-outline">Encoding binary file...</p>
                </div>
              ) : fileBase64 ? (
                <div className="flex flex-col gap-6">
                  
                  {/* Image Preview Block (If Image) */}
                  {file.type.startsWith('image/') && (
                    <div className="bg-surface-container-low border border-outline-variant p-5 rounded-2xl">
                      <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-3 block flex items-center gap-1.5">
                        <ImageIcon className="w-4 h-4 text-[#008cff]" />
                        Image Source Preview
                      </label>
                      <div className="w-full flex items-center justify-center bg-surface-container-lowest border border-outline-variant rounded-xl p-4 overflow-hidden max-h-48">
                        <img
                          src={fileDataUrl}
                          alt="preview"
                          className="max-h-40 max-w-full rounded object-contain shadow-sm"
                        />
                      </div>
                    </div>
                  )}

                  {/* Raw Base64 string */}
                  <div className="bg-surface-container-low border border-outline-variant p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                      <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                        Raw Base64 Data String
                      </label>
                      <button
                        onClick={handleCopyFileRaw}
                        className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                          copiedFileRaw ? 'text-emerald-400' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {copiedFileRaw ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedFileRaw ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={fileBase64}
                      className="w-full h-32 bg-surface-container border border-outline-variant rounded-xl p-3 font-mono text-xs text-[#008cff] focus:outline-none resize-none"
                    />
                  </div>

                  {/* Data URI format */}
                  <div className="bg-surface-container-low border border-outline-variant p-5 rounded-2xl">
                    <div className="flex justify-between items-center mb-3">
                      <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                        Complete Data URL (ready for HTML/CSS embedding)
                      </label>
                      <button
                        onClick={handleCopyFileDataUrl}
                        className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider transition-colors ${
                          copiedFileDataUrl ? 'text-emerald-400' : 'text-on-surface-variant hover:text-on-surface'
                        }`}
                      >
                        {copiedFileDataUrl ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedFileDataUrl ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                    <textarea
                      readOnly
                      value={fileDataUrl}
                      className="w-full h-32 bg-surface-container border border-outline-variant rounded-xl p-3 font-mono text-xs text-[#008cff] focus:outline-none resize-none"
                    />
                  </div>

                </div>
              ) : (
                <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-12 text-center text-on-surface-variant font-sans">
                  Upload a local file to encode it into a Base64 data string.
                </div>
              )}
            </div>

          </div>
        )}
      </main>
    </div>
  );
}
