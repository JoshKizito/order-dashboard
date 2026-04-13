/** @type {import('next').NextConfig} */
const nextConfig = {
  // L'URL du backend Express, définie dans les variables d'environnement
  env: {
    BACKEND_URL: process.env.BACKEND_URL || 'http://localhost:4000',
  },
};

module.exports = nextConfig;
