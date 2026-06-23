import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Globe, FileText, Copy, Plus, Download, Check, Trash2, Library } from 'lucide-react';
// import { Cite } from 'citation-js'; // Removed due to frequent Vite/Webpack Node polyfill issues. Using native formatter.

type SourceType = 'website' | 'book' | 'journal';

interface CitationData {
  id: string;
  type: SourceType;
  firstName: string;
  lastName: string;
  title: string;
  url?: string;
  publisher?: string;
  year?: string;
  month?: string;
  day?: string;
  journal?: string;
  volume?: string;
  issue?: string;
  pages?: string;
}

interface FormattedCitation {
  id: string;
  mla: string;
  apa: string;
  chicago: string;
}

export default function CitationStudioTool({ onBack }: { onBack?: () => void }) {
  const [activeTab, setActiveTab] = useState<SourceType>('website');
  const [queue, setQueue] = useState<FormattedCitation[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [publisher, setPublisher] = useState('');
  const [year, setYear] = useState('');
  const [month, setMonth] = useState('');
  const [day, setDay] = useState('');
  const [journal, setJournal] = useState('');
  const [volume, setVolume] = useState('');
  const [issue, setIssue] = useState('');
  const [pages, setPages] = useState('');

  // Auto-generated formats
  const [mla, setMla] = useState('');
  const [apa, setApa] = useState('');
  const [chicago, setChicago] = useState('');

  // Lightning-fast native formatting engine
  useEffect(() => {
    generateCitations();
  }, [activeTab, firstName, lastName, title, url, publisher, year, month, day, journal, volume, issue, pages]);

  const generateCitations = () => {
    let m = '', a = '', c = '';

    const authorFormatMLA = lastName ? `${lastName}${firstName ? `, ${firstName}` : ''}.` : '';
    const authorFormatAPA = lastName ? `${lastName}${firstName ? `, ${firstName.charAt(0)}.` : ''}` : '';
    const authorFormatChicago = lastName ? `${lastName}${firstName ? `, ${firstName}` : ''}.` : '';
    
    const dateFormatted = year ? ` ${year}.` : ' n.d.';
    const dateAPA = year ? ` (${year}).` : ' (n.d.).';

    if (activeTab === 'website') {
      m = `${authorFormatMLA} "${title || 'Untitled'}." ${publisher ? `*${publisher}*, ` : ''}${url ? `${url}.` : ''} Accessed ${day} ${month} ${year}.`;
      a = `${authorFormatAPA}${dateAPA} ${title || 'Untitled'}. ${publisher ? `${publisher}. ` : ''}${url ? `Retrieved from ${url}` : ''}`;
      c = `${authorFormatChicago} "${title || 'Untitled'}." ${publisher ? `${publisher}. ` : ''}${year ? `Last modified ${month} ${day}, ${year}. ` : ''}${url ? `${url}.` : ''}`;
    } 
    else if (activeTab === 'book') {
      m = `${authorFormatMLA} *${title || 'Untitled'}*. ${publisher ? `${publisher}, ` : ''}${year ? `${year}.` : ''}`;
      a = `${authorFormatAPA}${dateAPA} *${title || 'Untitled'}*. ${publisher ? `${publisher}.` : ''}`;
      c = `${authorFormatChicago} *${title || 'Untitled'}*. ${publisher ? `${publisher}, ` : ''}${year ? `${year}.` : ''}`;
    }
    else if (activeTab === 'journal') {
      m = `${authorFormatMLA} "${title || 'Untitled'}." *${journal || 'Journal Name'}*, vol. ${volume || '1'}, no. ${issue || '1'}, ${year ? `${year}, ` : ''}pp. ${pages || '1-2'}.`;
      a = `${authorFormatAPA}${dateAPA} ${title || 'Untitled'}. *${journal || 'Journal Name'}*, ${volume || '1'}(${issue || '1'}), ${pages || '1-2'}.`;
      c = `${authorFormatChicago} "${title || 'Untitled'}." *${journal || 'Journal Name'}* ${volume || '1'}, no. ${issue || '1'} (${year ? `${year}` : 'n.d.'}): ${pages || '1-2'}.`;
    }

    // Clean up empty italics/quotes
    setMla(m.replace(/\s+/g, ' ').trim());
    setApa(a.replace(/\s+/g, ' ').trim());
    setChicago(c.replace(/\s+/g, ' ').trim());
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const addToQueue = () => {
    if (!title && !lastName) return;
    const newCitation: FormattedCitation = {
      id: Date.now().toString(),
      mla,
      apa,
      chicago
    };
    setQueue(prev => [...prev, newCitation]);
    
    // Clear form
    setFirstName(''); setLastName(''); setTitle(''); setUrl(''); setPublisher(''); 
    setYear(''); setMonth(''); setDay(''); setJournal(''); setVolume(''); setIssue(''); setPages('');
  };

  const removeFromQueue = (id: string) => {
    setQueue(prev => prev.filter(c => c.id !== id));
  };

  const downloadBibliography = () => {
    if (queue.length === 0) return;
    
    let content = "Works Cited (MLA)\n\n";
    queue.forEach(c => content += c.mla.replace(/\*/g, '') + "\n\n");
    
    content += "References (APA)\n\n";
    queue.forEach(c => content += c.apa.replace(/\*/g, '') + "\n\n");
    
    content += "Bibliography (Chicago)\n\n";
    queue.forEach(c => content += c.chicago.replace(/\*/g, '') + "\n\n");

    const blob = new Blob([content], { type: 'text/plain' });
    const blobUrl = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = `Bibliography_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(blobUrl);
  };

  return (
    <div className="flex-grow w-full max-w-7xl mx-auto px-6 py-8 flex flex-col relative z-10 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
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
            <Library className="w-6 h-6 text-[#008cff]" />
            Citation Studio
          </h1>
          <p className="text-sm text-on-surface-variant mt-0.5">Generate perfect citations instantly. 100% local, no ads, no paywalls.</p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Column: Generator Form */}
        <div className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* Tabs */}
          <div className="flex bg-surface-container-low border border-outline-variant rounded-2xl p-2 shadow-sm overflow-x-auto scrollbar-none">
            {[
              { id: 'website', icon: Globe, label: 'Website' },
              { id: 'book', icon: BookOpen, label: 'Book' },
              { id: 'journal', icon: FileText, label: 'Journal' }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as SourceType)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all ${
                    isActive 
                      ? 'bg-surface border border-outline-variant shadow-sm text-[#008cff]' 
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Form */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">Author First Name</label>
                <input 
                  type="text" value={firstName} onChange={e => setFirstName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                  placeholder="e.g. John"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">Author Last Name</label>
                <input 
                  type="text" value={lastName} onChange={e => setLastName(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                  placeholder="e.g. Doe"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-on-surface-variant mb-2">{activeTab === 'journal' ? 'Article Title' : 'Title'}</label>
                <input 
                  type="text" value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                  placeholder={`e.g. The History of ${activeTab === 'website' ? 'the Internet' : 'Time'}`}
                />
              </div>

              {activeTab === 'website' && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-on-surface-variant mb-2">URL</label>
                  <input 
                    type="text" value={url} onChange={e => setUrl(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                    placeholder="https://..."
                  />
                </div>
              )}

              {(activeTab === 'website' || activeTab === 'book') && (
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2">Publisher / Website Name</label>
                  <input 
                    type="text" value={publisher} onChange={e => setPublisher(e.target.value)}
                    className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                    placeholder="e.g. Penguin Books"
                  />
                </div>
              )}

              {activeTab === 'journal' && (
                <>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-2">Journal Name</label>
                    <input 
                      type="text" value={journal} onChange={e => setJournal(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                      placeholder="e.g. Nature"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-sm font-bold text-on-surface-variant mb-2">Vol</label>
                      <input 
                        type="text" value={volume} onChange={e => setVolume(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-on-surface-variant mb-2">Issue</label>
                      <input 
                        type="text" value={issue} onChange={e => setIssue(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-on-surface-variant mb-2">Pages</label>
                      <input 
                        type="text" value={pages} onChange={e => setPages(e.target.value)}
                        className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-bold text-on-surface-variant mb-2">Year</label>
                <input 
                  type="text" value={year} onChange={e => setYear(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                  placeholder="2023"
                />
              </div>

              {activeTab === 'website' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-2">Month</label>
                    <input 
                      type="text" value={month} onChange={e => setMonth(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                      placeholder="e.g. Jan"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-2">Day</label>
                    <input 
                      type="text" value={day} onChange={e => setDay(e.target.value)}
                      className="w-full bg-surface-container border border-outline-variant rounded-lg px-4 py-2.5 text-on-surface focus:outline-none focus:ring-2 focus:ring-[#008cff]"
                      placeholder="15"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Outputs */}
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl p-6 shadow-sm flex flex-col gap-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-on-surface">Live Preview</h2>
              <button 
                onClick={addToQueue}
                disabled={!title && !lastName}
                className="flex items-center gap-2 bg-[#008cff] text-white hover:bg-[#0070cc] disabled:bg-surface-container-highest disabled:text-on-surface-variant px-4 py-2 rounded-lg text-sm font-bold transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add to Bibliography
              </button>
            </div>

            {[
              { id: 'mla', label: 'MLA 9', text: mla },
              { id: 'apa', label: 'APA 7', text: apa },
              { id: 'chicago', label: 'Chicago', text: chicago }
            ].map(format => (
              <div key={format.id} className="relative group">
                <div className="absolute -top-2 left-4 bg-surface-container-low px-2 text-xs font-bold text-on-surface-variant uppercase tracking-wider">
                  {format.label}
                </div>
                <div className="bg-surface-container border border-outline-variant rounded-xl p-4 pt-5 pr-12 min-h-[80px] flex items-center">
                  {/* Parse markdown italics for preview */}
                  <p className="text-on-surface font-serif text-[15px] leading-relaxed" 
                     dangerouslySetInnerHTML={{__html: format.text.replace(/\*(.*?)\*/g, '<em>$1</em>')}} />
                </div>
                <button 
                  onClick={() => handleCopy(format.text.replace(/\*/g, ''), `preview-${format.id}`)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 text-on-surface-variant hover:text-[#008cff] bg-surface-container hover:bg-[#008cff]/10 rounded-lg transition-colors border border-outline-variant hover:border-[#008cff]/30 shadow-sm"
                  title="Copy Citation"
                >
                  {copiedId === `preview-${format.id}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>

        </div>

        {/* Right Column: Bibliography Queue */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6 sticky top-6">
          <div className="bg-surface-container-low border border-outline-variant rounded-2xl overflow-hidden shadow-sm flex flex-col min-h-[500px] max-h-[calc(100vh-100px)]">
            <div className="h-16 border-b border-outline-variant bg-surface-container-lowest flex items-center px-5 justify-between shrink-0">
              <div className="flex items-center gap-2 font-bold text-on-surface">
                <Library className="w-5 h-5 text-[#008cff]" />
                Your Bibliography
              </div>
              <div className="bg-[#008cff]/10 text-[#008cff] text-xs font-bold px-2.5 py-1 rounded-full">
                {queue.length} Sources
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-outline-variant scrollbar-track-transparent">
              {queue.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-on-surface-variant opacity-60">
                  <BookOpen className="w-12 h-12 mb-4 opacity-50" />
                  <p className="font-medium mb-1">Bibliography is empty</p>
                  <p className="text-xs">Add citations from the generator to build your works cited list.</p>
                </div>
              ) : (
                queue.map((item, idx) => (
                  <div key={item.id} className="bg-surface-container border border-outline-variant rounded-xl p-4 relative group">
                    <span className="text-xs font-bold text-on-surface-variant mb-2 block uppercase tracking-wider">Source {idx + 1}</span>
                    <p className="text-sm text-on-surface font-serif mb-4" dangerouslySetInnerHTML={{__html: item.mla.replace(/\*(.*?)\*/g, '<em>$1</em>')}} />
                    
                    <div className="flex items-center gap-2 border-t border-outline-variant pt-3 mt-3">
                      <button 
                        onClick={() => handleCopy(item.mla.replace(/\*/g, ''), `q-mla-${item.id}`)}
                        className="text-xs font-medium text-on-surface-variant hover:text-[#008cff] transition-colors"
                      >
                        {copiedId === `q-mla-${item.id}` ? 'Copied MLA!' : 'Copy MLA'}
                      </button>
                      <span className="text-outline-variant">•</span>
                      <button 
                        onClick={() => handleCopy(item.apa.replace(/\*/g, ''), `q-apa-${item.id}`)}
                        className="text-xs font-medium text-on-surface-variant hover:text-[#008cff] transition-colors"
                      >
                        {copiedId === `q-apa-${item.id}` ? 'Copied APA!' : 'Copy APA'}
                      </button>
                    </div>

                    <button 
                      onClick={() => removeFromQueue(item.id)}
                      className="absolute top-3 right-3 p-1.5 text-on-surface-variant hover:text-red-500 bg-surface hover:bg-red-500/10 rounded-lg transition-colors border border-outline-variant hover:border-red-500/30 opacity-0 group-hover:opacity-100"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-outline-variant bg-surface-container-lowest shrink-0">
              <button 
                onClick={downloadBibliography}
                disabled={queue.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-surface hover:bg-surface-container-highest border border-outline-variant disabled:opacity-50 text-on-surface font-medium px-4 py-3 rounded-xl transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                Download Bibliography (.txt)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
