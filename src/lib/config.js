// 기본값: 환경변수 기반 (서버/SSR)
let API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080';

// 클라이언트 환경에서만 실행
if (typeof window !== 'undefined') {

  // 환경변수가 명시돼 있으면 항상 그 값을 사용 (로컬 Docker: http://localhost:8080)
  if (process.env.NEXT_PUBLIC_API_BASE_URL) {
    API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  // 값이 없고 운영 환경이면 same-origin(리버스 프록시 배포) 사용
  else if (process.env.NODE_ENV === 'production') {
    API_BASE_URL = window.location.origin;
  }
  // 그 외(개발)는 기본 backend 주소
  else {
    API_BASE_URL = 'http://localhost:8080';
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
