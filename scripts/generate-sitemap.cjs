const fs = require('fs');
const path = require('path');

// Get current date in YYYY-MM-DD format
const currentDate = new Date().toISOString().split('T')[0];

// Static routes
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/login', priority: '0.8', changefreq: 'monthly' },
  { path: '/signup', priority: '0.8', changefreq: 'monthly' },
  { path: '/booking', priority: '0.9', changefreq: 'weekly' }
];

// Generate sitemap XML
const generateSitemap = () => {
  const urls = staticRoutes.map(route => `
  <url>
    <loc>https://tabibi.eg${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}
</urlset>`;

  // Write to public directory
  const publicDir = path.join(__dirname, '..', 'public');
  const sitemapPath = path.join(publicDir, 'sitemap.xml');
  
  fs.writeFileSync(sitemapPath, sitemap);
  console.log('Sitemap generated successfully at:', sitemapPath);
};

generateSitemap();