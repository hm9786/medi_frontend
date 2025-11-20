"use client";

import Link from "next/link";
import { useSelector } from "react-redux";

export default function MenuItems({ onLogout, onClose, variant = "desktop" }) {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  // variant에 따른 스타일 클래스
  const isMobile = variant === "mobile";
  
  // 버튼/링크 기본 스타일
  const buttonBaseStyles = isMobile
    ? "w-full px-4 py-3 rounded-lg text-base font-bold font-['Inter']"
    : "px-6 py-2.5 rounded-lg shadow-[0px_1px_2px_0px_rgba(0,0,0,0.05)] outline outline-2 outline-offset-[-2px] outline-white inline-flex justify-center items-center gap-2 transition-colors";
  
  const textStyles = isMobile
    ? "text-base"
    : "text-base";

  if (isAuthenticated) {
    return (
      <>
        {/* 사용자 정보 */}
        {isMobile ? (
          <div className="text-black text-base font-medium font-['Inter'] pb-2 border-b">
            {user?.name || user?.email}님
          </div>
        ) : (
          <span className={`text-black ${textStyles} font-medium font-['Inter']`}>
            {user?.name || user?.email}님
          </span>
        )}
        
        {/* 로그아웃 버튼 */}
        <button
          onClick={onLogout}
          className={`${buttonBaseStyles} bg-black text-white hover:bg-black`}
        >
          {isMobile ? (
            "로그아웃"
          ) : (
            <span className={`text-white ${textStyles} font-bold font-['Inter']`}>
              로그아웃
            </span>
          )}
        </button>
      </>
    );
  }

  return (
    <>
      {/* 회원가입 버튼 */}
      <Link
        href="/signup/step0"
        onClick={onClose}
        className={`${buttonBaseStyles} bg-red-600 text-white hover:bg-red-700 ${isMobile ? "block text-center" : ""} ${isMobile ? "mb-3" : ""}`}
      >
        {isMobile ? (
          "회원가입"
        ) : (
          <span className={`text-white ${textStyles} font-medium font-['Inter']`}>
            회원가입
          </span>
        )}
      </Link>
      
      {/* 로그인 버튼 */}
      <Link
        href="/login"
        onClick={onClose}
        className={`${buttonBaseStyles} bg-black text-white hover:bg-black ${isMobile ? "block text-center" : ""}`}
      >
        {isMobile ? (
          "로그인"
        ) : (
          <span className={`text-white ${textStyles} font-bold font-['Inter']`}>
            로그인
          </span>
        )}
      </Link>
    </>
  );
}

