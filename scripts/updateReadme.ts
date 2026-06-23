import fs from 'fs';
import path from 'path';
import { ALL_TOOLS } from '../src/data/toolsManifest';

function getTargetAudience(category: string): string {
  switch (category.toLowerCase()) {
    case 'developer':
    case 'development':
      return 'Software Developers & Engineers';
    case 'json':
      return 'Developers & Data Analysts';
    case 'converter':
      return 'Students, Scientists, & General Users';
    case 'cryptography':
      return 'Security Professionals & Developers';
    case 'image':
    case 'design':
      return 'Designers, Content Creators, & Photographers';
    case 'video':
      return 'Video Editors & Social Media Managers';
    case 'text':
      return 'Writers, Editors, & Data Processors';
    case 'utility':
      return 'General Web Users';
    case 'pdf':
      return 'Office Workers & Students';
    default:
      return 'General Users';
  }
}

const readmePath = path.join(process.cwd(), 'README.md');
let readmeContent = fs.readFileSync(readmePath, 'utf8');

const markerStart = '<!-- TOOLS_LIST_START -->';
const markerEnd = '<!-- TOOLS_LIST_END -->';

let toolsListMarkdown = `\n## Included Tools\n\n`;

ALL_TOOLS.forEach((tool, index) => {
  toolsListMarkdown += `### ${index + 1}. ${tool.name}\n`;
  toolsListMarkdown += `- **Target Audience:** ${getTargetAudience(tool.category)}\n`;
  toolsListMarkdown += `- **Problem Solved:** ${tool.description}\n\n`;
});

if (readmeContent.includes(markerStart)) {
  const regex = new RegExp(`${markerStart}[\\s\\S]*?${markerEnd}`);
  readmeContent = readmeContent.replace(regex, `${markerStart}${toolsListMarkdown}${markerEnd}`);
} else {
  readmeContent += `\n${markerStart}${toolsListMarkdown}${markerEnd}\n`;
}

fs.writeFileSync(readmePath, readmeContent);
console.log('README.md updated with 102 tools successfully!');
