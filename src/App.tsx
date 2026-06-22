/// <reference types="vite/client" />
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import RelatedTools from './components/RelatedTools';
import { ArrowLeft } from 'lucide-react';
import { ALL_TOOLS } from './data/toolsManifest';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { getSeoData } from './data/toolsSeoData';
import FaqSection from './components/FaqSection';

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
  // Alias reverse-dictionary to DictionaryTool
  const targetId = id === 'reverse-dictionary' ? 'dictionary' : id;
  return targetId.replace(/[^a-zA-Z0-9]/g, '-').split('-').filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Tool';
}

function NotFoundState({ toolId }: { toolId?: string }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-background text-on-surface w-full animate-in fade-in zoom-in duration-300">
      <Helmet>
        <title>Tool Not Found | Tool Cabinet</title>
        <meta name="description" content="The requested tool could not be found on Tool Cabinet." />
      </Helmet>
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

  if (!toolId) return <NotFoundState />;
  
  // Find tool in manifest (support reverse-dictionary alias)
  const tool = ALL_TOOLS.find(t => t.id === toolId || (toolId === 'reverse-dictionary' && t.id === 'dictionary'));

  if (!tool) {
    return <NotFoundState toolId={toolId} />;
  }

  const className = getClassName(toolId);
  const LazyComponent = lazyTools[className];

  if (!LazyComponent) {
    return <NotFoundState toolId={toolId} />;
  }

  const seo = getSeoData(toolId, tool.name, tool.description);

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-background text-on-surface">
        <div className="flex flex-col items-center gap-4">
           <div className="w-8 h-8 rounded-full border-4 border-[#008cff] border-t-transparent animate-spin"></div>
           <p className="font-mono text-sm tracking-widest uppercase">Loading Tool Environment...</p>
        </div>
      </div>
    }>
      <Helmet>
        <title>{seo.title}</title>
        <meta name="description" content={seo.description} />
        <script type="application/ld+json">
          {JSON.stringify(seo.schema)}
        </script>
      </Helmet>

      <LazyComponent onBack={() => navigate('/')} />
      
      {/* ── SEO FAQ Section (Bottom Text Strategy) ────────────────────────── */}
      <FaqSection faqData={seo.faq} />

      <RelatedTools currentToolId={tool.id} onNavigate={(id) => navigate(`/${id}`)} />
      
      {/* ── Bottom Back Button ────────────────────────────────────────────── */}
      <div className="w-full bg-surface pb-12 flex justify-center border-t border-outline-variant pt-8 mt-auto">
        <button
          onClick={() => navigate('/')}
          className="group flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="font-mono text-[11px] uppercase tracking-widest">Back to Tool Cabinet</span>
        </button>
      </div>
    </Suspense>
  );
}

function LandingRoute() {
  return (
    <>
      <Helmet>
        <title>Tool Cabinet | Every Free Tool You Could Ever Need</title>
        <meta name="description" content="Precision-engineered, 100% client-side web tools. Image compressor, background remover, converters, and more. 100% offline, free, and private." />
      </Helmet>
      <LandingPage />
    </>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <div className="bg-background text-on-surface font-sans min-h-screen flex flex-col antialiased selection:bg-[#008cff] selection:text-white">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingRoute />} />
            
            {/* All tools are dynamically loaded to enforce code splitting */}
            <Route path="/:toolId" element={<DynamicToolRoute />} />
            
            {/* Universal fallback */}
            <Route path="*" element={<NotFoundState />} />
          </Routes>
        </BrowserRouter>
      </div>
    </HelmetProvider>
  );
}
