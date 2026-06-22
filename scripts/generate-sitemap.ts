import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ALL_TOOLS } from '../src/data/toolsManifest';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://toolcabinet.com';

function generateSitemap() {
  // Main tools list + the landing page and the reverse-dictionary alias
  const urls = [
    { loc: `${BASE_URL}/`, changefreq: 'daily', priority: '1.0' },
    { loc: `${BASE_URL}/reverse-dictionary`, changefreq: 'weekly', priority: '0.8' },
    ...ALL_TOOLS.map(tool => ({
      loc: `${BASE_URL}/${tool.id}`,
      changefreq: 'weekly',
      priority: '0.8'
    }))
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  const publicDir = path.resolve(__dirname, '../public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml, 'utf8');
  console.log('Sitemap generated successfully inside public/sitemap.xml!');
}

generateSitemap();
