/** @type {import("next").NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.watchOptions = {
        ignored: ["**/node_modules/**", "**/xjx/**", "**/.git/**", "**/.wrangler/**"],
      };
    }
    return config;
  },
};

export default nextConfig;
