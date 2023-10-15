/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'imagedelivery.net',
      'customer-rfd4j8o0msz4s9nx.cloudflarestream.com',
      'developers.google.com',
    ],
  },
};

module.exports = nextConfig;
