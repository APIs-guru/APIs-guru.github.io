/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://apis.guru/",
  generateRobotsTxt: true, // Generate a robots.txt file
  sitemapSize: 5000, // Split sitemap into chunks of 5,000 URLs
  exclude: ["/protected-page", "/admin/*"], // Exclude specific pages
  outDir: "./out",
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq || "daily",
      priority: config.priority || 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
