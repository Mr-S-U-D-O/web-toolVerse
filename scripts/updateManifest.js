const fs = require('fs');
const path = require('path');

const manifestPath = path.join(__dirname, 'src', 'data', 'toolsManifest.ts');
let content = fs.readFileSync(manifestPath, 'utf8');

if (!content.includes('keywords?: string[]') && !content.includes('keywords: string[]')) {
  content = content.replace(/status: 'active';/, "status: 'active';\n  keywords?: string[];");
}

const keywordsMap = {
  'image-compressor': ['make image smaller', 'reduce file size', 'shrink picture', 'optimize photo', 'bulk image compress'],
  'pdf-studio': ['merge pdf', 'split pdf', 'edit pdf', 'rotate pdf', 'secure pdf'],
  'background-remover': ['transparent background', 'cut out image', 'remove bg', 'isolate subject', 'magic wand'],
  'image-converter': ['change format', 'heic to jpg', 'png maker', 'webp converter', 'convert picture'],
  'video-transcoder': ['convert video', 'mp4 to webm', 'video to gif', 'change video format', 'compress video'],
  'youtube-downloader': ['yt downloader', 'save youtube', 'download video', 'youtube to mp4', 'offline video'],
  'facebook-downloader': ['fb video', 'save facebook video', 'download fb', 'facebook to mp4'],
  'tiktok-downloader': ['download tiktok', 'no watermark', 'save tiktok', 'tt downloader'],
  'instagram-downloader': ['ig downloader', 'save reel', 'download instagram', 'insta video'],
  'comma-separator': ['add commas', 'delimit list', 'comma format', 'separate items', 'list to commas'],
  'text-sorter': ['alphabetize', 'sort words', 'order list', 'arrange text', 'sort lines'],
  'remove-line-breaks': ['delete enters', 'single line text', 'join lines', 'strip newlines', 'flatten text'],
  'case-converter': ['uppercase', 'lowercase', 'capitalize', 'title case', 'camel case'],
  'text-to-slug': ['make url', 'url slug', 'hyphenate text', 'seo link', 'clean url'],
  'lorem-ipsum-generator': ['dummy text', 'placeholder text', 'fake latin', 'mock text', 'filler text'],
  'word-counter': ['count words', 'character count', 'how many words', 'text stats', 'reading time'],
  'random-word-generator': ['generate words', 'random english words', 'vocabulary', 'word list', 'idea generator'],
  'text-repeater': ['copy text', 'duplicate string', 'repeat words', 'multiply text', 'spam text'],
  'length-converter': ['meters to feet', 'inches to cm', 'distance converter', 'measure length', 'miles to km'],
  'area-converter': ['square feet to meters', 'acres to hectares', 'measure area', 'land size'],
  'weight-converter': ['lbs to kg', 'pounds to kilograms', 'grams to ounces', 'measure weight', 'mass converter'],
  'volume-converter': ['liters to gallons', 'ml to cups', 'liquid volume', 'measure capacity', 'pints to quarts'],
  'temperature-converter': ['celsius to fahrenheit', 'f to c', 'kelvin', 'measure heat', 'weather temp'],
  'each-converter': ['dozen', 'gross', 'score', 'count items', 'quantities'],
  'time-converter': ['minutes to hours', 'days to seconds', 'weeks to months', 'measure time', 'duration'],
  'digital-converter': ['mb to gb', 'bytes to kb', 'storage size', 'file size converter', 'terabytes'],
  'parts-per-converter': ['ppm', 'ppb', 'percent', 'permille', 'concentration'],
  'speed-converter': ['mph to kmh', 'knots', 'mach', 'velocity', 'how fast'],
  'pace-converter': ['running pace', 'min per mile', 'marathon pace', 'walking speed', 'min per km'],
  'pressure-converter': ['psi to bar', 'pascals', 'atmospheres', 'measure pressure', 'torr'],
  'current-converter': ['amps', 'milliamps', 'electric current', 'measure current', 'amperes'],
  'voltage-converter': ['volts', 'millivolts', 'kilovolts', 'electric potential', 'measure voltage'],
  'power-converter': ['watts to hp', 'kilowatts', 'horsepower', 'measure power', 'megawatts'],
  'reactive-power-converter': ['var', 'kvar', 'mvar', 'reactive power', 'ac power'],
  'apparent-power-converter': ['va', 'kva', 'mva', 'apparent power', 'complex power'],
  'energy-converter': ['joules to calories', 'kwh', 'btu', 'measure energy', 'watt hours'],
  'reactive-energy-converter': ['varh', 'kvarh', 'reactive energy', 'power integral'],
  'volumetric-flow-rate-converter': ['gpm', 'liters per second', 'flow rate', 'pipe flow', 'fluid dynamics'],
  'illuminance-converter': ['lux to foot candles', 'light level', 'brightness', 'measure light', 'phots'],
  'frequency-converter': ['hertz', 'mhz', 'ghz', 'measure frequency', 'cycles per second'],
  'angle-converter': ['degrees to radians', 'arcminutes', 'measure angle', 'geometry'],
  'currency-converter': ['exchange rate', 'usd to eur', 'money converter', 'fx rates', 'foreign exchange'],
  'number-to-word-converter': ['spell out number', 'number spelling', 'digits to text', 'write check'],
  'word-to-number-converter': ['text to digits', 'words to numbers', 'parse number', 'spelled out math'],
  'torque-converter': ['newton meters', 'foot pounds', 'measure torque', 'rotational force'],
  'charge-converter': ['coulombs', 'ampere hours', 'electric charge', 'battery capacity'],
  'number-to-roman-numerals': ['roman digits', 'number to roman', 'latin numbers', 'ancient math'],
  'roman-numerals-to-number': ['roman to decimal', 'decode roman', 'translate roman', 'roman numerals'],
  'text-to-binary': ['text to 01', 'binary code', 'encode binary', 'letters to bits', 'binary translator'],
  'binary-to-text': ['01 to text', 'decode binary', 'bits to letters', 'binary reader', 'binary decoder'],
  'hex-to-binary': ['hexadecimal to 01', 'base16 to base2', 'convert hex', 'hex math'],
  'binary-to-hex': ['01 to hex', 'base2 to base16', 'convert binary'],
  'ascii-to-binary': ['ascii to 01', 'ascii code', 'char to bits'],
  'binary-to-ascii': ['01 to ascii', 'bits to char'],
  'decimal-to-binary': ['base10 to base2', 'number to 01', 'math binary'],
  'binary-to-decimal': ['base2 to base10', '01 to number', 'binary math'],
  'text-to-ascii': ['text to numbers', 'char code', 'ascii values'],
  'ascii-to-text': ['numbers to text', 'decode ascii', 'char values'],
  'hex-to-decimal': ['base16 to base10', 'hex math', 'hex to number'],
  'decimal-to-hex': ['base10 to base16', 'number to hex'],
  'octal-to-binary': ['base8 to base2', 'octal math'],
  'binary-to-octal': ['base2 to base8'],
  'octal-to-decimal': ['base8 to base10'],
  'decimal-to-octal': ['base10 to base8'],
  'hex-to-octal': ['base16 to base8'],
  'octal-to-hex': ['base8 to base16'],
  'text-to-octal': ['words to base8'],
  'octal-to-text': ['base8 to words'],
  'text-to-hex': ['words to hex', 'encode hex'],
  'hex-to-text': ['hex to words', 'decode hex'],
  'text-to-decimal': ['words to base10', 'text to numbers'],
  'decimal-to-text': ['base10 to words'],
  'md5-generator': ['md5 hash', 'checksum', 'encrypt text', 'hash file', 'message digest'],
  'base64-encode': ['to base64', 'encode text', 'file to base64', 'b64 encoder', 'data uri'],
  'base64-decode': ['from base64', 'decode base64', 'b64 decoder', 'read base64'],
  'password-generator': ['make password', 'strong pass', 'random password', 'secure key', 'generate pass'],
  'what-is-my-ip': ['check ip', 'my ip address', 'find ip', 'where am i', 'isp check'],
  'ip-address-lookup': ['ip location', 'whois ip', 'trace ip', 'geo ip', 'ip info'],
  'vtt-to-srt': ['convert subtitles', 'vtt converter', 'subtitle format', 'webvtt to subrip'],
  'srt-to-vtt': ['subrip to webvtt', 'convert srt', 'subtitle converter', 'caption format'],
  'youtube-thumbnail-downloader': ['yt thumbnail', 'save thumbnail', 'download cover', 'youtube image', 'video poster'],
  'color-converter': ['hex to rgb', 'rgb to hsl', 'color picker', 'color codes', 'css color'],
  'hex-to-rgb': ['hexadecimal color', 'color format', 'convert hex color'],
  'rgb-to-hex': ['rgb color', 'css hex', 'convert rgb color'],
  'json-viewer': ['view json', 'pretty print', 'expand json', 'read json', 'json tree'],
  'json-formatter': ['beautify json', 'format json', 'json indentation', 'clean json', 'pretty json'],
  'json-validator': ['check json', 'lint json', 'json syntax', 'validate json', 'fix json'],
  'json-editor': ['edit json', 'modify json', 'change json', 'update json data', 'json creator'],
  'json-minify': ['compress json', 'uglify json', 'shrink json', 'remove whitespace json', 'one line json'],
  'xml-to-json': ['convert xml', 'parse xml', 'xml parser', 'json from xml'],
  'csv-to-json': ['spreadsheet to json', 'excel to json', 'convert csv', 'parse csv'],
  'tsv-to-json': ['tab separated to json', 'convert tsv', 'parse tsv'],
  'json-to-xml': ['json to tags', 'convert to xml', 'generate xml'],
  'json-to-csv': ['json to excel', 'json to spreadsheet', 'flatten json', 'export csv'],
  'json-to-text': ['json to string', 'stringify json', 'json to plain text', 'extract json text'],
  'json-to-tsv': ['json to tabs', 'json to spreadsheet', 'export tsv'],
  'dictionary': ['define word', 'word meaning', 'thesaurus', 'pronunciation', 'vocabulary lookup']
};

