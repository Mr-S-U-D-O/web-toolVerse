import fs from 'fs';
import path from 'path';

const landingPagePath = path.join(process.cwd(), 'src/components/LandingPage.tsx');
let landingPageContent = fs.readFileSync(landingPagePath, 'utf8');

const regex = /export const ACTIVE_TOOLS: any = (\[[\s\S]*?\]);/;
const match = landingPageContent.match(regex);

if (!match) {
  console.error('Could not find ACTIVE_TOOLS in LandingPage.tsx');
  process.exit(1);
}

const activeToolsContent = match[1];

const toolsManifestContent = `import { getInactiveTools } from './inactiveTools';

export const ACTIVE_TOOLS: any = ${activeToolsContent};

export const INACTIVE_TOOLS: any = getInactiveTools().map((t: any) => ({ ...t, status: 'inactive' }));
export const ACTIVE_TOOLS_WITH_STATUS: any = ACTIVE_TOOLS.map((t: any) => ({ ...t, status: 'active' }));

export const ALL_TOOLS: any = [...ACTIVE_TOOLS_WITH_STATUS, ...INACTIVE_TOOLS];
export const ACTIVE_TOOLS_COUNT = ACTIVE_TOOLS.length;
export const INACTIVE_TOOLS_COUNT = INACTIVE_TOOLS.length;
`;

fs.writeFileSync(path.join(process.cwd(), 'src/data/toolsManifest.ts'), toolsManifestContent);

// Remove ACTIVE_TOOLS from LandingPage.tsx and add imports
landingPageContent = landingPageContent.replace(regex, '');
landingPageContent = landingPageContent.replace("const INACTIVE_TOOLS = getInactiveTools();\n", "");
landingPageContent = landingPageContent.replace("const ALL_TOOLS = [...ACTIVE_TOOLS, ...INACTIVE_TOOLS];\n", "");

landingPageContent = landingPageContent.replace(
  "import { getInactiveTools } from '../data/inactiveTools';",
  "import { ACTIVE_TOOLS, ALL_TOOLS, ACTIVE_TOOLS_COUNT, INACTIVE_TOOLS_COUNT } from '../data/toolsManifest';"
);
landingPageContent = landingPageContent.replace(/\{ACTIVE_TOOLS\.length\}/g, "{ACTIVE_TOOLS_COUNT}");
landingPageContent = landingPageContent.replace(/\{INACTIVE_TOOLS\.length\}/g, "{INACTIVE_TOOLS_COUNT}");

fs.writeFileSync(landingPagePath, landingPageContent);
console.log('Refactoring done.');
