// 기본값: 환경변수 기반 (서버/SSR)
let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// 클라이언트 환경에서만 실행
if (typeof window !== 'undefined') {

  // 운영(production) 환경이면 window 기반 URL 사용
  if (process.env.NODE_ENV === 'production') {
    API_BASE_URL = window.location.origin;
  }
  // 개발 환경이면 환경변수 유지 (backend 주소 유지)
  else {
    API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';
  }
}

// URL 정규화
if (API_BASE_URL.endsWith('/')) {
  API_BASE_URL = API_BASE_URL.slice(0, -1);
}

export { API_BASE_URL };

export const apiUrl = (path = '') => {
  if (!path) return API_BASE_URL;

  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};
