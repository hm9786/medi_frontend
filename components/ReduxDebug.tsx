"use client";

import { useAppSelector } from "@/store";

export function ReduxDebug() {
  const authState = useAppSelector((state) => state.auth);

  // 프로덕션 환경에서는 표시하지 않음
  if (process.env.NODE_ENV !== 'development') return null;

  return (
    <div className="fixed bottom-4 left-4 bg-black text-white p-4 rounded text-xs max-w-xs z-50">
      <h4 className="font-bold mb-2">Redux Auth Debug</h4>
      <div className="space-y-1">
        <p>로그인: {authState.isLoggedIn ? '✅' : '❌'}</p>
        <p>로딩: {authState.isLoading ? '⏳' : '✅'}</p>
        <p>사용자: {authState.user?.name || 'None'}</p>
        <p>토큰: {authState.token ? '✅' : '❌'}</p>
        <p>에러: {authState.error || 'None'}</p>
      </div>
      <div className="mt-2 text-xs text-gray-400">
        Redux DevTools를 열어서 더 자세한 정보를 확인하세요
      </div>
    </div>
  );
}
