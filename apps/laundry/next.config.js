/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@lavaya/types', '@lavaya/config', '@lavaya/shared', '@lavaya/ui'],
  outputFileTracingRoot: require('path').resolve(__dirname, '../..'),
  reactStrictMode: true,
};

module.exports = nextConfig;