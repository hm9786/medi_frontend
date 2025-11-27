"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Calendar, TrendingUp, MessageSquare, Shield, AlertTriangle } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { apiUrl } from '@/lib/config';

export function VideoDetailTab({ video, onBack }) {
  const router = useRouter();
  const [videoInfo, setVideoInfo] = useState(null); // 유튜브 기본 정보
  const [stats, setStats] = useState(null);         // 필터링 통계
  const [chartData, setChartData] = useState([]);   // 그래프 데이터
  const [filterPeriod, setFilterPeriod] = useState('day'); // 📌 기간 필터 상태 추가
  const [isLoading, setIsLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [hasAcknowledgedWarning, setHasAcknowledgedWarning] = useState(false);
  const [isOriginalLoading, setIsOriginalLoading] = useState(false);
  const [originalComments, setOriginalComments] = useState([]);
  const [originalError, setOriginalError] = useState(null);
  const [currentOriginalPage, setCurrentOriginalPage] = useState(0);

  const COMMENTS_PER_PAGE = 5;

  // 1. 초기 데이터 로드 (비디오 정보 & 통계)
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!video?.id) return;
      setIsLoading(true);
      try {
        const [basicRes, statsRes] = await Promise.all([
          fetch(apiUrl(`api/youtube/videos/${video.id}`), { method: "GET", credentials: "include" }),
          fetch(apiUrl(`api/user/dashboard/videos/${video.id}/filtering-statistics`), { method: 'GET', credentials: 'include' })
        ]);

        if (basicRes.ok) setVideoInfo(await basicRes.json());
        if (statsRes.ok) setStats(await statsRes.json());
      } catch (error) {
        console.error("초기 데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, [video]);

  // 2. 📌 그래프 데이터 로드 (기간 변경 시 실행)
  useEffect(() => {
    const fetchTrendData = async () => {
      if (!video?.id) return;
      setIsChartLoading(true);

      const endDate = new Date();
      const startDate = new Date();
      
      // 기간 선택 로직
      if (filterPeriod === 'day') startDate.setDate(endDate.getDate() - 7);
      else if (filterPeriod === 'month') startDate.setMonth(endDate.getMonth() - 1);
      else if (filterPeriod === 'year') startDate.setFullYear(endDate.getFullYear() - 1);

      const to = endDate.toISOString().split('T')[0];
      const from = startDate.toISOString().split('T')[0];

      try {
        // 📌 videoId를 파라미터로 전달하여 해당 영상의 추이만 조회
        const response = await fetch(
          apiUrl(`api/user/dashboard/filtering-trend?from=${from}&to=${to}&videoId=${video.id}`),
          { method: 'GET', credentials: 'include' }
        );

        if (response.ok) {
          const trendJson = await response.json();
          const formattedTrend = trendJson.map(t => ({
            date: t.date.substring(5).replace('-', '/'), // MM/DD 형식
            filtered: t.filteredCount // 📌 필터링된 댓글 수만 사용
          }));
          setChartData(formattedTrend);
        }
      } catch (error) {
        console.error("그래프 데이터 로드 실패:", error);
        setChartData([]);
      } finally {
        setIsChartLoading(false);
      }
    };

    fetchTrendData();
  }, [video, filterPeriod]); // video나 filterPeriod가 바뀌면 실행

  // 3. 원본 악플 데이터 로드 (경고 동의 후, 또는 영상 전환 시 재로드)
  useEffect(() => {
    if (hasAcknowledgedWarning) {
      fetchOriginalComments();
    } else {
      // 경고창을 다시 보게 되면 목록도 초기화
      setOriginalComments([]);
      setCurrentOriginalPage(0);
      setOriginalError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [video?.id, hasAcknowledgedWarning]);

  // 페이지 수가 줄었을 때 현재 페이지를 안전하게 조정
  useEffect(() => {
    const totalPages = Math.ceil(originalComments.length / COMMENTS_PER_PAGE);
    if (totalPages > 0 && currentOriginalPage > totalPages - 1) {
      setCurrentOriginalPage(totalPages - 1);
    }
  }, [originalComments, currentOriginalPage, COMMENTS_PER_PAGE]);

  const fetchOriginalComments = async () => {
    if (!video?.id) return;
    setIsOriginalLoading(true);
    setOriginalError(null);
    try {
      const response = await fetch(
        apiUrl(`api/user/dashboard/videos/${video.id}/original-comments`),
        { method: 'GET', credentials: 'include' }
      );

      if (!response.ok) {
        throw new Error(`원본 악플 API 오류: ${response.status}`);
      }

      const payload = await response.json();
      const rawList = Array.isArray(payload?.comments)
        ? payload.comments
        : Array.isArray(payload)
          ? payload
          : payload?.data || [];

      const normalized = rawList
        .map((item, index) => ({
          id: item.id || item.commentId || item.youtubeCommentId || `comment-${index}`,
          author: item.author || item.authorName || item.authorDisplayName || '익명',
          content: item.content || item.text || item.textOriginal || item.text_original || '',
          publishedAt: item.publishedAt || item.createdAt || item.created_at || item.date,
        }))
        .filter((comment) => comment.content?.trim());

      setOriginalComments(normalized);
      setCurrentOriginalPage(0);
    } catch (error) {
      console.error('원본 악플 로드 실패:', error);
      setOriginalError('원본 악플을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsOriginalLoading(false);
    }
  };

  const handleWarningConfirm = () => {
    setHasAcknowledgedWarning(true);
  };

  const totalOriginalPages = Math.ceil(originalComments.length / COMMENTS_PER_PAGE);
  const paginatedOriginalComments = originalComments.slice(
    currentOriginalPage * COMMENTS_PER_PAGE,
    currentOriginalPage * COMMENTS_PER_PAGE + COMMENTS_PER_PAGE
  );

  const handlePrevComments = () => {
    setCurrentOriginalPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextComments = () => {
    if (totalOriginalPages === 0) return;
    setCurrentOriginalPage((prev) => Math.min(totalOriginalPages - 1, prev + 1));
  };

  const handleReportClick = () => {
    router.push('/dashboard?tab=legal');
  };

  const formatPublishedAt = (value) => {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return date.toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[600px]">
        <Loader2 className="size-8 animate-spin text-blue-600" />
      </div>
    );
  }

  // 데이터 매핑
  const displayVideo = videoInfo || video;
  const totalComments = displayVideo.commentCount || 0;
  const filteredComments = stats?.totalFilteredCount || 0;
  const filteringRate = totalComments > 0 
    ? ((filteredComments / totalComments) * 100).toFixed(1) 
    : '0.0';

  // 그래프 최신 값 (범례용)
  const lastChartValue = chartData.length > 0 ? chartData[chartData.length - 1].filtered : 0;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 font-sans">
      {/* 상단 네비게이션 */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 pl-0"
      >
        <ArrowLeft className="size-4 mr-2" />
        채널 대시보드로 돌아가기
      </Button>

      {/* 1. 영상 정보 및 요약 통계 */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* 썸네일 */}
            <div className="relative shrink-0">
              <img 
                src={displayVideo.thumbnailUrl || displayVideo.thumbnail} 
                alt={displayVideo.title}
                className="w-full md:w-[240px] h-[160px] rounded-lg object-cover shadow-sm"
              />
            </div>
            
            {/* 정보 및 통계 박스 */}
            <div className="flex-1 flex flex-col justify-between">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-2">
                  {displayVideo.title || '제목 없음'}
                </h2>
                <div className="flex items-center text-gray-500 text-sm">
                  <Calendar className="w-4 h-4 mr-1.5" />
                  {new Date(displayVideo.publishedAt).toLocaleDateString()} 게시
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 총 댓글 */}
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-gray-500 mb-1 text-sm font-medium">
                    <MessageSquare className="size-4" /> 총 댓글
                  </div>
                  <div className="text-gray-900 text-2xl font-bold">
                    {Number(totalComments).toLocaleString()}<span className="text-base font-normal text-gray-400 ml-1">개</span>
                  </div>
                </div>

                {/* 필터링된 댓글 */}
                <div className="p-4 rounded-xl border border-blue-100 flex flex-col justify-center" style={{ backgroundColor: '#F0F7FF' }}>
                  <div className="flex items-center gap-2 text-blue-600 mb-1 text-sm font-medium">
                    <Shield className="size-4" /> 필터링된 댓글
                  </div>
                  <div className="text-blue-700 text-2xl font-bold">
                    {Number(filteredComments).toLocaleString()}<span className="text-base font-normal text-blue-400 ml-1">개</span>
                  </div>
                </div>

                {/* 필터링 비율 */}
                <div className="p-4 rounded-xl bg-orange-50 border border-orange-100 flex flex-col justify-center">
                  <div className="flex items-center gap-2 text-orange-600 mb-1 text-sm font-medium">
                    <AlertTriangle className="size-4" /> 필터링 비율
                  </div>
                  <div className="text-orange-700 text-2xl font-bold">
                    {filteringRate}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 2. 📌 댓글 필터링 추이 그래프 (드롭다운 추가됨) */}
      <Card className="border-none shadow-sm bg-white">
        <CardHeader className="pb-2">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                <TrendingUp className="size-5 text-gray-500" />
                댓글 필터링 추이
              </CardTitle>
              <CardDescription className="mt-1">
                {filterPeriod === 'day' && '최근 7일간 차단된 댓글 현황'}
                {filterPeriod === 'month' && '최근 30일간 차단된 댓글 현황'}
                {filterPeriod === 'year' && '최근 1년간 차단된 댓글 현황'}
              </CardDescription>
            </div>

            {/* 📌 기간 선택 및 범례 */}
            <div className="flex items-center gap-4">
              {/* 범례 */}
              <div className="hidden sm:flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-md border border-gray-100">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-gray-600 text-xs font-medium">차단됨:</span>
                <span className="text-gray-900 text-xs font-bold">{lastChartValue.toLocaleString()}개</span>
              </div>

              {/* 드롭다운 메뉴 */}
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[130px] h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">일별 (7일)</SelectItem>
                  <SelectItem value="month">월별 (30일)</SelectItem>
                  <SelectItem value="year">연별 (1년)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="h-[350px] w-full mt-4">
            {isChartLoading ? (
              <div className="h-full flex items-center justify-center">
                <Loader2 className="size-6 animate-spin text-gray-400" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false} 
                    tickMargin={10}
                    minTickGap={30}
                  />
                  <YAxis 
                    tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                    axisLine={false} 
                    tickLine={false} 
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: '500' }}
                    formatter={(value) => [`${value}개`, '차단된 댓글']}
                  />
                  {/* 📌 필터링 댓글 라인 하나만 표시 */}
                  <Line 
                    type="monotone" 
                    dataKey="filtered" 
                    name="차단된 댓글"
                    stroke="#EF4444" 
                    strokeWidth={3} 
                    dot={{ fill: '#EF4444', r: 4, strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. 원본 악플 접근 경고 및 목록 */}
      {!hasAcknowledgedWarning ? (
        <Card className="border border-red-200 bg-red-50">
          <CardContent className="p-6 flex flex-col gap-6">
            <div>
              <Badge className="bg-red-600 hover:bg-red-600 text-white text-xs mb-3">필터링된 악플 원본</Badge>
              <h3 className="text-xl font-bold text-red-800 mb-2">주의: 원본 악플 내용이 포함되어 있습니다</h3>
              <p className="text-sm leading-relaxed text-red-700">
                악성 댓글은 이미 시청자에게 보이지 않지만, 원본 확인 시 심리적 충격이 있을 수 있습니다.
                필요한 경우 즉시 페이지 하단의 법률 상담을 이용하세요.
              </p>
            </div>
            <div className="flex flex-col gap-2 text-sm text-red-700">
              <p>• 악성 댓글은 자동으로 차단되어 공개되지 않습니다.</p>
              <p>• 원본 확인 시 신중하게 진행해주세요.</p>
              <p>• 법적 대응이 필요하면 즉시 전문가와 상담하세요.</p>
            </div>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white py-6 text-base font-semibold"
              onClick={handleWarningConfirm}
            >
              원본 내용 확인하기
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="border border-red-200 bg-white">
          <CardHeader className="pb-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-lg font-bold text-gray-900">
                  <AlertTriangle className="size-5 text-red-500" />
                  원본 악성 댓글 목록
                </CardTitle>
                <CardDescription className="mt-1 text-sm text-gray-500">
                  한 페이지에 {COMMENTS_PER_PAGE}개씩 열람할 수 있습니다. 고소 버튼을 누르면 법률 상담 탭으로 이동합니다.
                </CardDescription>
              </div>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50"
                onClick={handleReportClick}
              >
                법률 상담 바로가기
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {isOriginalLoading ? (
              <div className="flex justify-center py-10">
                <Loader2 className="size-6 animate-spin text-red-500" />
              </div>
            ) : originalError ? (
              <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-5 text-sm text-red-700">
                {originalError}
              </div>
            ) : originalComments.length === 0 ? (
              <div className="rounded-lg border border-gray-100 bg-gray-50 px-4 py-8 text-center text-sm text-gray-500">
                현재 확인 가능한 원본 악플이 없습니다.
              </div>
            ) : (
              <>
                <div className="space-y-4">
                  {paginatedOriginalComments.map((comment) => (
                    <div
                      key={comment.id}
                      className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 md:p-5"
                    >
                      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-xs text-gray-500">작성자</p>
                          <p className="font-semibold text-gray-900">{comment.author}</p>
                        </div>
                        <div className="text-left md:text-right">
                          <p className="text-xs text-gray-500">게시일자</p>
                          <p className="text-sm font-medium text-gray-800">
                            {formatPublishedAt(comment.publishedAt)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                          onClick={handleReportClick}
                        >
                          고소
                        </Button>
                      </div>
                      <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-gray-800">
                        {comment.content}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200"
                    onClick={handlePrevComments}
                    disabled={currentOriginalPage === 0}
                  >
                    이전
                  </Button>
                  <span className="text-sm font-medium text-gray-600">
                    {totalOriginalPages === 0 ? '0 / 0' : `${currentOriginalPage + 1} / ${totalOriginalPages}`}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-200"
                    onClick={handleNextComments}
                    disabled={
                      totalOriginalPages === 0 || currentOriginalPage >= totalOriginalPages - 1
                    }
                  >
                    다음
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}