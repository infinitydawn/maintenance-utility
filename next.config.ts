import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // ensure '@' maps to project root for both server and client builds
    if (!config.resolve) config.resolve = { alias: {} } as any;
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': require('path').resolve(__dirname),
    };
    return config;
  },
};

export default nextConfig;
