"use client";

import { useState, useEffect } from 'react'; // ‼️ useEffect 추가
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, TrendingUp, Loader2 } from 'lucide-react'; // ‼️ Loader2 추가
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

// ‼️ [수정됨] 하드코딩된 샘플 데이터 모두 제거

// ‼️ video prop (기본정보)와 onBack (뒤로가기 함수)를 받습니다.
export function VideoDetailTab({ video, onBack }) {
  // ‼️ [추가됨] 이 탭에서 필요한 상세 데이터(차트, 키워드)는
  // video.id를 기반으로 직접 fetching 합니다.
  const [detailData, setDetailData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVideoDetail = async () => {
      if (!video?.id) return;
      
      setIsLoading(true);
      
      try {
        // 비디오 기본 정보 조회
        const response = await fetch(`http://localhost:8080/api/youtube/videos/${video.id}`, {
          method: "GET",
          credentials: "include",
        });
        
        if (response.ok) {
          const videoData = await response.json();
          
          // 비디오 정보 업데이트 (video prop에 추가 정보 반영)
          // 주의: video prop은 읽기 전용이므로, 상세 분석 데이터만 별도로 관리
          
          // 상세 분석 데이터는 추``````후 API가 추가되면 여기서 가져옵니다.
          // 현재는 기본 비디오 정``````보만 사용하고, 분석 데이터는 임시로 빈 배열 설정
          setDetailData({
            videoInfo: videoData, // API에서 받은 비디오 정보
            commentTrendData: [], // 추후 댓글 추이 API가 추가되면 여기에 추가
            categoryDistribution: [], // 추후 카테고리 분포 API가 추가되면 여기에 추가
            topKeywords: [], // 추후 키워드 API가 추가되면 여기에 추가
          });
        } else {
          console.error("비디오 상세 정보 로드 실패:", response.status);
          setDetailData({
            videoInfo: null,
            commentTrendData: [],
            categoryDistribution: [],
            topKeywords: [],
          });
        }
      } catch (err) {
        console.error("비디오 상세 정보 로드 오류:", err);
        setDetailData({
          videoInfo: null,
          commentTrendData: [],
          categoryDistribution: [],
          topKeywords: [],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideoDetail();
  }, [video?.id]);

  // ‼️ [수정됨] 데이터가 로딩 중일 때 로딩 스피너 표시
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  // ‼️ [수정됨] 데이터가 없을 때 (로딩 완료 후)
  if (!detailData) {
     return (
      <Card>
        <CardContent className="pt-6 text-center text-gray-500">
          영상 상세 데이터를 불러오는 데 실패했습니다.
          <Button variant="link" onClick={onBack}>뒤로 가기</Button>
        </CardContent>
      </Card>
    );
  }
  
  // ‼️ [수정됨] detailData에서 데이터 추출
  const { videoInfo, commentTrendData, categoryDistribution, topKeywords } = detailData;
  
  // 비디오 정보는 video prop 또는 API에서 받은 videoInfo 사용
  const displayVideo = videoInfo || video;
  const totalComments = displayVideo.commentCount || 0;
  const filteredComments = displayVideo.filteredComments || 0;
  const filteringRate = totalComments > 0 ? ((filteredComments / totalComments) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* 뒤로가기 버튼 */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-4 text-medi-primary-dark font-semibold hover:bg-medi-primary-lighter"
      >
        <ArrowLeft className="size-4 mr-2" />
        전체 요약으로 돌아가기
      </Button>

      {/* 영상 정보 헤더 */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6">
            <img 
              src={displayVideo.thumbnailUrl || displayVideo.thumbnail} 
              alt={displayVideo.title || '비디오'}
              className="w-full md:w-[240px] h-[160px] rounded-lg object-cover flex-shrink-0 bg-gray-100"
            />
            {/* ... (이하 동일) ... */}
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{displayVideo.title || '제목 없음'}</h2>
              {/* ... */}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 댓글 추이 */}
        <Card className="lg:col-span-2">
          {/* ... */}
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={commentTrendData}>
                {/* ... (이하 동일) ... */}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* 유해 카테고리 분포 */}
        <Card>
          {/* ... */}
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categoryDistribution} /* ... */ >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 mt-6">
              {categoryDistribution.map((category, index) => (
                <div key={index} /* ... */ >
                  {/* ... (이하 동일) ... */}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 악플 TOP 키워드 */}
        <Card>
          {/* ... */}
          <CardContent>
            <div className="space-y-3">
              {topKeywords.map((item, index) => (
                <div key={index} /* ... */ >
                  {/* ... (이하 동일) ... */}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}