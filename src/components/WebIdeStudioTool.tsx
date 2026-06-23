import React, { useState, useEffect, useRef, useCallback } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { File, Folder, Plus, Download, Upload, Trash, FileCode2, Play, Edit2, ArrowLeft } from 'lucide-react';

export type VFSNodeType = 'file' | 'folder';

export interface VFSNode {
  id: string;
  name: string;
  type: VFSNodeType;
  parentId: string | null;
  content?: string;
  language?: string;
}

const initialVFS: VFSNode[] = [
  { id: 'root', name: 'src', type: 'folder', parentId: null },
  { id: '1', name: 'index.html', type: 'file', parentId: 'root', language: 'html', content: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <title>Live Preview</title>\n</head>\n<body>\n  <div class="container">\n    <h1>Hello, Web IDE!</h1>\n    <p>Start editing to see magic happen.</p>\n  </div>\n</body>\n</html>' },
  { id: '2', name: 'style.css', type: 'file', parentId: 'root', language: 'css', content: 'body {\n  font-family: system-ui, -apple-system, sans-serif;\n  background-color: #1e1e1e;\n  color: #fff;\n  padding: 20px;\n  margin: 0;\n  display: grid;\n  place-items: center;\n  min-height: 100vh;\n}\n\n.container {\n  text-align: center;\n  padding: 2rem;\n  border-radius: 8px;\n  background: #252526;\n  box-shadow: 0 4px 6px rgba(0,0,0,0.3);\n  border: 1px solid #333;\n}\n\nh1 {\n  color: #008cff;\n  margin-top: 0;\n}' },
  { id: '3', name: 'script.js', type: 'file', parentId: 'root', language: 'javascript', content: 'console.log("Welcome to Web IDE Studio!");' },
];

export default function WebIDEStudio({ onBack }: { onBack?: () => void }) {
  const [vfs, setVfs] = useState<VFSNode[]>(initialVFS);
  const [activeFileId, setActiveFileId] = useState<string | null>('1');
  const [srcDoc, setSrcDoc] = useState<string>('');
  const monaco = useMonaco();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const compileSrcDoc = useCallback((files: VFSNode[]) => {
    const htmlFile = files.find(f => f.name.endsWith('.html') && f.type === 'file');
    const cssFile = files.find(f => f.name.endsWith('.css') && f.type === 'file');
    const jsFile = files.find(f => f.name.endsWith('.js') && f.type === 'file');

    let htmlContent = htmlFile?.content || '<html><body></body></html>';
    const cssContent = cssFile?.content || '';
    const jsContent = jsFile?.content || '';

    if (cssContent) {
      if (htmlContent.includes('</head>')) {
        htmlContent = htmlContent.replace('</head>', `<style>${cssContent}</style></head>`);
      } else {
        htmlContent = `<style>${cssContent}</style>${htmlContent}`;
      }
    }

    if (jsContent) {
      if (htmlContent.includes('</body>')) {
        htmlContent = htmlContent.replace('</body>', `<script>${jsContent}</script></body>`);
      } else {
        htmlContent = `${htmlContent}<script>${jsContent}</script>`;
      }
    }

    return htmlContent;
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSrcDoc(compileSrcDoc(vfs));
    }, 500);
    return () => clearTimeout(handler);
  }, [vfs, compileSrcDoc]);

  const formatDocument = () => {
    if (monaco) {
      const editor = monaco.editor.getEditors()[0];
      if (editor) {
        editor.getAction('editor.action.formatDocument')?.run();
      }
    }
  };

  const handleEditorChange = (value: string | undefined) => {
    if (!activeFileId || value === undefined) return;
    setVfs(prev => prev.map(node => 
      node.id === activeFileId ? { ...node, content: value } : node
    ));
  };

  const activeFile = vfs.find(f => f.id === activeFileId);

  const exportProject = async () => {
    const zip = new JSZip();
    
    const buildZip = (parentId: string | null, currentZip: JSZip) => {
      const children = vfs.filter(f => f.parentId === parentId);
      children.forEach(child => {
        if (child.type === 'folder') {
          const folderZip = currentZip.folder(child.name);
          if (folderZip) buildZip(child.id, folderZip);
        } else if (child.type === 'file') {
          currentZip.file(child.name, child.content || '');
        }
      });
    };

    // Build from root's children
    const rootNode = vfs.find(n => n.parentId === null);
    if (rootNode) {
      buildZip(rootNode.id, zip);
    } else {
      buildZip(null, zip);
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, 'project.zip');
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newVfs: VFSNode[] = [];
    const rootId = 'root-imported';
    newVfs.push({ id: rootId, name: 'imported-project', type: 'folder', parentId: null });

    const folders = new Map<string, string>();

    const readFile = (file: File): Promise<string> => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.readAsText(file);
      });
    };

    const filePromises = Array.from(files).map(async (file: any) => {
      const webkitRelativePath = file.webkitRelativePath as string;
      const parts = webkitRelativePath.split('/');
      const fileName = parts.pop()!;
      let parentId = rootId;

      let currentPath = '';
      parts.forEach((part, index) => {
        currentPath += (index === 0 ? '' : '/') + part;
        if (!folders.has(currentPath)) {
          const folderId = `folder-${Math.random().toString(36).substr(2, 9)}`;
          newVfs.push({ id: folderId, name: part, type: 'folder', parentId });
          folders.set(currentPath, folderId);
        }
        parentId = folders.get(currentPath)!;
      });

      const fileId = `file-${Math.random().toString(36).substr(2, 9)}`;
      const content = await readFile(file);

      let ext = fileName.split('.').pop() || '';
      let lang = 'javascript';
      if (ext === 'html') lang = 'html';
      if (ext === 'css') lang = 'css';
      if (ext === 'json') lang = 'json';
      if (ext === 'ts' || ext === 'tsx') lang = 'typescript';

      newVfs.push({
        id: fileId,
        name: fileName,
        type: 'file',
        parentId,
        content,
        language: lang
      });
    });

    await Promise.all(filePromises);
    setVfs(newVfs);
    
    const firstFile = newVfs.find(f => f.type === 'file');
    if (firstFile) setActiveFileId(firstFile.id);
    
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const createNode = (type: VFSNodeType) => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;
    
    const rootNode = vfs.find(n => n.parentId === null) || { id: null };
    
    const newNode: VFSNode = {
      id: `${type}-${Date.now()}`,
      name,
      type,
      parentId: rootNode.id,
      content: type === 'file' ? '' : undefined,
      language: name.endsWith('.html') ? 'html' : name.endsWith('.css') ? 'css' : 'javascript'
    };
    
    setVfs(prev => [...prev, newNode]);
    if (type === 'file') setActiveFileId(newNode.id);
  };

  const deleteNode = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this?')) {
      // Basic deletion, doesn't deeply delete folder contents but good for 1-level MVP
      setVfs(prev => prev.filter(n => n.id !== id && n.parentId !== id)); 
      if (activeFileId === id) setActiveFileId(null);
    }
  };

  const renameNode = (id: string, currentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newName = prompt('Enter new name:', currentName);
    if (newName && newName.trim() !== '' && newName !== currentName) {
      setVfs(prev => prev.map(n => {
        if (n.id === id) {
          const isFile = n.type === 'file';
          return {
            ...n,
            name: newName,
            language: isFile ? (newName.endsWith('.html') ? 'html' : newName.endsWith('.css') ? 'css' : 'javascript') : n.language
          };
        }
        return n;
      }));
    }
  };

  const renderTree = (parentId: string | null = null, depth = 0) => {
    return vfs
      .filter(node => node.parentId === parentId)
      .map(node => (
        <div key={node.id} className="w-full">
          <div
            className={`flex items-center justify-between px-2 py-1.5 cursor-pointer hover:bg-[#2a2d3e] group ${
              activeFileId === node.id ? 'bg-[#008cff]/10 text-[#008cff] border-l-2 border-[#008cff]' : 'text-gray-400 border-l-2 border-transparent'
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
            onClick={() => node.type === 'file' && setActiveFileId(node.id)}
          >
            <div className="flex items-center gap-2 overflow-hidden">
              {node.type === 'folder' ? (
                <Folder size={14} className={activeFileId === node.id ? 'text-[#008cff]' : 'text-yellow-500'} />
              ) : (
                <FileCode2 size={14} className={activeFileId === node.id ? 'text-[#008cff]' : 'text-gray-400'} />
              )}
              <span className="truncate text-sm font-medium">{node.name}</span>
            </div>
            {node.parentId !== null && (
              <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 transition-opacity">
                <button 
                  onClick={(e) => renameNode(node.id, node.name, e)}
                  className="hover:text-[#008cff] p-1 rounded"
                  title="Rename"
                >
                  <Edit2 size={12} />
                </button>
                <button 
                  onClick={(e) => deleteNode(node.id, e)}
                  className="hover:text-red-400 p-1 rounded"
                  title="Delete"
                >
                  <Trash size={12} />
                </button>
              </div>
            )}
          </div>
          {node.type === 'folder' && renderTree(node.id, depth + 1)}
        </div>
      ));
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col">
      <div className="flex items-center gap-3 mb-6">
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
          <h1 className="text-2xl font-bold font-heading tracking-tight text-on-surface">Web IDE Studio</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">100% Client-Side Code Sandbox</p>
        </div>
      </div>

      <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[600px] w-full bg-[#0d0d0d] text-gray-300 font-sans border border-gray-800 rounded-lg overflow-hidden shadow-2xl">
        {/* Top Toolbar (optional extension point) */}
        <div className="h-10 border-b border-gray-800 bg-[#111] flex items-center px-4 justify-between">
          <div className="flex items-center gap-2">
             <FileCode2 size={18} className="text-[#008cff]" />
             <span className="font-bold text-gray-100 tracking-wide text-sm">Workspace Explorer</span>
          </div>
        </div>
        {/* Main IDE Layout */}
        <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-64 border-r border-gray-800 flex flex-col bg-[#111111] flex-shrink-0">
          <div className="p-3 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-xs font-bold tracking-wider text-gray-400 uppercase">Explorer</h2>
            <div className="flex gap-1">
              <button onClick={() => createNode('file')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-[#008cff] transition-colors" title="New File">
                <Plus size={14} />
              </button>
              <button onClick={() => createNode('folder')} className="p-1.5 hover:bg-gray-800 rounded text-gray-400 hover:text-[#008cff] transition-colors" title="New Folder">
                <Folder size={14} />
              </button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto py-2 scrollbar-thin scrollbar-thumb-gray-700">
            {renderTree(null)}
          </div>
          
          <div className="p-3 border-t border-gray-800 flex gap-2">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImport} 
              className="hidden" 
              // @ts-expect-error React types don't officially support directory attributes yet
              webkitdirectory="true" 
              directory="true" 
              multiple 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 py-2 rounded transition-colors"
            >
              <Upload size={14} /> Import
            </button>
            <button 
              onClick={exportProject}
              className="flex-1 flex items-center justify-center gap-1.5 text-xs font-medium bg-[#008cff]/10 text-[#008cff] hover:bg-[#008cff]/20 py-2 rounded border border-[#008cff]/20 transition-colors"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* Editor Pane */}
        <div className="flex-1 flex flex-col min-w-0 border-r border-gray-800 bg-[#1e1e1e]">
          <div className="h-10 border-b border-gray-800 flex items-center px-4 bg-[#111111] justify-between shadow-sm z-10">
            <div className="flex items-center gap-2 text-sm text-gray-300">
              {activeFile ? (
                <>
                  <FileCode2 size={14} className="text-[#008cff]" />
                  <span className="font-medium tracking-wide">{activeFile.name}</span>
                </>
              ) : (
                <span className="italic text-gray-500">No file selected</span>
              )}
            </div>
            {activeFile && (
              <button 
                onClick={formatDocument}
                className="text-xs px-3 py-1.5 bg-gray-800 hover:bg-[#008cff] hover:text-white rounded text-gray-300 transition-colors"
              >
                Format Document
              </button>
            )}
          </div>
          <div className="flex-1 relative">
            {activeFile ? (
              <Editor
                height="100%"
                language={activeFile.language || 'javascript'}
                theme="vs-dark"
                value={activeFile.content}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  wordWrap: 'on',
                  formatOnPaste: true,
                  padding: { top: 16 },
                  scrollBeyondLastLine: false,
                  smoothScrolling: true,
                  cursorBlinking: "smooth",
                  cursorSmoothCaretAnimation: "on",
                  fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', monospace"
                }}
              />
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-600 gap-4">
                <FileCode2 size={48} className="opacity-20" />
                <p>Select a file from the explorer to start editing</p>
              </div>
            )}
          </div>
        </div>

        {/* Preview Pane */}
        <div className="w-[40%] flex flex-col bg-white min-w-[300px]">
          <div className="h-10 border-b border-gray-200 flex items-center px-4 bg-gray-50 text-gray-600 justify-between">
            <div className="flex items-center gap-2 font-medium text-xs uppercase tracking-wider">
              <Play size={12} className="text-green-500 fill-green-500" />
              Live Preview
            </div>
          </div>
          <iframe 
            title="preview"
            srcDoc={srcDoc}
            className="w-full flex-1 border-none bg-white"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
        </div>
      </div>
    </div >
        
  );
}
