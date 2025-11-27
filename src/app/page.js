"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // 라우터 추가
import { useSelector } from "react-redux";   // Redux 상태 관리 추가
import Link from "next/link"; // 링크 이동을 위해 추가

import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, ArrowRight } from "lucide-react";

export default function Home() {
  // 1. 기존 인증 로직 통합 (로그인 한 사람은 대시보드로)
  const router = useRouter();
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // 2. 보내주신 디자인/애니메이션 로직
  const [hasLoaded, setHasLoaded] = useState(false);

  // 컴포넌트 마운트 후 애니메이션 시작
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  // 로그인 된 상태면 화면을 그리지 않음 (깜빡임 방지)
  if (isAuthenticated) {
    return null; 
  }

  return (
    <div>
      <main className="min-h-screen bg-white text-slate-900 transition-colors duration-300 font-sans">
        
        {/* 1. 네비게이션 헤더 */}
        <Navigation variant="landing" />

        {/* 2. 히어로 섹션 */}
        <section className="flex flex-col items-center text-center min-h-screen pt-12 sm:pt-20 pb-20 sm:pb-40 transition-colors duration-300 overflow-hidden">
          <div className="max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 mx-auto flex flex-col lg:flex-row items-center gap-8 sm:gap-12 lg:gap-20">
            
            {/* [왼쪽 방] 텍스트 영역 */}
            <div className="flex-1 w-full text-center lg:text-left md:-mt-20 lg:-mt-30 z-10">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-[3.8rem] font-extrabold tracking-tight mb-4 sm:mb-6 leading-tight">
                <span className="block text-slate-900 transition-colors">
                  유튜브 크리에이터를 위한
                </span>
                <span className="block text-blue-600 transition-colors">
                  댓글 관리 AI 에이전트
                </span>
               
              </h1>
              
              <p className="text-base sm:text-lg text-slate-600 mb-6 sm:mb-8 max-w-2xl mx-auto lg:mx-0 transition-colors px-2">
                메디는 AI 기반의 스마트 댓글 관리 AI에이전트 서비스로 
                <br className="hidden sm:block" />
                크리에이터의 정신적 육체적 부담을 덜어주고 컨텐츠의 질을 향상시킵니다
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-2">
                <Link href="/signup/step0" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto gap-2 bg-slate-900 text-white hover:bg-slate-800 transition-colors">
                    지금 시작하기 <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-200 transition-colors">
                  데모 영상 보기
                </Button>
              </div>
            </div>
          
            {/* [오른쪽 방] 이미지 영역 */}
            <div className="flex-1 w-full flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8 lg:gap-12 mt-6 sm:mt-10 lg:mt-0">
              
              {/* 휴대폰 1 */}
              <div 
                className={`relative transition-all duration-1000 ease-out 
                           ${hasLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              >
                {/* public 폴더에 아래 이미지가 있어야 합니다 */}
                <img 
                  src="/YouTubeChannelMockup.png"
                  alt="채널 화면" 
                  className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px] h-auto drop-shadow-2xl"
                />
              </div>
              
              {/* 휴대폰 2 */}
              <div 
                className={`relative mt-0 sm:mt-0 transition-all duration-1000 ease-out delay-200
                           ${hasLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}
              >
                 {/* public 폴더에 아래 이미지가 있어야 합니다 */}
                <img 
                  src="/YouTubeCommentMockup.png"
                  alt="댓글 화면" 
                  className="w-full max-w-[240px] sm:max-w-[280px] lg:max-w-[300px] h-auto drop-shadow-2xl"
                />
              </div>

            </div>
          </div>
        </section>

        {/* 3. 기능 소개 섹션 */}
        <section className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-slate-900 transition-colors">주요 기능</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            
            {[
              { title: "AI 자동 필터링", desc: "악플, 스팸을 자동으로 감지합니다.", detail: "문맥을 파악하는 AI가 설정한 강도에 맞춰 유해 댓글을 실시간으로 숨김 처리합니다." },
              { title: "실시간 대시보드", desc: "채널의 댓글 현황을 한눈에.", detail: "긍정/부정 댓글 비율, 주요 키워드 분석 등 데이터를 시각화하여 제공합니다." },
              { title: "24시간 안심 보호", desc: "잠든 사이에도 채널을 지킵니다.", detail: "클라우드 기반 에이전트가 24시간 365일 멈추지 않고 채널을 모니터링합니다." }
            ].map((item, index) => (
              <Card key={index} className="bg-white border-slate-200 transition-colors duration-300 hover:shadow-lg">
                <CardHeader>
                  <CheckCircle2 className="w-10 h-10 text-blue-500 mb-2" />
                  <CardTitle className="text-slate-900 transition-colors">{item.title}</CardTitle>
                  <CardDescription className="text-slate-500 transition-colors">{item.desc}</CardDescription>
                </CardHeader>
                <CardContent className="text-slate-600 transition-colors">
                  {item.detail}
                </CardContent>
              </Card>
            ))}

          </div>
        </section>
      </main>
    </div>
  );
}