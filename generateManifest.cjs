const fs = require('fs');
const path = require('path');

function processDir(dir) {
    let results = [];
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(processDir(fullPath));
        } else if (file.endsWith('Tool.tsx')) {
            results.push(fullPath);
        }
    }
    return results;
}

const componentsDir = path.join(__dirname, 'src', 'components');
const filesFull = processDir(componentsDir);
const files = filesFull.map(f => path.basename(f));

const categories = {
  Ai: 'AI Tools',
  Ai3d: 'AI 3D Tools',
  AiAudio: 'AI Audio Tools',
  AiCode: 'AI Code Tools',
  AiData: 'AI Data Tools',
  AiImage: 'AI Image Tools',
  AiText: 'AI Text Tools',
  AiVideo: 'AI Video Tools',
  Audio: 'Audio Tools',
  Base64: 'Encoding Tools',
  Basic: 'Math Tools',
  Bcrypt: 'Security Tools',
  Bmi: 'Health Tools',
  Case: 'Text Tools',
  Color: 'Design Tools',
  Compressor: 'Developer Tools',
  Cron: 'Developer Tools',
  Cropper: 'Image Tools',
  Css: 'Developer Tools',
  Csv: 'Data Tools',
  Dev: 'Developer Tools',
  Diff: 'Developer Tools',
  Discount: 'Finance Tools',
  Fin: 'Finance Tools',
  Hash: 'Security Tools',
  Html: 'Developer Tools',
  Image: 'Image Tools',
  JavaScript: 'Developer Tools',
  Json: 'Developer Tools',
  Jwt: 'Security Tools',
  Keycode: 'Developer Tools',
  Length: 'Math Tools',
  Line: 'Text Tools',
  List: 'Text Tools',
  Lorem: 'Text Tools',
  Mac: 'Developer Tools',
  Markdown: 'Developer Tools',
  Math: 'Math Tools',
  Password: 'Security Tools',
  Percentage: 'Math Tools',
  Pomodoro: 'Time Tools',
  QrCode: 'Developer Tools',
  Query: 'Developer Tools',
  Random: 'Math Tools',
  Regex: 'Developer Tools',
  Rgb: 'Design Tools',
  Roi: 'Finance Tools',
  Slug: 'Developer Tools',
  Sql: 'Developer Tools',
  Stopwatch: 'Time Tools',
  String: 'Text Tools',
  Temperature: 'Math Tools',
  Text: 'Text Tools',
  Timestamp: 'Time Tools',
  Tip: 'Finance Tools',
  Url: 'Developer Tools',
  Uuid: 'Developer Tools',
  Weight: 'Math Tools',
  Whitespace: 'Text Tools',
  Word: 'Text Tools',
  Xml: 'Developer Tools',
  Yaml: 'Developer Tools'
};

const getCategory = (filename) => {
  for (const prefix of Object.keys(categories).sort((a,b)=>b.length - a.length)) {
    if (filename.startsWith(prefix)) {
      return categories[prefix];
    }
  }
  return 'Utilities';
};

const getIcon = (category) => {
  if (category === 'Developer Tools') return 'Code';
  if (category === 'Math Tools' || category.includes('Finance')) return 'Calculator';
  if (category.includes('Text')) return 'Type';
  if (category.includes('Image') || category.includes('Design')) return 'Image';
  if (category.includes('Security')) return 'Shield';
  if (category.includes('Time')) return 'Clock';
  if (category.includes('AI')) return 'Sparkles';
  return 'Wrench';
};

const tools = files.map(file => {
  const baseName = file.replace('.tsx', '').replace(/Tool$/, '');
  const id = baseName.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
  const name = baseName.replace(/([a-z0-9])([A-Z])/g, '$1 $2').replace(/^Ai /, 'AI ');
  const category = getCategory(baseName);
  const icon = getIcon(category);
  return { id, name, category, icon };
});

const iconsToImport = [...new Set(tools.map(t => t.icon))];

const fileContent = `
import { ${iconsToImport.join(', ')} } from 'lucide-react';

export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: any;
  status: 'active';
}

export const ALL_TOOLS: Tool[] = [
${tools.map(t => `  { id: '${t.id}', name: '${t.name}', description: 'A utility tool for ${t.name}', category: '${t.category}', icon: ${t.icon}, status: 'active' }`).join(',\n')}
];
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'toolsManifest.ts'), fileContent.trim() + '\n');
console.log('Manifest generated with ' + tools.length + ' tools.');
