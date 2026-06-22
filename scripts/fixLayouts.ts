import fs from 'fs';
import path from 'path';

const tools = [
  'MathExponentsCalculatorTool',
  'FinSalaryCalculatorTool',
  'FinHourlyCalculatorTool',
  'TextCharacterCounterTool',
  'TextSentenceCounterTool',
  'TextParagraphCounterTool',
  'DevJavascriptFormatterTool',
  'DevCssFormatterTool',
  'DevHtmlFormatterTool',
  'DevSqlFormatterTool'
];

for (const t of tools) {
  const file = path.join(process.cwd(), 'src/components/' + t + '.tsx');
  let code = fs.readFileSync(file, 'utf8');

  code = code.replace(/import \{ Layout \} from '\.\/Layout';/, "import { ArrowLeft } from 'lucide-react';");
  const functionStart = 'export default function ' + t + '({ onBack }: { onBack: () => void }) {';
  code = code.replace(/export default function .*?\(\) \{/, functionStart);
  
const layoutStart = '    <div className="flex flex-col min-h-screen w-full bg-background text-on-surface">\\n' +
'      <header className="w-full border-b border-outline-variant bg-background sticky top-0 z-50">\\n' +
'        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center">\\n' +
'          <button onClick={onBack} className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group">\\n' +
'             <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />\\n' +
'             <span className="font-mono text-sm tracking-widest font-medium uppercase mt-0.5">Back to Main</span>\\n' +
'          </button>\\n' +
'        </div>\\n' +
'      </header>\\n\\n' +
'      <main className="flex-grow flex justify-center p-6 lg:p-12 w-full max-w-[1280px] mx-auto relative pt-12 md:pt-16">';

  code = code.replace(/<Layout>/, layoutStart);
  code = code.replace(/<\/Layout>/, "      </main>\n    </div>");

  fs.writeFileSync(file, code);
}

console.log("Replaced Layout in all 10 tools.");
