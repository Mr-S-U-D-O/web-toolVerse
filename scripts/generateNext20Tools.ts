import fs from 'fs';
import path from 'path';

const tools = [
  { 
    id: 'dev-xml-formatter', component: 'DevXmlFormatterTool', name: 'XML Formatter', cat: 'Developer Tools', icon: 'FileCode2',
    desc: 'Format and beautify XML strings.',
    imports: ``,
    logic: `  const [code, setCode] = useState<string>('');
  const [formattedCode, setFormattedCode] = useState<string>('');
  
  const formatCode = () => {
    let formatted = '';
    let pad = 0;
    code.split(/>\\s*</).forEach(function(node) {
      if (node.match(/^\\/\\w/)) pad -= 1;
      let indent = '';
      for (let i = 0; i < pad; i++) indent += '  ';
      formatted += indent + '<' + node + '>\\r\\n';
      if (node.match(/^<?\\w[^>]*[^\\/]$/)) pad += 1;
    });
    setFormattedCode(formatted.substring(1, formatted.length - 3));
  };`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface">Input XML</label>
              <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-96 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary font-mono text-sm resize-y" />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface">Formatted XML</label>
              <textarea value={formattedCode} readOnly className="w-full h-96 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary font-mono text-sm resize-y whitespace-pre" />
            </div>
          </div>
          <button onClick={formatCode} disabled={!code} className="w-full bg-primary hover:bg-primary/90 text-on-primary font-medium rounded-xl px-6 py-3 disabled:opacity-50">Format XML</button>`
  },
  { 
    id: 'fin-leverage-calculator', component: 'FinLeverageCalculatorTool', name: 'Leverage Calculator', cat: 'Finance Tools', icon: 'TrendingUp',
    desc: 'Calculate financial leverage based on debt and equity.',
    imports: ``,
    logic: `  const [debt, setDebt] = useState<string>('50000');
  const [equity, setEquity] = useState<string>('100000');
  
  const d = parseFloat(debt) || 0;
  const e = parseFloat(equity) || 0;
  const leverageRatio = e > 0 ? (d / e) : 0;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Total Debt ($)</label>
                <input type="number" value={debt} onChange={(e) => setDebt(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Total Equity ($)</label>
                <input type="number" value={equity} onChange={(e) => setEquity(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex flex-col items-center justify-center flex-grow text-center">
                <div className="text-sm text-on-surface-variant mb-2">Debt-to-Equity Ratio</div>
                <div className="text-4xl font-bold font-mono text-primary break-all">{leverageRatio.toFixed(2)}</div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-dividend-calculator', component: 'FinDividendCalculatorTool', name: 'Dividend Calculator', cat: 'Finance Tools', icon: 'PieChart',
    desc: 'Calculate estimated annual dividend yield and total payout.',
    imports: ``,
    logic: `  const [shares, setShares] = useState<string>('100');
  const [price, setPrice] = useState<string>('50');
  const [dividend, setDividend] = useState<string>('2.50');
  
  const s = parseFloat(shares) || 0;
  const p = parseFloat(price) || 0;
  const d = parseFloat(dividend) || 0;
  
  const yieldPct = p > 0 ? (d / p) * 100 : 0;
  const totalAnnual = s * d;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Number of Shares</label>
                <input type="number" value={shares} onChange={(e) => setShares(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Share Price ($)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Annual Dividend per Share ($)</label>
                <input type="number" value={dividend} onChange={(e) => setDividend(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex flex-col justify-center items-center">
                <div className="text-sm text-on-surface-variant mb-1">Dividend Yield</div>
                <div className="text-3xl font-bold font-mono text-primary">{yieldPct.toFixed(2)}%</div>
              </div>
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex flex-col justify-center items-center">
                <div className="text-sm text-on-surface-variant mb-1">Total Annual Dividend</div>
                <div className="text-3xl font-bold font-mono text-emerald-500">\${totalAnnual.toFixed(2)}</div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-eps-calculator', component: 'FinEpsCalculatorTool', name: 'EPS Calculator', cat: 'Finance Tools', icon: 'BarChart',
    desc: 'Calculate Earnings Per Share.',
    imports: ``,
    logic: `  const [income, setIncome] = useState<string>('500000');
  const [dividends, setDividends] = useState<string>('50000');
  const [shares, setShares] = useState<string>('100000');
  
  const i = parseFloat(income) || 0;
  const d = parseFloat(dividends) || 0;
  const s = parseFloat(shares) || 0;
  
  const eps = s > 0 ? (i - d) / s : 0;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Net Income ($)</label>
                <input type="number" value={income} onChange={(e) => setIncome(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Preferred Dividends ($)</label>
                <input type="number" value={dividends} onChange={(e) => setDividends(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Outstanding Shares</label>
                <input type="number" value={shares} onChange={(e) => setShares(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 focus:ring-2 focus:ring-primary font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 rounded-xl border border-outline flex flex-col justify-center items-center flex-grow">
                <div className="text-sm text-on-surface-variant mb-1">Earnings Per Share (EPS)</div>
                <div className="text-4xl font-bold font-mono text-emerald-500">\${eps.toFixed(2)}</div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'text-html-encoder', component: 'TextHtmlEncoderTool', name: 'HTML Encoder', cat: 'Text Tools', icon: 'Code',
    desc: 'Encode characters and tags to safe HTML entities.',
    imports: ``,
    logic: `  const [text, setText] = useState<string>('');
  const [encoded, setEncoded] = useState<string>('');
  
  const encodeHtml = () => {
    const el = document.createElement('div');
    el.innerText = text;
    setEncoded(el.innerHTML);
  };
  
  React.useEffect(() => { encodeHtml(); }, [text]);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Text</span>
                {text && <button onClick={() => setText('')} className="text-error text-xs hover:text-error/80">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y focus:ring-2 focus:ring-primary" placeholder="Enter HTML <tags> or text..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Encoded HTML</span>
                {encoded && <button onClick={() => navigator.clipboard.writeText(encoded)} className="text-primary text-xs hover:text-primary/80">Copy</button>}
              </label>
              <textarea value={encoded} readOnly className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y break-all" placeholder="Encoded entities..." />
            </div>
          </div>`
  },
  { 
    id: 'text-html-decoder', component: 'TextHtmlDecoderTool', name: 'HTML Decoder', cat: 'Text Tools', icon: 'Code2',
    desc: 'Decode safe HTML entities back to readable tags/text.',
    imports: ``,
    logic: `  const [text, setText] = useState<string>('');
  const [decoded, setDecoded] = useState<string>('');
  
  const decodeHtml = () => {
    const el = document.createElement('textarea');
    el.innerHTML = text;
    setDecoded(el.value);
  };
  
  React.useEffect(() => { decodeHtml(); }, [text]);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Encoded HTML</span>
                {text && <button onClick={() => setText('')} className="text-error text-xs hover:text-error/80">Clear</button>}
              </label>
              <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y focus:ring-2 focus:ring-primary" placeholder="Paste &lt;tags&gt;..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Decoded Text</span>
                {decoded && <button onClick={() => navigator.clipboard.writeText(decoded)} className="text-primary text-xs hover:text-primary/80">Copy</button>}
              </label>
              <textarea value={decoded} readOnly className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y" placeholder="Decoded output..." />
            </div>
          </div>`
  },
  { 
    id: 'text-hex-decoder', component: 'TextHexDecoderTool', name: 'Hex Decoder', cat: 'Text Tools', icon: 'Binary',
    desc: 'Decode hexadecimal code back to readable characters.',
    imports: ``,
    logic: `  const [hex, setHex] = useState<string>('');
  const [text, setText] = useState<string>('');
  
  React.useEffect(() => {
    try {
      const cleanHex = hex.replace(/\\s+/g, '');
      let str = '';
      for (let i = 0; i < cleanHex.length; i += 2) {
        str += String.fromCharCode(parseInt(cleanHex.substr(i, 2), 16));
      }
      setText(str);
    } catch {
      setText('');
    }
  }, [hex]);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Hexadecimal</span>
                {hex && <button onClick={() => setHex('')} className="text-error text-xs hover:text-error/80">Clear</button>}
              </label>
              <textarea value={hex} onChange={(e) => setHex(e.target.value)} className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y focus:ring-2 focus:ring-primary" placeholder="Paste hex..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Decoded Text</span>
                {text && <button onClick={() => navigator.clipboard.writeText(text)} className="text-primary text-xs hover:text-primary/80">Copy</button>}
              </label>
              <textarea value={text} readOnly className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y" placeholder="Result text..." />
            </div>
          </div>`
  },
  { 
    id: 'text-binary-decoder', component: 'TextBinaryDecoderTool', name: 'Binary Decoder', cat: 'Text Tools', icon: 'Binary',
    desc: 'Decode binary sequences back to text.',
    imports: ``,
    logic: `  const [bin, setBin] = useState<string>('');
  const [text, setText] = useState<string>('');
  
  React.useEffect(() => {
    try {
      const cleanBin = bin.replace(/[^01]/g, '');
      let str = '';
      for (let i = 0; i < cleanBin.length; i += 8) {
        str += String.fromCharCode(parseInt(cleanBin.substr(i, 8), 2));
      }
      setText(str);
    } catch {
      setText('');
    }
  }, [bin]);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Binary</span>
                {bin && <button onClick={() => setBin('')} className="text-error text-xs hover:text-error/80">Clear</button>}
              </label>
              <textarea value={bin} onChange={(e) => setBin(e.target.value)} className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y focus:ring-2 focus:ring-primary" placeholder="011000..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Decoded Text</span>
                {text && <button onClick={() => navigator.clipboard.writeText(text)} className="text-primary text-xs hover:text-primary/80">Copy</button>}
              </label>
              <textarea value={text} readOnly className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y" placeholder="Result text..." />
            </div>
          </div>`
  },
  { 
    id: 'text-octal-decoder', component: 'TextOctalDecoderTool', name: 'Octal Decoder', cat: 'Text Tools', icon: 'Binary',
    desc: 'Decode octal sequences back to text.',
    imports: ``,
    logic: `  const [oct, setOct] = useState<string>('');
  const [text, setText] = useState<string>('');
  
  React.useEffect(() => {
    try {
      const parts = oct.trim().split(/\\s+/);
      let str = '';
      for (let p of parts) {
        if(p) str += String.fromCharCode(parseInt(p, 8));
      }
      setText(str);
    } catch {
      setText('');
    }
  }, [oct]);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Octal</span>
                {oct && <button onClick={() => setOct('')} className="text-error text-xs hover:text-error/80">Clear</button>}
              </label>
              <textarea value={oct} onChange={(e) => setOct(e.target.value)} className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y focus:ring-2 focus:ring-primary" placeholder="Space separated octal..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Decoded Text</span>
                {text && <button onClick={() => navigator.clipboard.writeText(text)} className="text-primary text-xs hover:text-primary/80">Copy</button>}
              </label>
              <textarea value={text} readOnly className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y" placeholder="Result text..." />
            </div>
          </div>`
  },
  { 
    id: 'text-decimal-decoder', component: 'TextDecimalDecoderTool', name: 'Decimal Decoder', cat: 'Text Tools', icon: 'Binary',
    desc: 'Decode ASCII decimal sequences back to text.',
    imports: ``,
    logic: `  const [dec, setDec] = useState<string>('');
  const [text, setText] = useState<string>('');
  
  React.useEffect(() => {
    try {
      const parts = dec.trim().split(/\\s+/);
      let str = '';
      for (let p of parts) {
        if(p && !isNaN(Number(p))) str += String.fromCharCode(parseInt(p, 10));
      }
      setText(str);
    } catch {
      setText('');
    }
  }, [dec]);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input Decimal</span>
                {dec && <button onClick={() => setDec('')} className="text-error text-xs hover:text-error/80">Clear</button>}
              </label>
              <textarea value={dec} onChange={(e) => setDec(e.target.value)} className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y focus:ring-2 focus:ring-primary" placeholder="Space separated decimal..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Decoded Text</span>
                {text && <button onClick={() => navigator.clipboard.writeText(text)} className="text-primary text-xs hover:text-primary/80">Copy</button>}
              </label>
              <textarea value={text} readOnly className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y" placeholder="Result text..." />
            </div>
          </div>`
  },
  { 
    id: 'text-ascii-decoder', component: 'TextAsciiDecoderTool', name: 'ASCII Decoder', cat: 'Text Tools', icon: 'Type',
    desc: 'Decode ASCII codes to letters.',
    imports: ``,
    logic: `  const [code, setCode] = useState<string>('');
  const [text, setText] = useState<string>('');
  
  React.useEffect(() => {
    try {
      const parts = code.trim().split(/\\D+/);
      let str = '';
      for (let p of parts) {
        if(p && !isNaN(Number(p))) str += String.fromCharCode(parseInt(p, 10));
      }
      setText(str);
    } catch {
      setText('');
    }
  }, [code]);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input ASCII Numbers</span>
                {code && <button onClick={() => setCode('')} className="text-error text-xs hover:text-error/80">Clear</button>}
              </label>
              <textarea value={code} onChange={(e) => setCode(e.target.value)} className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y focus:ring-2 focus:ring-primary" placeholder="Enter ASCII numbers..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Decoded Letters</span>
                {text && <button onClick={() => navigator.clipboard.writeText(text)} className="text-primary text-xs hover:text-primary/80">Copy</button>}
              </label>
              <textarea value={text} readOnly className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y" placeholder="Result text..." />
            </div>
          </div>`
  },
  { 
    id: 'dev-html-minifier', component: 'DevHtmlMinifierTool', name: 'HTML Minifier', cat: 'Developer Tools', icon: 'Code',
    desc: 'Compress and strip whitespace from HTML code.',
    imports: ``,
    logic: `  const [html, setHtml] = useState<string>('');
  const [minHtml, setMinHtml] = useState<string>('');
  
  const minify = () => {
    let result = html
      .replace(/<!--[\\s\\S]*?-->/g, '') // remove comments
      .replace(/>\\s+</g, '><')       // remove spaces between tags
      .replace(/\\r?\\n|\\r/g, '')     // remove newlines
      .replace(/\\s{2,}/g, ' ')        // collapse spaces
      .trim();
    setMinHtml(result);
  };
  
  React.useEffect(() => { minify(); }, [html]);`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Input HTML</span>
                {html && <button onClick={() => setHtml('')} className="text-error text-xs hover:text-error/80">Clear</button>}
              </label>
              <textarea value={html} onChange={(e) => setHtml(e.target.value)} className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y focus:ring-2 focus:ring-primary" placeholder="Paste formatted HTML..." />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-on-surface flex justify-between">
                <span>Minified HTML</span>
                {minHtml && <button onClick={() => navigator.clipboard.writeText(minHtml)} className="text-primary text-xs hover:text-primary/80">Copy</button>}
              </label>
              <textarea value={minHtml} readOnly className="w-full h-80 bg-surface-container-highest border border-outline rounded-xl px-4 py-3 font-mono text-sm resize-y break-all" placeholder="Minified HTML string..." />
            </div>
          </div>`
  },
  { 
    id: 'fin-expense-calculator', component: 'FinExpenseCalculatorTool', name: 'Expense Calculator', cat: 'Finance Tools', icon: 'CreditCard',
    desc: 'Calculate total monthly and annual expenses.',
    imports: ``,
    logic: `  const [housing, setHousing] = useState<string>('1500');
  const [food, setFood] = useState<string>('500');
  const [transport, setTransport] = useState<string>('300');
  const [utilities, setUtilities] = useState<string>('200');
  const [other, setOther] = useState<string>('300');
  
  const h = parseFloat(housing) || 0;
  const f = parseFloat(food) || 0;
  const t = parseFloat(transport) || 0;
  const u = parseFloat(utilities) || 0;
  const o = parseFloat(other) || 0;
  
  const monthly = h + f + t + u + o;
  const annual = monthly * 12;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Housing / Rent ($)</label>
                <input type="number" value={housing} onChange={(e) => setHousing(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Food & Groceries ($)</label>
                <input type="number" value={food} onChange={(e) => setFood(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Transport ($)</label>
                <input type="number" value={transport} onChange={(e) => setTransport(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Utilities & Bills ($)</label>
                <input type="number" value={utilities} onChange={(e) => setUtilities(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Other / Misc ($)</label>
                <input type="number" value={other} onChange={(e) => setOther(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Total Monthly Expenses</div>
                <div className="text-4xl font-bold font-mono text-error">\${monthly.toFixed(2)}</div>
              </div>
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Total Annual Expenses</div>
                <div className="text-3xl font-bold font-mono text-error/80">\${annual.toFixed(2)}</div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-income-calculator', component: 'FinIncomeCalculatorTool', name: 'Income Calculator', cat: 'Finance Tools', icon: 'DollarSign',
    desc: 'Aggregate multiple income streams into a total.',
    imports: ``,
    logic: `  const [salary, setSalary] = useState<string>('4000');
  const [freelance, setFreelance] = useState<string>('500');
  const [dividends, setDividends] = useState<string>('100');
  const [other, setOther] = useState<string>('200');
  
  const s = parseFloat(salary) || 0;
  const f = parseFloat(freelance) || 0;
  const d = parseFloat(dividends) || 0;
  const o = parseFloat(other) || 0;
  
  const monthly = s + f + d + o;
  const annual = monthly * 12;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Primary Salary ($/mo)</label>
                <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Freelance/Side Hustle ($/mo)</label>
                <input type="number" value={freelance} onChange={(e) => setFreelance(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Dividends/Investments ($/mo)</label>
                <input type="number" value={dividends} onChange={(e) => setDividends(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Other Income ($/mo)</label>
                <input type="number" value={other} onChange={(e) => setOther(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Total Monthly Income</div>
                <div className="text-4xl font-bold font-mono text-emerald-500">\${monthly.toFixed(2)}</div>
              </div>
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Total Annual Income</div>
                <div className="text-3xl font-bold font-mono text-emerald-500/80">\${annual.toFixed(2)}</div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-retirement-calculator', component: 'FinRetirementCalculatorTool', name: 'Retirement Calculator', cat: 'Finance Tools', icon: 'Heart',
    desc: 'Estimate required savings for retirement target.',
    imports: ``,
    logic: `  const [current, setCurrent] = useState<string>('30');
  const [retireAge, setRetireAge] = useState<string>('65');
  const [monthlyNeed, setMonthlyNeed] = useState<string>('5000');
  
  const c = parseInt(current) || 0;
  const r = parseInt(retireAge) || 0;
  const mn = parseFloat(monthlyNeed) || 0;
  
  const years = Math.max(0, r - c);
  // Using 4% Withdrawal Rule for target nest egg
  const annualNeed = mn * 12;
  const targetNestEgg = annualNeed * 25;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Current Age</label>
                <input type="number" value={current} onChange={(e) => setCurrent(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Expected Retirement Age</label>
                <input type="number" value={retireAge} onChange={(e) => setRetireAge(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Desired Monthly Income During Retirement ($)</label>
                <input type="number" value={monthlyNeed} onChange={(e) => setMonthlyNeed(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Target Nest Egg (4% Rule)</div>
                <div className="text-4xl font-bold font-mono text-primary">\${(targetNestEgg/1000000).toFixed(2)}M</div>
                <div className="text-xs text-on-surface-variant mt-2">\${targetNestEgg.toLocaleString()} total</div>
              </div>
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Years to Prepare</div>
                <div className="text-3xl font-bold font-mono text-on-surface">{years} Years</div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-401k-calculator', component: 'Fin401kCalculatorTool', name: '401k Calculator', cat: 'Finance Tools', icon: 'Briefcase',
    desc: 'Calculate 401(k) growth with employer match.',
    imports: ``,
    logic: `  const [salary, setSalary] = useState<string>('80000');
  const [contribution, setContribution] = useState<string>('10');
  const [matchPercent, setMatchPercent] = useState<string>('50');
  const [matchLimit, setMatchLimit] = useState<string>('6');
  const [years, setYears] = useState<string>('20');
  const [rate, setRate] = useState<string>('7');
  
  const s = parseFloat(salary) || 0;
  const contribPct = (parseFloat(contribution) || 0) / 100;
  const matchP = (parseFloat(matchPercent) || 0) / 100;
  const limitP = (parseFloat(matchLimit) || 0) / 100;
  const y = parseFloat(years) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  
  const employeeContrib = s * contribPct;
  const matchedPortion = Math.min(contribPct, limitP) * s;
  const employerContrib = matchedPortion * matchP;
  const annualTotal = employeeContrib + employerContrib;
  
  const futureValue = r > 0 ? annualTotal * (Math.pow(1 + r, y) - 1) / r : annualTotal * y;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Annual Salary ($)</label>
                  <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Your Contrib (%)</label>
                  <input type="number" value={contribution} onChange={(e) => setContribution(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Employer Match (%)</label>
                  <input type="number" value={matchPercent} onChange={(e) => setMatchPercent(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Match Limit (%)</label>
                  <input type="number" value={matchLimit} onChange={(e) => setMatchLimit(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Years to Grow</label>
                  <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Est. Return (%)</label>
                  <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center justify-center flex-grow">
                <div className="text-sm text-on-surface-variant mb-1">Estimated 401(k) Balance</div>
                <div className="text-4xl font-bold font-mono text-emerald-500">\${futureValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
                <div className="text-xs text-on-surface-variant mt-2 border-t border-outline/50 pt-2">Annual You: \${employeeContrib} | Annual Match: \${employerContrib}</div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-ira-calculator', component: 'FinIraCalculatorTool', name: 'IRA Calculator', cat: 'Finance Tools', icon: 'PiggyBank',
    desc: 'Calculate growth of Individual Retirement Account.',
    imports: ``,
    logic: `  const [contribution, setContribution] = useState<string>('6500');
  const [years, setYears] = useState<string>('20');
  const [rate, setRate] = useState<string>('7');
  
  const c = parseFloat(contribution) || 0;
  const y = parseFloat(years) || 0;
  const r = (parseFloat(rate) || 0) / 100;
  
  const futureValue = r > 0 ? c * (Math.pow(1 + r, y) - 1) / r : c * y;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Annual Contribution ($)</label>
                <input type="number" value={contribution} onChange={(e) => setContribution(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Years to Grow</label>
                <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Est. Return Rate (%)</label>
                <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center justify-center flex-grow">
                <div className="text-sm text-on-surface-variant mb-1">Estimated IRA Balance</div>
                <div className="text-4xl font-bold font-mono text-emerald-500">\${futureValue.toLocaleString(undefined, {maximumFractionDigits: 0})}</div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-stocks-calculator', component: 'FinStocksCalculatorTool', name: 'Stocks Calculator', cat: 'Finance Tools', icon: 'BarChart2',
    desc: 'Calculate profit or loss from buying and selling stocks.',
    imports: ``,
    logic: `  const [shares, setShares] = useState<string>('100');
  const [buyPrice, setBuyPrice] = useState<string>('50');
  const [sellPrice, setSellPrice] = useState<string>('70');
  const [fees, setFees] = useState<string>('5');
  
  const s = parseFloat(shares) || 0;
  const buyP = parseFloat(buyPrice) || 0;
  const sellP = parseFloat(sellPrice) || 0;
  const f = parseFloat(fees) || 0;
  
  const totalCost = (s * buyP) + f;
  const totalRevenue = (s * sellP) - f;
  const profit = totalRevenue - totalCost;
  const roi = totalCost > 0 ? (profit / totalCost) * 100 : 0;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Number of Shares</label>
                <input type="number" value={shares} onChange={(e) => setShares(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Buy Price ($)</label>
                  <input type="number" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-medium text-on-surface">Sell Price ($)</label>
                  <input type="number" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-2 font-mono text-sm" />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Trading Fees ($ total)</label>
                <input type="number" value={fees} onChange={(e) => setFees(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Net Profit / Loss</div>
                <div className={\`text-4xl font-bold font-mono \${profit >= 0 ? "text-emerald-500" : "text-error"}\`}>\${profit.toFixed(2)}</div>
              </div>
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Return on Investment (ROI)</div>
                <div className={\`text-3xl font-bold font-mono \${roi >= 0 ? "text-emerald-500/80" : "text-error/80"}\`}>{roi.toFixed(2)}%</div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-bonds-calculator', component: 'FinBondsCalculatorTool', name: 'Bonds Calculator', cat: 'Finance Tools', icon: 'FileText',
    desc: 'Calculate bond yield to maturity and coupon payments.',
    imports: ``,
    logic: `  const [faceValue, setFaceValue] = useState<string>('1000');
  const [couponRate, setCouponRate] = useState<string>('5');
  const [years, setYears] = useState<string>('10');
  const [price, setPrice] = useState<string>('950');
  
  const f = parseFloat(faceValue) || 0;
  const cRate = (parseFloat(couponRate) || 0) / 100;
  const y = parseFloat(years) || 0;
  const p = parseFloat(price) || 0;
  
  const annualCoupon = f * cRate;
  // Approximation of Yield to Maturity (YTM)
  const ytm = p > 0 && y > 0 ? ((annualCoupon + ((f - p) / y)) / ((f + p) / 2)) * 100 : 0;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Face/Par Value ($)</label>
                <input type="number" value={faceValue} onChange={(e) => setFaceValue(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Coupon Rate (%)</label>
                <input type="number" value={couponRate} onChange={(e) => setCouponRate(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Years to Maturity</label>
                <input type="number" value={years} onChange={(e) => setYears(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Current Market Price ($)</label>
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Annual Coupon Payment</div>
                <div className="text-3xl font-bold font-mono text-primary">\${annualCoupon.toFixed(2)}</div>
              </div>
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Approx. Yield to Maturity (YTM)</div>
                <div className="text-4xl font-bold font-mono text-emerald-500">{ytm.toFixed(2)}%</div>
              </div>
            </div>
          </div>`
  },
  { 
    id: 'fin-options-calculator', component: 'FinOptionsCalculatorTool', name: 'Options Calculator', cat: 'Finance Tools', icon: 'TrendingUp',
    desc: 'Calculate basic intrinsic value for Call or Put options.',
    imports: ``,
    logic: `  const [type, setType] = useState<string>('call');
  const [stockPrice, setStockPrice] = useState<string>('150');
  const [strikePrice, setStrikePrice] = useState<string>('140');
  const [premium, setPremium] = useState<string>('5');
  
  const current = parseFloat(stockPrice) || 0;
  const strike = parseFloat(strikePrice) || 0;
  const cost = parseFloat(premium) || 0;
  
  let intrinsic = 0;
  if (type === 'call') intrinsic = Math.max(0, current - strike);
  else intrinsic = Math.max(0, strike - current);
  
  const profit = intrinsic - cost;`,
    ui: `          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Option Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono text-sm leading-6">
                  <option value="call">Call Option</option>
                  <option value="put">Put Option</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Current Stock Price ($)</label>
                <input type="number" value={stockPrice} onChange={(e) => setStockPrice(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Option Strike Price ($)</label>
                <input type="number" value={strikePrice} onChange={(e) => setStrikePrice(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-on-surface">Premium Paid / Option Cost ($)</label>
                <input type="number" value={premium} onChange={(e) => setPremium(e.target.value)} className="w-full bg-surface-container-high border border-outline rounded-xl px-4 py-3 font-mono" />
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Intrinsic Value (Per Share)</div>
                <div className="text-3xl font-bold font-mono text-primary">\${intrinsic.toFixed(2)}</div>
              </div>
              <div className="bg-surface-container-high p-6 border border-outline rounded-xl flex flex-col items-center">
                <div className="text-sm text-on-surface-variant mb-1">Net Profit / Loss (Per Share)</div>
                <div className={\`text-4xl font-bold font-mono \${profit >= 0 ? "text-emerald-500" : "text-error"}\`}>\${profit.toFixed(2)}</div>
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

const inactiveToolsFile = path.join(process.cwd(), 'src/data/inactiveTools.ts');
let inactiveStr = fs.readFileSync(inactiveToolsFile, 'utf8');

const toolsManifestFile = path.join(process.cwd(), 'src/data/toolsManifest.ts');
let toolsManifestStr = fs.readFileSync(toolsManifestFile, 'utf8');

const generatedRoot = path.join(process.cwd(), 'src/components');

let appendImports = "";
let appendCases = "";
let appendManifest = "";

let tIds: string[] = [];

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
