"use client"; // useState를 사용해야 하므로 Client Component가 되어야 합니다.

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation"; // 1. Navigation 컴포넌트 가져오기
import {
  loginStart,
  loginSuccess,
  loginFailure,
} from "@/lib/slices/authSlice";

// 2. 구글 로고 아이콘 (SVG 컴포넌트)
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


// 3. '로그인' 페이지 본문
export default function LoginPage() {
  // 폼 데이터를 '기억'하기 위한 State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Redux에서 로딩 상태와 에러 가져오기
  const { isLoading, error } = useSelector((state) => state.auth);

  // 로그인 버튼 클릭 시 실행될 함수
  const handleLogin = async (e) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지
    
    // 1. 간단한 유효성 검사
    if (!email || !password) {
      dispatch(loginFailure("아이디와 비밀번호를 모두 입력해주세요."));
      return;
    }

    dispatch(loginStart());

    try {
      // 2. 백엔드 API 호출
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // 세션 쿠키 사용
        body: JSON.stringify({
          email: email,
          password: password,
          rememberMe: false, // 필요시 체크박스로 변경 가능
        }),
      });

      // HTTP 상태 코드 확인
      if (!response.ok) {
        // 401 Unauthorized 등의 에러 처리
        try {
          const errorData = await response.json();
          dispatch(loginFailure(errorData.message || "로그인에 실패했습니다."));
        } catch {
          dispatch(loginFailure(`서버 오류가 발생했습니다. (${response.status})`));
        }
        return;
      }

      const data = await response.json();

      // 3. 로그인 성공 시 Redux에 저장하고 대시보드로 이동
      if (data.success) {
        dispatch(loginSuccess(data.user));
        router.push("/dashboard");
      } else {
        dispatch(loginFailure(data.message || "아이디 또는 비밀번호가 일치하지 않습니다."));
      }
    } catch (error) {
      console.error("로그인 오류:", error);
      dispatch(loginFailure("서버 연결에 실패했습니다. 다시 시도해주세요."));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />

      {/* 메인 콘텐츠 (flex를 사용해 화면 중앙에 배치) */}
      <main className="min-h-screen flex flex-col justify-center items-center pt-20">
        <div className="flex flex-col items-center gap-8 w-full max-w-md px-4 py-8">
          
          {/* 3-1. 제목 (Roboto 폰트 적용) */}
          <h1 className="text-6xl font-medium font-['Roboto'] text-black">
            로그인
          </h1>

          {/* 3-2. 로그인 폼 */}
          <form onSubmit={handleLogin} className="w-full flex flex-col gap-4">
            
            {/* 아이디(이메일) 입력란 */}
            <div className="w-full grid gap-1.5">
              <Label 
                htmlFor="email" 
                className="text-xl font-bold font-['Comic_Neue'] text-black"
              >
                아이디(이메일)
              </Label>
              <Input 
                type="email" 
                id="email" 
                placeholder="email@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-14 rounded-2xl text-base"
              />
              <div className="text-right">
                <Link href="#" className="text-sm text-gray-600 hover:underline">
                  아이디 찾기
                </Link>
              </div>
            </div>

            {/* 비밀번호 입력란 */}
            <div className="w-full grid gap-1.5">
              <Label 
                htmlFor="password" 
                className="text-xl font-bold font-['Comic_Neue'] text-black"
              >
                비밀번호
              </Label>
              <Input 
                type="password" 
                id="password" 
                placeholder="비밀번호" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-14 rounded-2xl text-base"
              />
              <div className="text-right">
                <Link href="/findpassword" className="text-sm text-gray-600 hover:underline">
                  비밀번호 찾기
                </Link>
              </div>
            </div>

            {/* 에러 메시지 표시 */}
            {error && (
              <p className="text-sm font-medium text-red-500">
                {error}
              </p>
            )}

            {/* 로그인 버튼 */}
            <Button 
              type="submit" 
              size="lg" 
              className="h-14 w-full rounded-2xl text-base mt-4"
              disabled={isLoading}
            >
              {isLoading ? "로그인 중..." : "로그인"}
            </Button>
          </form>

          {/* 회원가입 링크 */}
          <div className="text-sm text-gray-600">
            회원이 아니신가요?
            <Link href="/signup/step0" className="font-bold text-blue-500 hover:underline ml-1">
              회원가입
            </Link>
          </div>

          {/* 구분선 (or) */}
          <div className="flex items-center w-full">
            <Separator className="flex-1" />
            <span className="px-4 text-sm text-gray-500">OR</span>
            <Separator className="flex-1" />
          </div>
          
          {/* 구글 로그인 버튼 */}
          <Button size="lg" variant="outline" className="h-14 w-full rounded-2xl text-base border-neutral-300">
            <GoogleIcon className="mr-2 h-6 w-6" />
            구글 계정으로 계속하기
          </Button>

        </div>
      </main>
    </div>
  );
}