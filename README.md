# Web-ToolVerse

Web-ToolVerse is a comprehensive collection of completely free, client-side web tools. It includes utilities ranging from image formatting to developer tools, cryptography algorithms, string manipulators, and much more! 

## Architecture & Design

Web-ToolVerse adopts a strictly **"One Tool, One Component"** architecture. This avoids massive monolithic files and prevents UI clutter. 
* All 295+ tools are stored as standalone React components inside `src/components/`.
* Code splitting is heavily enforced: `App.tsx` dynamically imports each tool on-demand via `React.lazy()` and `Suspense`, ensuring the core JavaScript bundle remains incredibly lightweight.
* SEO is dynamically handled on every route. The document `<title>` and `<meta name="description">` adjust intelligently based on the actively loaded tool.
* An AST-based code parser guarantees our robust minifiers and formatters work accurately completely entirely on the client, keeping data secure and offline-ready. 

## Local Development & Build

### Prerequisites
Make sure you have Node.js and `npm` installed.

1. **Install dependencies:**  
   \`\`\`bash
   npm install
   \`\`\`

2. **Start the development server:**  
   \`\`\`bash
   npm run dev
   \`\`\`
   Your server will start (typically on http://localhost:3000) with hot module reloading enabled.

3. **Production Build:**  
   To build the application for a true production environment (e.g. Vercel, Netlify):
   \`\`\`bash
   npm run build
   \`\`\`
   This command executes Vite's build process to generate a highly optimized bundle inside the `dist/` directory. You can preview it with:
   \`\`\`bash
   npm run preview
   \`\`\`

## Adding New Tools

If you want to add a new tool to Web-ToolVerse:
1. Create a `[ToolName]Tool.tsx` file inside `src/components/` following the existing tool structure.
2. Ensure you have the `generateManifest.cjs` file in your root folder.
3. Run:
   \`\`\`bash
   node generateManifest.cjs
   \`\`\`
4. The system will automatically parse the components folder, map the new tool, and update the global `toolsManifest.ts`. No manual wiring is needed!
