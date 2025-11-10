"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { restoreSession } from "@/lib/slices/authSlice";

export default function AuthInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    // 앱 초기 로드 시 세션 확인
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/me", {
          method: "GET",
          credentials: "include",
        });

        // HTTP 상태 코드 확인
        if (!response.ok) {
          // 401 Unauthorized 등은 정상적인 경우 (로그인 안 됨)
          return;
        }

        const data = await response.json();

        if (data.success && data.authenticated && data.user) {
          // 세션이 유효하면 Redux에 사용자 정보 저장
          dispatch(restoreSession(data.user));
        }
      } catch (error) {
        // 네트워크 오류 등은 조용히 처리 (로그인 안 된 것으로 간주)
        console.error("세션 확인 오류:", error);
      }
    };

    checkSession();
  }, [dispatch]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않음
}

