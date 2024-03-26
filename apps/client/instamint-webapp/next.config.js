/** @type {import('next').NextConfig} */
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { i18n } = require("./next-i18next.config.js")

const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@instamint/ui-kit"],
  i18n,
}

module.exports = nextConfig
