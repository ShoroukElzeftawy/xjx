/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.watchOptions = {
      ...(config.watchOptions ?? {}),
      ignored: ["**/node_modules/**", "**/xjx/**", "**/.git/**", "**/.wrangler/**"],
    };
    return config;
  },
};

export default nextConfig;
