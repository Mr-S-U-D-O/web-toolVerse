import fs from 'fs';
let landingCode = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');
landingCode = landingCode.replace(/export const ACTIVE_TOOLS: any\[\] = \[/, 'export const ACTIVE_TOOLS: Array<{id: string, name: string, category: string, tags?: string[], icon?: any}> = [');
fs.writeFileSync('src/components/LandingPage.tsx', landingCode);
console.log("Fixed too complex union type to exact type.");
