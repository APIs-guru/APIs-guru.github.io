import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.apis.guru",
        pathname: "/**",
      },
    ],
    unoptimized: true,
  },
};

export default nextConfig;
