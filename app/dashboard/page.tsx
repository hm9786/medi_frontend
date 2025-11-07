"use client";

import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useAppSelector } from "@/store";

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <main className="container mx-auto px-6 py-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              대시보드
            </h1>
            <p className="text-gray-600 mb-6">
              안녕하세요, {user?.name}님! 메디 대시보드에 오신 것을 환영합니다.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 댓글 관리 카드 */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                  댓글 관리
                </h3>
                <p className="text-blue-700 text-sm mb-4">
                  AI가 분석한 댓글들을 확인하고 관리하세요.
                </p>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-600">
                  댓글 보기
                </button>
              </div>

              {/* 설정 카드 */}
              <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                <h3 className="text-lg font-semibold text-green-900 mb-2">
                  설정
                </h3>
                <p className="text-green-700 text-sm mb-4">
                  계정 설정과 알림 설정을 관리하세요.
                </p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-md text-sm hover:bg-green-600">
                  설정하기
                </button>
              </div>

              {/* 통계 카드 */}
              <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-900 mb-2">
                  통계
                </h3>
                <p className="text-purple-700 text-sm mb-4">
                  댓글 분석 통계와 리포트를 확인하세요.
                </p>
                <button className="bg-purple-500 text-white px-4 py-2 rounded-md text-sm hover:bg-purple-600">
                  통계 보기
                </button>
              </div>
            </div>

            {/* 사용자 정보 */}
            <div className="mt-8 p-4 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                계정 정보
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">이름:</span> {user?.name}</p>
                <p><span className="font-medium">이메일:</span> {user?.email}</p>
                {user?.phone && (
                  <p><span className="font-medium">전화번호:</span> {user.phone}</p>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
