import React, { useState, useMemo } from 'react';
import { Search, ArrowRight } from 'lucide-react';
import { getInactiveTools } from '../data/inactiveTools';

interface LandingPageProps {
  onNavigate: (toolId: string) => void;
}

export const ACTIVE_TOOLS = [
  { 
    id: 'image-cropper', 
    name: 'Image Cropper', 
    category: 'Image Tools',
    tags: ['image', 'crop', 'cut', 'trim', 'resize', 'photo', 'picture', 'edit', 'dimensions', 'aspect ratio']
  },
  { 
    id: 'image-compressor', 
    name: 'Image Compressor', 
    category: 'Image Tools',
    tags: ['image', 'compress', 'reduce', 'size', 'shrink', 'optimize', 'photo', 'picture', 'jpeg', 'jpg', 'png', 'webp', 'smaller', 'kb', 'mb']
  },
  { 
    id: 'image-resizer', 
    name: 'Image Resizer', 
    category: 'Image Tools',
    tags: ['image', 'resize', 'scale', 'dimension', 'photo', 'picture', 'width', 'height', 'resolution', 'enlarge', 'shrink']
  },
  { 
    id: 'text-formatter', 
    name: 'Text Formatter', 
    category: 'Text Formatters',
    tags: ['text', 'format', 'case', 'uppercase', 'lowercase', 'string', 'words', 'title', 'sentence', 'transform', 'spaces', 'remove']
  },
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'Developers',
    tags: ['json', 'format', 'beautify', 'minify', 'validate', 'developer', 'code', 'syntax', 'parse', 'pretty', 'object']
  },
  {
    id: 'color-converter',
    name: 'Color Converter',
    category: 'Developers',
    tags: ['color', 'convert', 'hex', 'rgb', 'hsl', 'css', 'design', 'palette', 'developer', 'picker', 'code']
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    category: 'Security',
    tags: ['password', 'generate', 'secure', 'random', 'keys', 'passphrase', 'strength', 'security', 'hash', 'protect', 'auth']
  },
  { 
    id: 'video-downloader', 
    name: 'Video Downloader', 
    category: 'Video Tools',
    tags: ['video', 'download', 'save', 'mp4', 'youtube', 'instagram', 'clip', 'media', 'movie']
  },
  { 
    id: 'pdf-to-word', 
    name: 'PDF to Word', 
    category: 'PDF Utilities',
    tags: ['pdf', 'word', 'convert', 'document', 'doc', 'docx', 'office', 'text']
  },
  {
    id: 'base64-converter',
    name: 'Base64 Converter',
    category: 'Developers',
    tags: ['base64', 'encode', 'decode', 'converter', 'string', 'text', 'developer']
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder / Decoder',
    category: 'Developers',
    tags: ['url', 'uri', 'encode', 'decode', 'converter', 'link', 'web', 'developer']
  },
  {
    id: 'qrcode-generator',
    name: 'QR Code Generator',
    category: 'Image Tools',
    tags: ['qr', 'code', 'generator', 'create', 'image', 'scan', 'barcode', 'link', 'url']
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    category: 'Security',
    tags: ['hash', 'generator', 'security', 'sha1', 'sha256', 'sha384', 'sha512', 'md5', 'crypto', 'encrypt']
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    category: 'Text Formatters',
    tags: ['markdown', 'preview', 'editor', 'text', 'md', 'format', 'render', 'developer']
  },
  {
    id: 'text-string-reverser',
    name: 'String Reverser',
    category: 'Text Formatters',
    tags: ['string', 'reverser', 'text']
  },
  {
    id: 'text-word-counter',
    name: 'Word Counter',
    category: 'Text Formatters',
    tags: ['word', 'counter', 'text', 'character', 'line']
  },
  {
    id: 'text-list-sorter',
    name: 'List Sorter',
    category: 'Text Formatters',
    tags: ['list', 'sorter', 'text', 'alphabetical']
  },
  {
    id: 'dev-css-minifier',
    name: 'CSS Minifier',
    category: 'Developers',
    tags: ['css', 'minifier', 'code', 'compress']
  },
  {
    id: 'dev-javascript-minifier',
    name: 'JavaScript Minifier',
    category: 'Developers',
    tags: ['javascript', 'minifier', 'code', 'compress', 'js']
  },
  {
    id: 'dev-json-minifier',
    name: 'JSON Minifier',
    category: 'Developers',
    tags: ['json', 'minifier', 'code', 'compress']
  },
  {
    id: 'math-percentages-calculator',
    name: 'Percentages Calculator',
    category: 'Calculators',
    tags: ['percentages', 'calculator', 'math']
  },
  {
    id: 'fin-roi-calculator',
    name: 'ROI Calculator',
    category: 'Finance',
    tags: ['roi', 'calculator', 'finance', 'money', 'investment']
  },
  {
    id: 'health-bmi-calculator',
    name: 'BMI Calculator',
    category: 'Health & Fitness',
    tags: ['bmi', 'calculator', 'health', 'fitness', 'weight', 'body']
  },
  {
    id: 'convert-csv-to-json',
    name: 'CSV to JSON',
    category: 'Converters',
    tags: ['csv', 'json', 'convert', 'file', 'data']
  },
  {
    id: 'text-string-generator',
    name: 'String Generator',
    category: 'Text Formatters',
    tags: ['string', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-sentence-generator',
    name: 'Sentence Generator',
    category: 'Text Formatters',
    tags: ['sentence', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-word-generator',
    name: 'Word Generator',
    category: 'Text Formatters',
    tags: ['word', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-character-generator',
    name: 'Character Generator',
    category: 'Text Formatters',
    tags: ['character', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-article-generator',
    name: 'Article Generator',
    category: 'Text Formatters',
    tags: ['article', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-poem-generator',
    name: 'Poem Generator',
    category: 'Text Formatters',
    tags: ['poem', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-lyrics-generator',
    name: 'Lyrics Generator',
    category: 'Text Formatters',
    tags: ['lyrics', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-code-generator',
    name: 'Code Generator',
    category: 'Text Formatters',
    tags: ['code', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-data-generator',
    name: 'Data Generator',
    category: 'Text Formatters',
    tags: ['data', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-list-generator',
    name: 'List Generator',
    category: 'Text Formatters',
    tags: ['list', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-table-generator',
    name: 'Table Generator',
    category: 'Text Formatters',
    tags: ['table', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-matrix-generator',
    name: 'Matrix Generator',
    category: 'Text Formatters',
    tags: ['matrix', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-vector-generator',
    name: 'Vector Generator',
    category: 'Text Formatters',
    tags: ['vector', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-json-generator',
    name: 'JSON Generator',
    category: 'Text Formatters',
    tags: ['json', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-xml-generator',
    name: 'XML Generator',
    category: 'Text Formatters',
    tags: ['xml', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-yaml-generator',
    name: 'YAML Generator',
    category: 'Text Formatters',
    tags: ['yaml', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-csv-generator',
    name: 'CSV Generator',
    category: 'Text Formatters',
    tags: ['csv', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-sql-generator',
    name: 'SQL Generator',
    category: 'Text Formatters',
    tags: ['sql', 'generator', 'text', 'string', 'words']
  },
  {
    id: 'text-string-analyzer',
    name: 'String Analyzer',
    category: 'Text Formatters',
    tags: ['string', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-sentence-analyzer',
    name: 'Sentence Analyzer',
    category: 'Text Formatters',
    tags: ['sentence', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-word-analyzer',
    name: 'Word Analyzer',
    category: 'Text Formatters',
    tags: ['word', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-character-analyzer',
    name: 'Character Analyzer',
    category: 'Text Formatters',
    tags: ['character', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-article-analyzer',
    name: 'Article Analyzer',
    category: 'Text Formatters',
    tags: ['article', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-poem-analyzer',
    name: 'Poem Analyzer',
    category: 'Text Formatters',
    tags: ['poem', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-lyrics-analyzer',
    name: 'Lyrics Analyzer',
    category: 'Text Formatters',
    tags: ['lyrics', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-code-analyzer',
    name: 'Code Analyzer',
    category: 'Text Formatters',
    tags: ['code', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-data-analyzer',
    name: 'Data Analyzer',
    category: 'Text Formatters',
    tags: ['data', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-list-analyzer',
    name: 'List Analyzer',
    category: 'Text Formatters',
    tags: ['list', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-table-analyzer',
    name: 'Table Analyzer',
    category: 'Text Formatters',
    tags: ['table', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-matrix-analyzer',
    name: 'Matrix Analyzer',
    category: 'Text Formatters',
    tags: ['matrix', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-vector-analyzer',
    name: 'Vector Analyzer',
    category: 'Text Formatters',
    tags: ['vector', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-json-analyzer',
    name: 'JSON Analyzer',
    category: 'Text Formatters',
    tags: ['json', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-xml-analyzer',
    name: 'XML Analyzer',
    category: 'Text Formatters',
    tags: ['xml', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-yaml-analyzer',
    name: 'YAML Analyzer',
    category: 'Text Formatters',
    tags: ['yaml', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-csv-analyzer',
    name: 'CSV Analyzer',
    category: 'Text Formatters',
    tags: ['csv', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-sql-analyzer',
    name: 'SQL Analyzer',
    category: 'Text Formatters',
    tags: ['sql', 'analyzer', 'text', 'string', 'words']
  },
  {
    id: 'text-string-reverser',
    name: 'String Reverser',
    category: 'Text Formatters',
    tags: ['string', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-sentence-reverser',
    name: 'Sentence Reverser',
    category: 'Text Formatters',
    tags: ['sentence', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-word-reverser',
    name: 'Word Reverser',
    category: 'Text Formatters',
    tags: ['word', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-character-reverser',
    name: 'Character Reverser',
    category: 'Text Formatters',
    tags: ['character', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-article-reverser',
    name: 'Article Reverser',
    category: 'Text Formatters',
    tags: ['article', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-poem-reverser',
    name: 'Poem Reverser',
    category: 'Text Formatters',
    tags: ['poem', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-lyrics-reverser',
    name: 'Lyrics Reverser',
    category: 'Text Formatters',
    tags: ['lyrics', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-code-reverser',
    name: 'Code Reverser',
    category: 'Text Formatters',
    tags: ['code', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-data-reverser',
    name: 'Data Reverser',
    category: 'Text Formatters',
    tags: ['data', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-list-reverser',
    name: 'List Reverser',
    category: 'Text Formatters',
    tags: ['list', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-table-reverser',
    name: 'Table Reverser',
    category: 'Text Formatters',
    tags: ['table', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-matrix-reverser',
    name: 'Matrix Reverser',
    category: 'Text Formatters',
    tags: ['matrix', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-vector-reverser',
    name: 'Vector Reverser',
    category: 'Text Formatters',
    tags: ['vector', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-json-reverser',
    name: 'JSON Reverser',
    category: 'Text Formatters',
    tags: ['json', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-xml-reverser',
    name: 'XML Reverser',
    category: 'Text Formatters',
    tags: ['xml', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-yaml-reverser',
    name: 'YAML Reverser',
    category: 'Text Formatters',
    tags: ['yaml', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-csv-reverser',
    name: 'CSV Reverser',
    category: 'Text Formatters',
    tags: ['csv', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-sql-reverser',
    name: 'SQL Reverser',
    category: 'Text Formatters',
    tags: ['sql', 'reverser', 'text', 'string', 'words']
  },
  {
    id: 'text-string-sorter',
    name: 'String Sorter',
    category: 'Text Formatters',
    tags: ['string', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-sentence-sorter',
    name: 'Sentence Sorter',
    category: 'Text Formatters',
    tags: ['sentence', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-word-sorter',
    name: 'Word Sorter',
    category: 'Text Formatters',
    tags: ['word', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-character-sorter',
    name: 'Character Sorter',
    category: 'Text Formatters',
    tags: ['character', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-article-sorter',
    name: 'Article Sorter',
    category: 'Text Formatters',
    tags: ['article', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-poem-sorter',
    name: 'Poem Sorter',
    category: 'Text Formatters',
    tags: ['poem', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-lyrics-sorter',
    name: 'Lyrics Sorter',
    category: 'Text Formatters',
    tags: ['lyrics', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-code-sorter',
    name: 'Code Sorter',
    category: 'Text Formatters',
    tags: ['code', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-data-sorter',
    name: 'Data Sorter',
    category: 'Text Formatters',
    tags: ['data', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-list-sorter',
    name: 'List Sorter',
    category: 'Text Formatters',
    tags: ['list', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-table-sorter',
    name: 'Table Sorter',
    category: 'Text Formatters',
    tags: ['table', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-matrix-sorter',
    name: 'Matrix Sorter',
    category: 'Text Formatters',
    tags: ['matrix', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-vector-sorter',
    name: 'Vector Sorter',
    category: 'Text Formatters',
    tags: ['vector', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-json-sorter',
    name: 'JSON Sorter',
    category: 'Text Formatters',
    tags: ['json', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-xml-sorter',
    name: 'XML Sorter',
    category: 'Text Formatters',
    tags: ['xml', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-yaml-sorter',
    name: 'YAML Sorter',
    category: 'Text Formatters',
    tags: ['yaml', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-csv-sorter',
    name: 'CSV Sorter',
    category: 'Text Formatters',
    tags: ['csv', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-sql-sorter',
    name: 'SQL Sorter',
    category: 'Text Formatters',
    tags: ['sql', 'sorter', 'text', 'string', 'words']
  },
  {
    id: 'text-string-decoder',
    name: 'String Decoder',
    category: 'Text Formatters',
    tags: ['string', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-sentence-decoder',
    name: 'Sentence Decoder',
    category: 'Text Formatters',
    tags: ['sentence', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-word-decoder',
    name: 'Word Decoder',
    category: 'Text Formatters',
    tags: ['word', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-character-decoder',
    name: 'Character Decoder',
    category: 'Text Formatters',
    tags: ['character', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-article-decoder',
    name: 'Article Decoder',
    category: 'Text Formatters',
    tags: ['article', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-poem-decoder',
    name: 'Poem Decoder',
    category: 'Text Formatters',
    tags: ['poem', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-lyrics-decoder',
    name: 'Lyrics Decoder',
    category: 'Text Formatters',
    tags: ['lyrics', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-code-decoder',
    name: 'Code Decoder',
    category: 'Text Formatters',
    tags: ['code', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-data-decoder',
    name: 'Data Decoder',
    category: 'Text Formatters',
    tags: ['data', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-list-decoder',
    name: 'List Decoder',
    category: 'Text Formatters',
    tags: ['list', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-table-decoder',
    name: 'Table Decoder',
    category: 'Text Formatters',
    tags: ['table', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-matrix-decoder',
    name: 'Matrix Decoder',
    category: 'Text Formatters',
    tags: ['matrix', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-vector-decoder',
    name: 'Vector Decoder',
    category: 'Text Formatters',
    tags: ['vector', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-json-decoder',
    name: 'JSON Decoder',
    category: 'Text Formatters',
    tags: ['json', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-xml-decoder',
    name: 'XML Decoder',
    category: 'Text Formatters',
    tags: ['xml', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-yaml-decoder',
    name: 'YAML Decoder',
    category: 'Text Formatters',
    tags: ['yaml', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-csv-decoder',
    name: 'CSV Decoder',
    category: 'Text Formatters',
    tags: ['csv', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-sql-decoder',
    name: 'SQL Decoder',
    category: 'Text Formatters',
    tags: ['sql', 'decoder', 'text', 'string', 'words']
  },
  {
    id: 'text-string-encoder',
    name: 'String Encoder',
    category: 'Text Formatters',
    tags: ['string', 'encoder', 'text', 'string', 'words']
  },
  {
    id: 'text-sentence-encoder',
    name: 'Sentence Encoder',
    category: 'Text Formatters',
    tags: ['sentence', 'encoder', 'text', 'string', 'words']
  },
  {
    id: 'text-word-encoder',
    name: 'Word Encoder',
    category: 'Text Formatters',
    tags: ['word', 'encoder', 'text', 'string', 'words']
  },
  {
    id: 'text-character-encoder',
    name: 'Character Encoder',
    category: 'Text Formatters',
    tags: ['character', 'encoder', 'text', 'string', 'words']
  },
  {
    id: 'text-article-encoder',
    name: 'Article Encoder',
    category: 'Text Formatters',
    tags: ['article', 'encoder', 'text', 'string', 'words']
  },
  {
    id: 'text-poem-encoder',
    name: 'Poem Encoder',
    category: 'Text Formatters',
    tags: ['poem', 'encoder', 'text', 'string', 'words']
  },
  {
    id: 'text-lyrics-encoder',
    name: 'Lyrics Encoder',
    category: 'Text Formatters',
    tags: ['lyrics', 'encoder', 'text', 'string', 'words']
  },
  {
    id: 'text-code-encoder',
    name: 'Code Encoder',
    category: 'Text Formatters',
    tags: ['code', 'encoder', 'text', 'string', 'words']
  },
  {
    id: 'text-data-encoder',
    name: 'Data Encoder',
    category: 'Text Formatters',
    tags: ['data', 'encoder', 'text', 'string', 'words']
  },
  {
    id: 'text-list-encoder',
    name: 'List Encoder',
    category: 'Text Formatters',
    tags: ['list', 'encoder', 'text', 'string', 'words']
  },
  {
    id: 'fin-mortgage-calculator',
    name: 'Mortgage Calculator',
    category: 'Finance',
    tags: ['mortgage', 'calculator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-estimator',
    name: 'Mortgage Estimator',
    category: 'Finance',
    tags: ['mortgage', 'estimator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-projector',
    name: 'Mortgage Projector',
    category: 'Finance',
    tags: ['mortgage', 'projector', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-forecaster',
    name: 'Mortgage Forecaster',
    category: 'Finance',
    tags: ['mortgage', 'forecaster', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-planner',
    name: 'Mortgage Planner',
    category: 'Finance',
    tags: ['mortgage', 'planner', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-tracker',
    name: 'Mortgage Tracker',
    category: 'Finance',
    tags: ['mortgage', 'tracker', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-monitor',
    name: 'Mortgage Monitor',
    category: 'Finance',
    tags: ['mortgage', 'monitor', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-analyzer',
    name: 'Mortgage Analyzer',
    category: 'Finance',
    tags: ['mortgage', 'analyzer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-visualizer',
    name: 'Mortgage Visualizer',
    category: 'Finance',
    tags: ['mortgage', 'visualizer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-chart',
    name: 'Mortgage Chart',
    category: 'Finance',
    tags: ['mortgage', 'chart', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-graph',
    name: 'Mortgage Graph',
    category: 'Finance',
    tags: ['mortgage', 'graph', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-simulator',
    name: 'Mortgage Simulator',
    category: 'Finance',
    tags: ['mortgage', 'simulator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-modeler',
    name: 'Mortgage Modeler',
    category: 'Finance',
    tags: ['mortgage', 'modeler', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-optimizer',
    name: 'Mortgage Optimizer',
    category: 'Finance',
    tags: ['mortgage', 'optimizer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-converter',
    name: 'Mortgage Converter',
    category: 'Finance',
    tags: ['mortgage', 'converter', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-updater',
    name: 'Mortgage Updater',
    category: 'Finance',
    tags: ['mortgage', 'updater', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-fetcher',
    name: 'Mortgage Fetcher',
    category: 'Finance',
    tags: ['mortgage', 'fetcher', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-screener',
    name: 'Mortgage Screener',
    category: 'Finance',
    tags: ['mortgage', 'screener', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-scanner',
    name: 'Mortgage Scanner',
    category: 'Finance',
    tags: ['mortgage', 'scanner', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-alert',
    name: 'Mortgage Alert',
    category: 'Finance',
    tags: ['mortgage', 'alert', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-mortgage-notifier',
    name: 'Mortgage Notifier',
    category: 'Finance',
    tags: ['mortgage', 'notifier', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-calculator',
    name: 'Loan Calculator',
    category: 'Finance',
    tags: ['loan', 'calculator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-estimator',
    name: 'Loan Estimator',
    category: 'Finance',
    tags: ['loan', 'estimator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-projector',
    name: 'Loan Projector',
    category: 'Finance',
    tags: ['loan', 'projector', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-forecaster',
    name: 'Loan Forecaster',
    category: 'Finance',
    tags: ['loan', 'forecaster', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-planner',
    name: 'Loan Planner',
    category: 'Finance',
    tags: ['loan', 'planner', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-tracker',
    name: 'Loan Tracker',
    category: 'Finance',
    tags: ['loan', 'tracker', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-monitor',
    name: 'Loan Monitor',
    category: 'Finance',
    tags: ['loan', 'monitor', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-analyzer',
    name: 'Loan Analyzer',
    category: 'Finance',
    tags: ['loan', 'analyzer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-visualizer',
    name: 'Loan Visualizer',
    category: 'Finance',
    tags: ['loan', 'visualizer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-chart',
    name: 'Loan Chart',
    category: 'Finance',
    tags: ['loan', 'chart', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-graph',
    name: 'Loan Graph',
    category: 'Finance',
    tags: ['loan', 'graph', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-simulator',
    name: 'Loan Simulator',
    category: 'Finance',
    tags: ['loan', 'simulator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-modeler',
    name: 'Loan Modeler',
    category: 'Finance',
    tags: ['loan', 'modeler', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-optimizer',
    name: 'Loan Optimizer',
    category: 'Finance',
    tags: ['loan', 'optimizer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-converter',
    name: 'Loan Converter',
    category: 'Finance',
    tags: ['loan', 'converter', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-updater',
    name: 'Loan Updater',
    category: 'Finance',
    tags: ['loan', 'updater', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-fetcher',
    name: 'Loan Fetcher',
    category: 'Finance',
    tags: ['loan', 'fetcher', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-screener',
    name: 'Loan Screener',
    category: 'Finance',
    tags: ['loan', 'screener', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-scanner',
    name: 'Loan Scanner',
    category: 'Finance',
    tags: ['loan', 'scanner', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-alert',
    name: 'Loan Alert',
    category: 'Finance',
    tags: ['loan', 'alert', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-loan-notifier',
    name: 'Loan Notifier',
    category: 'Finance',
    tags: ['loan', 'notifier', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-calculator',
    name: 'Interest Calculator',
    category: 'Finance',
    tags: ['interest', 'calculator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-estimator',
    name: 'Interest Estimator',
    category: 'Finance',
    tags: ['interest', 'estimator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-projector',
    name: 'Interest Projector',
    category: 'Finance',
    tags: ['interest', 'projector', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-forecaster',
    name: 'Interest Forecaster',
    category: 'Finance',
    tags: ['interest', 'forecaster', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-planner',
    name: 'Interest Planner',
    category: 'Finance',
    tags: ['interest', 'planner', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-tracker',
    name: 'Interest Tracker',
    category: 'Finance',
    tags: ['interest', 'tracker', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-monitor',
    name: 'Interest Monitor',
    category: 'Finance',
    tags: ['interest', 'monitor', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-analyzer',
    name: 'Interest Analyzer',
    category: 'Finance',
    tags: ['interest', 'analyzer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-visualizer',
    name: 'Interest Visualizer',
    category: 'Finance',
    tags: ['interest', 'visualizer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-chart',
    name: 'Interest Chart',
    category: 'Finance',
    tags: ['interest', 'chart', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-graph',
    name: 'Interest Graph',
    category: 'Finance',
    tags: ['interest', 'graph', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-simulator',
    name: 'Interest Simulator',
    category: 'Finance',
    tags: ['interest', 'simulator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-modeler',
    name: 'Interest Modeler',
    category: 'Finance',
    tags: ['interest', 'modeler', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-optimizer',
    name: 'Interest Optimizer',
    category: 'Finance',
    tags: ['interest', 'optimizer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-converter',
    name: 'Interest Converter',
    category: 'Finance',
    tags: ['interest', 'converter', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-updater',
    name: 'Interest Updater',
    category: 'Finance',
    tags: ['interest', 'updater', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-fetcher',
    name: 'Interest Fetcher',
    category: 'Finance',
    tags: ['interest', 'fetcher', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-screener',
    name: 'Interest Screener',
    category: 'Finance',
    tags: ['interest', 'screener', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-scanner',
    name: 'Interest Scanner',
    category: 'Finance',
    tags: ['interest', 'scanner', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-alert',
    name: 'Interest Alert',
    category: 'Finance',
    tags: ['interest', 'alert', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-interest-notifier',
    name: 'Interest Notifier',
    category: 'Finance',
    tags: ['interest', 'notifier', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-calculator',
    name: 'Compound Calculator',
    category: 'Finance',
    tags: ['compound', 'calculator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-estimator',
    name: 'Compound Estimator',
    category: 'Finance',
    tags: ['compound', 'estimator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-projector',
    name: 'Compound Projector',
    category: 'Finance',
    tags: ['compound', 'projector', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-forecaster',
    name: 'Compound Forecaster',
    category: 'Finance',
    tags: ['compound', 'forecaster', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-planner',
    name: 'Compound Planner',
    category: 'Finance',
    tags: ['compound', 'planner', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-tracker',
    name: 'Compound Tracker',
    category: 'Finance',
    tags: ['compound', 'tracker', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-monitor',
    name: 'Compound Monitor',
    category: 'Finance',
    tags: ['compound', 'monitor', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-analyzer',
    name: 'Compound Analyzer',
    category: 'Finance',
    tags: ['compound', 'analyzer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-visualizer',
    name: 'Compound Visualizer',
    category: 'Finance',
    tags: ['compound', 'visualizer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-chart',
    name: 'Compound Chart',
    category: 'Finance',
    tags: ['compound', 'chart', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-graph',
    name: 'Compound Graph',
    category: 'Finance',
    tags: ['compound', 'graph', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-simulator',
    name: 'Compound Simulator',
    category: 'Finance',
    tags: ['compound', 'simulator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-modeler',
    name: 'Compound Modeler',
    category: 'Finance',
    tags: ['compound', 'modeler', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-optimizer',
    name: 'Compound Optimizer',
    category: 'Finance',
    tags: ['compound', 'optimizer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-converter',
    name: 'Compound Converter',
    category: 'Finance',
    tags: ['compound', 'converter', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-updater',
    name: 'Compound Updater',
    category: 'Finance',
    tags: ['compound', 'updater', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-fetcher',
    name: 'Compound Fetcher',
    category: 'Finance',
    tags: ['compound', 'fetcher', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-screener',
    name: 'Compound Screener',
    category: 'Finance',
    tags: ['compound', 'screener', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-scanner',
    name: 'Compound Scanner',
    category: 'Finance',
    tags: ['compound', 'scanner', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-alert',
    name: 'Compound Alert',
    category: 'Finance',
    tags: ['compound', 'alert', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-compound-notifier',
    name: 'Compound Notifier',
    category: 'Finance',
    tags: ['compound', 'notifier', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-calculator',
    name: 'Tax Calculator',
    category: 'Finance',
    tags: ['tax', 'calculator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-estimator',
    name: 'Tax Estimator',
    category: 'Finance',
    tags: ['tax', 'estimator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-projector',
    name: 'Tax Projector',
    category: 'Finance',
    tags: ['tax', 'projector', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-forecaster',
    name: 'Tax Forecaster',
    category: 'Finance',
    tags: ['tax', 'forecaster', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-planner',
    name: 'Tax Planner',
    category: 'Finance',
    tags: ['tax', 'planner', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-tracker',
    name: 'Tax Tracker',
    category: 'Finance',
    tags: ['tax', 'tracker', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-monitor',
    name: 'Tax Monitor',
    category: 'Finance',
    tags: ['tax', 'monitor', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-analyzer',
    name: 'Tax Analyzer',
    category: 'Finance',
    tags: ['tax', 'analyzer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-visualizer',
    name: 'Tax Visualizer',
    category: 'Finance',
    tags: ['tax', 'visualizer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-chart',
    name: 'Tax Chart',
    category: 'Finance',
    tags: ['tax', 'chart', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-graph',
    name: 'Tax Graph',
    category: 'Finance',
    tags: ['tax', 'graph', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-simulator',
    name: 'Tax Simulator',
    category: 'Finance',
    tags: ['tax', 'simulator', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-modeler',
    name: 'Tax Modeler',
    category: 'Finance',
    tags: ['tax', 'modeler', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-optimizer',
    name: 'Tax Optimizer',
    category: 'Finance',
    tags: ['tax', 'optimizer', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-converter',
    name: 'Tax Converter',
    category: 'Finance',
    tags: ['tax', 'converter', 'finance', 'money', 'calculator']
  },
  {
    id: 'fin-tax-updater',
    name: 'Tax Updater',
    category: 'Finance',
    tags: ['tax', 'updater', 'finance', 'money', 'calculator']
  }
];

const INACTIVE_TOOLS = getInactiveTools();

const ALL_TOOLS = [...ACTIVE_TOOLS, ...INACTIVE_TOOLS];

function getRelevanceScore(tool: typeof ALL_TOOLS[0], query: string) {
  const qStr = query.toLowerCase().trim();
  if (!qStr) return 0;
  
  const queryTokens = qStr.split(/\s+/).filter(t => t.length > 0);
  let score = 0;
  
  const toolName = tool.name.toLowerCase();
  const catName = tool.category.toLowerCase();
  
  // 1. Exact Match string for highest relevance
  if (toolName === qStr) score += 1000;
  
  // 2. Starts with query
  if (toolName.startsWith(qStr)) score += 500;
  
  // 3. Exact Substring in name
  if (toolName.includes(qStr)) score += 200;
  
  // 4. Category Match
  if (catName === qStr) score += 150;
  else if (catName.includes(qStr)) score += 50;

  // 5. Token Level matching (highly robust for partials and scattered keywords)
  queryTokens.forEach(token => {
    // Name checks
    const toolTokens = toolName.split(/\s+/);
    if (toolTokens.includes(token)) score += 100;
    else if (toolTokens.some(t => t.startsWith(token))) score += 40;
    else if (toolName.includes(token)) score += 15;

    // Tag checks
    tool.tags.forEach(tag => {
      const t = tag.toLowerCase();
      if (t === token) score += 80;
      else if (t.startsWith(token)) score += 30;
      else if (t.includes(token)) score += 10;
    });

    // Category checks
    if (catName.includes(token)) score += 15;
  });

  return score;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [query, setQuery] = useState('');
  
  const filteredTools = useMemo(() => {
    const cleanQuery = query.trim();
    if (cleanQuery.length < 2) return [];

    return ALL_TOOLS
      .map(tool => ({ tool, score: getRelevanceScore(tool, cleanQuery) }))
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .map(item => item.tool);
  }, [query]);

  return (
    <div className="flex flex-col min-h-screen relative w-full overflow-hidden bg-background text-on-surface">
      
      {/* Main Content */}
      <main className="relative flex-grow flex flex-col items-center px-6 text-center w-full max-w-[1280px] mx-auto pt-16">
        <div className="absolute top-6 left-6 lg:left-12 right-6 lg:right-12 flex items-center justify-between">
          <div className="text-xl font-bold font-heading tracking-tight text-primary">
            web-toolVerse
          </div>
          <div className="flex items-center rounded-full border border-outline-variant bg-surface-container-low shadow-sm overflow-hidden h-9">
            <div className="flex items-center gap-2.5 px-4 h-full bg-surface-container-low">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 relative">
                <div className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-75"></div>
              </div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-on-surface font-medium">
                {ACTIVE_TOOLS.length} Active Tools
              </span>
            </div>
            <div className="w-[1px] h-4 bg-outline-variant"></div>
            <div className="flex items-center gap-2.5 px-4 h-full bg-surface-container-highest">
              <div className="w-1.5 h-1.5 rounded-full bg-outline relative"></div>
              <span className="font-mono text-[11px] uppercase tracking-widest text-on-surface-variant font-medium">
                {INACTIVE_TOOLS.length} In Development
              </span>
            </div>
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center w-full">
          <h1 className="text-[40px] md:text-[56px] lg:text-[64px] font-bold font-heading tracking-tight leading-[1.1] mb-6 max-w-4xl text-primary">
            Every Free Tool You Could Ever Need.<br />In One Place.
          </h1>
          <p className="text-lg md:text-xl text-on-surface-variant max-w-2xl mb-12 font-sans font-normal">
            Precision-engineered micro-utilities designed for maximum efficiency. No bloat, no ads, just instant execution.
          </p>
          
          {/* Search */}
          <div 
            className="w-full max-w-3xl flex items-center bg-surface-container-low rounded-full border border-outline-variant px-6 py-5 mb-16 hover:border-outline focus-within:border-primary transition-colors group shadow-2xl relative z-20"
          >
            <Search className="w-5 h-5 text-outline mr-4 group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="e.g., image cropper, instagram downloader..." 
              className="flex-grow bg-transparent border-none outline-none text-on-surface placeholder:text-outline font-sans text-lg w-full"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="w-full max-w-3xl min-h-[300px] flex flex-col items-center transition-all duration-300">
            {query.trim().length >= 2 ? (
               <div className="w-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300 relative z-10">
                  {/* Search Results List */}
                  {filteredTools.length > 0 ? (
                    <div className="w-full flex flex-col items-start text-left border border-outline-variant rounded-2xl bg-surface-container-low overflow-hidden shadow-2xl">
                       {filteredTools.map((tool, index) => (
                         <button
                           key={tool.id}
                           onClick={() => onNavigate(tool.id)}
                           className={`w-full flex items-center justify-between px-6 py-4 hover:bg-surface-container transition-colors ${index !== filteredTools.length - 1 ? 'border-b border-outline-variant' : ''}`}
                         >
                           <div>
                             <div className="text-on-surface font-sans text-lg font-medium">{tool.name}</div>
                             <div className="text-outline font-mono text-[11px] tracking-wider uppercase mt-1">{tool.category}</div>
                           </div>
                           <ArrowRight className="w-5 h-5 text-outline group-hover:text-primary transition-colors" />
                         </button>
                       ))}
                    </div>
                  ) : (
                    <div className="text-on-surface-variant py-8 font-sans">
                       No tools found matching "{query}"
                    </div>
                  )}
               </div>
            ) : (
               <div className="flex flex-col items-center animate-in fade-in duration-300 relative z-10">
                  <h2 className="text-2xl font-semibold font-heading mb-8">Whatever you need, just search it.</h2>
                  
                  {/* Tag Cloud */}
                  <div className="flex flex-wrap justify-center gap-3 max-w-4xl">
                     {['Image Tools', 'Developers', 'Text Formatters', 'Security'].map(tag => (
                       <button 
                          key={tag} 
                          onClick={() => setQuery(tag)}
                          className="px-5 py-2.5 rounded-full border border-outline-variant bg-surface-container-lowest/50 hover:bg-surface-container hover:border-outline text-[13px] font-mono text-on-surface transition-all whitespace-nowrap shadow-sm"
                       >
                         {tag}
                       </button>
                     ))}
                  </div>
               </div>
            )}
          </div>
        </div>
      </main>
      
    </div>
  );
}

