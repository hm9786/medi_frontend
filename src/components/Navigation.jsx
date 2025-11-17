"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/slices/authSlice";

export default function Navigation() {
  const router = useRouter();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // 로그아웃 핸들러
  const handleLogout = async () => {
    try {
      const isGoogleUser = user?.provider === "GOOGLE";
      
      const logoutUrl = isGoogleUser 
        ? "http://localhost:8080/api/auth/oauth2/logout"
        : "http://localhost:8080/api/auth/logout";
      
      const response = await fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        console.warn(`로그아웃 API 오류: ${response.status}`);
      }
    } catch (error) {
      console.error("로그아웃 오류:", error);
    } finally {
      dispatch(logout());
      router.push("/");
    }
  };

  return (
    <header className="w-full h-20 relative border-b border-black overflow-hidden bg-white">
      <nav className="max-w-[1440px] mx-auto h-full relative px-6">
        {/* 로고 */}
        <Link
          href="/"
          className="absolute left-[148px] top-[22px] w-20 h-8 flex justify-center items-center text-black text-4xl font-bold font-['Comic_Neue'] leading-[54px]"
        >
          Medi
        </Link>

        {/* 메뉴 항목 */}
        <div className="absolute left-[808px] top-[24px] w-80 inline-flex justify-end items-center gap-12">
          <Link 
            href="#" 
            className="flex justify-center items-center text-black text-xl font-medium font-['Inter'] leading-8 hover:text-red-600 transition-colors"
          >
            제품소개
          </Link>
          <Link 
            href="#" 
            className="flex justify-center items-center text-black text-xl font-medium font-['Inter'] leading-8 hover:text-red-600 transition-colors"
          >
            회사소개
          </Link>
          <Link 
            href="#" 
            className="flex justify-center items-center text-black text-xl font-medium font-['Inter'] leading-8 hover:text-red-600 transition-colors"
          >
            요금제
          </Link>
        </div>

        {/* 로그인 상태에 따른 버튼 표시 */}
        {isAuthenticated ? (
          <div className="absolute right-[148px] top-[11px] flex items-center gap-3">
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
          <>
            {/* 회원가입 버튼 */}
            <Link
              href="/signup/step0"
              className="absolute left-[1195px] top-[11px] px-6 py-3.5 bg-red-600 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-2 outline-offset-[-2px] outline-white inline-flex justify-center items-center gap-2 hover:bg-red-700 transition-colors"
            >
              <span className="text-white text-base font-medium font-['Inter'] leading-6">
                회원가입
              </span>
            </Link>

            {/* 로그인 버튼 */}
            <Link
              href="/login"
              className="absolute left-[1313px] top-[11px] px-6 py-3.5 bg-black rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-2 outline-offset-[-2px] outline-white inline-flex justify-center items-center gap-2 hover:bg-black transition-colors"
            >
              <span className="text-white text-base font-bold font-['Inter'] leading-6">
                로그인
              </span>
            </Link>
          </>
        )}
      </nav>
    </header>
  );
}