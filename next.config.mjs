/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // 다른 로컬 IP에서 오는 개발 요청 허용
    allowedDevOrigins: [
      'http://192.168.70.188:3000',
      'http://localhost:3000'
    ],
  },

  images: {
    // 외부 이미지 도메인 허용 (YouTube, Google 등)
    domains: [
      'yt3.ggpht.com',               // YouTube 프로필 이미지
      'i.ytimg.com',                 // YouTube 썸네일 이미지
      'lh3.googleusercontent.com',   // Google 프로필 이미지 (선택)
    ],
  },
};

export default nextConfig;
