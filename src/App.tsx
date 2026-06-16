import { useState } from 'react';
import LandingPage from './components/LandingPage';
import CropperTool from './components/CropperTool';
import CompressorTool from './components/CompressorTool';
import ImageResizerTool from './components/ImageResizerTool';
import TextFormatterTool from './components/TextFormatterTool';
import JsonFormatterTool from './components/JsonFormatterTool';
import ColorConverterTool from './components/ColorConverterTool';
import PasswordGeneratorTool from './components/PasswordGeneratorTool';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | string>('landing');

  return (
    <div className="bg-background text-on-surface font-sans min-h-screen flex flex-col antialiased selection:bg-primary selection:text-on-primary">
      {currentView === 'landing' && (
        <LandingPage onNavigate={(toolId) => setCurrentView(toolId)} />
      )}
      
      {currentView === 'image-cropper' && (
        <CropperTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'image-compressor' && (
        <CompressorTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'image-resizer' && (
        <ImageResizerTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'text-formatter' && (
        <TextFormatterTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'json-formatter' && (
        <JsonFormatterTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'color-converter' && (
        <ColorConverterTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'password-generator' && (
        <PasswordGeneratorTool onBack={() => setCurrentView('landing')} />
      )}

      {/* Fallback for tools we haven't implemented yet */}
      {currentView !== 'landing' && 
       currentView !== 'image-cropper' && 
       currentView !== 'image-compressor' && 
       currentView !== 'image-resizer' && 
       currentView !== 'text-formatter' && 
       currentView !== 'json-formatter' && 
       currentView !== 'color-converter' && 
       currentView !== 'password-generator' && (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center">
          <h2 className="text-2xl font-bold mb-4 font-heading text-primary">Coming Soon</h2>
          <p className="text-on-surface-variant mb-8 max-w-md">
            The {currentView} tool is currently under development. Please check back later.
          </p>
          <button 
            onClick={() => setCurrentView('landing')}
            className="px-6 py-2 bg-primary text-on-primary font-bold rounded hover:bg-surface-tint transition-colors"
          >
            Back to Tools
          </button>
        </div>
      )}
    </div>
  );
}
