import axios from 'axios';

// API 기본 설정 (백엔드 직접 연동)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

// axios 인스턴스 생성 (세션 기반)
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // 쿠키 자동 전송
  headers: {
    'Content-Type': 'application/json',
  },
});

// 응답 인터셉터 (에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 401 에러 시 로그인 페이지로 리다이렉트
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API 응답 타입 정의
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message: string;
}

// 사용자 정보 타입
export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
}

// 회원가입 관련 API
export const authAPI = {
  // 이메일 중복 검사
  checkEmailDuplicate: async (email: string): Promise<ApiResponse<{ available: boolean }>> => {
    const response = await apiClient.post('/auth/check-email', { email });
    return response.data;
  },

  // 인증번호 발송
  sendVerificationCode: async (email: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/send-verification', { email });
    return response.data;
  },

  // 인증번호 확인
  verifyCode: async (email: string, code: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/verify-code', { email, code });
    return response.data;
  },

  // 회원가입
  signup: async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post('/auth/signup', userData);
    return response.data;
  },

  // 로그인
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User }>> => {
    const response = await apiClient.post('/auth/login', { email, password });
    return response.data;
  },

  // 사용자 정보 조회 (현재 로그인 상태 확인)
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  },

  // 현재 로그인 상태 확인 (/api/auth/me)
  checkAuthStatus: async (): Promise<{ authenticated: boolean; user?: User; sessionId?: string; message?: string }> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // 로그아웃
  logout: async (): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/logout');
    return response.data;
  },

  // 비밀번호 재설정 요청
  requestPasswordReset: async (email: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/password-reset-request', { email });
    return response.data;
  },

  // 비밀번호 재설정
  resetPassword: async (email: string, code: string, newPassword: string): Promise<ApiResponse> => {
    const response = await apiClient.post('/auth/password-reset', { email, code, newPassword });
    return response.data;
  },
};

// 세션 관리 유틸리티 (간단한 상태 확인용)
export const sessionUtils = {
  // 로그인 상태는 서버에서 세션으로 관리
  // 클라이언트에서는 API 호출로만 확인
  checkLoginStatus: async (): Promise<boolean> => {
    try {
      await apiClient.get('/auth/check-session');
      return true;
    } catch (error) {
      return false;
    }
  },
};
