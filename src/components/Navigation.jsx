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
  const clearGoogleSession = () => {
    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = "https://accounts.google.com/Logout";
      document.body.appendChild(iframe);
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 2000);
    } catch (error) {
      console.info("구글 세션 초기화 중 오류가 발생했지만 무시합니다.");
    }
  };

  const handleLogout = async () => {
    try {
      const isGoogleUser = user?.provider === "GOOGLE";
      const googleLogoutUrl = "http://localhost:8080/api/auth/oauth2/logout";
      const defaultLogoutUrl = "http://localhost:8080/api/auth/logout";
      
      if (isGoogleUser) {
        try {
          const oauthResponse = await fetch(googleLogoutUrl, {
            method: "POST",
            credentials: "include",
          });
          if (!oauthResponse.ok) {
            console.warn(`구글 로그아웃 API 오류: ${oauthResponse.status}`);
          }
          clearGoogleSession();
        } catch (error) {
          console.info("구글 로그아웃 요청 중 오류가 발생했지만 무시합니다.");
        }
      }

      const response = await fetch(defaultLogoutUrl, {
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
      router.push("/login");
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