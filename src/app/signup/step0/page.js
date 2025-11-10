"use client"; // useRouter 등을 사용하기 위해 Client Component로 설정

import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// Navigation 컴포넌트의 경로가 올바른지 확인하세요.
// 이 코드는 Navigation.jsx 파일이 src/components/에 있다고 가정합니다.
import Navigation from "@/components/Navigation"; 

// 1. 구글 로고 아이콘 (SVG 컴포넌트)
// (피그마의 div 4개 대신, 깔끔한 SVG를 사용합니다)
function GoogleIcon(props) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 48 48" 
      width="24px" 
      height="24px" 
      {...props}
    >
      <path 
        fill="#FFC107" 
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12s5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path 
        fill="#FF3D00" 
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path 
        fill="#4CAF50" 
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path 
        fill="#1976D2" 
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.574l6.19,5.238C39.901,36.096,44,30.638,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}


// 2. '메디 시작하기' (step0) 페이지 본문
export default function SignupStep0Page() {
  const [isLoading, setIsLoading] = useState(false);

  // 구글 OAuth 회원가입/로그인 핸들러
  const handleGoogleAuth = async () => {
    try {
      setIsLoading(true);
      // 구글 OAuth 로그인 URL 조회
      const response = await fetch("http://localhost:8080/api/auth/oauth2/google/url", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        alert("구글 로그인 URL을 가져오는데 실패했습니다.");
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      
      // 백엔드에서 받은 URL로 리다이렉트
      // URL이 상대 경로인 경우 백엔드 base URL과 결합
      const redirectUrl = data.url.startsWith("http") 
        ? data.url 
        : `http://localhost:8080${data.url}`;
      
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("구글 로그인 오류:", error);
      alert("서버 연결에 실패했습니다.");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />

      {/* 메인 콘텐츠 (flex를 사용해 화면 중앙에 배치) */}
      <main className="min-h-screen flex flex-col justify-center items-center pt-20">
        <div className="flex flex-col items-center gap-10 w-full max-w-md px-4">
          
          {/* 3-1. 메디 시작하기 (Roboto 폰트 적용) */}
          <h1 className="text-6xl font-medium font-['Roboto'] leading-[64px] text-black">
            메디 시작하기
          </h1>

          {/* 3-2. 버튼 영역 */}
          <div className="flex flex-col gap-4 w-full">
            
            {/* 이메일로 시작하기 (shadcn/ui Button) */}
            {/* 이 버튼을 누르면 step1 (약관 동의) 페이지로 이동합니다. */}
            <Button size="lg" className="h-14 w-full rounded-2xl text-base" asChild>
              <Link href="/signup/step1">이메일 계정으로 시작하기</Link>
            </Button>

            {/* 구글로 계속하기 (shadcn/ui Button) */}
            <Button 
              size="lg" 
              variant="outline" 
              className="h-14 w-full rounded-2xl text-base border-neutral-300"
              onClick={handleGoogleAuth}
              disabled={isLoading}
            >
              <GoogleIcon className="mr-2 h-6 w-6" />
              {isLoading ? "연결 중..." : "구글 계정으로 계속하기"}
            </Button>
          </div>

        </div>
      </main>
    </div>
  );
}