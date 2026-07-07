"use client";

import { useEffect, Suspense } from "react";
import { useDispatch } from "react-redux";
import { useRouter, useSearchParams } from "next/navigation";
import { loginSuccess, loginFailure } from "@/lib/slices/authSlice";
import { apiUrl } from "@/lib/config";
import { Loader2 } from "lucide-react";

export default function OAuth2CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    }>
      <OAuth2CallbackInner />
    </Suspense>
  );
}

function OAuth2CallbackInner() {
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // 백엔드에서 구글 OAuth 인증 후 리다이렉트된 경우
        // 세션 확인 API 호출 (OAuth2와 일반 로그인 모두 지원)
        const response = await fetch(apiUrl("api/auth/me"), {
          method: "GET",
          credentials: "include",
        });

        // HTTP 상태 코드 확인
        if (!response.ok) {
          dispatch(loginFailure("구글 로그인에 실패했습니다."));
          router.push("/login");
          return;
        }

        const data = await response.json();

        // 백엔드 응답 형식: { success: true, authenticated: true, user: {...} }
        if (data.success && data.authenticated && data.user) {
          // 로그인 성공 - Redux에 사용자 정보 저장
          dispatch(loginSuccess(data.user));
          router.push("/dashboard");
        } else {
          dispatch(loginFailure(data.message || "구글 로그인에 실패했습니다."));
          router.push("/login");
        }
      } catch (error) {
        console.error("구글 OAuth 콜백 오류:", error);
        dispatch(loginFailure("서버 연결에 실패했습니다."));
        router.push("/login");
      }
    };

    handleCallback();
  }, [dispatch, router]);

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-medium text-gray-700 mb-4">로그인 처리 중...</h1>
        <p className="text-gray-500">잠시만 기다려주세요.</p>
      </div>
    </div>
  );
}

