import React, { useState } from 'react';

interface WhatsappLinkGeneratorToolProps {
  onBack?: () => void;
}

export default function WhatsappLinkGeneratorTool({ onBack }: WhatsappLinkGeneratorToolProps) {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [copySuccess, setCopySuccess] = useState(false);

  // Clean phone number: keep only digits
  const cleanPhone = phone.replace(/\D/g, '');
  const encodedMessage = encodeURIComponent(message);
  
  const generatedLink = cleanPhone 
    ? `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
    : '';

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleTest = () => {
    if (!generatedLink) return;
    window.open(generatedLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-background text-on-surface w-full flex flex-col font-mono selection:bg-[#008cff] selection:text-white">
      
      {/* Brutalist Sticky Header */}
      <header className="sticky top-0 z-30 w-full border-b border-outline-variant bg-background/95 backdrop-blur-sm">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={onBack}
            className="text-on-surface-variant hover:text-[#008cff] transition-colors uppercase tracking-widest font-bold text-xs"
          >
            [ BACK TO CABINET ]
          </button>
          <span className="font-bold uppercase tracking-wider text-sm">
            WHATSAPP CHAT LINK GENERATOR
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow max-w-[800px] mx-auto w-full px-6 py-12 flex flex-col gap-10">
        
        {/* Title Block */}
        <div className="border-b border-outline-variant pb-6">
          <h1 className="text-3xl font-black uppercase tracking-tight text-on-surface mb-2">
            WHATSAPP CHAT LINK GENERATOR
          </h1>
          <p className="text-on-surface-variant text-sm font-sans tracking-wide">
            Create instant WhatsApp conversation starters for your business. No trackers, no databases, runs 100% locally.
          </p>
        </div>

        {/* Form Fields - Grid Layout */}
        <div className="flex flex-col gap-6">
          {/* Phone Field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-bold tracking-widest text-on-surface-variant">
              PHONE NUMBER (WITH COUNTRY CODE, NO "+" OR SPACES)
            </label>
            <input
              type="text"
              placeholder="e.g. 15551234567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-base text-on-surface font-mono outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] transition-all"
            />
          </div>

          {/* Text Message Field */}
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase font-bold tracking-widest text-on-surface-variant">
              PRE-FILLED CONVERSATION TEXT
            </label>
            <textarea
              rows={5}
              placeholder="Hello! I am interested in your services..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full bg-surface-container-low border border-outline-variant px-4 py-3 text-base text-on-surface font-mono outline-none focus:border-[#008cff] focus:ring-1 focus:ring-[#008cff] transition-all resize-y"
            />
          </div>
        </div>

        {/* Live Output Canvas */}
        <div className="border border-outline-variant bg-surface-container-lowest p-6 flex flex-col gap-4">
          <div className="text-xs uppercase font-bold tracking-widest text-on-surface-variant border-b border-outline-variant pb-2">
            LIVE LINK PREVIEW
          </div>
          
          <div className="min-h-12 py-3 px-4 bg-surface-container-low border border-outline-variant overflow-x-auto break-all font-bold">
            {generatedLink ? (
              <span className="text-[#008cff]">{generatedLink}</span>
            ) : (
              <span className="text-on-surface-variant/40 italic">
                Enter phone number to generate link...
              </span>
            )}
          </div>

          {/* Interaction Toggles */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
            <button
              onClick={handleCopy}
              disabled={!generatedLink}
              className="w-full py-3.5 border border-outline-variant bg-surface-container-low hover:bg-surface-container hover:border-[#008cff] disabled:opacity-40 disabled:hover:border-outline-variant disabled:hover:bg-surface-container-low text-xs font-bold uppercase tracking-wider transition-all"
            >
              {copySuccess ? '[ LINK COPIED ]' : '[ COPY GENERATED LINK ]'}
            </button>
            <button
              onClick={handleTest}
              disabled={!generatedLink}
              className="w-full py-3.5 bg-[#008cff] text-white hover:bg-[#0070cc] disabled:opacity-40 disabled:hover:bg-[#008cff] text-xs font-bold uppercase tracking-wider transition-all"
            >
              [ TEST DIRECT COMMUNICATION LINK ]
            </button>
          </div>
        </div>
        
      </main>
    </div>
  );
}
