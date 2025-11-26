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

    // Normalizes text to a URL-friendly slug
    // e.g., "Example API" -> "example-api"
    // With preserveDots=true: "twilio.com" -> "twilio.com"
    const normalizeSlug = (text: string, preserveDots = false) => {
      return text
        .toLowerCase()
        .replace(preserveDots ? /[^a-z0-9.]+/g : /[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    // Converts service name to legacy format (all special chars become dashes)
    // e.g., "twilio_media_v1" -> "twilio-media-v1"
    // e.g., "subscriptions-api-(v2)" -> "subscriptions-api-v2"
    const toLegacyServiceSlug = (service: string) => {
      return service
        .toLowerCase()
        .replace(/[\(\)]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    // Normalizes service slug for current URLs (removes parentheses, preserves underscores)
    // e.g., "twilio_media_v1" -> "twilio_media_v1"
    // e.g., "subscriptions-api-(v2)" -> "subscriptions-api-v2"
    const toCurrentServiceSlug = (service: string) => {
      return service
        .toLowerCase()
        .replace(/[\(\)]/g, "")
        .replace(/--+/g, "-")
        .replace(/^-+|-+$/g, "");
    };

    for (const key in list) {
      if (!Object.prototype.hasOwnProperty.call(list, key)) continue;

      // Parse the key format "provider:service" or just "provider"
      const [provider, service] = key.split(":");
      if (!provider) {
        console.warn(`Invalid key format: ${key}`);
        continue;
      }

      // Generate different slug formats for redirects
      // e.g., key="twilio.com:twilio_media_v1"
      const legacyFullSlug = normalizeSlug(key); // "twilio-com-twilio-media-v1"
      const currentProviderSlug = normalizeSlug(provider, true); // "twilio.com"
      const legacyProviderSlug = normalizeSlug(provider.replace(/\./g, "-")); // "twilio-com"

      const currentServiceSlug = service ? toCurrentServiceSlug(service) : null; // "twilio_media_v1"
      const legacyServiceSlug = service ? toLegacyServiceSlug(service) : null; // "twilio-media-v1"

      // Build the canonical destination URL
      const destination = service
        ? `/apis/${encodeURIComponent(currentProviderSlug)}/${encodeURIComponent(currentServiceSlug!)}`
        : `/apis/${encodeURIComponent(currentProviderSlug)}`;

      // Redirect duplicate provider-only URLs
      // e.g., /apis/example.com/example.com -> /apis/example.com
      if (!service) {
        redirectList.push({
          source: `/apis/${encodeURIComponent(currentProviderSlug)}/${encodeURIComponent(currentProviderSlug)}`,
          destination: `/apis/${encodeURIComponent(currentProviderSlug)}`,
          permanent: true,
        });
      }

      // Redirect from legacy service slug (dashes) to current service slug (underscores preserved)
      // e.g., /apis/twilio.com/twilio-media-v1 -> /apis/twilio.com/twilio_media_v1
      if (service && legacyServiceSlug !== currentServiceSlug) {
        redirectList.push({
          source: `/apis/${encodeURIComponent(currentProviderSlug)}/${encodeURIComponent(legacyServiceSlug!)}`,
          destination,
          permanent: true,
        });
      }

      // Redirect from legacy full slug format
      // e.g., /apis/twilio-com-twilio-media-v1 -> /apis/twilio.com/twilio_media_v1
      if (legacyFullSlug !== currentProviderSlug) {
        redirectList.push({
          source: `/apis/${encodeURIComponent(legacyFullSlug)}`,
          destination,
          permanent: true,
        });
      }

      // Redirect from legacy provider slug (dots replaced with dashes)
      // e.g., /apis/twilio-com -> /apis/twilio.com
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
