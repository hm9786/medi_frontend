"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store";
import { logoutUser } from "@/store/authSlice";
import { useState } from "react";

export function Navigation() {
  const dispatch = useAppDispatch();
  const { user, isLoggedIn, isLoading } = useAppSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    setIsDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        
        {/* 로고 */}
        <Link
          href="/"
          className="text-black text-4xl font-bold font-['Comic_Neue'] leading-[54px]"
        >
          Medi
        </Link>

        {/* 메뉴 항목 - 로그인 상태에 따라 다름 */}
        <div className="hidden md:flex items-center space-x-6">
          {isLoggedIn ? (
            // 로그인 후 메뉴
            <>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-blue-500">
                대시보드
              </Link>
              <Link href="/comments" className="text-sm text-gray-600 hover:text-blue-500">
                댓글관리
              </Link>
              <Link href="/settings" className="text-sm text-gray-600 hover:text-blue-500">
                설정
              </Link>
            </>
          ) : (
            // 로그인 전 메뉴
            <>
              <Link href="/informitem" className="text-sm text-gray-600 hover:text-blue-500">
                제품소개
              </Link>
              <Link href="/companyinform" className="text-sm text-gray-600 hover:text-blue-500">
                회사소개
              </Link>
              <Link href="/plan" className="text-sm text-gray-600 hover:text-blue-500">
                요금제
              </Link>
            </>
          )}
        </div>

        {/* 로그인 상태에 따른 버튼 */}
        <div className="flex items-center space-x-2">
          {isLoading ? (
            // 로딩 중
            <div className="w-20 h-10 bg-gray-200 animate-pulse rounded"></div>
          ) : isLoggedIn ? (
            // 로그인 후 - 사용자 드롭다운
            <div className="relative">
              <Button
                variant="ghost"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center space-x-2"
              >
                <span>{user?.name || '사용자'}</span>
                <svg 
                  className={`w-4 h-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </Button>
              
              {/* 드롭다운 메뉴 */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
                  <Link 
                    href="/profile" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    프로필
                  </Link>
                  <Link 
                    href="/settings" 
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    설정
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                  >
                    로그아웃
                  </button>
                </div>
              )}
            </div>
          ) : (
            // 로그인 전 - 로그인/회원가입 버튼
            <>
              <Link href="/login">
                <Button variant="ghost">로그인</Button>
              </Link>
              <Link href="/hello">
                <Button>회원가입</Button>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
