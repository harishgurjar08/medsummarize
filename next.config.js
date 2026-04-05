/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Allow large file uploads in API routes
  api: {
    bodyParser: false,
  },

  // Webpack config to handle pdf-parse and tesseract.js properly
  webpack: (config, { isServer }) => {
    if (isServer) {
      // pdf-parse uses fs — keep it server-side only
      config.externals = [...(config.externals || []), "canvas", "jsdom"];
    }
    // Handle binary files for tesseract worker
    config.module.rules.push({
      test: /\.node$/,
      use: "node-loader",
    });
    return config;
  },

  // Increase serverless function timeout for AI processing
  experimental: {
    serverComponentsExternalPackages: ["pdf-parse", "tesseract.js"],
  },
};

module.exports = nextConfig;
