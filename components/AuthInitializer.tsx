"use client";

import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { initializeAuth, fetchUserProfile } from '@/store/authSlice';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // 앱 시작 시 세션 확인
    dispatch(initializeAuth());
    
    // 사용자 정보 조회 시도 (세션이 있으면 성공, 없으면 실패)
    dispatch(fetchUserProfile());
  }, [dispatch]);

  return <>{children}</>;
}
