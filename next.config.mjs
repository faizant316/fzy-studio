/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: false,
  },
  async redirects() {
    return [
      // Canonical host: send www.fzydev.com -> fzydev.com (apex primary).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.fzydev.com" }],
        destination: "https://fzydev.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
