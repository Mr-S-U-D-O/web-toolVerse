# Web-ToolVerse

Web-ToolVerse is a comprehensive collection of completely free, client-side web tools. It includes utilities ranging from image formatting to developer tools, cryptography algorithms, string manipulators, and much more! 

## Architecture & Design

Web-ToolVerse adopts a strictly **"One Tool, One Component"** architecture. This avoids massive monolithic files and prevents UI clutter. 
* All tools are stored as standalone React components inside `src/components/`.
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

<!-- TOOLS_LIST_START -->
## Included Tools

### 1. Image Compressor
- **Target Audience:** Designers, Content Creators, & Photographers
- **Problem Solved:** Compress JPG, PNG, WebP and more — 100% client-side, no uploads, unlimited batch with ZIP export.

### 2. PDF Studio
- **Target Audience:** Office Workers & Students
- **Problem Solved:** Merge, split, reorder, rotate and encrypt PDFs in one workflow. No uploads. 100% client-side.

### 3. Background Remover
- **Target Audience:** Designers, Content Creators, & Photographers
- **Problem Solved:** Remove image backgrounds instantly using on-device AI. 100% private — no uploads, no limits, full-resolution transparent PNG.

### 4. Image Converter
- **Target Audience:** Designers, Content Creators, & Photographers
- **Problem Solved:** Convert JPG, PNG, WebP, and HEIC offline. Instant native canvas processing, no server uploads.

### 5. Video Transcoder
- **Target Audience:** Video Editors & Social Media Managers
- **Problem Solved:** Convert MP4, WebM, and GIF entirely in your browser using multi-threaded WebAssembly. No cloud limits.

### 6. YouTube Downloader
- **Target Audience:** Video Editors & Social Media Managers
- **Problem Solved:** Extract YouTube videos and audio up to 4K using our Hybrid WASM architecture.

### 7. Facebook Downloader
- **Target Audience:** Video Editors & Social Media Managers
- **Problem Solved:** Extract Facebook videos natively in your browser.

### 8. TikTok Downloader
- **Target Audience:** Video Editors & Social Media Managers
- **Problem Solved:** Download TikToks seamlessly without watermarks.

### 9. Instagram Downloader
- **Target Audience:** Video Editors & Social Media Managers
- **Problem Solved:** Extract Instagram Reels and Posts safely and securely.

### 10. Comma Separator
- **Target Audience:** Writers, Editors, & Data Processors
- **Problem Solved:** Format lists of items with commas or custom delimiters.

### 11. Text Sorter
- **Target Audience:** Writers, Editors, & Data Processors
- **Problem Solved:** Sort lines of text alphabetically, numerically, or by length.

### 12. Remove Line Breaks
- **Target Audience:** Writers, Editors, & Data Processors
- **Problem Solved:** Clean up text by removing line breaks and replacing them with spaces.

### 13. Case Converter
- **Target Audience:** Writers, Editors, & Data Processors
- **Problem Solved:** Convert text case to UPPERCASE, lowercase, Title Case, camelCase, etc.

### 14. Text to Slug
- **Target Audience:** Writers, Editors, & Data Processors
- **Problem Solved:** Generate URL-friendly, clean slugs from any text input.

### 15. Lorem Ipsum Generator
- **Target Audience:** Writers, Editors, & Data Processors
- **Problem Solved:** Generate mock paragraphs, sentences, or lists for layout testing.

### 16. Word Counter
- **Target Audience:** Writers, Editors, & Data Processors
- **Problem Solved:** Get real-time character, word, line, and sentence counts, reading times, and keyword density.

### 17. Random Word Generator
- **Target Audience:** Writers, Editors, & Data Processors
- **Problem Solved:** Generate random English words based on category, count, and filters.

### 18. Text Repeater
- **Target Audience:** Writers, Editors, & Data Processors
- **Problem Solved:** Repeat a block of text a specified number of times with custom delimiters.

### 19. Length Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between millimeters, centimeters, meters, kilometers, inches, feet, yards, and miles.

### 20. Area Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between square meters, square kilometers, hectares, acres, square feet, and square miles.

### 21. Weight Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between milligrams, grams, kilograms, ounces, pounds, stones, and tons.

### 22. Volume Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between milliliters, liters, gallons, quarts, pints, cups, and cubic meters.

