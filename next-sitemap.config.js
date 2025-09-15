/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://apis.guru",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ["/studio/*", "/api/*", "/blog/*"],

  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq || "daily",
      priority: config.priority || 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
