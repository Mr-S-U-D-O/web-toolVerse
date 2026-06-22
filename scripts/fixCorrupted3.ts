import fs from 'fs';
let landingCode = fs.readFileSync('src/components/LandingPage.tsx', 'utf-8');
landingCode = landingCode.replace(/} \}\n\];/g, '}\n];');
fs.writeFileSync('src/components/LandingPage.tsx', landingCode);
console.log("Fixed last item double brace.");
