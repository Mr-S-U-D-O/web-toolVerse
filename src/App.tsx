import { useState } from 'react';
import LandingPage from './components/LandingPage';
import CropperTool from './components/CropperTool';
import CompressorTool from './components/CompressorTool';
import ImageResizerTool from './components/ImageResizerTool';
import TextFormatterTool from './components/TextFormatterTool';
import JsonFormatterTool from './components/JsonFormatterTool';
import ColorConverterTool from './components/ColorConverterTool';
import PasswordGeneratorTool from './components/PasswordGeneratorTool';
import Base64ConverterTool from './components/Base64ConverterTool';
import UrlEncoderTool from './components/UrlEncoderTool';
import QrCodeGeneratorTool from './components/QrCodeGeneratorTool';
import HashGeneratorTool from './components/HashGeneratorTool';
import MarkdownPreviewTool from './components/MarkdownPreviewTool';
import StringReverserTool from './components/StringReverserTool';
import WordCounterTool from './components/WordCounterTool';
import ListSorterTool from './components/ListSorterTool';
import CssMinifierTool from './components/CssMinifierTool';
import JsonMinifierTool from './components/JsonMinifierTool';
import JavaScriptMinifierTool from './components/JavaScriptMinifierTool';
import PercentagesCalculatorTool from './components/PercentagesCalculatorTool';
import RoiCalculatorTool from './components/RoiCalculatorTool';
import BmiCalculatorTool from './components/BmiCalculatorTool';
import CsvToJsonTool from './components/CsvToJsonTool';
import AnyTextTool from './components/AnyTextTool';
import { ACTIVE_TOOLS } from './components/LandingPage';

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

      {currentView === 'base64-converter' && (
        <Base64ConverterTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'url-encoder' && (
        <UrlEncoderTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'qrcode-generator' && (
        <QrCodeGeneratorTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'hash-generator' && (
        <HashGeneratorTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'markdown-preview' && (
        <MarkdownPreviewTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'text-string-reverser' && (
        <StringReverserTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'text-word-counter' && (
        <WordCounterTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'text-list-sorter' && (
        <ListSorterTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'dev-css-minifier' && (
        <CssMinifierTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'dev-json-minifier' && (
        <JsonMinifierTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'dev-javascript-minifier' && (
        <JavaScriptMinifierTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'math-percentages-calculator' && (
        <PercentagesCalculatorTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'fin-roi-calculator' && (
        <RoiCalculatorTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'health-bmi-calculator' && (
        <BmiCalculatorTool onBack={() => setCurrentView('landing')} />
      )}

      {currentView === 'convert-csv-to-json' && (
        <CsvToJsonTool onBack={() => setCurrentView('landing')} />
      )}

      {/* Generic Text tools render */}
      {currentView.startsWith('text-') && !['text-string-reverser', 'text-word-counter', 'text-list-sorter'].includes(currentView) && (() => {
         const match = currentView.match(/^text-(.+)-(.+)$/);
         if (match) {
            const selectedTool = ACTIVE_TOOLS.find(t => t.id === currentView);
            if (selectedTool) {
              return <AnyTextTool onBack={() => setCurrentView('landing')} title={selectedTool.name} action={match[2]} type={match[1]} />
            }
         }
         return null;
      })()}

      {/* Fallback for tools we haven't implemented yet */}
      {!currentView.startsWith('text-') && currentView !== 'landing' && 
       currentView !== 'image-cropper' && 
       currentView !== 'image-compressor' && 
       currentView !== 'image-resizer' && 
       currentView !== 'text-formatter' && 
       currentView !== 'json-formatter' && 
       currentView !== 'color-converter' && 
       currentView !== 'password-generator' && 
       currentView !== 'base64-converter' && 
       currentView !== 'url-encoder' && 
       currentView !== 'qrcode-generator' && 
       currentView !== 'hash-generator' && 
       currentView !== 'markdown-preview' && 
       currentView !== 'text-string-reverser' && 
       currentView !== 'text-word-counter' && 
       currentView !== 'text-list-sorter' && 
       currentView !== 'dev-css-minifier' && 
       currentView !== 'dev-json-minifier' && 
       currentView !== 'dev-javascript-minifier' && 
       currentView !== 'math-percentages-calculator' && 
       currentView !== 'fin-roi-calculator' && 
       currentView !== 'health-bmi-calculator' && 
       currentView !== 'convert-csv-to-json' && (
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
