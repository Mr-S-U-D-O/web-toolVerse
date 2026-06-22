import fs from 'fs';
let landingCode = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');
landingCode = landingCode.replace(/} \},/g, '},');
fs.writeFileSync('src/components/LandingPage.tsx', landingCode);
console.log("Fixed double brace syntax error.");
