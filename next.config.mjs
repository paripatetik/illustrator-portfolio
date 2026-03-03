/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    qualities: [75, 85],
  },
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
