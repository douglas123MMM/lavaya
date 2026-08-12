/** @type {import('next').NextConfig} */
const nextConfig = {
  // Permite importar paquetes workspace del monorepo (TS source)
  transpilePackages: ['@lavaya/types', '@lavaya/config', '@lavaya/shared', '@lavaya/ui'],
  // Necesario en monorepo: trazar archivos desde la raíz del repo
  outputFileTracingRoot: require('path').resolve(__dirname, '../..'),
  reactStrictMode: true,
};

module.exports = nextConfig;