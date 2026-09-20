/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/Transport360',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
