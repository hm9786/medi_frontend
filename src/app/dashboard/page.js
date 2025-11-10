import Navigation from "@/components/Navigation";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation />

      {/* 메인 콘텐츠 */}
      <main className="min-h-screen flex flex-col justify-center items-center pt-20">
        <div className="flex flex-col items-center gap-8">
          <h1 className="text-6xl font-medium font-['Roboto'] text-black">
            임시
          </h1>
        </div>
      </main>
    </div>
  );
}

