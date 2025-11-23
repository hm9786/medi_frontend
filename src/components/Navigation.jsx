"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/slices/authSlice";
import { Button } from "@/components/ui/button";

export default function Navigation({ variant = "default", hideButtons = false }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = async () => {
    try {
      const logoutUrl = "http://localhost:8080/api/auth/logout";
      await fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("로그아웃 오류:", error);
    } finally {
      dispatch(logout());
      router.push("/login");
    }
  };

  // 메인 페이지용 네비게이션 (landing variant)
  if (variant === "landing") {
    return (
      <nav className="border-b border-slate-200 sticky top-0 bg-white/80 backdrop-blur-md z-50 transition-colors duration-300">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <Link href="/" className="text-lg sm:text-xl font-bold text-black transition-colors hover:opacity-80">
            MEDI
          </Link>
          <div className="flex gap-2 sm:gap-4 items-center">
            {/* 버튼 영역 - hideButtons가 false일 때만 표시 */}
            {!hideButtons && (
              <>
                <Link href="/login">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm border-slate-200 transition-colors">
                    로그인
                  </Button>
                </Link>
                <Link href="/signup/step0">
                  <Button size="sm" className="text-xs sm:text-sm bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                    무료로 시작하기
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    );
  }

  // 기본 네비게이션
  return (
    <header className="w-full h-20 border-b border-black bg-white">
      <nav className="max-w-[1440px] mx-auto h-full px-6 flex items-center justify-between">
        {/* 로고 */}
        <Link
          href="/"
          className="text-black text-4xl font-bold font-['Comic_Neue'] leading-[54px]"
        >
          Medi
        </Link>

        {/* 로그인 상태에 따른 버튼 표시 */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <span className="text-black text-base font-medium font-['Inter']">
              {user?.name || user?.email}님
            </span>
            <button
              onClick={handleLogout}
              className="px-6 py-3.5 bg-black rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-2 outline-offset-[-2px] outline-white inline-flex justify-center items-center gap-2 hover:bg-black transition-colors"
            >
              <span className="text-white text-base font-bold font-['Inter'] leading-6">
                로그아웃
              </span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              href="/signup/step0"
              className="px-6 py-3.5 bg-red-600 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-2 outline-offset-[-2px] outline-white inline-flex justify-center items-center gap-2 hover:bg-red-700 transition-colors"
            >
              <span className="text-white text-base font-medium font-['Inter'] leading-6">
                회원가입
              </span>
            </Link>
            <Link
              href="/login"
              className="px-6 py-3.5 bg-black rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-2 outline-offset-[-2px] outline-white inline-flex justify-center items-center gap-2 hover:bg-black transition-colors"
            >
              <span className="text-white text-base font-bold font-['Inter'] leading-6">
                로그인
              </span>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
}