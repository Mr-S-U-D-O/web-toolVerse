export function getInactiveTools() {
  const tools = [];
  const ignoredIds = new Set([
    'text-string-reverser',
    'text-word-counter',
    'text-list-sorter',
    'dev-css-minifier',
    'dev-javascript-minifier',
    'dev-json-minifier',
    'math-percentages-calculator',
    'fin-roi-calculator',
    'health-bmi-calculator',
    'convert-csv-to-json',
    'text-string-generator',
    'text-sentence-generator',
    'text-word-generator',
    'text-character-generator',
    'text-article-generator',
    'text-poem-generator',
    'text-lyrics-generator',
    'text-code-generator',
    'text-data-generator',
    'text-list-generator',
    'text-table-generator',
    'text-matrix-generator',
    'text-vector-generator',
    'text-json-generator',
    'text-xml-generator',
    'text-yaml-generator',
    'text-csv-generator',
    'text-sql-generator',
    'text-string-analyzer',
    'text-sentence-analyzer',
    'text-word-analyzer',
    'text-character-analyzer',
    'text-article-analyzer',
    'text-poem-analyzer',
    'text-lyrics-analyzer',
    'text-code-analyzer',
    'text-data-analyzer',
    'text-list-analyzer',
    'text-table-analyzer',
    'text-matrix-analyzer',
    'text-vector-analyzer',
    'text-json-analyzer',
    'text-xml-analyzer',
    'text-yaml-analyzer',
    'text-csv-analyzer',
    'text-sql-analyzer',
    'text-string-reverser',
    'text-sentence-reverser',
    'text-word-reverser',
    'text-character-reverser',
    'text-article-reverser',
    'text-poem-reverser',
    'text-lyrics-reverser',
    'text-code-reverser',
    'text-data-reverser',
    'text-list-reverser',
    'text-table-reverser',
    'text-matrix-reverser',
    'text-vector-reverser',
    'text-json-reverser',
    'text-xml-reverser',
    'text-yaml-reverser',
    'text-csv-reverser',
    'text-sql-reverser',
    'text-string-sorter',
    'text-sentence-sorter',
    'text-word-sorter',
    'text-character-sorter',
    'text-article-sorter',
    'text-poem-sorter',
    'text-lyrics-sorter',
    'text-code-sorter',
    'text-data-sorter',
    'text-list-sorter',
    'text-table-sorter',
    'text-matrix-sorter',
    'text-vector-sorter',
    'text-json-sorter',
    'text-xml-sorter',
    'text-yaml-sorter',
    'text-csv-sorter',
    'text-sql-sorter',
    'text-string-decoder',
    'text-sentence-decoder',
    'text-word-decoder',
    'text-character-decoder',
    'text-article-decoder',
    'text-poem-decoder',
    'text-lyrics-decoder',
    'text-code-decoder',
    'text-data-decoder',
    'text-list-decoder',
    'text-table-decoder',
    'text-matrix-decoder',
    'text-vector-decoder',
    'text-json-decoder',
    'text-xml-decoder',
    'text-yaml-decoder',
    'text-csv-decoder',
    'text-sql-decoder',
    'text-string-encoder',
    'text-sentence-encoder',
    'text-word-encoder',
    'text-character-encoder',
    'text-article-encoder',
    'text-poem-encoder',
    'text-lyrics-encoder',
    'text-code-encoder',
    'text-data-encoder',
    'text-list-encoder',
    'fin-mortgage-calculator',
    'fin-mortgage-estimator',
    'fin-mortgage-projector',
    'fin-mortgage-forecaster',
    'fin-mortgage-planner',
    'fin-mortgage-tracker',
    'fin-mortgage-monitor',
    'fin-mortgage-analyzer',
    'fin-mortgage-visualizer',
    'fin-mortgage-chart',
    'fin-mortgage-graph',
    'fin-mortgage-simulator',
    'fin-mortgage-modeler',
    'fin-mortgage-optimizer',
    'fin-mortgage-converter',
    'fin-mortgage-updater',
    'fin-mortgage-fetcher',
    'fin-mortgage-screener',
    'fin-mortgage-scanner',
    'fin-mortgage-alert',
    'fin-mortgage-notifier',
    'fin-loan-calculator',
    'fin-loan-estimator',
    'fin-loan-projector',
    'fin-loan-forecaster',
    'fin-loan-planner',
    'fin-loan-tracker',
    'fin-loan-monitor',
    'fin-loan-analyzer',
    'fin-loan-visualizer',
    'fin-loan-chart',
    'fin-loan-graph',
    'fin-loan-simulator',
    'fin-loan-modeler',
    'fin-loan-optimizer',
    'fin-loan-converter',
    'fin-loan-updater',
    'fin-loan-fetcher',
    'fin-loan-screener',
    'fin-loan-scanner',
    'fin-loan-alert',
    'fin-loan-notifier',
    'fin-interest-calculator',
    'fin-interest-estimator',
    'fin-interest-projector',
    'fin-interest-forecaster',
    'fin-interest-planner',
    'fin-interest-tracker',
    'fin-interest-monitor',
    'fin-interest-analyzer',
    'fin-interest-visualizer',
    'fin-interest-chart',
    'fin-interest-graph',
    'fin-interest-simulator',
    'fin-interest-modeler',
    'fin-interest-optimizer',
    'fin-interest-converter',
    'fin-interest-updater',
    'fin-interest-fetcher',
    'fin-interest-screener',
    'fin-interest-scanner',
    'fin-interest-alert',
    'fin-interest-notifier',
    'fin-compound-calculator',
    'fin-compound-estimator',
    'fin-compound-projector',
    'fin-compound-forecaster',
    'fin-compound-planner',
    'fin-compound-tracker',
    'fin-compound-monitor',
    'fin-compound-analyzer',
    'fin-compound-visualizer',
    'fin-compound-chart',
    'fin-compound-graph',
    'fin-compound-simulator',
    'fin-compound-modeler',
    'fin-compound-optimizer',
    'fin-compound-converter',
    'fin-compound-updater',
    'fin-compound-fetcher',
    'fin-compound-screener',
    'fin-compound-scanner',
    'fin-compound-alert',
    'fin-compound-notifier',
    'fin-tax-calculator',
    'fin-tax-estimator',
    'fin-tax-projector',
    'fin-tax-forecaster',
    'fin-tax-planner',
    'fin-tax-tracker',
    'fin-tax-monitor',
    'fin-tax-analyzer',
    'fin-tax-visualizer',
    'fin-tax-chart',
    'fin-tax-graph',
    'fin-tax-simulator',
    'fin-tax-modeler',
    'fin-tax-optimizer',
    'fin-tax-converter',
    'fin-tax-updater',
    'math-algebra-calculator',
    'math-algebra-solver',
    'math-algebra-grapher',
    'math-algebra-converter',
    'math-algebra-generator',
    'math-algebra-analyzer',
    'math-algebra-visualizer',
    'math-algebra-simulator',
    'math-algebra-estimator',
    'math-algebra-predictor',
    'math-geometry-calculator',
    'math-geometry-solver',
    'math-geometry-grapher',
    'math-geometry-converter',
    'math-geometry-generator',
    'math-geometry-analyzer',
    'math-geometry-visualizer',
    'math-geometry-simulator',
    'math-geometry-estimator',
    'math-geometry-predictor',
    'math-calculus-calculator',
    'math-calculus-solver',
    'math-calculus-grapher',
    'math-calculus-converter',
    'math-calculus-generator',
    'math-calculus-analyzer',
    'math-calculus-visualizer',
    'math-calculus-simulator',
    'math-calculus-estimator',
    'math-calculus-predictor',
    'math-trigonometry-calculator',
    'math-trigonometry-solver',
    'math-trigonometry-grapher',
    'math-trigonometry-converter',
    'math-trigonometry-generator',
    'math-trigonometry-analyzer',
    'math-trigonometry-visualizer',
    'math-trigonometry-simulator',
    'math-trigonometry-estimator',
    'math-trigonometry-predictor',
    'math-statistics-calculator',
    'math-statistics-solver',
    'math-statistics-grapher',
    'math-statistics-converter',
    'math-statistics-generator',
    'math-statistics-analyzer',
    'math-statistics-visualizer',
    'math-statistics-simulator',
    'math-statistics-estimator',
    'math-statistics-predictor',
    'math-probability-calculator',
    'math-probability-solver',
    'math-probability-grapher',
    'math-probability-converter',
    'math-probability-generator',
    'math-probability-analyzer',
    'math-probability-visualizer',
    'math-probability-simulator',
    'math-probability-estimator',
    'math-probability-predictor',
    'math-fractions-calculator',
    'math-fractions-solver',
    'math-fractions-grapher',
    'math-fractions-converter',
    'math-fractions-generator',
    'math-fractions-analyzer',
    'math-fractions-visualizer',
    'math-fractions-simulator',
    'math-fractions-estimator',
    'math-fractions-predictor',
    'math-percentages-calculator',
    'math-percentages-solver',
    'math-percentages-grapher',
    'math-percentages-converter',
    'math-percentages-generator',
    'math-percentages-analyzer',
    'math-percentages-visualizer',
    'math-percentages-simulator',
    'math-percentages-estimator',
    'math-percentages-predictor',
    'math-ratios-calculator',
    'math-ratios-solver',
    'math-ratios-grapher',
    'math-ratios-converter',
    'math-ratios-generator',
    'math-ratios-analyzer',
    'math-ratios-visualizer',
    'math-ratios-simulator',
    'math-ratios-estimator',
    'math-ratios-predictor',
    'math-proportions-calculator',
    'math-proportions-solver',
    'math-proportions-grapher',
    'math-proportions-converter',
    'math-proportions-generator',
    'math-proportions-analyzer',
    'math-proportions-visualizer',
    'math-proportions-simulator',
    'math-proportions-estimator',
    'math-proportions-predictor'
  ]);
  
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

  const seoTopics = ['Keywords', 'Backlinks', 'Traffic', 'Ranking', 'SERP', 'Domain', 'Meta', 'H1', 'Links', 'Images', 'Alt Text', 'Sitemap', 'Robots', 'Canonical', 'Redirects', '404', 'Performance', 'Mobile', 'Vitals', 'CTR', 'Impressions', 'Clicks', 'Bounce', 'Session', 'Conversion', 'RoI', 'PPC', 'AdWords', 'Analytics', 'Tag Manager', 'Social', 'Local SEO', 'GMB', 'Reviews', 'Citations', 'NAP', 'Schema', 'Snippets', 'Knowledge', 'Voice', 'Video SEO', 'ASO', 'Content', 'Blog', 'Article', 'Landing Page', 'PR'];
  const seoActions = ['Analyzer', 'Checker', 'Generator', 'Tracker', 'Monitor', 'Auditor', 'Extractor', 'Scraper', 'Finder', 'Explorer', 'Planner', 'Optimizer', 'Validator', 'Builder', 'Simulator', 'Estimator', 'Reporter', 'Dashboard', 'Visualizer', 'Comparator', 'Benchmarker'];
  for (const t of seoTopics) {
      for (const a of seoActions) {
          tools.push({ id: `seo-${t.toLowerCase().replace(' ', '-')}-${a.toLowerCase()}`, name: `${t} ${a}`, category: 'SEO & Marketing', tags: [t.toLowerCase(), a.toLowerCase(), 'seo', 'marketing'] });
      }
  }

  const aiTopics = ['Text', 'Image', 'Audio', 'Video', '3D', 'Code', 'Data', 'Model', 'Prompt', 'Token', 'Embeddings', 'Dataset', 'Chatbot', 'Agent', 'Workflow', 'Pipeline', 'UI', 'Website', 'App', 'Game', 'Music', 'Voice', 'Speech', 'Translation', 'Summary', 'Essay', 'Poem', 'Story', 'Snippet', 'Regex', 'SQL', 'NoSQL', 'Graph', 'Chart', 'Presentation', 'Spreadsheet', 'Document', 'PDF', 'Email', 'Message', 'Reply', 'Post', 'Tweet', 'Ad', 'Copy', 'Headline', 'Title', 'Subject', 'Bio', 'Description', 'Review', 'Comment', 'Feedback', 'Survey', 'Poll'];
  const aiActions = ['Generator', 'Creator', 'Maker', 'Builder', 'Writer', 'Composer', 'Designer', 'Editor', 'Improver', 'Enhancer', 'Upscaler', 'Refiner', 'Analyzer', 'Evaluator', 'Scorer', 'Reviewer', 'Critique', 'Summarizer', 'Expander', 'Translator', 'Paraphraser', 'Rewriter'];
  for (const t of aiTopics) {
      for (const a of aiActions) {
          tools.push({ id: `ai-${t.toLowerCase().replace(' ', '-')}-${a.toLowerCase()}`, name: `AI ${t} ${a}`, category: 'Artificial Intelligence', tags: ['ai', t.toLowerCase(), a.toLowerCase(), 'generator'] });
      }
  }

  const finTopics = ['Mortgage', 'Loan', 'Interest', 'Compound', 'Tax', 'Salary', 'Hourly', 'Budget', 'Expense', 'Income', 'Savings', 'Investment', 'Retirement', '401k', 'IRA', 'Stocks', 'Bonds', 'Options', 'Futures', 'Forex', 'Crypto', 'Bitcoin', 'Ethereum', 'NFT', 'DeFi', 'Yield', 'Margin', 'Leverage', 'Dividend', 'Portfolio', 'Risk', 'Volatility', 'Beta', 'Alpha', 'Sharpe', 'Sortino', 'Treynor', 'CAPM', 'WACC', 'DCF', 'NPV', 'IRR', 'ROI', 'ROE', 'ROA', 'EBITDA', 'P/E', 'EPS', 'Revenue', 'Profit', 'Markup', 'Discount', 'Sale'];
  const finActions = ['Calculator', 'Estimator', 'Projector', 'Forecaster', 'Planner', 'Tracker', 'Monitor', 'Analyzer', 'Visualizer', 'Chart', 'Graph', 'Simulator', 'Modeler', 'Optimizer', 'Converter', 'Updater', 'Fetcher', 'Screener', 'Scanner', 'Alert', 'Notifier'];
  for (const t of finTopics) {
      for (const a of finActions) {
          tools.push({ id: `fin-${t.toLowerCase().replace(' ', '-')}-${a.toLowerCase()}`, name: `${t} ${a}`, category: 'Finance', tags: [t.toLowerCase(), a.toLowerCase(), 'finance', 'money'] });
      }
  }

  const healthTopics = ['BMI', 'BMR', 'TDEE', 'Macros', 'Calories', 'Protein', 'Carbs', 'Fat', 'Water', 'Sleep', 'Heart Rate', 'Blood Pressure', 'Blood Sugar', 'Cholesterol', 'Weight', 'Height', 'Body Fat', 'Muscle Mass', 'Bone Density', 'Steps', 'Distance', 'Pace', 'Speed', 'Cadence', 'VO2 Max', 'Power', 'Wattage', 'Resistance', 'Reps', 'Sets', 'Volume', '1RM', 'Wilks', 'Dots', 'Sinclair', 'Pregnancy', 'Ovulation', 'Period', 'Fertility', 'Due Date', 'Milestones', 'Vaccination', 'Medication', 'Supplement', 'Vitamin', 'Mineral', 'Allergy', 'Symptom', 'Disease', 'Condition', 'Treatment', 'Therapy', 'Recovery', 'Rehab'];
  const healthActions = ['Tracker', 'Calculator', 'Log', 'Journal', 'Diary', 'Planner', 'Schedule', 'Routine', 'Program', 'Plan', 'Guide', 'Coach', 'Monitor', 'Analyzer', 'Estimator', 'Predictor', 'Checker', 'Test', 'Quiz', 'Assessment', 'Profile'];
  for (const t of healthTopics) {
      for (const a of healthActions) {
          tools.push({ id: `health-${t.toLowerCase().replace(' ', '-')}-${a.toLowerCase()}`, name: `${t} ${a}`, category: 'Health & Fitness', tags: [t.toLowerCase(), a.toLowerCase(), 'health', 'fitness', 'medical'] });
      }
  }

  const audioTopics = ['MP3', 'WAV', 'FLAC', 'AAC', 'OGG', 'M4A', 'WMA', 'ALAC', 'AIFF', 'DSD', 'MIDI', 'Voice', 'Speech', 'Music', 'Song', 'Track', 'Album', 'Podcast', 'Audiobook', 'Sound Effect', 'Ringtone', 'Alarm', 'Notification', 'Beat', 'Sample', 'Loop', 'Stem', 'Vocals', 'Instrumental', 'Bass', 'Drums', 'Guitar', 'Piano', 'Synth', 'Strings', 'Brass', 'Woodwinds', 'Percussion', 'Choir', 'Orchestra', 'Band', 'Concert', 'Live', 'Studio', 'Master', 'Mix', 'Remix', 'Mashup', 'Cover', 'Karaoke', 'Acapella'];
  const audioActions = ['Converter', 'Compressor', 'Extractor', 'Trimmer', 'Cutter', 'Joiner', 'Merger', 'Splitter', 'Mixer', 'Equalizer', 'Normalizer', 'Amplifier', 'Panner', 'Pitcher', 'Stretcher', 'Reverser', 'Inverter', 'BPM', 'Key', 'Chord', 'Tuner', 'Metronome', 'Synthesizer', 'Sequencer', 'Sampler', 'Player', 'Recorder', 'Editor', 'Visualizer', 'Analyzer', 'Identifier', 'Tagger', 'Renamer', 'Organizer', 'Downloader', 'Uploader', 'Streamer', 'Broadcaster'];
  for (const t of audioTopics) {
      for (const a of audioActions) {
          tools.push({ id: `audio-${t.toLowerCase().replace(' ', '-')}-${a.toLowerCase()}`, name: `${t} ${a}`, category: 'Audio Tools', tags: [t.toLowerCase(), a.toLowerCase(), 'audio', 'sound', 'music'] });
      }
  }

  // Add the initial active tools to an ignore set so we don't yield duplicated IDs or names
  return tools.filter(t => !ignoredIds.has(t.id));
}
