"use client"; // useState, onClick 등 상호작용을 위해 필요합니다.

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navigation from "@/components/Navigation";

// 2. 약관 텍스트
const termsOfServiceText = `MEDI 서비스 이용약관

제1조 (목적)
이 약관은 MEDI(이하 "서비스")가 제공하는 유튜브 댓글 필터링 및 채널 분석 서비스의 이용과 관련하여, 서비스와 회원 간의 권리, 의무 및 책임사항을 규정함을 목적으로 합니다.

제2조 (서비스의 내용)
서비스는 다음 각 호의 기능을 제공합니다.
1. 회원의 YouTube 계정(채널) 연동 및 채널·영상·댓글 데이터 동기화
2. AI 모델을 활용한 댓글 분석 및 악성 댓글(욕설, 혐오, 인신공격, 성적 발언, 스팸 등) 자동 필터링
3. 채널·영상별 필터링 통계 대시보드 및 보고서 제공
4. 필터링 결과에 대한 이메일 알림 발송
5. 악성 댓글 관련 법률 상담 챗봇 제공

제3조 (이용 계약의 체결)
이용 계약은 가입 신청자가 본 약관에 동의하고 회원가입을 신청한 후, 서비스가 이를 승낙함으로써 체결됩니다.

제4조 (YouTube 계정 연동)
1. 회원은 Google OAuth를 통해 본인의 YouTube 채널을 서비스에 연동할 수 있습니다.
2. 서비스는 연동된 채널의 댓글을 YouTube Data API를 통해 수집·분석하며, 회원이 설정한 기준에 따라 댓글을 숨김 처리하거나 삭제할 수 있습니다.
3. 회원은 언제든지 채널 연동을 해제할 수 있으며, 해제 시 관련 데이터 수집이 중단됩니다.

제5조 (회원의 의무)
1. 회원은 본인 소유의 YouTube 채널만 연동해야 합니다.
2. 회원은 서비스가 제공하는 필터링·삭제 기능의 최종 결과에 대한 관리 책임이 본인에게 있음을 확인합니다.

제6조 (서비스의 책임과 한계)
1. AI 필터링 결과는 완전성을 보장하지 않으며, 오분류가 발생할 수 있습니다.
2. 법률 상담 챗봇의 답변은 법적 효력이 없는 참고 자료입니다.

제7조 (계약 해지)
회원은 언제든지 회원 탈퇴를 통해 이용 계약을 해지할 수 있으며, 탈퇴 시 연동 정보 및 OAuth 토큰은 즉시 무효화됩니다.

제8조 (기타)
본 약관에 명시되지 않은 사항은 관계 법령과 일반적인 상거래 관행에 따릅니다.`;

const privacyPolicyText = `개인정보 수집·이용 동의

MEDI(이하 "서비스")는 개인정보 보호법 등 관련 법령을 준수하며, 아래와 같이 개인정보를 수집·이용합니다.

1. 수집하는 개인정보 항목
① 계정 정보: 이메일 주소, 비밀번호(암호화 저장), 이름, 전화번호
② 소셜 로그인 정보(Google OAuth 연동 시): Google 계정 식별자, 이메일, 프로필 정보, OAuth 액세스/리프레시 토큰
③ YouTube 연동 데이터: 채널 정보(채널 ID·채널명·구독자 수 등), 영상 정보(제목·조회수·썸네일 등), 댓글 정보(댓글 내용·작성자·작성 시각 등)
④ 필터링 설정 및 결과: 필터링 카테고리, 커스텀 키워드, AI 분류 결과, 댓글 통계
⑤ 서비스 이용 로그: 접속 일시, IP 주소, 브라우저 정보

2. 수집·이용 목적
① 회원 가입, 본인 확인 및 계정 관리
② YouTube 채널 연동, 댓글 수집 및 AI 기반 악성 댓글 필터링 서비스 제공
③ 필터링 통계 대시보드·보고서 제공 및 이메일 알림 발송
④ 서비스 품질 개선(AI 모델 성능 개선, 오류 분석) 및 고객 지원

3. 보유 및 이용 기간
① 계정 정보: 회원 탈퇴 시 즉시 파기 (OAuth 토큰은 즉시 무효화)
② YouTube 댓글 데이터, 필터링 설정, 이용 로그: 수집·이용 목적 달성 후 지체 없이 파기
③ 관계 법령에서 별도의 보존 기간을 정한 경우 해당 기간 동안 보관

4. 동의 거부 권리
귀하는 개인정보 수집·이용에 대한 동의를 거부할 권리가 있습니다. 다만, 필수 항목에 대한 동의를 거부할 경우 서비스 이용(회원가입)이 제한됩니다.`;


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
      // 다음 회원가입 단계(step1)로 이동합니다.
      router.push("/signup/step1"); 
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />

      {/* 메인 콘텐츠 (flex를 사용해 화면 중앙에 배치) */}
      <main className="min-h-screen flex flex-col justify-center items-center pt-20">
        <div className="flex flex-col items-center gap-10 w-full max-w-lg px-4 py-8">

          {/* 3-1. 제목 */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-medium text-foreground text-center">
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
             <Link href="/signup/step1">다음</Link>
             </Button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
}