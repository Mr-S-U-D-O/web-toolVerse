import React, { useState, useEffect } from 'react';
import { ArrowLeft, Copy, Check, Shield, RefreshCw, Layers } from 'lucide-react';

const PARAGRAPHS = [
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem.",
  "Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
  "At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est, omnis dolor repellendus.",
  "Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.",
  "Aliquam feugiat dolor in lorem pretium, scelerisque congue ex tincidunt. Cras porttitor feugiat magna in imperdiet. Mauris congue arcu pretium lectus lobortis porttitor. Vestibulum vitae purus id tellus tristique congue. Phasellus tristique convallis ex ac accumsan. Quisque eget sollicitudin nisl, sed finibus augue. Duis molestie diam quis ex aliquet, at venenatis lectus iaculis."
];

// Helper to extract sentences
const SENTENCES = PARAGRAPHS.flatMap(p => p.split(/(?<=[.!?])\s+/));

// Helper to extract words
const WORDS = PARAGRAPHS.flatMap(p => p.toLowerCase().replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g,"").split(/\s+/)).filter(w => w.length > 0);

export default function LoremIpsumGeneratorTool({ onBack }: { onBack?: () => void }) {
  const [type, setType] = useState<'paragraphs' | 'sentences' | 'words' | 'lists'>('paragraphs');
  const [count, setCount] = useState(3);
  const [startWithLorem, setStartWithLorem] = useState(true);
  const [listType, setListType] = useState<'bullet' | 'number'>('bullet');
  const [outputText, setOutputText] = useState('');
  const [copied, setCopied] = useState(false);
  const [seed, setSeed] = useState(0);

  const triggerRegenerate = () => {
    setSeed(prev => prev + 1);
  };

  useEffect(() => {
    let generated: string[] = [];

    if (type === 'paragraphs') {
      for (let i = 0; i < count; i++) {
        let p = PARAGRAPHS[i % PARAGRAPHS.length];
        // If first paragraph and should start with Lorem
        if (i === 0 && startWithLorem) {
          if (!p.startsWith("Lorem ipsum")) {
            p = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. " + p;
          }
        }
        generated.push(p);
      }
      setOutputText(generated.join('\n\n'));
    } 
    
    else if (type === 'sentences') {
      let sentencePool = [...SENTENCES];
      if (startWithLorem) {
        generated.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
      }
      for (let i = generated.length; i < count; i++) {
        const randIdx = Math.floor(Math.random() * sentencePool.length);
        generated.push(sentencePool[randIdx]);
      }
      setOutputText(generated.join(' '));
    } 
    
    else if (type === 'words') {
      if (startWithLorem && count >= 8) {
        generated = ["Lorem", "ipsum", "dolor", "sit", "amet,", "consectetur", "adipiscing", "elit."];
      }
      for (let i = generated.length; i < count; i++) {
        const randIdx = Math.floor(Math.random() * WORDS.length);
        let word = WORDS[randIdx];
        if (i === 0) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }
        generated.push(word);
      }
      let joined = generated.join(' ');
      if (!joined.endsWith('.')) {
        joined += '.';
      }
      setOutputText(joined);
    } 
    
    else if (type === 'lists') {
      for (let i = 0; i < count; i++) {
        const randIdx = Math.floor(Math.random() * SENTENCES.length);
        let sentence = SENTENCES[randIdx];
        if (i === 0 && startWithLorem) {
          sentence = "Lorem ipsum dolor sit amet, consectetur adipiscing elit.";
        }
        const bullet = listType === 'bullet' ? '• ' : `${i + 1}. `;
        generated.push(`${bullet}${sentence}`);
      }
      setOutputText(generated.join('\n'));
    }
  }, [type, count, startWithLorem, listType, seed]);

  const handleCopy = async () => {
    if (!outputText) return;
    try {
      await navigator.clipboard.writeText(outputText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text', err);
    }
  };

  return (
    <div className="min-h-screen bg-background text-on-surface w-full pb-20">
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
            <div className="font-sans text-sm font-medium text-on-surface">Lorem Ipsum Generator</div>
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
          <h1 className="font-heading text-3xl font-bold tracking-tight text-[#008cff]">Lorem Ipsum Generator</h1>
          <p className="text-on-surface-variant mt-2 text-sm font-sans max-w-2xl">
            Create professional dummy text for website mockups, layouts, and print tests. Generate words, sentences, lists, or full paragraphs with absolute control.
          </p>
        </div>

        {/* Two-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Configurations (Left) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            
            <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant">
              <h2 className="font-heading font-semibold text-base mb-6 flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#008cff]" />
                Generator Settings
              </h2>
              
              <div className="flex flex-col gap-6">
                
                {/* Generator Type */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-3">
                    What to Generate
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {(['paragraphs', 'sentences', 'words', 'lists'] as const).map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setType(t)}
                        className={`py-2.5 px-3 text-xs font-mono uppercase rounded-lg border transition-colors ${
                          type === t
                            ? 'border-[#008cff] bg-[#008cff]/10 text-white'
                            : 'border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Count */}
                <div>
                  <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                    Quantity ({count})
                  </label>
                  <input
                    type="range"
                    min="1"
                    max={type === 'words' ? '200' : '20'}
                    value={count}
                    onChange={(e) => setCount(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-[#008cff]"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-outline mt-1">
                    <span>1</span>
                    <span>{type === 'words' ? '200' : '20'}</span>
                  </div>
                </div>

                {/* List type sub-options */}
                {type === 'lists' && (
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                      List Prefix Type
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { value: 'bullet', label: 'Bulleted List (•)' },
                        { value: 'number', label: 'Numbered List (1.)' }
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setListType(opt.value as any)}
                          className={`py-2 px-3 text-xs font-mono rounded-lg border transition-colors ${
                            listType === opt.value
                              ? 'border-[#008cff] bg-[#008cff]/10 text-white'
                              : 'border-outline-variant bg-surface-container hover:bg-surface-container-high text-on-surface-variant'
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Toggles and Actions */}
                <div className="border-t border-outline-variant pt-5 flex flex-wrap items-center justify-between gap-4">
                  <label className="flex items-center gap-3 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={startWithLorem}
                      onChange={(e) => setStartWithLorem(e.target.checked)}
                      className="rounded border-outline-variant bg-surface-container text-[#008cff] focus:ring-[#008cff] w-4 h-4"
                    />
                    <span className="text-sm text-on-surface-variant hover:text-on-surface transition-colors">
                      Start with "Lorem ipsum..."
                    </span>
                  </label>

                  <button
                    onClick={triggerRegenerate}
                    className="flex items-center gap-2 bg-surface-container hover:bg-surface-container-high border border-outline-variant px-4 py-2 rounded-xl text-xs font-mono uppercase tracking-wider text-on-surface transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Regenerate
                  </button>
                </div>

              </div>
            </div>

          </div>

          {/* Generated Output (Right) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <div className="bg-surface-container-low p-5 rounded-2xl border border-outline-variant sticky top-[80px]">
              <div className="flex justify-between items-center mb-3">
                <label className="font-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  Mock Text Output
                </label>
                {outputText && (
                  <button
                    onClick={handleCopy}
                    className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs font-mono uppercase tracking-wider transition-all duration-300 ${
                      copied
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-[#008cff] text-white hover:bg-[#0070cc] shadow-sm'
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy Result
                      </>
                    )}
                  </button>
                )}
              </div>
              <textarea
                readOnly
                value={outputText}
                placeholder="Dummy text will load here..."
                className="w-full h-96 bg-surface-container-lowest border border-outline-variant rounded-xl p-4 font-sans text-sm text-on-surface leading-relaxed focus:outline-none resize-none placeholder:text-outline/70"
              />
              <div className="mt-2 flex justify-between text-[11px] font-mono text-on-surface-variant">
                <span>Words: {outputText ? outputText.trim().split(/\s+/).length : 0}</span>
                <span>Length: {outputText.length} chars</span>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