let modifiedContent = content;

Object.keys(keywordsMap).forEach(id => {
  const regex = new RegExp("(id:\\s*['\"]" + id + "['\"][\\s\\S]*?status:\\s*'active')(,?)");
  const keywordsStr = JSON.stringify(keywordsMap[id]);
  modifiedContent = modifiedContent.replace(regex, "$1,\n    keywords: " + keywordsStr);
});

if (!modifiedContent.includes("'web-ide-studio'")) {
  const newTool = "  {\n" +
    "    id: 'web-ide-studio',\n" +
    "    name: 'Web IDE Studio',\n" +
    "    description: '100% client-side web IDE for HTML, CSS, and JavaScript with virtual file system and live preview.',\n" +
    "    category: 'Developer Tools',\n" +
    "    icon: null,\n" +
    "    status: 'active',\n" +
    "    keywords: [\"html compiler\", \"js sandbox\", \"code editor\", \"test code\", \"frontend environment\"]\n" +
    "  },\n";
  
  modifiedContent = modifiedContent.replace(/export const ALL_TOOLS: Tool\[\] = \[/, "export const ALL_TOOLS: Tool[] = [\n" + newTool);
}

fs.writeFileSync(manifestPath, modifiedContent, 'utf8');
console.log('Manifest successfully updated.');
