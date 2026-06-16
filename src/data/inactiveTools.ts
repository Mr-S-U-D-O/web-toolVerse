export function getInactiveTools() {
  const tools = [];
  const formats = ['JPG', 'PNG', 'GIF', 'WEBP', 'SVG', 'PDF', 'DOC', 'DOCX', 'TXT', 'CSV', 'JSON', 'XML', 'MP4', 'MP3', 'WAV', 'MKV', 'AVI', 'MOV', 'HEIC', 'AVIF', 'M4A', 'FLAC', 'AAC', 'MD', 'HTML', 'CSS', 'JS', 'TS', 'PPTX', 'XLSX', 'YAML', 'TOML', 'INI', 'EPUB', 'MOBI', 'ZIP', 'TAR', 'GZ', 'RAR', '7Z', 'ISO'];
  
  // Format converters: 41 * 40 = 1640 tools
  for (const from of formats) {
    for (const to of formats) {
      if (from !== to) {
        tools.push({
          id: `convert-${from.toLowerCase()}-to-${to.toLowerCase()}`,
          name: `${from} to ${to}`,
          category: 'Converters',
          tags: [from.toLowerCase(), to.toLowerCase(), 'convert', 'converter', 'file']
        });
      }
    }
  }

  const platforms = ['Instagram', 'YouTube', 'TikTok', 'Twitter', 'Facebook', 'Vimeo', 'Twitch', 'LinkedIn', 'Pinterest', 'Reddit', 'Snapchat', 'WhatsApp', 'Telegram', 'Discord', 'Slack', 'Zoom', 'Skype', 'Google Meet'];
  const platformTools = ['Video Downloader', 'Image Downloader', 'Story Viewer', 'Profile Picture Viewer', 'Audio Extractor', 'Metadata Viewer', 'Analytics', 'Hashtag Generator', 'Caption Generator', 'Bio Generator'];

  // Platform tools: 18 * 10 = 180 tools
  for (const plat of platforms) {
      for (const pt of platformTools) {
          tools.push({
              id: `${plat.toLowerCase()}-${pt.toLowerCase().replace(' ', '-')}`,
              name: `${plat} ${pt}`,
              category: 'Social Media',
              tags: [plat.toLowerCase(), pt.toLowerCase().split(' ')[0], 'social', 'media', 'tool']
          })
      }
  }

  const codeLangs = ['Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Go', 'Rust', 'Dart', 'Scala', 'Haskell', 'Lua', 'Perl', 'R', 'MATLAB', 'SQL', 'NoSQL', 'HTML', 'CSS', 'SASS', 'LESS', 'XML', 'YAML', 'JSON', 'GraphQL', 'Bash', 'PowerShell'];
  const codeTools = ['Formatter', 'Linter', 'Minifier', 'Obfuscator', 'Deobfuscator', 'Compiler', 'Interpreter', 'Syntax Checker', 'Documentation Generator', 'Snippet Generator', 'Type Converter', 'Boilerplate Generator', 'Regex Tester', 'AST Viewer'];
  
  // Code tools: 31 * 14 = 434 tools
  for (const clang of codeLangs) {
      for (const ct of codeTools) {
          tools.push({
              id: `dev-${clang.toLowerCase()}-${ct.toLowerCase().replace(' ', '-')}`,
              name: `${clang} ${ct}`,
              category: 'Developers',
              tags: [clang.toLowerCase(), ct.toLowerCase().split(' ')[0], 'code', 'dev', 'developer']
          });
      }
  }

  const textActions = ['Generator', 'Analyzer', 'Counter', 'Reverser', 'Sorter', 'Filter', 'Splitter', 'Merger', 'Extractor', 'Replacer', 'Transliterator', 'Encoder', 'Decoder', 'Encryptor', 'Decryptor', 'Compressor', 'Decompressor', 'Diff', 'Patch'];
  const textTypes = ['String', 'Sentence', 'Paragraph', 'Word', 'Character', 'Article', 'Essay', 'Poem', 'Lyrics', 'Script', 'Subtitle', 'Transcript', 'Code', 'Log', 'Config', 'Data', 'List', 'Table', 'Matrix', 'Vector', 'Graph', 'Tree', 'JSON', 'XML', 'YAML', 'CSV', 'TSV', 'SQL', 'HTML', 'CSS', 'JS', 'Markdown', 'Base64', 'Hex', 'Binary', 'Octal', 'Decimal', 'Ascii', 'Unicode', 'Emoji'];
  
  // Text tools: 19 * 40 = 760 tools
  for (const ta of textActions) {
      for (const tt of textTypes) {
          tools.push({
              id: `text-${tt.toLowerCase()}-${ta.toLowerCase()}`,
              name: `${tt} ${ta}`,
              category: 'Text Formatters',
              tags: [tt.toLowerCase(), ta.toLowerCase(), 'text', 'string', 'words']
          })
      }
  }

  const mathOps = ['Calculator', 'Solver', 'Grapher', 'Converter', 'Generator', 'Analyzer', 'Visualizer', 'Simulator', 'Estimator', 'Predictor'];
  const mathTopics = ['Algebra', 'Geometry', 'Calculus', 'Trigonometry', 'Statistics', 'Probability', 'Fractions', 'Percentages', 'Ratios', 'Proportions', 'Equations', 'Inequalities', 'Functions', 'Matrices', 'Vectors', 'Complex Numbers', 'Logarithms', 'Exponents', 'Roots', 'Polynomials', 'Sequences', 'Series', 'Limits', 'Derivatives', 'Integrals', 'Differential Equations', 'Transforms', 'Tensors', 'Quaternions', 'Boolean Algebra', 'Set Theory', 'Logic', 'Combinatorics', 'Graph Theory', 'Number Theory', 'Cryptography', 'Topology', 'Fractals', 'Chaos Theory', 'Game Theory', 'Optimization', 'Numerical Analysis', 'Statistics', 'Data Science', 'Machine Learning', 'Artificial Intelligence', 'Physics', 'Chemistry', 'Biology', 'Astronomy', 'Economics', 'Finance', 'Engineering', 'Computer Science'];

  // Math tools: 10 * 54 = 540 tools
  for (const mo of mathOps) {
      for (const mt of mathTopics) {
          tools.push({
              id: `math-${mt.toLowerCase().replace(' ', '-')}-${mo.toLowerCase()}`,
              name: `${mt} ${mo}`,
              category: 'Calculators',
              tags: [mt.toLowerCase().split(' ')[0], mo.toLowerCase(), 'math', 'calculator', 'science']
          })
      }
  }

  const imageActions = ['Crop', 'Resize', 'Compress', 'Convert', 'Rotate', 'Flip', 'Filter', 'Adjust', 'Blur', 'Sharpen', 'Noise Reduction', 'Watermark', 'Overlay', 'Merge', 'Split', 'Extract', 'Animate', 'Glitch', 'Pixelate', 'Colorize', 'De-colorize', 'Invert', 'Threshold', 'Edge Detect', 'Emboss', 'Posterize', 'Solarize', 'Cartoonize', 'Sketch', 'Oil Paint', 'Watercolor', 'Pop Art', 'Vintage', 'Sepia', 'Grayscale', 'Black and White'];
  const imageTypes = ['Avatar', 'Thumbnail', 'Banner', 'Cover', 'Icon', 'Logo', 'Meme', 'Screenshot', 'Wallpaper', 'Texture', 'Pattern', 'Background', 'Foreground', 'Sprite', 'Tileset', 'Map', 'Chart', 'Graph', 'Blueprint', 'Schematic', 'Diagram', 'Flowchart', 'Wireframe', 'Mockup', 'Prototype', 'Design', 'Illustration', 'Painting', 'Drawing', 'Sketch', 'Doodle'];

  // Image tools: 36 * 31 = 1116 tools
  for (const ia of imageActions) {
      for (const it of imageTypes) {
          tools.push({
              id: `img-${it.toLowerCase().replace(' ', '-')}-${ia.toLowerCase().replace(' ', '-')}`,
              name: `${it} ${ia}`,
              category: 'Image Tools',
              tags: [it.toLowerCase(), ia.toLowerCase(), 'image', 'photo', 'picture', 'edit']
          })
      }
  }
  
  // Total tools = 1640 + 180 + 434 + 760 + 540 + 1116 = 4670 tools

  // Add the initial active tools to an ignore set so we don't yield duplicated IDs or names
  return tools;
}
