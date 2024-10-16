/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jinzchrvefdtlzaogeox.supabase.co', // Your Supabase domain
        port: '', // You can leave this empty if there is no specific port
        pathname: '/storage/v1/object/public/**', // Path to access your bucket
      },
    ],
  },
};

export default nextConfig;
