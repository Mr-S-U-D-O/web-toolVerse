import fs from 'fs';

let landingCode = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// The regex needs to handle nested elements or just remove everything starting from `component` to the end of the object.
// Example: component: () => <AnyAudioTool onBack={() => { setView('grid'); setSearchQuery(''); setSelectedCategory('All'); }} title="M4A Pitcher" action="Pitcher" topic="M4A" /> }
landingCode = landingCode.replace(/, component:[^}]+ \}/g, ' }');

fs.writeFileSync('src/components/LandingPage.tsx', landingCode);
console.log("Stripped component property aggressively.");
