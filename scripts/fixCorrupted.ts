import fs from 'fs';

let landingCode = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');

// The corrupted lines look like:
// { id: 'audio-alac-editor', name: 'ALAC Editor', icon: Headphones, category: 'Audio Tools' }} title="ALAC Editor" action="Editor" topic="ALAC" /> },
// Let's replace the string starting from `}} title=` until `/>` with nothing.
landingCode = landingCode.replace(/\}\} title="[^"]+" action="[^"]+" (?:topic|type|lang)="[^"]+" \/>/g, '}');

fs.writeFileSync('src/components/LandingPage.tsx', landingCode);
console.log("Fixed corrupted properties.");
