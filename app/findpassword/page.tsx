"use client"; // useState, onClick 등 상호작용을 위해 필요합니다.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";


// 2. '비밀번호 찾기' 페이지 본문
export default function ForgotPasswordPage() {
  // ⬇️ "인증번호 확인" 입력창을 보여줄지 말지 '기억'하는 State
  const [showAuthCodeInput, setShowAuthCodeInput] = useState(false);

  // 폼 데이터를 '기억'하기 위한 State
  const [email, setEmail] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  
  const router = useRouter(); // 페이지 이동을 위한 훅

  // "인증번호 받기" 버튼 클릭 시
  const handleRequestCode = () => {
    setError("");
    
    if (!email) {
      setError("아이디(이메일)를 입력해주세요.");
      return;
    }

    // [미래] 여기에 백엔드로 "email"을 보내 인증번호를 요청하는 API 호출
    console.log("인증번호 요청:", email);

    // 성공 시, 메시지를 보여주고 "인증번호 확인" 입력창을 엽니다.
    setMessage("인증번호가 전송되었습니다. 이메일을 확인해주세요.");
    setShowAuthCodeInput(true); // ⬅️ "인증번호 확인" 입력창을 보여줍니다!
  };

  // "비밀번호 변경" (폼 전체 제출) 버튼 클릭 시
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // 폼 제출 시 새로고침 방지
    setError("");

    // 인증번호 확인란이 열렸는지 체크
    if (!showAuthCodeInput) {
      setError("먼저 이메일 인증을 완료해주세요.");
      return;
    }

    if (!authCode || !newPassword || !confirmPassword) {
      setError("모든 필드를 입력해주세요.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("새 비밀번호가 일치하지 않습니다.");
      setConfirmPassword(""); // 비밀번호 확인란 비우기
      return;
    }
    
    // [미래] 여기에 백엔드로 email, authCode, newPassword를 보내
    // 비밀번호를 변경하는 API 호출
    console.log("비밀번호 변경 시도:", email, authCode, newPassword);

    // 성공 시 로그인 페이지로 이동
    alert("비밀번호가 성공적으로 변경되었습니다.");
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 콘텐츠 (flex를 사용해 화면 중앙에 배치) */}
      <main className="min-h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-8 w-full max-w-md px-4 py-8">
          
          {/* 2-1. 제목 (Roboto 폰트 적용) */}
          <h1 className="text-6xl font-medium font-['Roboto'] text-black text-center">
            비밀번호 찾기
          </h1>

          {/* 2-2. 폼 */}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            
            {/* 아이디(이메일) 입력란 */}
            <div className="w-full grid gap-1.5">
              <Label 
                htmlFor="email" 
                className="text-xl font-bold font-['Comic_Neue'] text-black"
              >
                아이디(이메일)
              </Label>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  id="email" 
                  placeholder="email@example.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={showAuthCodeInput} // 인증번호를 받으면 수정 불가능
                  className="h-14 rounded-2xl text-base"
                />
                <Button 
                  type="button" // 폼 제출(submit) 방지
                  onClick={handleRequestCode}
                  disabled={showAuthCodeInput} // 이미 눌렀으면 비활성화
                  className="h-14 rounded-lg text-base shrink-0"
                >
                  {showAuthCodeInput ? "재전송" : "인증번호 받기"}
                </Button>
              </div>
            </div>

            {/*
              ⬇️ "인증번호 받기"를 누르면 (showAuthCodeInput === true가 되면)
              이 부분이 화면에 '추가로 생성'됩니다.
            */}
            {showAuthCodeInput && (
              <div className="w-full grid gap-1.5 animate-in fade-in-50 slide-in-from-top-2 duration-300">
                <Label 
                  htmlFor="authCode" 
                  className="text-xl font-bold font-['Comic_Neue'] text-black"
                >
                  인증번호 확인
                </Label>
                <div className="flex gap-2">
                  <Input 
                    type="text" 
                    id="authCode" 
                    placeholder="인증번호 6자리" 
                    value={authCode}
                    onChange={(e) => setAuthCode(e.target.value)}
                    className="h-14 rounded-2xl text-base"
                  />
                  <Button 
                    type="button"
                    variant="outline"
                    className="h-14 rounded-lg text-base shrink-0"
                  >
                    확인
                  </Button>
                </div>
              </div>
            )}
            
            {/* 새 비밀번호 */}
            <div className="w-full grid gap-1.5">
              <Label 
                htmlFor="newPassword" 
                className="text-xl font-bold font-['Comic_Neue'] text-black"
              >
                새 비밀번호
              </Label>
              <Input 
                type="password" 
                id="newPassword" 
                placeholder="새 비밀번호" 
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="h-14 rounded-2xl text-base"
              />
            </div>

            {/* 새 비밀번호 확인 */}
            <div className="w-full grid gap-1.5">
              <Label 
                htmlFor="confirmPassword" 
                className="text-xl font-bold font-['Comic_Neue'] text-black"
              >
                새 비밀번호 확인
              </Label>
              <Input 
                type="password" 
                id="confirmPassword" 
                placeholder="새 비밀번호 확인" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="h-14 rounded-2xl text-base"
              />
            </div>

            {/* 에러 및 성공 메시지 표시 */}
            {error && (
              <p className="text-sm font-medium text-red-500">
                {error}
              </p>
            )}
            {message && !error && (
              <p className="text-sm font-medium text-green-600">
                {message}
              </p>
            )}

            {/*
              피그마 디자인에는 '로그인'으로 되어있으나,
              '비밀번호 변경'이 문맥상 맞으므로 수정했습니다.
            */}
            <Button type="submit" size="lg" className="h-14 w-full rounded-2xl text-base mt-4">
              비밀번호 변경
            </Button>
            
          </form>
        </div>
      </main>
    </div>
  );
}