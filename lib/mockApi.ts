// 백엔드가 준비되기 전 테스트용 Mock API

import { User, ApiResponse } from './api';

// Mock 사용자 데이터
const mockUsers: User[] = [
  {
    id: '1',
    email: 'test@example.com',
    name: '테스트 사용자',
    phone: '010-1234-5678'
  }
];

// Mock 인증 토큰
const MOCK_TOKEN = 'mock-jwt-token-12345';

// 지연 시뮬레이션
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockAuthAPI = {
  // 이메일 중복 검사
  checkEmailDuplicate: async (email: string): Promise<ApiResponse<{ available: boolean }>> => {
    await delay(500);
    
    const exists = mockUsers.some(user => user.email === email);
    
    return {
      success: true,
      data: { available: !exists },
      message: exists ? '이미 사용중인 이메일입니다.' : '사용 가능한 이메일입니다.'
    };
  },

  // 인증번호 발송
  sendVerificationCode: async (email: string): Promise<ApiResponse> => {
    await delay(1000);
    
    return {
      success: true,
      data: {},
      message: '인증번호가 발송되었습니다.'
    };
  },

  // 인증번호 확인
  verifyCode: async (email: string, code: string): Promise<ApiResponse> => {
    await delay(500);
    
    // Mock: 123456이면 성공
    if (code === '123456') {
      return {
        success: true,
        data: {},
        message: '인증이 완료되었습니다.'
      };
    } else {
      throw {
        response: {
          data: {
            success: false,
            message: '인증번호가 올바르지 않습니다.'
          }
        }
      };
    }
  },

  // 회원가입
  signup: async (userData: {
    email: string;
    password: string;
    name: string;
    phone: string;
  }): Promise<ApiResponse<{ user: User }>> => {
    await delay(1000);
    
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email,
      name: userData.name,
      phone: userData.phone
    };
    
    mockUsers.push(newUser);
    
    return {
      success: true,
      data: {
        user: newUser
      },
      message: '회원가입이 완료되었습니다.'
    };
  },

  // 로그인
  login: async (email: string, password: string): Promise<ApiResponse<{ user: User }>> => {
    await delay(800);
    
    const user = mockUsers.find(u => u.email === email);
    
    if (user && password === 'password123') {
      return {
        success: true,
        data: {
          user
        },
        message: '로그인 성공'
      };
    } else {
      throw {
        response: {
          data: {
            success: false,
            message: '이메일 또는 비밀번호가 올바르지 않습니다.'
          }
        }
      };
    }
  },

  // 사용자 정보 조회
  getProfile: async (): Promise<ApiResponse<User>> => {
    await delay(300);
    
    return {
      success: true,
      data: mockUsers[0], // 첫 번째 사용자 반환
      message: '사용자 정보 조회 성공'
    };
  },

  // 로그아웃
  logout: async (): Promise<ApiResponse> => {
    await delay(200);
    
    return {
      success: true,
      data: {},
      message: '로그아웃 완료'
    };
  }
};

// Mock API 사용 여부 (환경변수로 제어)
export const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';
