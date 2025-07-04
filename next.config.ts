import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // Enables static exports for GitHub Pages
  basePath: "/apis-guru-next", // Replace with your repository name
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "api.apis.guru",
        pathname: "/**",
      },
    ],
    unoptimized: true, // Required for static export with images
  },
};

export default nextConfig;
