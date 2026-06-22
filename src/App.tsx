/// <reference types="vite/client" />
import React, { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate, useLocation } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RelatedTools from './components/RelatedTools';
import { ArrowLeft } from 'lucide-react';
import { ALL_TOOLS } from './data/toolsManifest';

// Dynamically load the rest so we don't break the app, but we manually map the examples.
const toolModules = import.meta.glob('./components/**/*Tool.tsx');
const lazyTools: Record<string, React.LazyExoticComponent<React.ComponentType<any>>> = {};

Object.entries(toolModules).forEach(([path, importFn]) => {
  const nameMatch = path.match(/\/([^/]+)\.tsx$/);
  if (nameMatch) {
    lazyTools[nameMatch[1]] = React.lazy(importFn as any);
  }
});

function getClassName(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, '-').split('-').filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Tool';
}

function useSEO(toolId?: string) {
  useEffect(() => {
    if (!toolId) {
      document.title = "Web-ToolVerse | Every Free Tool You Could Ever Need";
      let meta = document.querySelector('meta[name="description"]');
      if (meta) {
        meta.setAttribute("content", "A comprehensive collection of free web tools.");
      }
      return;
    }

    const tool = ALL_TOOLS.find(t => t.id === toolId);
    if (tool) {
      document.title = `${tool.name} | Web-ToolVerse`;
      let meta = document.querySelector('meta[name="description"]');
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", tool.description || `Free online ${tool.name} tool.`);
    } else {
      document.title = "Tool Not Found | Web-ToolVerse";
    }
  }, [toolId]);
}

function NotFoundState({ toolId }: { toolId?: string }) {
  const navigate = useNavigate();
  useSEO(toolId); // Call here for 404 title
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background text-on-surface w-full animate-in fade-in zoom-in duration-300">
      <div className="max-w-md flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl bg-[#008cff]/10 text-[#008cff] flex items-center justify-center mb-6 border border-[#008cff]/20">
          <span className="font-heading text-2xl font-bold">404</span>
        </div>
        <h2 className="text-3xl font-bold mb-4 font-heading tracking-tight">Tool Not Found</h2>
        <p className="text-on-surface-variant mb-10 max-w-sm text-lg leading-relaxed">
          The tool {toolId ? `"${toolId}"` : 'you are looking for'} doesn't seem to exist or has been moved.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="group flex items-center justify-center gap-2 bg-[#008cff] text-white hover:bg-[#0070cc] font-mono text-sm tracking-wider uppercase px-6 py-3 rounded-lg transition-colors shadow-sm"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Directory
        </button>
      </div>
    </div>
  );
}

function DynamicToolRoute() {
  const { toolId } = useParams();
  const navigate = useNavigate();
  
  useSEO(toolId);

  if (!toolId) return <NotFoundState />;
  
  const className = getClassName(toolId);
  const LazyComponent = lazyTools[className];

  if (!LazyComponent) {
    return <NotFoundState toolId={toolId} />;
  }

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 rounded-full border-4 border-[#008cff] border-t-transparent animate-spin"></div>
           <p className="font-mono text-sm tracking-widest uppercase">Loading Tool Environment...</p>
        </div>
      </div>
    }>
      <LazyComponent onBack={() => navigate('/')} />
      <RelatedTools currentToolId={toolId} onNavigate={(id) => navigate(`/tools/${id}`)} />
      
      {/* ── Bottom Back Button ────────────────────────────────────────────── */}
      <div className="w-full bg-surface pb-12 flex justify-center border-t border-outline-variant pt-8 mt-auto">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-mono text-[11px] uppercase tracking-widest">Back to web-toolVerse</span>
        </button>
      </div>
    </Suspense>
  );
}

function LandingRoute() {
  useSEO();
  return <LandingPage />;
}

export default function App() {
  return (
    <div className="bg-background text-on-surface font-sans min-h-screen flex flex-col antialiased selection:bg-[#008cff] selection:text-white">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingRoute />} />
          
          {/* All tools are dynamically loaded to enforce code splitting */}
          <Route path="/tools/:toolId" element={<DynamicToolRoute />} />
          
          {/* Universal fallback */}
          <Route path="*" element={<NotFoundState />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
