/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qwq1hpjx-8000.brs.devtunnels.ms',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;
