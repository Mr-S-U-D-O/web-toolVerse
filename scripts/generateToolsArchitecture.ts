import fs from 'fs';
import path from 'path';

const landingCode = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');
const matches = [...landingCode.matchAll(/id:\s*'([^']+)',\s*name:\s*'([^']+)'/g)];
console.log(`Found ${matches.length} tools.`);

const TOOLS_DIR = path.join('src', 'components', 'tools');
if (fs.existsSync(TOOLS_DIR)) {
  fs.rmSync(TOOLS_DIR, { recursive: true, force: true });
}
fs.mkdirSync(TOOLS_DIR, { recursive: true });

let importMap = '';

function getClassName(id: string) {
  return id.replace(/[^a-zA-Z0-9]/g, '-').split('-').filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('') + 'Tool';
}

const componentNames: string[] = [];

matches.forEach(match => {
  const id = match[1];
  const name = match[2];
  const className = getClassName(id);

  // If we already handled it explicitly, skip generating generic file
  if ([
     'ImageCropperTool', 'ImageCompressorTool', 'ImageResizerTool', 'TextFormatterTool',
     'JsonFormatterTool', 'ColorConverterTool', 'PasswordGeneratorTool', 'Base64ConverterTool',
     'UrlEncoderTool', 'QrCodeGeneratorTool', 'HashGeneratorTool', 'MarkdownPreviewTool',
     'StringReverserTool', 'WordCounterTool', 'ListSorterTool', 'CssMinifierTool',
     'JsonMinifierTool', 'JavaScriptMinifierTool', 'PercentagesCalculatorTool',
     'RoiCalculatorTool', 'BmiCalculatorTool', 'CsvToJsonTool'
  ].includes(className)) {
     return;
  }

  componentNames.push(className);

  let systemMessage = `You are an advanced software tool named "${name}".\n`;
  if (id.startsWith('audio-')) {
     systemMessage += `You are an audio engineering assistant. The user will ask you to compute, process, converter, or analyze audio metadata or signals. Provide the computed results accurately. Treat the user input as context for FFMPEG/Librosa analysis or commands.`;
  } else if (id.startsWith('fin-') || id.startsWith('math-')) {
     systemMessage += `You are a highly precise, mathematically sound computation engine. Evaluate the user's financial/mathematical structures and provide an exact output format. Explain the formula briefly.`;
  } else if (id.startsWith('code-')) {
     systemMessage += `You are a senior compiler/transpiler and software engineer perfectly adept at ${name}. Output exactly what is requested with high-quality markdown code blocks.`;
  } else {
     systemMessage += `The user is asking you to act as a ${name}. Compute, format, or analyze the input text properly and return the exact output.`;
  }

  const componentCode = `import React from 'react';
import { AICoreToolWrapper } from '../core/AICoreToolWrapper';

export default function ${className}({ onBack }: { onBack: () => void }) {
  return (
    <AICoreToolWrapper 
      id="${id}" 
      name="${name}" 
      onBack={onBack} 
      systemPrompt={${JSON.stringify(systemMessage)}}
    />
  );
}
`;

  fs.writeFileSync(path.join(TOOLS_DIR, `${className}.tsx`), componentCode);
});

console.log('Successfully generated individual tool components in src/components/tools.');