### 23. Temperature Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between Celsius, Fahrenheit, and Kelvin scales instantly.

### 24. Each Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between singles, pairs, dozens, scores, gross, and great gross quantities.

### 25. Time Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between milliseconds, seconds, minutes, hours, days, weeks, months, and years.

### 26. Digital Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between bits, bytes, kilobytes, megabytes, gigabytes, and terabytes.

### 27. Parts Per Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between percent, permille, parts per million (ppm), and parts per billion (ppb).

### 28. Speed Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between m/s, km/h, mph, knots, Mach, and speed of light.

### 29. Pace Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert running/walking pace values (min/km, min/mile, seconds/meter).

### 30. Pressure Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between Pascals, bars, PSI, atmospheres, and Torr.

### 31. Current Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between microamperes, milliamperes, amperes, and kiloamperes.

### 32. Voltage Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between microvolts, millivolts, volts, and kilovolts.

### 33. Power Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between watts, kilowatts, megawatts, horsepower, and BTU/hr.

### 34. Reactive Power Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between volt-amperes reactive (VAR), kVAR, and MVAR.

### 35. Apparent Power Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between volt-amperes (VA), kilovolt-amperes (kVA), and megavolt-amperes (MVA).

### 36. Energy Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between Joules, calories, watt-hours, kilowatt-hours, and BTUs.

### 37. Reactive Energy Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert between volt-ampere reactive hours (VARh), kVARh, and MVARh.

### 38. Volumetric Flow Rate Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert volumetric flow rates (L/s, L/min, m³/s, cubic feet/s, GPM).

### 39. Illuminance Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert light levels between lux, foot-candles, and phots.

### 40. Frequency Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert frequencies between Hertz, kilohertz, megahertz, gigahertz, and rad/s.

### 41. Angle Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert angles between degrees, radians, gradians, arcminutes, and arcseconds.

### 42. Currency Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert values between global currencies with live Exchange Rate updates.

### 43. Number to Word Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Translate digits and integers into standard English spelled-out words.

### 44. Word to Number Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Parse English spelled-out numerals back into standard numeric digits.

### 45. Torque Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert rotational force between Newton-meters, foot-pounds, and inch-pounds.

### 46. Charge Converter
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert electric charge between coulombs, ampere-hours, and faradays.

### 47. Number to Roman Numerals
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert standard integers into traditional Roman Numeral representation.

### 48. Roman Numerals to Number
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert Roman Numeral strings back into standard decimal integers.

### 49. Text to Binary
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert plain text strings into binary code (0s and 1s).

### 50. Binary to Text
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert binary code strings back into plain UTF-8 text.

### 51. HEX to Binary
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert hexadecimal strings into binary representation.

### 52. Binary to HEX
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert binary strings into hexadecimal notation.

### 53. ASCII to Binary
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert ASCII decimal values into binary representation.

### 54. Binary to ASCII
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert binary representation back to ASCII decimal codes.

### 55. Decimal to Binary
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert standard decimal numbers to binary code representation.

### 56. Binary to Decimal
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert binary code representation back to standard decimal numbers.

### 57. Text to ASCII
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert plain text characters to their ASCII decimal codes.

### 58. ASCII to Text
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert decimal ASCII codes back into plain UTF-8 text.

### 59. HEX to Decimal
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert hexadecimal strings into standard decimal integers.

### 60. Decimal to HEX
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert standard decimal integers into hexadecimal representation.

### 61. Octal to Binary
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert octal values into binary representations.

### 62. Binary to Octal
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert binary code into octal representation.

### 63. Octal to Decimal
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert octal values into standard decimal integers.

### 64. Decimal to Octal
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert standard decimal integers into octal representation.

### 65. HEX to Octal
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert hexadecimal representation into octal values.

### 66. Octal to HEX
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert octal representation into hexadecimal values.

### 67. Text to Octal
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert plain text strings into octal byte representation.

### 68. Octal to Text
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert octal byte representation back into plain UTF-8 text.

### 69. Text to HEX
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert plain text strings into hexadecimal representations.

### 70. HEX to Text
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert hexadecimal representation back into plain UTF-8 text.

### 71. Text to Decimal
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert plain text strings into decimal byte codes.

