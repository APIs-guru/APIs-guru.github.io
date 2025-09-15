import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import list from "./list.json";
const nextConfig: NextConfig = {
  output: "standalone",
  basePath: "",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.apis.guru",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
        pathname: "/**",
      },
    ],
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(
      new webpack.DefinePlugin({
        __SENTRY_DEBUG__: false,
        __SENTRY_TRACING__: false,
        __RRWEB_EXCLUDE_IFRAME__: true,
        __RRWEB_EXCLUDE_SHADOW_DOM__: true,
        __SENTRY_EXCLUDE_REPLAY_WORKER__: true,
      })
    );

    return config;
  },
  async redirects() {
    const redirectList = [];

    const normalizeSlug = (text: string, preserveDots = false) => {
      return text
        .toLowerCase()
        .replace(preserveDots ? /[^a-z0-9.]+/g : /[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    const normalizeServiceSlug = (service: string) => {
      return service
        .toLowerCase()
        .replace(/[\(\)]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    for (const key in list) {
      if (!Object.prototype.hasOwnProperty.call(list, key)) continue;

      const [provider, service] = key.split(":");
      if (!provider) {
        console.warn(`Invalid key format: ${key}`);
        continue;
      }

      const legacyFullSlug = normalizeSlug(key);
      const currentProviderSlug = normalizeSlug(provider, true);
      const legacyProviderSlug = normalizeSlug(provider.replace(/\./g, "-"));

      const destination = service
        ? `/apis/${encodeURIComponent(currentProviderSlug)}/${encodeURIComponent(normalizeServiceSlug(service))}`
        : `/apis/${encodeURIComponent(currentProviderSlug)}`;

      if (!service) {
        redirectList.push({
          source: `/apis/${encodeURIComponent(currentProviderSlug)}/${encodeURIComponent(currentProviderSlug)}`,
          destination: `/apis/${encodeURIComponent(currentProviderSlug)}`,
          permanent: true,
        });
      }

      if (legacyFullSlug !== currentProviderSlug) {
        redirectList.push({
          source: `/apis/${encodeURIComponent(legacyFullSlug)}`,
          destination,
          permanent: true,
        });
      }

      if (legacyProviderSlug !== currentProviderSlug) {
        redirectList.push({
          source: `/apis/${encodeURIComponent(legacyProviderSlug)}`,
          destination: `/apis/${encodeURIComponent(currentProviderSlug)}`,
          permanent: true,
        });
      }
    }

    return redirectList;
  },
};

export default withSentryConfig(nextConfig, {
  org: "apisguru",
  project: "apis-guru",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  disableLogger: true,
  automaticVercelMonitors: true,
});
