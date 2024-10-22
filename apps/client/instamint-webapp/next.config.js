/** @type {import('next').NextConfig} */
const { i18n } = require("./next-i18next.config.js")

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "localhost",
      },
    ],
  },
  transpilePackages: ["@instamint/ui-kit"],
  i18n,
}

module.exports = nextConfig
