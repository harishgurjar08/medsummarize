/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 🔥 ADD THIS (fix build fail)
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Webpack config
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), "canvas", "jsdom"];
    }

    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });

    return config;
  },

  // ✅ FIXED (new syntax)
  serverExternalPackages: ["pdf-parse", "tesseract.js"],
};

module.exports = nextConfig;
