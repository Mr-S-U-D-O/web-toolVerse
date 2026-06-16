import fs from 'fs';
import { getInactiveTools } from '../src/data/inactiveTools';

// Extract active tools from LandingPage.tsx
const landingPageCode = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');
const activeMatch = landingPageCode.match(/const ACTIVE_TOOLS = \[([\s\S]*?)\];/);
if (!activeMatch) {
  console.error('Could not find ACTIVE_TOOLS array in LandingPage.tsx');
  process.exit(1);
}

// Extract names using regex
const activeNames = [];
const nameRegex = /name:\s*'([^']+)'/g;
let match;
while ((match = nameRegex.exec(activeMatch[1])) !== null) {
  activeNames.push(match[1]);
}

const inactiveTools = getInactiveTools();

const readmeContent = `# Web-ToolVerse

Web-ToolVerse is a comprehensive collection of completely free, client-side web tools. It includes utilities ranging from image formatting to developer tools, cryptography algorithms, string manipulators, and much more! 

## App Information
- **Total Tools:** ${activeNames.length + inactiveTools.length}
- **Developed/Functional Tools:** ${activeNames.length}
- **In-Development Tools:** ${inactiveTools.length}

## Fully Developed Tools (Usable)
${activeNames.map((n, i) => (i + 1) + ". " + n).join('\\n')}

## In Development Tools (Searchable Placeholder)
${inactiveTools.map((t, i) => (i + 1) + ". " + t.name).join('\\n')}
`;

fs.writeFileSync('README.md', readmeContent);
console.log("README.md generated successfully with " + activeNames.length + " active and " + inactiveTools.length + " inactive tools.");
