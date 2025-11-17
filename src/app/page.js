"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Navigation from "@/components/Navigation";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function MainPage() {
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-200">
      {/* 네비게이션 */}
      <Navigation />

      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-[600px]">
          
          {/* 왼쪽: 텍스트 콘텐츠 */}
          <div className="flex flex-col items-center text-center space-y-8 lg:space-y-10 mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold font-['Inter'] leading-tight text-black">
              MEDI가 당신의 채널<br className="hidden sm:block" /> 댓글창을<br />
              24시간 지킵니다
            </h1>

            <p className="text-lg sm:text-xl lg:text-2xl font-medium font-['Inter'] leading-relaxed text-black max-w-md mx-auto">
              유튜브 크리에이터를 위한 댓글관리<br />
              솔루션 메디를 만나보세요
            </p>

            <Link href="/signup/step0" className="w-full flex justify-center">
              <Button className="w-full sm:w-56 h-12 sm:h-14 bg-red-600 hover:bg-red-700 rounded-lg shadow-md text-white text-lg sm:text-xl lg:text-2xl font-bold font-['Inter'] transition-all">
                무료로 시작하기
              </Button>
            </Link>
          </div>

          {/* 오른쪽: 휴대폰 목업 */}
          <div className="relative h-[400px] sm:h-[500px] lg:h-[600px] flex items-center justify-center lg:justify-end">
            {/* 첫 번째 휴대폰 (뒤쪽) */}
            <div 
              className="absolute right-0 sm:right-8 lg:right-12 top-8 sm:top-12 w-40 sm:w-48 lg:w-64 h-[350px] sm:h-[420px] lg:h-[585px] bg-white rounded-3xl overflow-hidden transform rotate-[-20deg] z-10"
              style={{
                boxShadow: '0px 28.8px 28.8px 0px rgba(0,0,0,0.25)'
              }}
            >
              <Image
                src="/mockup-phone-1.png"
                alt="Phone mockup 1"
                fill
                className="object-cover"
                priority
              />
            </div>

            {/* 두 번째 휴대폰 (앞쪽) */}
            <div 
              className="absolute left-4 sm:left-8 lg:left-0 top-32 sm:top-40 lg:top-48 w-40 sm:w-48 lg:w-64 h-[350px] sm:h-[420px] lg:h-[585px] bg-white rounded-3xl overflow-hidden transform rotate-[-20deg] z-20"
              style={{
                boxShadow: '0px 28.8px 28.8px 0px rgba(0,0,0,0.25)'
              }}
            >
              <Image
                src="/mockup-phone-2.png"
                alt="Phone mockup 2"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}