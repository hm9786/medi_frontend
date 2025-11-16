"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { logout } from "@/lib/slices/authSlice";

export default function Navigation() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      // 구글 OAuth 로그인인지 확인
      const isGoogleUser = user?.provider === "GOOGLE";
      
      // 적절한 로그아웃 API 호출
      const logoutUrl = isGoogleUser 
        ? "http://localhost:8080/api/auth/oauth2/logout"
        : "http://localhost:8080/api/auth/logout";
      
      const response = await fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
      });

      // HTTP 상태 코드 확인 (로그아웃은 실패해도 클라이언트 상태는 초기화)
      if (!response.ok) {
        console.warn(`로그아웃 API 오류: ${response.status}`);
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
    } finally {
      // Redux 상태 초기화 (서버 응답과 관계없이 항상 실행)
      dispatch(logout());
      router.push("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50 h-16">
      <nav className="container mx-auto px-6 h-full flex justify-between items-center">
        {/* 로고 (Comic Neue 폰트 적용) */}
        <Link
          href="/"
          className="text-black text-4xl font-bold font-['Comic_Neue'] leading-none flex items-center"
        >
          Medi
        </Link>

        {/* 메뉴 항목 */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="#" className="text-sm text-gray-600 hover:text-blue-500">
            제품소개
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-blue-500">
            회사소개
          </Link>
          <Link href="#" className="text-sm text-gray-600 hover:text-blue-500">
            요금제
          </Link>
        </div>

        {/* 로그인 상태에 따른 버튼 표시 */}
        {isAuthenticated ? (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-700">
              {user?.name || user?.email}님
            </span>
            <Button variant="ghost" onClick={handleLogout}>
              로그아웃
            </Button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Link href="/login">
              <Button variant="ghost">로그인</Button>
            </Link>
            <Link href="/signup/step0">
              <Button>회원가입</Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}