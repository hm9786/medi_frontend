"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authAPI, tokenUtils, User } from '@/lib/api';

// AuthContext 타입 정의
interface AuthContextType {
  // 상태
  user: User | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  
  // 액션
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Context 생성
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider Props 타입
interface AuthProviderProps {
  children: ReactNode;
}

// AuthProvider 컴포넌트
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 사용자 정보 새로고침
  const refreshUser = async () => {
    try {
      if (tokenUtils.isLoggedIn()) {
        const response = await authAPI.getProfile();
        setUser(response.data);
        setIsLoggedIn(true);
      } else {
        setUser(null);
        setIsLoggedIn(false);
      }
    } catch (error) {
      console.error('사용자 정보 조회 실패:', error);
      // 토큰이 유효하지 않은 경우
      tokenUtils.clearTokens();
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 로그인 함수
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await authAPI.login(email, password);
      
      // 토큰 저장
      tokenUtils.setTokens(response.data.token);
      
      // 사용자 정보 설정
      setUser(response.data.user);
      setIsLoggedIn(true);
      
      return true;
    } catch (error) {
      console.error('로그인 실패:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = async () => {
    try {
      setIsLoading(true);
      
      // 백엔드에 로그아웃 요청 (선택사항)
      try {
        await authAPI.logout();
      } catch (error) {
        console.error('로그아웃 API 호출 실패:', error);
        // API 호출이 실패해도 로컬 로그아웃은 진행
      }
      
      // 토큰 제거
      tokenUtils.clearTokens();
      
      // 상태 초기화
      setUser(null);
      setIsLoggedIn(false);
    } catch (error) {
      console.error('로그아웃 실패:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 컴포넌트 마운트 시 사용자 정보 확인
  useEffect(() => {
    refreshUser();
  }, []);

  // Context 값
  const contextValue: AuthContextType = {
    user,
    isLoading,
    isLoggedIn,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// useAuth 훅
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth는 AuthProvider 내부에서 사용되어야 합니다');
  }
  return context;
}

// 로그인 상태 확인 훅
export function useRequireAuth() {
  const { isLoggedIn, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      window.location.href = '/login';
    }
  }, [isLoggedIn, isLoading]);

  return { isLoggedIn, isLoading };
}
