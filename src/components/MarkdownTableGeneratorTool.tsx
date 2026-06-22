import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, Copy, Check } from 'lucide-react';

interface MarkdownTableGeneratorToolProps {
  onBack: () => void;
}

export default function MarkdownTableGeneratorTool({ onBack }: MarkdownTableGeneratorToolProps) {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  
  // Create 2D array for table data
  const [data, setData] = useState<string[][]>(Array(4).fill(Array(3).fill('')));
  const [copied, setCopied] = useState(false);

  // Initialize data correctly without shared object references
  React.useEffect(() => {
    const initialData = Array.from({ length: rows + 1 }, () => Array.from({ length: cols }, () => ''));
    // Prefill headers
    initialData[0] = initialData[0].map((_, i) => `Header ${i + 1}`);
    setData(initialData);
  }, []);

  const updateCell = (r: number, c: number, val: string) => {
    const newData = data.map((row, i) => i === r ? row.map((col, j) => j === c ? val : col) : row);
    setData(newData);
  };

  const addRow = () => {
    setData([...data, Array.from({ length: data[0].length }, () => '')]);
    setRows(rows + 1);
  };

  const removeRow = (rIdx: number) => {
    if (data.length <= 2) return; // Must have header and at least 1 row
    setData(data.filter((_, i) => i !== rIdx));
    setRows(rows - 1);
  };

  const addCol = () => {
    setData(data.map((r, i) => [...r, i === 0 ? `Header ${r.length + 1}` : '']));
    setCols(cols + 1);
  };

  const removeCol = (cIdx: number) => {
    if (data[0].length <= 1) return; // Must have at least 1 col
    setData(data.map(r => r.filter((_, j) => j !== cIdx)));
    setCols(cols - 1);
  };

  const generateMarkdown = () => {
    if (data.length === 0) return '';
    let md = '';
    
    // Calculate max widths for each column to align it nicely
    const colWidths = data[0].map((_, cIdx) => {
      return Math.max(...data.map(r => (r[cIdx] || '').length), 3);
    });

    data.forEach((row, rIdx) => {
      let rowMd = '|';
      row.forEach((cell, cIdx) => {
        rowMd += ` ${cell.padEnd(colWidths[cIdx], ' ')} |`;
      });
      md += rowMd.trim() + '\n';
      
      // Add separator after header
      if (rIdx === 0) {
        let sepMd = '|';
        row.forEach((_, cIdx) => {
          sepMd += ` ${'-'.repeat(colWidths[cIdx])} |`;
        });
        md += sepMd.trim() + '\n';
      }
    });

    return md;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface p-4 sm:p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Tools</span>
        </button>

        <h1 className="text-3xl font-bold font-heading mb-2">Markdown Table Generator</h1>
        <p className="text-on-surface-variant mb-8">Build tables visually and export them as clean Markdown syntax.</p>

        <div className="bg-surface rounded-xl p-6 border border-outline mb-6 overflow-x-auto">
          <div className="flex gap-4 mb-4">
             <button onClick={addCol} className="flex items-center gap-1 text-sm bg-background border border-outline px-3 py-1 rounded hover:border-primary transition-colors">
               <Plus size={16}/> Add Column
             </button>
             <button onClick={addRow} className="flex items-center gap-1 text-sm bg-background border border-outline px-3 py-1 rounded hover:border-primary transition-colors">
               <Plus size={16}/> Add Row
             </button>
          </div>

          <div className="inline-block min-w-full">
            <table className="w-full text-left border-collapse border border-outline bg-background">
              <thead>
                <tr>
                  {data[0]?.map((_, cIdx) => (
                    <th key={`h-${cIdx}`} className="p-2 border border-outline bg-surface relative group">
                      <input 
                        type="text" 
                        value={data[0][cIdx]} 
                        onChange={(e) => updateCell(0, cIdx, e.target.value)}
                        className="w-full bg-transparent focus:outline-none font-bold"
                      />
                      {data[0].length > 1 && (
                        <button onClick={() => removeCol(cIdx)} className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:scale-110 shadow-sm">
                          <Trash2 size={12} />
                        </button>
                      )}
                    </th>
                  ))}
                  <th className="w-8 border-none bg-surface"></th> {/* Spacer for row delete */}
                </tr>
              </thead>
              <tbody>
                {data.slice(1).map((row, rIdxOffset) => {
                  const rIdx = rIdxOffset + 1; // Actual index in data array
                  return (
                    <tr key={`r-${rIdx}`} className="group hover:bg-surface/50">
                      {row.map((cell, cIdx) => (
                        <td key={`c-${cIdx}`} className="p-2 border border-outline relative">
                           <input 
                            type="text" 
                            value={cell} 
                            onChange={(e) => updateCell(rIdx, cIdx, e.target.value)}
                            className="w-full bg-transparent focus:outline-none font-mono text-sm"
                          />
                        </td>
                      ))}
                      <td className="w-8 p-0 text-center border-none">
                         {data.length > 2 && (
                            <button onClick={() => removeRow(rIdx)} className="text-red-500 hover:scale-110 p-2 opacity-0 group-hover:opacity-100 transition-all">
                              <Trash2 size={16} />
                            </button>
                         )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-surface rounded-xl flex flex-col border border-outline overflow-hidden relative">
          <div className="bg-background border-b border-outline p-4 flex items-center justify-between">
             <span className="font-bold flex items-center gap-2">Markdown Code</span>
             <button
               onClick={handleCopy}
               className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 text-sm rounded font-bold hover:bg-surface-tint transition-colors"
             >
               {copied ? <Check size={16} /> : <Copy size={16} />}
               {copied ? 'Copied' : 'Copy'}
             </button>
          </div>
          <textarea
             className="w-full bg-surface border-none p-4 font-mono text-sm focus:outline-none min-h-[250px] resize-y whitespace-pre block"
             value={generateMarkdown()}
             readOnly
          />
        </div>

      </div>
    </div>
  );
}