### 72. Decimal to Text
- **Target Audience:** Students, Scientists, & General Users
- **Problem Solved:** Convert decimal byte codes back into plain UTF-8 text.

### 73. MD5 Generator
- **Target Audience:** Security Professionals & Developers
- **Problem Solved:** Generate standard MD5 cryptographic hashes from text or local files.

### 74. Base64 Encode
- **Target Audience:** Security Professionals & Developers
- **Problem Solved:** Encode plain text or local files into standard Base64 representation.

### 75. Base64 Decode
- **Target Audience:** Security Professionals & Developers
- **Problem Solved:** Decode standard Base64 string representations back to plain text or binary files.

### 76. Password Generator
- **Target Audience:** Security Professionals & Developers
- **Problem Solved:** Generate secure, customizable, high-entropy passwords on your local device.

### 77. What Is My IP
- **Target Audience:** General Web Users
- **Problem Solved:** Instantly view your public IP address and query geo-location, ISP, and timezone data.

### 78. IP Address Lookup
- **Target Audience:** General Web Users
- **Problem Solved:** Query details and location profiles of any public IPv4 or IPv6 address.

### 79. VTT to SRT
- **Target Audience:** General Web Users
- **Problem Solved:** Convert WebVTT subtitle files (.vtt) to SubRip subtitle files (.srt) locally.

### 80. SRT to VTT
- **Target Audience:** General Web Users
- **Problem Solved:** Convert SubRip subtitle files (.srt) to WebVTT subtitle files (.vtt) locally.

### 81. YouTube Thumbnail Downloader
- **Target Audience:** Video Editors & Social Media Managers
- **Problem Solved:** Extract and download YouTube video thumbnail images in all available sizes.

### 82. Color Converter
- **Target Audience:** Designers, Content Creators, & Photographers
- **Problem Solved:** Convert between HEX, RGB, HSL, and CMYK color representations with a visual picker.

### 83. HEX to RGB
- **Target Audience:** Designers, Content Creators, & Photographers
- **Problem Solved:** Quickly convert hexadecimal color strings into decimal RGB format.

### 84. RGB to HEX
- **Target Audience:** Designers, Content Creators, & Photographers
- **Problem Solved:** Quickly convert decimal RGB color channels into hexadecimal color strings.

### 85. JSON Viewer
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Parse raw JSON data and explore its keys, structures, and values in an interactive collapsible tree view.

### 86. JSON Formatter
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Beautify JSON text with custom indentation levels (2 spaces, 4 spaces, or Tabs) for easier reading.

### 87. JSON Validator
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Verify standard JSON compliance, validate syntax, and pinpoint parsing errors with line highlights.

### 88. JSON Editor
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Modify JSON data with a dual-pane sync setup: raw text area alongside an interactive tree and value form editor.

### 89. JSON Minify
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Strip all comments, whitespace, indentation, and newlines from a JSON payload to reduce file size.

### 90. XML to JSON
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Convert structured XML documents or tags into structured JSON representation recursively.

### 91. CSV to JSON
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Parse CSV files or pasted spreadsheets and convert row values into structured JSON objects.

### 92. TSV to JSON
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Convert Tab-Separated Values (TSV) documents or spreadsheets into structured JSON arrays of objects.

### 93. JSON to XML
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Serialize a JSON object or array back into valid XML markup with a custom root element wrapper.

### 94. JSON to CSV
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Flatten arrays of JSON objects into tabular CSV representation, extracting headers from keys.

### 95. JSON to Text
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Flatten structured JSON objects into human-readable plain text key-value lines.

### 96. JSON to TSV
- **Target Audience:** Developers & Data Analysts
- **Problem Solved:** Convert structured JSON arrays of objects into Tab-Separated Values (TSV) lists.

### 97. Dictionary Studio
- **Target Audience:** General Web Users
- **Problem Solved:** Lookup standard word definitions, phonetics, and audio pronunciations, or search for words using concept descriptions.

### 98. Web IDE Studio
- **Target Audience:** Software Developers & Engineers
- **Problem Solved:** A 100% client-side web IDE for HTML, CSS, and JavaScript. Manage virtual files, use Monaco editor, and view live previews.

<!-- TOOLS_LIST_END -->
