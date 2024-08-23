/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pwm.im-cdn.it",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
      }
    ],
  },
};

const withVercelToolbar = require("@vercel/toolbar/plugins/next")();
// Instead of module.exports = nextConfig, do this:
module.exports = withVercelToolbar(nextConfig);
