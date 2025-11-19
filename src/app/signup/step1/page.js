"use client"; // useState, onClick 등 상호작용을 위해 필요합니다.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";

// 1. 네비게이션 (헤더) 뼈대
// (회원가입 단계에서는 로고만 보여주는 것이 깔끔합니다.)
function Navigation() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        {/* 로고 (Comic Neue 폰트 적용) */}
        <Link
          href="/"
          className="text-black text-4xl font-bold font-['Comic_Neue'] leading-[54px]"
        >
          Medi
        </Link>
      </nav>
    </header>
  );
}

// 2. 약관 텍스트 (임시 하드코딩)
// (나중에 실제 약관 텍스트로 이 부분을 교체하세요)
const termsOfServiceText = `
제1조 (목적)
이 약관은 Medi 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다. (중략)

제2조 (이용 계약의 체결)
이용 계약은 회원이 되고자 하는 자(이하 "가입 신청자")의 약관 내용에 대한 동의와 이용 신청에 대하여 회사가 승낙함으로써 체결됩니다.

(내용이 매우 깁니다)
...
...
(스크롤 테스트를 위한 긴 텍스트)
...
...
제10조 (기타)
본 약관에 명시되지 않은 사항은 관계 법령과 일반적인 상거래 관행에 따릅니다.
`;

const privacyPolicyText = `
개인정보처리방침

Medi(이하 "회사")는 개인정보보호법을 준수하며, 아래와 같은 개인정보를 수집 및 이용합니다.

1. 수집하는 개인정보 항목
- 항목: 이메일, 비밀번호, 이름, 전화번호
- 수집 목적: 본인 확인 및 서비스 제공
(내용이 매우 깁니다)
...
...
(스크롤 테스트를 위한 긴 텍스트)
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

  // 2. "다음" 버튼 활성화 로직: 두 필수 항목 모두 true일 때 활성화
  const isNextButtonEnabled = agreedToTerms && agreedToPrivacy;

  // 3. '전체 동의' 체크박스 로직
  const handleAllAgreeChange = (checked) => {
    const isChecked = checked === true;
    setAgreedToTerms(isChecked);
    setAgreedToPrivacy(isChecked);
  };

  const allAgreedState = () => {
    if (agreedToTerms && agreedToPrivacy) return true;
    // (참고) 일부만 체크된 상태를 구현하려면 "indeterminate"를 반환합니다.
    // if (agreedToTerms || agreedToPrivacy) return "indeterminate";
    return false;
  };
  
  // "다음" 버튼 클릭 시
  const handleNextClick = () => {
    if (isNextButtonEnabled) {
      // 다음 회원가입 단계(step2)로 이동합니다.
      router.push("/signup/step2"); 
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />

      {/* 메인 콘텐츠 (flex를 사용해 화면 중앙에 배치) */}
      <main className="min-h-screen flex flex-col justify-center items-center pt-20">
        <div className="flex flex-col items-center gap-10 w-full max-w-lg px-4 py-8">
          
          {/* 3-1. 제목 (Roboto 폰트 적용) */}
          <h1 className="text-6xl font-medium font-['Roboto'] text-black text-center">
            이용약관 동의
          </h1>

          {/* 3-2. 약관 동의 영역 (디자인 참고) */}
          <div className="w-full flex flex-col gap-6 p-4">
            
            {/* 전체 동의 */}
            <div className="flex items-center space-x-3 border-b pb-4 border-gray-200">
              <Checkbox 
                id="all" 
                checked={allAgreedState()}
                onCheckedChange={handleAllAgreeChange}
                className="w-5 h-5"
              />
              <Label htmlFor="all" className="text-xl font-bold text-gray-900">
                전체 동의
              </Label>
            </div>
            
            {/* 이용약관 (필수) */}
            <div className="flex flex-col gap-2">
              <Label className="text-base font-medium">
                <span className="font-bold text-black underline">필수</span>
                {` 메디 이용약관`}
              </Label>
              {/* 스크롤 가능한 약관 내용 */}
              <ScrollArea className="h-48 w-full rounded-lg border border-gray-300 p-4 text-sm bg-gray-50">
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {termsOfServiceText}
                </pre>
              </ScrollArea>
              {/* 개별 동의 체크박스 */}
              <div className="flex items-center space-x-2 justify-end">
                <Checkbox 
                  id="terms" 
                  checked={agreedToTerms}
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
                <span className="font-bold text-black underline">필수</span>
                {` 개인정보처리방침`}
              </Label>
              {/* 스크롤 가능한 약관 내용 */}
              <ScrollArea className="h-48 w-full rounded-lg border border-gray-300 p-4 text-sm bg-gray-50">
                <pre className="whitespace-pre-wrap font-sans text-gray-700">
                  {privacyPolicyText}
                </pre>
              </ScrollArea>
              {/* 개별 동의 체크박스 */}
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
                {/* 취소 버튼: 메인 페이지로 돌아갑니다. */}
                <Link href="/">취소</Link>
              </Button>
              <Button 
                size="lg" 
                className="flex-1 h-14 rounded-lg text-base"
                // ⬇️ 핵심 로직: 필수 동의 시에만 활성화
                disabled={!isNextButtonEnabled}
                onClick={handleNextClick}
              >
                다음
              </Button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}