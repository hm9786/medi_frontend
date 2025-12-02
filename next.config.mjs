/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    domains: [
      'yt3.ggpht.com',
      'i.ytimg.com',
      'lh3.googleusercontent.com',
    ],
  },
  experimental: {
    // 필요한 경우 여기에 experimental 옵션 추가
  },
};

export default nextConfig;
