"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Shield, Heart, TrendingUp, Smile } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// ‼️ [수정됨] 하드코딩된 샘플 데이터 모두 제거

// data prop으로 채널의 '멘탈 케어' 데이터를 받습니다.
export function MentalCareTab({ data }) {

  // ‼️ [수정됨] Props로 받은 데이터 사용 (없을 경우 빈 배열 또는 기본값)
  const emotionTrendData = data?.emotionTrend || [];
  const cheerComments = data?.cheerComments || [];
  const totalFiltered = data?.stats?.totalFiltered || 0;
  const positivePercentage = data?.stats?.positivePercentage || 0;
  const todayCheerCount = data?.stats?.todayCheerCount || 0;
  
  const currentPositive = emotionTrendData.length > 0 
    ? emotionTrendData[emotionTrendData.length - 1].positive 
    : 0;

  // ‼️ [수정됨] 데이터가 로딩 중이거나 없을 때의 UI
  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-gray-500">
          데이터를 불러오는 중입니다...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* 상단 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 필터링된 댓글 수 */}
        <Card className="border-2 border-medi-primary-light bg-medi-primary-lighter">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg flex items-center justify-center bg-primary">
                <Shield className="size-6 text-white" />
              </div>
              <Badge className="bg-green-100 text-green-700">
                <TrendingUp className="size-3 mr-1" />
                안전
              </Badge>
            </div>
            <div className="text-gray-600 mb-1">지금까지 필터링한 댓글</div>
            <div className="text-gray-900 text-4xl font-bold">
              {totalFiltered.toLocaleString()}개
            </div>
            <p className="text-gray-500 mt-2">당신의 마음을 지켜드렸어요</p>
          </CardContent>
        </Card>

        {/* 긍정 댓글 비율 */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-green-100 flex items-center justify-center">
                <Smile className="size-6 text-green-600" />
              </div>
            </div>
            <div className="text-gray-600 mb-1">긍정 댓글 비율</div>
            <div className="text-gray-900 text-4xl font-bold">
              {positivePercentage}%
            </div>
            <p className="text-gray-500 mt-2">건강한 커뮤니티를 만들고 있어요</p>
          </CardContent>
        </Card>

        {/* 오늘의 응원 메시지 */}
        <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50 to-white">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="size-12 rounded-lg bg-pink-100 flex items-center justify-center">
                <Heart className="size-6 text-pink-600" />
              </div>
              <Badge className="bg-pink-100 text-pink-700">
                오늘
              </Badge>
            </div>
            <div className="text-gray-600 mb-1">받은 응원 댓글</div>
            <div className="text-gray-900 text-4xl font-bold">
              {todayCheerCount}개
            </div>
            <p className="text-gray-500 mt-2">많은 분들이 응원하고 있어요 💕</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 왼쪽: 응원 댓글 모음 */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-bold">
                <Heart className="size-5 text-primary" />
                응원 댓글 모음
              </CardTitle>
              <p className="text-gray-500">여러분의 사랑을 모았어요</p>
            </CardHeader>
            <CardContent className="space-y-4 max-h-[600px] overflow-y-auto">
              {cheerComments.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">응원 댓글이 없습니다.</p>
              ) : (
                cheerComments.map((comment) => (
                  <div 
                    key={comment.id} 
                    className="p-4 rounded-lg border border-gray-100 hover:border-pink-200 hover:bg-pink-50/30 transition-all"
                  >
                    {/* ... (이하 동일) ... */}
                    <p className="text-gray-700 mb-2">{comment.text}</p>
                    {/* ... */}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* 오른쪽: 감정 트렌드 */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">감정 트렌드</CardTitle>
              <p className="text-gray-500">최근 일주일간 댓글 감정 분석</p>
              <div className="flex items-baseline gap-2 mt-4">
                {/* ... (이하 동일) ... */}
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={emotionTrendData}>
                  {/* ... (이하 동일) ... */}
                  <Line dataKey="positive" stroke="#10B981" /* ... */ />
                  <Line dataKey="negative" stroke="#EF4444" /* ... */ />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}