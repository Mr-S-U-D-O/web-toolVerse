import fs from 'fs';
import path from 'path';

const tools = [
  { 
    id: 'dev-json-formatter', component: 'DevJsonFormatterTool', name: 'JSON Formatter', cat: 'Developer Tools', icon: 'FileJson2',
    desc: 'Format and beautify JSON files',
    imports: `import * as prettier from 'prettier/standalone';\nimport * as prettierPluginBabel from 'prettier/plugins/babel';\nimport * as prettierPluginEstree from 'prettier/plugins/estree';`,
    logic: `  const [code, setCode] = useState<string>('');
  const [formattedCode, setFormattedCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const formatCode = async () => {
    try {
      setError('');
      const formatted = await prettier.format(code, {
        parser: 'json',
        plugins: [prettierPluginBabel, prettierPluginEstree],
      });
      setFormattedCode(formatted);
    } catch (err: any) {
      setError(err.message || 'Error parsing JSON');
    }
  };`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input JSON</span>
                {code && <button onClick={() => setCode('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-96 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-y" placeholder="{ \\"key\\": \\"value\\" }"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Formatted JSON</span>
                {formattedCode && <button onClick={() => navigator.clipboard.writeText(formattedCode)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={formattedCode} readOnly className="w-full h-96 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-y whitespace-pre" placeholder="Formatted output"/>
            </div>
          </div>
          {error && <div className="w-full bg-error/10 text-error font-mono text-sm p-4 rounded-xl border border-error/50 mb-6">{error}</div>}
          <button onClick={formatCode} disabled={!code} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-medium rounded-xl px-6 py-3">Format JSON</button>`
  },
  { 
    id: 'dev-yaml-formatter', component: 'DevYamlFormatterTool', name: 'YAML Formatter', cat: 'Developer Tools', icon: 'FileText',
    desc: 'Format and beautify YAML configurations',
    imports: `import * as prettier from 'prettier/standalone';\nimport * as prettierPluginYaml from 'prettier/plugins/yaml';`,
    logic: `  const [code, setCode] = useState<string>('');
  const [formattedCode, setFormattedCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const formatCode = async () => {
    try {
      setError('');
      const formatted = await prettier.format(code, {
        parser: 'yaml',
        plugins: [prettierPluginYaml],
      });
      setFormattedCode(formatted);
    } catch (err: any) {
      setError(err.message || 'Error parsing YAML');
    }
  };`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input YAML</span>
                {code && <button onClick={() => setCode('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-96 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-y" placeholder="key: value"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Formatted YAML</span>
                {formattedCode && <button onClick={() => navigator.clipboard.writeText(formattedCode)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={formattedCode} readOnly className="w-full h-96 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-y whitespace-pre" placeholder="Formatted output"/>
            </div>
          </div>
          {error && <div className="w-full bg-error/10 text-error font-mono text-sm p-4 rounded-xl border border-error/50 mb-6">{error}</div>}
          <button onClick={formatCode} disabled={!code} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-medium rounded-xl px-6 py-3">Format YAML</button>`
  },
  { 
    id: 'dev-graphql-formatter', component: 'DevGraphqlFormatterTool', name: 'GraphQL Formatter', cat: 'Developer Tools', icon: 'Database',
    desc: 'Format and beautify GraphQL queries and schemas',
    imports: `import * as prettier from 'prettier/standalone';\nimport * as prettierPluginGraphql from 'prettier/plugins/graphql';`,
    logic: `  const [code, setCode] = useState<string>('');
  const [formattedCode, setFormattedCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const formatCode = async () => {
    try {
      setError('');
      const formatted = await prettier.format(code, {
        parser: 'graphql',
        plugins: [prettierPluginGraphql],
      });
      setFormattedCode(formatted);
    } catch (err: any) {
      setError(err.message || 'Error parsing GraphQL');
    }
  };`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input GraphQL</span>
                {code && <button onClick={() => setCode('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-96 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-y" placeholder="query { ... }"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Formatted GraphQL</span>
                {formattedCode && <button onClick={() => navigator.clipboard.writeText(formattedCode)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={formattedCode} readOnly className="w-full h-96 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-y whitespace-pre" placeholder="Formatted output"/>
            </div>
          </div>
          {error && <div className="w-full bg-error/10 text-error font-mono text-sm p-4 rounded-xl border border-error/50 mb-6">{error}</div>}
          <button onClick={formatCode} disabled={!code} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-medium rounded-xl px-6 py-3">Format GraphQL</button>`
  },
  { 
    id: 'dev-typescript-formatter', component: 'DevTypescriptFormatterTool', name: 'TypeScript Formatter', cat: 'Developer Tools', icon: 'FileCode2',
    desc: 'Format and beautify TypeScript code',
    imports: `import * as prettier from 'prettier/standalone';\nimport * as prettierPluginTypescript from 'prettier/plugins/typescript';\nimport * as prettierPluginEstree from 'prettier/plugins/estree';`,
    logic: `  const [code, setCode] = useState<string>('');
  const [formattedCode, setFormattedCode] = useState<string>('');
  const [error, setError] = useState<string>('');

  const formatCode = async () => {
    try {
      setError('');
      const formatted = await prettier.format(code, {
        parser: 'typescript',
        plugins: [prettierPluginTypescript, prettierPluginEstree],
      });
      setFormattedCode(formatted);
    } catch (err: any) {
      setError(err.message || 'Error parsing TypeScript');
    }
  };`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input TypeScript</span>
                {code && <button onClick={() => setCode('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-96 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-y" placeholder="interface Any { ... }"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Formatted TypeScript</span>
                {formattedCode && <button onClick={() => navigator.clipboard.writeText(formattedCode)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={formattedCode} readOnly className="w-full h-96 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm resize-y whitespace-pre" placeholder="Formatted output"/>
            </div>
          </div>
          {error && <div className="w-full bg-error/10 text-error font-mono text-sm p-4 rounded-xl border border-error/50 mb-6">{error}</div>}
          <button onClick={formatCode} disabled={!code} className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-on-primary font-medium rounded-xl px-6 py-3">Format TypeScript</button>`
  },
  { 
    id: 'text-hex-generator', component: 'TextHexGeneratorTool', name: 'Hex Generator', cat: 'Text Tools', icon: 'Binary',
    desc: 'Convert any text into exact Hexadecimal representation',
    imports: ``,
    logic: `  const [text, setText] = useState<string>('');
  const hex = text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Text</span>
                {text && <button onClick={() => setText('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Enter text..."/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Hex Result</span>
                {hex && <button onClick={() => navigator.clipboard.writeText(hex)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={hex} readOnly className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Hex string..."/>
            </div>
          </div>`
  },
  { 
    id: 'text-binary-generator', component: 'TextBinaryGeneratorTool', name: 'Binary Generator', cat: 'Text Tools', icon: 'Binary',
    desc: 'Convert any text into exact Binary representation',
    imports: ``,
    logic: `  const [text, setText] = useState<string>('');
  const bin = text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Text</span>
                {text && <button onClick={() => setText('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Enter text..."/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Binary Result</span>
                {bin && <button onClick={() => navigator.clipboard.writeText(bin)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={bin} readOnly className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="0110..."/>
            </div>
          </div>`
  },
  { 
    id: 'text-octal-generator', component: 'TextOctalGeneratorTool', name: 'Octal Generator', cat: 'Text Tools', icon: 'Binary',
    desc: 'Convert any text into exact Octal representation',
    imports: ``,
    logic: `  const [text, setText] = useState<string>('');
  const oct = text.split('').map(c => c.charCodeAt(0).toString(8).padStart(3, '0')).join(' ');`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Text</span>
                {text && <button onClick={() => setText('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Enter text..."/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Octal Result</span>
                {oct && <button onClick={() => navigator.clipboard.writeText(oct)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={oct} readOnly className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="141 142..."/>
            </div>
          </div>`
  },
  { 
    id: 'text-decimal-generator', component: 'TextDecimalGeneratorTool', name: 'Decimal Generator', cat: 'Text Tools', icon: 'Binary',
    desc: 'Convert any text into ASCII Decimal numbers',
    imports: ``,
    logic: `  const [text, setText] = useState<string>('');
  const dec = text.split('').map(c => c.charCodeAt(0).toString(10)).join(' ');`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Text</span>
                {text && <button onClick={() => setText('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Enter text..."/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Decimal Result</span>
                {dec && <button onClick={() => navigator.clipboard.writeText(dec)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={dec} readOnly className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="97 98..."/>
            </div>
          </div>`
  },
  { 
    id: 'text-ascii-generator', component: 'TextAsciiGeneratorTool', name: 'Ascii Extractor', cat: 'Text Tools', icon: 'Type',
    desc: 'Extract only valid ASCII characters from any text string',
    imports: ``,
    logic: `  const [text, setText] = useState<string>('');
  const ascii = text.replace(/[^\\x00-\\x7F]/g, '');`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Text (Mixed Encodings)</span>
                {text && <button onClick={() => setText('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Paste dirty text or unicode..."/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Safe ASCII Result</span>
                {ascii && <button onClick={() => navigator.clipboard.writeText(ascii)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={ascii} readOnly className="w-full h-64 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Only ASCII allowed..."/>
            </div>
          </div>`
  },
  { 
    id: 'text-word-merger', component: 'TextWordMergerTool', name: 'Word Merger', cat: 'Text Tools', icon: 'Combine',
    desc: 'Join unstructured word lists or paragraphs with a delimiter',
    imports: ``,
    logic: `  const [text, setText] = useState<string>('');
  const [delimiter, setDelimiter] = useState<string>(', ');
  
  const d = delimiter === '\\\\n' ? '\\n' : delimiter === '\\\\t' ? '\\t' : delimiter;
  const words = text.split(/[\\n\\s]+/).filter(Boolean);
  const result = words.join(d);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input List/Words</span>
                {text && <button onClick={() => setText('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full border border-outline h-[350px] bg-surface-container-highest text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Enter words on new lines or space separated..."/>
            </div>
            <div className="flex flex-col gap-4">
               <div>
                  <label className="text-sm font-medium text-on-surface">Merge Delimiter</label>
                  <input type="text" value={delimiter} onChange={(e) => setDelimiter(e.target.value)} className="w-full mt-2 bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" placeholder="e.g. , or -"/>
               </div>
               <div className="flex flex-col gap-2 flex-grow">
                  <label className="text-sm font-medium text-on-surface flex justify-between">
                    <span>Merged Result</span>
                    {result && <button onClick={() => navigator.clipboard.writeText(result)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
                  </label>
                  <textarea value={result} readOnly className="w-full flex-grow bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Result will appear here..."/>
               </div>
            </div>
          </div>`
  },
  { 
    id: 'text-word-extractor', component: 'TextWordExtractorTool', name: 'Word Extractor', cat: 'Text Tools', icon: 'Search',
    desc: 'Automatically extract all alphanumeric words from text into a list',
    imports: ``,
    logic: `  const [text, setText] = useState<string>('');
  const words = text.match(/[A-Za-z0-9]+/g) || [];
  const result = words.join('\\n');`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Original Text</span>
                {text && <button onClick={() => setText('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-80 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Paste paragraphs, code or anything with punctuation."/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Extracted Words ({words.length})</span>
                {result && <button onClick={() => navigator.clipboard.writeText(result)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={result} readOnly className="w-full h-80 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Words will appear here..."/>
            </div>
          </div>`
  },
  { 
    id: 'text-base64-encoder', component: 'TextBase64EncoderTool', name: 'Base64 Encoder', cat: 'Text Tools', icon: 'Lock',
    desc: 'Encode any string or raw text into Base64 format securely',
    imports: ``,
    logic: `  const [text, setText] = useState<string>('');
  const [b64, setB64] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  React.useEffect(() => {
    try {
      setError('');
      setB64(btoa(text));
    } catch(e) {
      setError('Cannot encode special characters directly. Use URL encoder first.');
      setB64('');
    }
  }, [text]);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Raw Text</span>
                {text && <button onClick={() => setText('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-80 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Type here to encode"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Base64 Formatted</span>
                {b64 && <button onClick={() => navigator.clipboard.writeText(b64)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={b64} readOnly className="w-full h-80 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm break-all" placeholder="Encoded string..."/>
              {error && <span className="text-xs text-error mt-1">{error}</span>}
            </div>
          </div>`
  },
  { 
    id: 'text-base64-decoder', component: 'TextBase64DecoderTool', name: 'Base64 Decoder', cat: 'Text Tools', icon: 'Unlock',
    desc: 'Decode any valid Base64 string back to readable text',
    imports: ``,
    logic: `  const [b64, setB64] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [error, setError] = useState<string>('');
  
  React.useEffect(() => {
    if(!b64) { setText(''); setError(''); return; }
    try {
      setError('');
      setText(atob(b64));
    } catch(e) {
      setError('Invalid base64 string provided.');
      setText('');
    }
  }, [b64]);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Base64 Raw String</span>
                {b64 && <button onClick={() => setB64('')} className="text-error hover:text-error/80 text-xs">Clear</button>}
              </label>
              <textarea value={b64} onChange={(e) => setB64(e.target.value)} className="w-full h-80 bg-surface-container-highest border border-outline text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm break-all" placeholder="Paste Base64 here"/>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Decoded Output</span>
                {text && <button onClick={() => navigator.clipboard.writeText(text)} className="text-primary hover:text-primary/80 text-xs">Copy</button>}
              </label>
              <textarea value={text} readOnly className="w-full h-80 bg-surface-container-highest text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono resize-y text-sm" placeholder="Readable text..."/>
              {error && <span className="text-xs text-error mt-1">{error}</span>}
            </div>
          </div>`
  },
  { 
    id: 'fin-savings-calculator', component: 'FinSavingsCalculatorTool', name: 'Savings Calculator', cat: 'Finance Tools', icon: 'PiggyBank',
    desc: 'Calculate future compound interest and savings growth',
    imports: ``,
    logic: `  const [principal, setPrincipal] = useState<string>('1000');
  const [rate, setRate] = useState<string>('5');
  const [years, setYears] = useState<string>('10');
  const [compounding, setCompounding] = useState<number>(12); // monthly
  
  const p = parseFloat(principal) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  const y = parseFloat(years) || 0;
  
  const futureValue = p * Math.pow(1 + r / compounding, compounding * y);
  const earned = futureValue - p;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Initial Principal ($)</label>
                <input type="number" value={principal} onChange={(e) => setPrincipal(e.target.value)} className="w-full bg-surface-container-high border border-outline text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Annual Interest Rate (%)</label>
                <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-surface-container-high border border-outline text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Years to Grow</label>
                <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full bg-surface-container-high border border-outline text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Compounding Frequency</label>
                <select value={compounding} onChange={(e) => setCompounding(Number(e.target.value))} className="w-full bg-surface-container-high border border-outline text-on-surface rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm leading-6">
                  <option value={1}>Annually</option>
                  <option value={2}>Bi-annually</option>
                  <option value={4}>Quarterly</option>
                  <option value={12}>Monthly</option>
                  <option value={365}>Daily</option>
                </select>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Total Future Value</div>
                <div className="text-4xl font-bold font-mono text-emerald-500 break-all max-w-full">\$\${futureValue.toFixed(2)}</div>
              </div>
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Total Interest Earned</div>
                <div className="text-3xl font-bold font-mono text-emerald-500/80 break-all max-w-full">+\$\${earned.toFixed(2)}</div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-investment-calculator', component: 'FinInvestmentCalculatorTool', name: 'Investment Calculator', cat: 'Finance Tools', icon: 'TrendingUp',
    desc: 'Calculate Return on Investment (ROI) factoring initial and final values',
    imports: ``,
    logic: `  const [initial, setInitial] = useState<string>('5000');
  const [current, setCurrent] = useState<string>('6500');
  
  const i = parseFloat(initial) || 0;
  const c = parseFloat(current) || 0;
  
  const profit = c - i;
  const roi = i > 0 ? (profit / i) * 100 : 0;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Initial Investment ($)</label>
                <input type="number" value={initial} onChange={(e) => setInitial(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Current/Final Value ($)</label>
                <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Return on Investment (ROI)</div>
                <div className={\`text-4xl font-bold font-mono break-all max-w-full \${roi >= 0 ? 'text-emerald-500' : 'text-error'}\`}>
                  {roi.toFixed(2)}%
                </div>
              </div>
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Net Profit / Loss</div>
                <div className={\`text-3xl font-bold font-mono break-all max-w-full \${profit >= 0 ? 'text-emerald-500/80' : 'text-error/80'}\`}>
                  {profit >= 0 ? '+' : ''}\$\${profit.toFixed(2)}
                </div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-roe-calculator', component: 'FinRoeCalculatorTool', name: 'ROE Calculator', cat: 'Finance Tools', icon: 'BarChart',
    desc: 'Return on Equity Calculator: Net Income divided by Shareholder Equity',
    imports: ``,
    logic: `  const [income, setIncome] = useState<string>('50000');
  const [equity, setEquity] = useState<string>('200000');
  
  const netIncome = parseFloat(income) || 0;
  const shareholderEquity = parseFloat(equity) || 0;
  
  const roe = shareholderEquity > 0 ? (netIncome / shareholderEquity) * 100 : 0;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Net Income ($)</label>
                <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Shareholder's Equity ($)</label>
                <input type="number" value={equity} onChange={(e) => setEquity(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex items-center justify-center h-full flex-col">
                <div className="text-sm text-on-surface-variant mb-2">Return on Equity (ROE)</div>
                <div className="text-5xl font-bold font-mono text-primary break-all max-w-full">
                  {roe.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-roa-calculator', component: 'FinRoaCalculatorTool', name: 'ROA Calculator', cat: 'Finance Tools', icon: 'BarChart2',
    desc: 'Return on Assets Calculator: Net Income divided by Total Assets',
    imports: ``,
    logic: `  const [income, setIncome] = useState<string>('50000');
  const [assets, setAssets] = useState<string>('400000');
  
  const netIncome = parseFloat(income) || 0;
  const totalAssets = parseFloat(assets) || 0;
  
  const roa = totalAssets > 0 ? (netIncome / totalAssets) * 100 : 0;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Net Income ($)</label>
                <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Total Assets ($)</label>
                <input type="number" value={assets} onChange={(e) => setAssets(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex items-center justify-center h-full flex-col">
                <div className="text-sm text-on-surface-variant mb-2">Return on Assets (ROA)</div>
                <div className="text-5xl font-bold font-mono text-primary break-all max-w-full">
                  {roa.toFixed(2)}%
                </div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-ebitda-calculator', component: 'FinEbitdaCalculatorTool', name: 'EBITDA Calculator', cat: 'Finance Tools', icon: 'Calculator',
    desc: 'Sum up Net Income, Interest, Taxes, Depreciation & Amortization',
    imports: ``,
    logic: `  const [netIncome, setNetIncome] = useState<string>('150000');
  const [interest, setInterest] = useState<string>('10000');
  const [taxes, setTaxes] = useState<string>('30000');
  const [da, setDa] = useState<string>('20000');
  
  const ebitda = (parseFloat(netIncome) || 0) + (parseFloat(interest) || 0) + (parseFloat(taxes) || 0) + (parseFloat(da) || 0);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface">Net Income ($)</label>
                <input type="number" value={netIncome} onChange={(e) => setNetIncome(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary font-mono text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface">Interest Expense ($)</label>
                <input type="number" value={interest} onChange={(e) => setInterest(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary font-mono text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface">Taxes ($)</label>
                <input type="number" value={taxes} onChange={(e) => setTaxes(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary font-mono text-sm" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-on-surface">Depreciation & Amortization ($)</label>
                <input type="number" value={da} onChange={(e) => setDa(e.target.value)} className="w-full bg-surface-container-high  border border-outline text-on-surface px-3 py-2 rounded-lg focus:ring-1 focus:ring-primary font-mono text-sm" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex items-center justify-center h-full flex-col text-center">
                <div className="text-sm text-on-surface-variant mb-2">EBITDA</div>
                <div className="text-5xl font-bold font-mono text-emerald-500 break-all max-w-full">
                  \$\${ebitda.toLocaleString()}
                </div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-revenue-calculator', component: 'FinRevenueCalculatorTool', name: 'Revenue Calculator', cat: 'Finance Tools', icon: 'DollarSign',
    desc: 'Calculate Total Revenue from Units Sold and Price Per Unit',
    imports: ``,
    logic: `  const [price, setPrice] = useState<string>('99.99');
  const [units, setUnits] = useState<string>('150');
  
  const p = parseFloat(price) || 0;
  const u = parseFloat(units) || 0;
  const revenue = p * u;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Price Per Unit ($)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Units Sold</label>
                <input type="number" value={units} onChange={(e) => setUnits(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex items-center justify-center h-full flex-col">
                <div className="text-sm text-on-surface-variant mb-2">Total Generated Revenue</div>
                <div className="text-5xl font-bold font-mono text-primary break-all max-w-full">
                  \$\${revenue.toFixed(2)}
                </div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-margin-calculator', component: 'FinMarginCalculatorTool', name: 'Margin Calculator', cat: 'Finance Tools', icon: 'Percent',
    desc: 'Calculate gross margin percentage from revenue and cost of goods',
    imports: ``,
    logic: `  const [revenue, setRevenue] = useState<string>('10000');
  const [cogs, setCogs] = useState<string>('4000');
  
  const r = parseFloat(revenue) || 0;
  const c = parseFloat(cogs) || 0;
  
  const grossProfit = r - c;
  const grossMargin = r > 0 ? (grossProfit / r) * 100 : 0;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Total Revenue ($)</label>
                <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Cost of Goods Sold - COGS ($)</label>
                <input type="number" value={cogs} onChange={(e) => setCogs(e.target.value)} className="w-full bg-surface-container-high text-on-surface border border-outline rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex items-center justify-center flex-col text-center">
                <div className="text-sm text-emerald-500/80 mb-2">Gross Profit</div>
                <div className="text-3xl font-bold font-mono text-emerald-500 break-all">\$\${grossProfit.toFixed(2)}</div>
              </div>
              <div className="bg-surface-container-high border border-outline p-6 rounded-xl flex items-center justify-center flex-col text-center">
                <div className="text-sm text-on-surface-variant mb-2">Gross Margin</div>
                <div className="text-3xl font-bold font-mono text-on-surface break-all">{grossMargin.toFixed(2)}%</div>
              </div>
            </div>
          </div>`
  }
];

const TEMPLATE = `import React, { useState } from 'react';
import { ArrowLeft, ${'${icon}'} } from 'lucide-react';
${'${imports}'}

export default function ${'${component}'}({ onBack }: { onBack: () => void }) {
${'${logic}'}

  return (
    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">
      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">
          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">
             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">
        <div className="max-w-4xl w-full mx-auto p-6 md:p-8">
          <div className="flex flex-col items-center justify-center mb-12 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 shadow-sm ring-1 ring-primary/20">
              <${'${icon}'} className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold font-heading text-on-surface mb-4">
              ${'${name}'}
            </h1>
            <p className="text-on-surface-variant max-w-2xl">
              ${'${desc}'}
            </p>
          </div>

          <div className="bg-surface-container rounded-3xl p-6 md:p-8 ring-1 ring-outline-variant">
${'${ui}'}
          </div>
        </div>
      </main>
    </div>
  );
}`;


const appFile = path.join(process.cwd(), 'src/App.tsx');
let appContent = fs.readFileSync(appFile, 'utf8');

const toolsManifestFile = path.join(process.cwd(), 'src/data/toolsManifest.ts');
let toolsManifestStr = fs.readFileSync(toolsManifestFile, 'utf8');

const inactiveToolsFile = path.join(process.cwd(), 'src/data/inactiveTools.ts');
let inactiveStr = fs.readFileSync(inactiveToolsFile, 'utf8');

const generatedRoot = path.join(process.cwd(), 'src/components');

const tIds = [];
let appendImports = '';
let appendCases = '';
let appendManifest = '';

for (const t of tools) {
  const finalCode = TEMPLATE
    .replace(/\$\{component\}/g, t.component)
    .replace(/\$\{icon\}/g, t.icon)
    .replace(/\$\{imports\}/g, t.imports)
    .replace(/\$\{logic\}/g, t.logic)
    .replace(/\$\{name\}/g, t.name)
    .replace(/\$\{desc\}/g, t.desc)
    .replace(/\$\{ui\}/g, t.ui);

  fs.writeFileSync(path.join(generatedRoot, t.component + '.tsx'), finalCode);
  console.log("Created: " + t.component);

  tIds.push(t.id);
  appendImports += "import " + t.component + " from './" + "components/" + t.component + "';\n";
  appendCases += "      case '" + t.id + "': return <" + t.component + " onBack={() => setCurrentView('landing')} />;\n";
  appendManifest += "  { id: '" + t.id + "', name: '" + t.name + "', icon: Download, category: '" + t.cat + "' },\n";
}

// 1. Mod App.tsx
const appImportsRegex = /import TextStringReplacerTool from '\.\/components\/TextStringReplacerTool';/;
appContent = appContent.replace(appImportsRegex, "import TextStringReplacerTool from './components/TextStringReplacerTool';\n" + appendImports);

const appCasesRegex = /case 'text-string-replacer': return <TextStringReplacerTool onBack=\{\(\) => setCurrentView\('landing'\)\} \/>;/;
appContent = appContent.replace(appCasesRegex, "case 'text-string-replacer': return <TextStringReplacerTool onBack={() => setCurrentView('landing')} />;\n" + appendCases);

fs.writeFileSync(appFile, appContent);
console.log("Updated App.tsx");

// 2. Mod InactiveTools + ToolsManifest
const ignoreRegex = /const ignoredIds = new Set\(\[(.*?)\]\);/s;
const match = inactiveStr.match(ignoreRegex);
if(match) {
   let newInner = match[1] + tIds.map(t => "\n    '" + t + "',").join('');
   inactiveStr = inactiveStr.replace(ignoreRegex, "const ignoredIds = new Set([" + newInner + "]);");
   fs.writeFileSync(inactiveToolsFile, inactiveStr);
}

const activeRegex = /(export const ACTIVE_TOOLS: any = \[)([\s\S]*?)(\];)/;
const match2 = toolsManifestStr.match(activeRegex);
if (match2) {
  const newArrayContent = match2[2] + appendManifest;
  toolsManifestStr = toolsManifestStr.replace(activeRegex, "$1" + newArrayContent + "$3");
  fs.writeFileSync(toolsManifestFile, toolsManifestStr);
}

console.log("Updated ToolsManifest");

