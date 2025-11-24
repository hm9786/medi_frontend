"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Navigation({ hideButtons = false }) {
  return (
    <nav className="w-full border-b border-slate-200 sticky top-0 bg-white backdrop-blur-md z-50 transition-colors duration-300">
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