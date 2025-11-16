"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Navigation from "@/components/Navigation"; // 1. 방금 만든 Navigation 컴포넌트
import Link from "next/link";
import { Button } from "@/components/ui/button";

// 메인 페이지
export default function MainPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  // 로그인 상태면 대시보드로 리다이렉트
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // 로그인 상태면 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1. 네비게이션 */}
      <Navigation />

      {/* 2. 메인 컨텐츠 (Hero) */}
      <main className="pt-24 md:pt-32">
        
        {/* 헤드라인 및 CTA 버튼 (반응형 중앙 정렬) */}
        <section className="container mx-auto px-6 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-4 font-['Inter']">
            AI가 당신의 댓글창을 24시간 지킵니다
          </h1>
          <p className="text-lg text-gray-600 mb-8 font-medium font-['Inter']">
            SNS 댓글관리 솔루션 메디를 만나보세요
          </p>
          
          {/* shadcn/ui 버튼 사용 */}
          <Link href="/login"> {/* 회원가입 1단계로 이동 */}
            <Button size="lg" className="text-lg px-8 py-6 rounded-lg">
              무료로 시작하기
            </Button>
          </Link>
        </section>

        {/* 3. 목업 이미지 영역 (반응형 레이아웃) */}
        <section className="container mx-auto px-6 mt-12 md:mt-16 flex flex-col md:flex-row justify-center items-start gap-8">
          
          {/* 왼쪽 모바일 목업 (임시) */}
          <div className="w-full md:w-1/3 flex justify-center">
            {/* ‼️ public 폴더에 실제 이미지를 넣고 경로를 수정해야 합니다. */}
            <img 
              src="/mockup-mobile.png" // '/public/mockup-mobile.png'을 의미
              alt="모바일 댓글창 예시" 
              className="rounded-[40px] shadow-xl max-w-xs"
            />
          </div>

          {/* 오른쪽 대시보드 목업 (임시) */}
          <div className="w-full md:w-2/3 flex justify-center">
            {/* ‼️ public 폴더에 실제 이미지를 넣고 경로를 수정해야 합니다. */}
            <img 
              src="/mockup-dashboard.png" // '/public/mockup-dashboard.png'을 의미
              alt="대시보드 예시" 
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
        </section>

      </main>
    </div>
  );
}