import React, { useState } from 'react';
import { DiffEditor } from '@monaco-editor/react';
import { ArrowLeft, SplitSquareHorizontal, ShieldCheck, Trash2, Code2 } from 'lucide-react';

export default function SecureDiffTool({ onBack }: { onBack?: () => void }) {
  const [originalText, setOriginalText] = useState('// Original Code\nfunction example() {\n  console.log("Hello World");\n}');
  const [modifiedText, setModifiedText] = useState('// Modified Code\nfunction example() {\n  console.log("Hello Secure Diff");\n  return true;\n}');
  const [language, setLanguage] = useState('javascript');

  const handleClearAll = () => {
    setOriginalText('');
    setModifiedText('');
  };

  const LANGUAGES = [
    { id: 'plaintext', name: 'Plain Text' },
    { id: 'javascript', name: 'JavaScript' },
    { id: 'typescript', name: 'TypeScript' },
    { id: 'json', name: 'JSON' },
    { id: 'html', name: 'HTML' },
    { id: 'css', name: 'CSS' },
    { id: 'python', name: 'Python' },
    { id: 'java', name: 'Java' },
    { id: 'markdown', name: 'Markdown' },
    { id: 'xml', name: 'XML' },
    { id: 'sql', name: 'SQL' }
  ];

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col relative z-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
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
              <SplitSquareHorizontal className="w-6 h-6 text-[#008cff]" />
              Secure Diff Checker
            </h1>
            <p className="text-sm text-on-surface-variant mt-0.5">Compare text and code side-by-side completely offline.</p>
          </div>
        </div>
        
        {/* Safety Badge */}
        <div className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-3 py-1.5 rounded-full text-xs font-bold tracking-wide shadow-sm self-start sm:self-auto">
          <ShieldCheck className="w-4 h-4" />
          100% Local Execution - Your code never leaves your device.
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-14rem)] min-h-[600px] w-full bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden shadow-sm">
        
        {/* Editor Toolbar */}
        <div className="h-14 border-b border-outline-variant bg-surface-container-lowest flex items-center px-4 justify-between gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-on-surface-variant bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 focus-within:ring-2 focus-within:ring-[#008cff] transition-all">
              <Code2 className="w-4 h-4 text-[#008cff]" />
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent border-none focus:outline-none text-on-surface cursor-pointer appearance-none min-w-[100px]"
              >
                {LANGUAGES.map(lang => (
                  <option key={lang.id} value={lang.id}>{lang.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2">
             <button 
                onClick={handleClearAll}
                className="flex items-center justify-center gap-2 text-xs font-medium text-red-500 hover:text-white bg-red-500/10 hover:bg-red-500 px-3 py-1.5 rounded-lg transition-colors border border-red-500/20 hover:border-transparent"
              >
                <Trash2 className="w-4 h-4" />
                Clear All
              </button>
          </div>
        </div>

        {/* Diff Editor Pane */}
        <div className="flex-1 relative bg-[#1e1e1e]">
          <DiffEditor
            height="100%"
            language={language}
            original={originalText}
            modified={modifiedText}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              wordWrap: 'on',
              padding: { top: 16, bottom: 16 },
              scrollBeyondLastLine: false,
              smoothScrolling: true,
              cursorBlinking: "smooth",
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace",
              renderSideBySide: true,
              ignoreTrimWhitespace: false,
              originalEditable: true,
            }}
            onMount={(editor) => {
              // Ensure we can bind to onChange events to keep React state updated if user edits
              const originalEditor = editor.getOriginalEditor();
              const modifiedEditor = editor.getModifiedEditor();
              
              originalEditor.onDidChangeModelContent(() => {
                setOriginalText(originalEditor.getValue());
              });
              
              modifiedEditor.onDidChangeModelContent(() => {
                setModifiedText(modifiedEditor.getValue());
              });
            }}
          />
        </div>
      </div>
    </div>
  );
}
