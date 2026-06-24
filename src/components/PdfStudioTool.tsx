import { ArrowLeft, Shield } from 'lucide-react';
import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { PDFDocument } from 'pdf-lib';

interface PDFStudioToolProps {
  onBack?: () => void;
}

type TabType = 'MERGE' | 'SPLIT' | 'PROTECT' | 'UNLOCK';

interface MergeFileItem {
  id: string;
  name: string;
  bytes: Uint8Array;
  pageCount: number;
}

export default function PDFStudioTool({ onBack }: PDFStudioToolProps) {
  const [activeTab, setActiveTab] = useState<TabType>('MERGE');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // ─── MERGE state ────────────────────────────────────────────────────────────
  const [mergeFiles, setMergeFiles] = useState<MergeFileItem[]>([]);
  const mergeFileInputRef = useRef<HTMLInputElement>(null);

  // ─── SPLIT state ────────────────────────────────────────────────────────────
  const [splitFile, setSplitFile] = useState<{ name: string; bytes: Uint8Array; pageCount: number } | null>(null);
  const [pageRangeInput, setPageRangeInput] = useState('');
  const splitFileInputRef = useRef<HTMLInputElement>(null);

  // ─── PROTECT state ──────────────────────────────────────────────────────────
  const [protectFile, setProtectFile] = useState<{ name: string; bytes: Uint8Array } | null>(null);
  const [userPassword, setUserPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const protectFileInputRef = useRef<HTMLInputElement>(null);

  // ─── UNLOCK state ───────────────────────────────────────────────────────────
  const [unlockFile, setUnlockFile] = useState<{ name: string; bytes: Uint8Array } | null>(null);
  const [unlockPassword, setUnlockPassword] = useState('');
  const unlockFileInputRef = useRef<HTMLInputElement>(null);

  // ─── General Helper to trigger download ──────────────────────────────────────
  const triggerDownload = (bytes: Uint8Array, fileName: string) => {
    const blob = new Blob([bytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  };

  // ─── MERGE Actions ──────────────────────────────────────────────────────────
  const handleMergeAddFiles = async (files: FileList) => {
    setError(null);
    setLoading(true);
    try {
      const loaded: MergeFileItem[] = [];
      for (const file of Array.from(files)) {
        if (!file.name.toLowerCase().endsWith('.pdf')) continue;
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
        const pageCount = doc.getPageCount();
        
        loaded.push({
          id: crypto.randomUUID(),
          name: file.name,
          bytes,
          pageCount,
        });
      }
      setMergeFiles((prev) => [...prev, ...loaded]);
    } catch (err) {
      console.error(err);
      setError('Could not read PDF. Some files might be protected or corrupted.');
    } finally {
      setLoading(false);
    }
  };

  const handleMergeMove = (index: number, direction: 'UP' | 'DOWN') => {
    const newIndex = direction === 'UP' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= mergeFiles.length) return;
    
    setMergeFiles((prev) => {
      const list = [...prev];
      const temp = list[index];
      list[index] = list[newIndex];
      list[newIndex] = temp;
      return list;
    });
  };

  const handleMergeRemove = (id: string) => {
    setMergeFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMergeSubmit = async () => {
    if (mergeFiles.length === 0) return;
    setError(null);
    setLoading(true);
    try {
      const mergedDoc = await PDFDocument.create();
      for (const item of mergeFiles) {
        const srcDoc = await PDFDocument.load(item.bytes, { ignoreEncryption: true });
        const pages = await mergedDoc.copyPages(srcDoc, Array.from({ length: item.pageCount }, (_, i) => i));
        pages.forEach((page) => mergedDoc.addPage(page));
      }
      const bytes = await mergedDoc.save();
      triggerDownload(bytes, 'merged_document.pdf');
    } catch (err) {
      console.error(err);
      setError('Failed to bind documents. Verify that documents are not restricted.');
    } finally {
      setLoading(false);
    }
  };

  // ─── SPLIT Actions ──────────────────────────────────────────────────────────
  const handleSplitLoadFile = async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
      setSplitFile({
        name: file.name,
        bytes,
        pageCount: doc.getPageCount(),
      });
      setPageRangeInput('');
    } catch (err) {
      console.error(err);
      setError('Failed to read PDF file.');
    } finally {
      setLoading(false);
    }
  };

  const parseRanges = (input: string, max: number): number[][] => {
    const ranges: number[][] = [];
    const parts = input.split(',');
    for (const part of parts) {
      const clean = part.trim();
      if (!clean) continue;
      if (clean.includes('-')) {
        const [startStr, endStr] = clean.split('-');
        const start = parseInt(startStr.trim(), 10);
        const end = parseInt(endStr.trim(), 10);
        if (!isNaN(start) && !isNaN(end) && start > 0 && end >= start && end <= max) {
          const list = [];
          for (let i = start; i <= end; i++) list.push(i - 1);
          ranges.push(list);
        }
      } else {
        const val = parseInt(clean, 10);
        if (!isNaN(val) && val > 0 && val <= max) {
          ranges.push([val - 1]);
        }
      }
    }
    return ranges;
  };

  const executeSplitDownload = async (pagesList: number[], index: number) => {
    if (!splitFile) return;
    try {
      const doc = await PDFDocument.create();
      const srcDoc = await PDFDocument.load(splitFile.bytes, { ignoreEncryption: true });
      const copied = await doc.copyPages(srcDoc, pagesList);
      copied.forEach((p) => doc.addPage(p));
      const bytes = await doc.save();
      const baseName = splitFile.name.replace(/\.pdf$/i, '');
      triggerDownload(bytes, `${baseName}_part_${index + 1}.pdf`);
    } catch (err) {
      console.error(err);
      setError('Failed to extract specified range.');
    }
  };

  const handleSplitAll = async () => {
    if (!splitFile) return;
    const parsed = parseRanges(pageRangeInput, splitFile.pageCount);
    if (parsed.length === 0) {
      setError('Please specify valid page ranges (e.g. 1-3, 5).');
      return;
    }
    setError(null);
    for (let i = 0; i < parsed.length; i++) {
      await executeSplitDownload(parsed[i], i);
    }
  };

  // ─── PROTECT Actions ────────────────────────────────────────────────────────
  const handleProtectLoadFile = async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      setProtectFile({ name: file.name, bytes });
    } catch (err) {
      console.error(err);
      setError('Failed to load PDF file.');
    } finally {
      setLoading(false);
    }
  };

  const handleProtectSubmit = async () => {
    if (!protectFile) return;
    if (!userPassword && !ownerPassword) {
      setError('Please set at least one password.');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const doc = await PDFDocument.load(protectFile.bytes, { ignoreEncryption: true });
      doc.encrypt({
        userPassword,
        ownerPassword,
        permissions: {
          printing: 'highResolution',
          modifying: false,
          copying: false,
        },
      });
      const bytes = await doc.save();
      const baseName = protectFile.name.replace(/\.pdf$/i, '');
      triggerDownload(bytes, `${baseName}_protected.pdf`);
    } catch (err) {
      console.error(err);
      setError('Failed to encrypt PDF document.');
    } finally {
      setLoading(false);
    }
  };

  // ─── UNLOCK Actions ─────────────────────────────────────────────────────────
  const handleUnlockLoadFile = async (file: File) => {
    setError(null);
    setLoading(true);
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      setUnlockFile({ name: file.name, bytes });
      setUnlockPassword('');
    } catch (err) {
      console.error(err);
      setError('Failed to load PDF file.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnlockSubmit = async () => {
    if (!unlockFile) return;
    setError(null);
    setLoading(true);
    try {
      // Load using password, which decrypts it in memory
      const doc = await PDFDocument.load(unlockFile.bytes, { password: unlockPassword });
      const bytes = await doc.save();
      const baseName = unlockFile.name.replace(/\.pdf$/i, '');
      triggerDownload(bytes, `${baseName}_unlocked.pdf`);
    } catch (err) {
      console.error(err);
      setError('Failed to decrypt PDF. Verify the password and try again.');
    } finally {
      setLoading(false);
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
            <div className="font-sans text-sm font-medium text-on-surface">PDF Studio</div>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">PDF Studio</h1>
            <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
              Merge multiple PDFs, split page bounds by range, set structural passwords, and strip restrictions client-side.
            </p>
          </div>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="border border-red-500 bg-red-500/5 text-red-500 p-4 text-xs font-bold uppercase tracking-wider">
            ERROR: {error}
          </div>
        )}

        {/* Global Loading Spinner */}
        {loading && (
          <div className="border border-[#008cff] bg-[#008cff]/5 text-[#008cff] p-4 text-xs font-bold uppercase tracking-wide text-center">
            PROCESSING IN CLIENT MEMORY...
          </div>
        )}

        {/* ─── TAB: MERGE ──────────────────────────────────────────────────────── */}
        {activeTab === 'MERGE' && (
          <div className="flex flex-col gap-6">
            <input
              ref={mergeFileInputRef}
              type="file"
              accept=".pdf"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleMergeAddFiles(e.target.files)}
            />
            
            {/* Merge Dropzone */}
            <div
              onClick={() => mergeFileInputRef.current?.click()}
              className="border-2 border-dashed border-outline-variant hover:border-[#008cff] bg-surface-container-low p-12 text-center cursor-pointer transition-all"
            >
              <span className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                DROP PDF FILES HERE OR CLICK TO BROWSE
              </span>
            </div>

            {/* Merge Files Table */}
            {mergeFiles.length > 0 && (
              <div className="border border-outline-variant">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th className="p-3 uppercase font-bold tracking-wide border-r border-outline-variant">ORDER</th>
                      <th className="p-3 uppercase font-bold tracking-wide border-r border-outline-variant">FILENAME</th>
                      <th className="p-3 uppercase font-bold tracking-wide border-r border-outline-variant text-right">PAGES</th>
                      <th className="p-3 uppercase font-bold tracking-wide">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mergeFiles.map((file, idx) => (
                      <tr key={file.id} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low/50">
                        <td className="p-3 border-r border-outline-variant font-bold">{idx + 1}</td>
                        <td className="p-3 border-r border-outline-variant truncate max-w-xs">{file.name}</td>
                        <td className="p-3 border-r border-outline-variant text-right font-bold">{file.pageCount}</td>
                        <td className="p-3 flex gap-2">
                          <button
                            onClick={() => handleMergeMove(idx, 'UP')}
                            disabled={idx === 0}
                            className="hover:text-[#008cff] disabled:opacity-30 uppercase font-bold tracking-wider"
                          >
                            Up
                          </button>
                          <button
                            onClick={() => handleMergeMove(idx, 'DOWN')}
                            disabled={idx === mergeFiles.length - 1}
                            className="hover:text-[#008cff] disabled:opacity-30 uppercase font-bold tracking-wider"
                          >
                            Down
                          </button>
                          <button
                            onClick={() => handleMergeRemove(file.id)}
                            className="text-red-500 hover:text-red-600 uppercase font-bold tracking-wider ml-2"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Bind Trigger */}
            <button
              onClick={handleMergeSubmit}
              disabled={mergeFiles.length === 0}
              className="w-full py-4 bg-[#008cff] hover:bg-[#0070cc] text-white disabled:opacity-40 text-xs font-bold uppercase tracking-wide transition-all"
            >
              Bind Documents
            </button>
          </div>
        )}

        {/* ─── TAB: SPLIT ──────────────────────────────────────────────────────── */}
        {activeTab === 'SPLIT' && (
          <div className="flex flex-col gap-6">
            <input
              ref={splitFileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleSplitLoadFile(e.target.files[0])}
            />

            {/* Split Dropzone */}
            {!splitFile ? (
              <div
                onClick={() => splitFileInputRef.current?.click()}
                className="border-2 border-dashed border-outline-variant hover:border-[#008cff] bg-surface-container-low p-12 text-center cursor-pointer transition-all"
              >
                <span className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                  DROP A PDF DOCUMENT HERE OR CLICK TO BROWSE
                </span>
              </div>
            ) : (
              <div className="border border-outline-variant bg-surface-container-low p-6 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">SELECTED FILE</div>
                  <div className="text-sm font-bold mt-1">{splitFile.name}</div>
                  <div className="text-xs text-on-surface-variant mt-1">{splitFile.pageCount} PAGES AVAILABLE</div>
                </div>
                <button
                  onClick={() => setSplitFile(null)}
                  className="text-red-500 hover:text-red-600 uppercase font-bold tracking-wider text-xs"
                >
                  Change
                </button>
              </div>
            )}

            {splitFile && (
              <div className="flex flex-col gap-6">
                {/* Page range text inputs */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                    SPECIFY PAGE RANGES (E.G. "1-3, 5, 7-12")
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 1-3, 5, 7-12"
                    value={pageRangeInput}
                    onChange={(e) => setPageRangeInput(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-base text-on-surface font-mono outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] transition-all"
                  />
                </div>

                {/* Display table of ranges */}
                {pageRangeInput.trim() && (
                  <div className="border border-outline-variant">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-outline-variant">
                          <th className="p-3 uppercase font-bold tracking-wide border-r border-outline-variant">PART</th>
                          <th className="p-3 uppercase font-bold tracking-wide border-r border-outline-variant">PAGES</th>
                          <th className="p-3 uppercase font-bold tracking-wide">ACTIONS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {parseRanges(pageRangeInput, splitFile.pageCount).map((list, idx) => (
                          <tr key={idx} className="border-b border-outline-variant last:border-0 hover:bg-surface-container-low/50">
                            <td className="p-3 border-r border-outline-variant font-bold">PART {idx + 1}</td>
                            <td className="p-3 border-r border-outline-variant">{list.map((p) => p + 1).join(', ')}</td>
                            <td className="p-3">
                              <button
                                onClick={() => executeSplitDownload(list, idx)}
                                className="text-[#008cff] hover:text-[#0070cc] uppercase font-bold tracking-wider"
                              >
                                Download Part
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <button
                  onClick={handleSplitAll}
                  className="w-full py-4 bg-[#008cff] hover:bg-[#0070cc] text-white text-xs font-bold uppercase tracking-wide transition-all"
                >
                  [ SPLIT & DOWNLOAD ALL PARTS ]
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: PROTECT ────────────────────────────────────────────────────── */}
        {activeTab === 'PROTECT' && (
          <div className="flex flex-col gap-6">
            <input
              ref={protectFileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleProtectLoadFile(e.target.files[0])}
            />

            {!protectFile ? (
              <div
                onClick={() => protectFileInputRef.current?.click()}
                className="border-2 border-dashed border-outline-variant hover:border-[#008cff] bg-surface-container-low p-12 text-center cursor-pointer transition-all"
              >
                <span className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                  DROP A PDF DOCUMENT HERE OR CLICK TO BROWSE
                </span>
              </div>
            ) : (
              <div className="border border-outline-variant bg-surface-container-low p-6 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">SELECTED FILE</div>
                  <div className="text-sm font-bold mt-1">{protectFile.name}</div>
                </div>
                <button
                  onClick={() => setProtectFile(null)}
                  className="text-red-500 hover:text-red-600 uppercase font-bold tracking-wider text-xs"
                >
                  Change
                </button>
              </div>
            )}

            {protectFile && (
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                      USER PASSWORD (REQUIRED TO OPEN)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter user password..."
                      value={userPassword}
                      onChange={(e) => setUserPassword(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-base text-on-surface font-mono outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] transition-all"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                      OWNER PASSWORD (RESTRICT PRINT/COPY)
                    </label>
                    <input
                      type="password"
                      placeholder="Enter owner password..."
                      value={ownerPassword}
                      onChange={(e) => setOwnerPassword(e.target.value)}
                      className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-base text-on-surface font-mono outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleProtectSubmit}
                  className="w-full py-4 bg-[#008cff] hover:bg-[#0070cc] text-white text-xs font-bold uppercase tracking-wide transition-all"
                >
                  Encrypt Document
                </button>
              </div>
            )}
          </div>
        )}

        {/* ─── TAB: UNLOCK ─────────────────────────────────────────────────────── */}
        {activeTab === 'UNLOCK' && (
          <div className="flex flex-col gap-6">
            <input
              ref={unlockFileInputRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleUnlockLoadFile(e.target.files[0])}
            />

            {!unlockFile ? (
              <div
                onClick={() => unlockFileInputRef.current?.click()}
                className="border-2 border-dashed border-outline-variant hover:border-[#008cff] bg-surface-container-low p-12 text-center cursor-pointer transition-all"
              >
                <span className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                  DROP A RESTRICTED PDF HERE OR CLICK TO BROWSE
                </span>
              </div>
            ) : (
              <div className="border border-outline-variant bg-surface-container-low p-6 flex justify-between items-center">
                <div>
                  <div className="text-xs font-bold uppercase tracking-wider text-on-surface-variant">SELECTED FILE</div>
                  <div className="text-sm font-bold mt-1">{unlockFile.name}</div>
                </div>
                <button
                  onClick={() => setUnlockFile(null)}
                  className="text-red-500 hover:text-red-600 uppercase font-bold tracking-wider text-xs"
                >
                  Change
                </button>
              </div>
            )}

            {unlockFile && (
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase font-bold tracking-wide text-on-surface-variant">
                    DECRYPTION PASSWORD (REQUIRED FOR OPEN LOCKS)
                  </label>
                  <input
                    type="password"
                    placeholder="Enter password to unlock..."
                    value={unlockPassword}
                    onChange={(e) => setUnlockPassword(e.target.value)}
                    className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-base text-on-surface font-mono outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] transition-all"
                  />
                </div>

                <button
                  onClick={handleUnlockSubmit}
                  className="w-full py-4 bg-[#008cff] hover:bg-[#0070cc] text-white text-xs font-bold uppercase tracking-wide transition-all"
                >
                  [ DECRYPT & DOWNLOAD ]
                </button>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}
