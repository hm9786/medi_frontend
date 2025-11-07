"use client"; // useState, onClick 등 상호작용을 위해 필요합니다.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useRouter } from "next/navigation";


// 2. 약관 텍스트 (임시 하드코딩)
// (나중에 실제 약관 텍스트로 이 부분을 교체하세요)
const termsOfServiceText = `
제1조 (목적)
이 약관은 Medi 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (정의)
1. "서비스"라 함은 ... (중략) ...
2. "회원"이라 함은 ... (중략) ...

(내용이 매우 깁니다)
...
...
(스크롤 테스트를 위한 긴 텍스트)
...
...
...
...
...
...
...
...
...
...
...
...
제10조 (기타)
본 약관에 명시되지 않은 사항은 관계 법령과 일반적인 상거래 관행에 따릅니다.
`;

const privacyPolicyText = `
개인정보처리방침

Medi(이하 "회사")는 개인정보보호법을 준수하며, 관련 법령에 의거한 개인정보처리방침을 정하여 이용자 권익 보호에 최선을 다하고 있습니다.

1. 수집하는 개인정보 항목
회사는 회원가입, 상담, 서비스 신청 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
- 항목 : 이메일, 비밀번호, 이름 ... (중략) ...

(내용이 매우 깁니다)
...
...
(스크롤 테스트를 위한 긴 텍스트)
...
...
...
...
...
...
...
...
...
...
...
...
4. 개인정보의 파기
회사는 원칙적으로 개인정보 수집 및 이용목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
`;


// 3. '회원가입 1단계' 페이지 본문
export default function SignupStep1Page() {
  // 1. 각 필수 체크박스의 상태를 '기억'합니다.
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);

  const router = useRouter();

  // 2. "다음" 버튼 활성화 로직
  const isNextButtonEnabled = agreedToTerms && agreedToPrivacy;
  
  // "다음" 버튼 클릭 시
  const handleNextClick = () => {
    if (isNextButtonEnabled) {
      // (필수) 다음 회원가입 단계(step2)로 이동합니다.
      router.push("/signup/step2"); 
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 메인 콘텐츠 (flex를 사용해 화면 중앙에 배치) */}
      <main className="min-h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col items-center gap-6 w-full max-w-lg px-4 py-8">
          
          {/* 3-1. 제목 (Roboto 폰트 적용) */}
          <h1 className="text-6xl font-medium font-['Roboto'] text-black text-center">
            이용약관 동의
          </h1>

          {/* 3-2. 약관 동의 폼 */}
          <div className="w-full flex flex-col gap-5 p-4">
            
            {/* 이용약관 (필수) */}
            <div className="flex flex-col gap-2">
              <Label className="text-base font-medium">
                <span className="font-bold text-blue-500 underline">필수</span>
                {` 메디 이용약관`}
              </Label>
              {/* ⬇️ 피그마의 bg-zinc-300 대신 ScrollArea를 사용합니다. */}
              <ScrollArea className="h-48 w-full rounded-md border p-4 text-sm">
                {/* ⬇️ 여기에 실제 이용약관 텍스트를 하드코딩합니다. */}
                <pre className="whitespace-pre-wrap font-sans">
                  {termsOfServiceText}
                </pre>
              </ScrollArea>
              <div className="flex items-center space-x-2 justify-end">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
                  // ⬇️ 타입 문제 해결을 위해 boolean으로 캐스팅
                  onCheckedChange={(checked) => setAgreedToTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-base font-medium">
                  이용약관에 동의합니다
                </Label>
              </div>
            </div>

            {/* 개인정보 처리방침 (필수) */}
            <div className="flex flex-col gap-2">
              <Label className="text-base font-medium">
                <span className="font-bold text-blue-500 underline">필수</span>
                {` 개인정보처리방침`}
              </Label>
              {/* ⬇️ 피그마의 bg-zinc-300 대신 ScrollArea를 사용합니다. */}
              <ScrollArea className="h-48 w-full rounded-md border p-4 text-sm">
                {/* ⬇️ 여기에 실제 개인정보 처리방침 텍스트를 하드코딩합니다. */}
                <pre className="whitespace-pre-wrap font-sans">
                  {privacyPolicyText}
                </pre>
              </ScrollArea>
              <div className="flex items-center space-x-2 justify-end">
                <Checkbox 
                  id="privacy" 
                  checked={agreedToPrivacy}
                  onCheckedChange={(checked) => setAgreedToPrivacy(checked === true)}
                />
                <Label htmlFor="privacy" className="text-base font-medium">
                  개인정보처리방침에 동의합니다
                </Label>
              </div>
            </div>

            {/* 3-3. 하단 버튼 영역 */}
            <div className="flex w-full justify-between mt-6 gap-4">
              <Button 
                variant="outline"
                size="lg" 
                className="flex-1 h-14 rounded-lg text-base" 
                asChild
              >
                <Link href="/">취소</Link>
              </Button>
              <Button 
                size="lg" 
                className="flex-1 h-14 rounded-lg text-base"
                // ⬇️ 여기가 핵심 로직입니다!
                disabled={!isNextButtonEnabled}
                onClick={handleNextClick}
              >
                <Link href="/">
                다음</Link>
              </Button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}