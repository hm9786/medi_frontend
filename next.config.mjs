/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    // 외부 이미지 도메인 허용 (YouTube, Google 등) — Next 16에서 domains는 deprecated라 remotePatterns 사용
    remotePatterns: [
      { protocol: 'https', hostname: 'yt3.ggpht.com' },             // YouTube 프로필 이미지
      { protocol: 'https', hostname: 'i.ytimg.com' },               // YouTube 썸네일 이미지
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' }, // Google 프로필 이미지
    ],
  },
  experimental: {
    // 필요한 경우 여기에 experimental 옵션 추가
  },
};

export default nextConfig;
