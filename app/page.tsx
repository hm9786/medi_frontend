import { Button } from "@/components/ui/button";
import Link from "next/link";

// 메인 페이지
export default function MainPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 메인 컨텐츠 (Hero) */}
      <main className="pt-4 md:pt-12">
        
        {/* 2-1. 헤드라인 및 CTA 버튼 영역 */}
        <section className="container mx-auto px-6 text-center flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-4">
            AI가 당신의 댓글창을 24시간 지킵니다
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            SNS 댓글관리 솔루션 메디를 만나보세요
          </p>
          
          <Link href="/helloㅎㅎ">
            <Button size="lg" className="text-lg px-8 py-6">
              무료로 시작하기
            </Button>
           </Link> 
        </section>

        {/* 2-2. 목업 이미지 영역 (레이아웃만 잡음) */}
        <section className="container mx-auto px-6 mt-12 md:mt-16 flex flex-col md:flex-row justify-center items-start gap-8">
          
          {/* 왼쪽 모바일 목업 (임시) */}
          <div className="w-full md:w-1/3 flex justify-center">
            <img 
              src="/images/mockup-mobile.png" // [수정 필요] 임시 이미지 경로
              alt="모바일 댓글창 예시" 
              className="rounded-2xl shadow-xl max-w-xs"
            />
          </div>

          {/* 오른쪽 대시보드 목업 (임시) */}
          <div className="w-full md:w-2/3 flex justify-center">
            <img 
              src="/images/mockup-dashboard.png" // [수정 필요] 임시 이미지 경로
              alt="대시보드 예시" 
              className="rounded-lg shadow-2xl w-full"
            />
          </div>
        </section>

      </main>
    </div>
  );
}