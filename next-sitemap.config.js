import list from "./list.json";

const getProviderOnlyRoutes = () => {
  const providerOnlyRoutes = new Set();

  for (const key of Object.keys(list)) {
    const [provider, service] = key.split(":");
    if (!service) {
      const providerSlug = provider.toLowerCase();
      providerOnlyRoutes.add(`/apis/${providerSlug}/${providerSlug}`);
    }
  }

  return providerOnlyRoutes;
};

const providerOnlyRoutes = getProviderOnlyRoutes();

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.SITE_URL || "https://apis.guru",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  exclude: ["/studio/*", "/api/*", "/blog/*"],

  transform: async (config, path) => {
    if (providerOnlyRoutes.has(path)) {
      return null;
    }
    return {
      loc: path,
      changefreq: config.changefreq || "daily",
      priority: config.priority || 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    };
  },
};
