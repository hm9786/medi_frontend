"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, Shield, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VideoDetailTab } from './VideoDetailTab'; // 영상 클릭 시 상세 탭

// ‼️ [수정됨] 하드코딩된 샘플 데이터 모두 제거

// data prop으로 채널의 '전체 요약' 데이터를 받습니다.
export function OverviewTab({ data }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // ‼️ [수정됨] Props로 받은 데이터 사용 (없을 경우 빈 배열)
  const categoryData = data?.categories || [];
  const recentVideos = data?.videos || [];
  const monthlyFilterData = data?.monthlyData || [];
  
  const filteredVideos = recentVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalFiltered = categoryData.reduce((sum, cat) => sum + cat.count, 0);

  // 영상 상세 페이지 표시
  if (selectedVideo) {
    return (
      <VideoDetailTab 
        video={selectedVideo} 
        onBack={() => setSelectedVideo(null)} 
        // ‼️ [수정됨] VideoDetailTab에도 채널 ID나 비디오 ID를 넘겨
        //           상세 데이터를 fetching하게 해야 합니다. (지금은 video 객체만 전달)
      />
    );
  }

  // ‼️ [수정됨] 데이터가 로딩 중이거나 없을 때의 UI (간단한 예시)
  if (!data) {
    return (
      <Card>
          <CardContent className="pt-6 text-center text-gray-500 leading-[1.5]">
          데이터를 불러오는 중입니다...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* 왼쪽: 영상 목록 */}
      <div className="lg:col-span-1">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium leading-[1.5]">영상 목록</CardTitle>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="영상 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
          </CardHeader>
          <CardContent className="space-y-3 max-h-[600px] overflow-y-auto">
            {filteredVideos.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4 leading-[1.5]">영상이 없습니다.</p>
            ) : (
              filteredVideos.map(video => (
                <div 
                  key={video.id} 
                  className="flex gap-3 pb-3 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50 -mx-6 px-6 py-2 transition-colors"
                  onClick={() => setSelectedVideo(video)}
                >
                  <img 
                    src={video.thumbnail} 
                    alt={video.title} 
                    className="w-[120px] h-[80px] rounded-lg object-cover flex-shrink-0 bg-gray-100"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 line-clamp-2 mb-1 leading-[1.5]">{video.title}</h4>
                    <p className="text-sm text-gray-500 mb-2 leading-[1.5]">{video.date}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      {/* 오른쪽: 전체 요약 */}
      <div className="lg:col-span-3 space-y-6">
        {/* ... (중략) ... */}

        {/* 필터링된 댓글 상세 분석 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium leading-[1.5]">필터링된 댓글 상세 분석</CardTitle>
            <p className="text-gray-500 leading-[1.5]">누적 아래 필터링된 댓글의 대한 상세 통계입니다</p>
            <div className="flex items-baseline gap-2 mt-4">
              <span className="text-gray-600">총</span>
              <span className="text-gray-900 text-4xl font-bold">
                {totalFiltered.toLocaleString()}개
              </span>
              <span className="text-gray-600">필터링</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryData.length > 0 ? (
                categoryData.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      {/* ... (이하 동일) ... */}
                      <span className="text-gray-700 font-medium">{category.name}</span>
                      {/* ... */}
                    </div>
                    <Progress value={category.percentage} className="h-2" style={{ backgroundColor: '#f0f0f0' }} indicatorClassName={`bg-[${category.color}]`} />
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm text-center py-4 leading-[1.5]">카테고리 데이터가 없습니다.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* 월별 필터링 추이 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium leading-[1.5]">월별 필터링 추이</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyFilterData}>
                {/* ... (이하 동일) ... */}
                <Bar dataKey="filtered" fill="hsl(var(--primary))" radius={[8, 8, 0, 0]} name="필터링 댓글" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 필터링 효과 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-medium leading-[1.5]">필터링 효과</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 총 차단 댓글 */}
              <div className="flex flex-col items-center p-4 rounded-lg border border-gray-200 bg-gradient-to-br from-medi-primary-lighter to-white">
                {/* ... (이하 동일) ... */}
                <div className="text-gray-900 text-3xl font-bold mb-2">
                  {totalFiltered.toLocaleString()}개
                </div>
                {/* ... */}
              </div>
              {/* ... (차단률, 건전성 카드) ... */}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}