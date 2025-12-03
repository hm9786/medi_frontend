"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Loader2, Calendar, TrendingUp, MessageSquare, Shield, AlertTriangle, ShieldAlert, ChevronLeft, ChevronRight, Eye, Scale, ChevronDown, ThumbsUp } from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { apiUrl } from '@/lib/config';

const getStressBadgeInfo = (averageCount) => {
  if (averageCount >= 40) {
    return {
      label: '위험',
      description: '상시 모니터링이 필요한 수준입니다.',
      badgeClass: 'bg-red-100 text-red-700 border-red-200',
    };
  }
  if (averageCount >= 20) {
    return {
      label: '주의',
      description: '필터링 빈도가 높습니다. 추세를 확인하세요.',
      badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    };
  }
  if (averageCount >= 5) {
    return {
      label: '보통',
      description: '안정적으로 관리되고 있습니다.',
      badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    };
  }
  return {
    label: '안정',
    description: '필터링 빈도가 매우 낮습니다.',
    badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };
};

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
  const [visibleOriginalComments, setVisibleOriginalComments] = useState(() => new Set());
  const [sortBy, setSortBy] = useState('date');
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const sortDropdownRef = useRef(null);
  const topRef = useRef(null); // 최상단 요소 참조

  const COMMENTS_PER_PAGE = 5;

  // 컴포넌트 마운트 시 페이지 상단으로 스크롤
  useEffect(() => {
    const scrollToTop = () => {
      // ref를 사용하여 최상단 요소로 스크롤
      if (topRef.current) {
        topRef.current.scrollIntoView({ behavior: 'auto', block: 'start', inline: 'nearest' });
      }
      
      // 모든 가능한 스크롤 방법 시도
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if (document.scrollingElement) {
        document.scrollingElement.scrollTop = 0;
      }
    };
    
    // 즉시 실행
    scrollToTop();
    
    // 렌더링 후 스크롤
    requestAnimationFrame(() => {
      scrollToTop();
    });
    
    // 작은 화면에서 레이아웃 렌더링 완료 후 스크롤
    const timer = setTimeout(() => {
      scrollToTop();
    }, 200);
    
    // 작은 화면에서 레이아웃 변경 감지 후 스크롤
    let resizeObserver;
    if (typeof ResizeObserver !== 'undefined' && topRef.current) {
      resizeObserver = new ResizeObserver(() => {
        scrollToTop();
      });
      resizeObserver.observe(document.body);
    }
    
    return () => {
      clearTimeout(timer);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [video?.id]);

  useEffect(() => {
    setVisibleOriginalComments(new Set());
    setShowSortDropdown(false);
    setSortBy('date');
    setCurrentOriginalPage(0);
  }, [video?.id, hasAcknowledgedWarning]);

  useEffect(() => {
    if (!showSortDropdown) return;
    const handleClickOutside = (event) => {
      if (sortDropdownRef.current && !sortDropdownRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortDropdown]);

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
      const periodType =
        filterPeriod === 'day' ? 'daily' : filterPeriod === 'month' ? 'monthly' : 'yearly';

      try {
        // 📌 작성 시간(published_at) 기준 통계 API 호출 (특정 영상)
        const response = await fetch(
          apiUrl(
            `api/v1/analysis/comments/stats?videoId=${video.id}` +
              `&period=${periodType}&startDate=${from}&endDate=${to}`
          ),
          { method: 'GET', credentials: 'include' }
        );

        if (response.ok) {
          const trendJson = await response.json();
          const statsArray = Array.isArray(trendJson?.stats) ? trendJson.stats : [];

          const formattedTrend = statsArray.map((t) => ({
            // "YYYY-MM-DD" → "MM/DD" 형태로 축 약식 표기
            date: (t.date || '').substring(5).replace('-', '/') || t.date,
            filtered: t.filteredCount ?? 0,
            total: t.totalCount ?? 0,
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
          likes: Number(item.likeCount ?? item.likes ?? item.like ?? 0) || 0,
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

  // 📌 백엔드 DB의 실제 원본 악플 데이터만 사용 (MOCK 데이터 제거)
  const sortedOriginalComments = [...originalComments].sort((a, b) => {
    if (sortBy === 'likes') {
      return (b.likes || 0) - (a.likes || 0);
    }
    const dateA = new Date(a.publishedAt || a.date || 0).getTime();
    const dateB = new Date(b.publishedAt || b.date || 0).getTime();
    return dateB - dateA;
  });
  const totalOriginalPages = Math.ceil(sortedOriginalComments.length / COMMENTS_PER_PAGE);
  const paginatedOriginalComments = sortedOriginalComments.slice(
    currentOriginalPage * COMMENTS_PER_PAGE,
    currentOriginalPage * COMMENTS_PER_PAGE + COMMENTS_PER_PAGE
  );
  const paginationRangeStart =
    sortedOriginalComments.length === 0 ? 0 : currentOriginalPage * COMMENTS_PER_PAGE + 1;
  const paginationRangeEnd =
    sortedOriginalComments.length === 0
      ? 0
      : Math.min((currentOriginalPage + 1) * COMMENTS_PER_PAGE, sortedOriginalComments.length);
  const shouldLockCommentCardHeight = paginatedOriginalComments.length >= COMMENTS_PER_PAGE;

  const handlePrevComments = () => {
    setCurrentOriginalPage((prev) => Math.max(0, prev - 1));
    // 페이지 변경 시 현재 페이지의 선택 상태는 유지 (다른 페이지로 이동했다가 돌아올 수 있음)
  };

  const handleNextComments = () => {
    if (totalOriginalPages === 0) return;
    setCurrentOriginalPage((prev) => Math.min(totalOriginalPages - 1, prev + 1));
    // 페이지 변경 시 현재 페이지의 선택 상태는 유지 (다른 페이지로 이동했다가 돌아올 수 있음)
  };

  const handleDeleteComment = (commentId) => {
    // TODO: 백엔드 연동 시 실제 삭제 API 호출로 교체
    console.warn('삭제 버튼 클릭됨 (UI 전용):', commentId);
  };

  const handleToggleVisibility = (commentId) => {
    setVisibleOriginalComments((prev) => {
      const next = new Set(prev);
      if (next.has(commentId)) {
        next.delete(commentId);
      } else {
        next.add(commentId);
      }
      return next;
    });
  };

  const handleSortChange = (option) => {
    setSortBy(option);
    setShowSortDropdown(false);
    setCurrentOriginalPage(0);
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
  const todayFilteredCount = stats?.todayFilteredCount ?? stats?.todayFiltered ?? 0;
  const recentWeekFilteredCount = stats?.recent7DaysFilteredCount ?? stats?.weekFilteredCount ?? 0;
  const legalFlaggedCount =
    stats?.legalFlaggedCount ??
    stats?.legalReviewRecommendationCount ??
    stats?.legalConsultingRecommendedCount ??
    0;
  const dailyAverageFiltered = recentWeekFilteredCount
    ? Math.max(1, Math.round(recentWeekFilteredCount / 7))
    : Math.max(0, Math.round(filteredComments / Math.max(chartData.length || 1, 7)));
  const stressInfo = getStressBadgeInfo(dailyAverageFiltered);

  // 그래프 최신 값 (범례용)
  const lastChartValue = chartData.length > 0 ? chartData[chartData.length - 1].filtered : 0;

  return (
    <div className="space-y-6 animate-in fade-in-50 duration-500 font-sans">
      {/* 스크롤 위치 초기화를 위한 최상단 참조 요소 */}
      <div ref={topRef} className="absolute top-0 left-0 w-0 h-0" aria-hidden="true" />
      
      {/* 상단 네비게이션 */}
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 pl-0 py-4 px-5 text-xl font-bold"
      >
        <ArrowLeft className="size-7 mr-3" />
        채널 대시보드로 돌아가기
      </Button>

      {/* 1. 영상 정보 + 상단 카드 섹션 */}
      <Card className="border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-4 sm:p-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] items-stretch">
            {/* 좌측: 썸네일 + 제목/메타 정보 (게시글 카드 느낌) */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="relative shrink-0 w-full sm:w-auto">
                <img 
                  src={displayVideo.thumbnailUrl || displayVideo.thumbnail} 
                  alt={displayVideo.title}
                  className="w-full sm:w-[140px] sm:h-[100px] md:w-[180px] md:h-[130px] lg:w-[220px] lg:h-[160px] rounded-xl sm:rounded-2xl object-cover shadow-sm"
                />
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 leading-snug mb-2 line-clamp-2 sm:truncate">
                  {displayVideo.title || '제목 없음'}
                </h2>
                <div className="flex items-center text-gray-500 text-xs sm:text-sm mb-3 sm:mb-4">
                  <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5" />
                  {new Date(displayVideo.publishedAt).toLocaleDateString('ko-KR')} 게시
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500">
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1">
                    <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 mr-1" />
                    <span className="text-gray-700">
                      {Number(displayVideo.likeCount ?? displayVideo.like_count ?? 0).toLocaleString()}
                    </span>
                  </span>
                  <span className="hidden sm:inline h-3 w-px bg-gray-200" />
                  <span>조회수 {Number(displayVideo.viewCount || 0).toLocaleString()}회</span>
                </div>
              </div>
            </div>

            {/* 우측: 빈 카드 / 총 댓글 / 필터링 된 댓글 / 필터링 비율 카드 (가로 병렬) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {/* 빈 카드 */}
              <div className="rounded-xl sm:rounded-2xl bg-gray-50 flex flex-col justify-center px-2 sm:px-4 py-2 sm:py-3 min-h-[70px] sm:min-h-0">
              </div>

              {/* 총 댓글 */}
              <div className="rounded-xl sm:rounded-2xl bg-[#F5F5F7] flex flex-col justify-center px-2 sm:px-4 py-2 sm:py-3 min-h-[70px] sm:min-h-0">
                <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-gray-600 mb-0.5 sm:mb-1 font-medium">
                  <MessageSquare className="size-3 sm:size-4" />
                  <span className="hidden sm:inline">총 댓글</span>
                  <span className="sm:hidden">댓글</span>
                </div>
                <div className="text-sm sm:text-lg md:text-2xl font-bold text-gray-900">
                  {Number(totalComments).toLocaleString()}
                  <span className="ml-1 text-[10px] sm:text-xs md:text-sm font-normal text-gray-400">개</span>
                </div>
              </div>

              {/* 필터링된 댓글 */}
              <div className="rounded-xl sm:rounded-2xl bg-[#F4F7FF] flex flex-col justify-center px-2 sm:px-4 py-2 sm:py-3 min-h-[70px] sm:min-h-0">
                <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-[#3756B2] mb-0.5 sm:mb-1 font-medium">
                  <Shield className="size-3 sm:size-4" />
                  <span className="hidden sm:inline">필터링 된 댓글</span>
                  <span className="sm:hidden">필터링</span>
                </div>
                <div className="text-sm sm:text-lg md:text-2xl font-bold text-[#1D3A8A]">
                  {Number(filteredComments).toLocaleString()}
                  <span className="ml-1 text-[10px] sm:text-xs md:text-sm font-normal text-[#9DB3FF]">개</span>
                </div>
              </div>

              {/* 필터링 비율 */}
              <div className="rounded-xl sm:rounded-2xl bg-[#FFF5EC] flex flex-col justify-center px-2 sm:px-4 py-2 sm:py-3 min-h-[70px] sm:min-h-0">
                <div className="flex items-center gap-1 sm:gap-2 text-[10px] sm:text-xs md:text-sm text-[#D97706] mb-0.5 sm:mb-1 font-medium">
                  <AlertTriangle className="size-3 sm:size-4" />
                  <span className="hidden sm:inline">필터링 비율</span>
                  <span className="sm:hidden">비율</span>
                </div>
                <div className="text-sm sm:text-lg md:text-2xl font-bold text-[#B45309]">
                  {filteringRate}%
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
                  <SelectItem value="year">연도별 (1년)</SelectItem>
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
                <LineChart data={chartData.length > 0 ? chartData : [{ date: '데이터 없음', filtered: 0, total: 0 }]} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
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
                    formatter={(value, name) => [
                      `${Number(value).toLocaleString()}개`,
                      name
                    ]}
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
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    name="총 댓글"
                    stroke="#94A3B8" 
                    strokeWidth={2} 
                    dot={false}
                    activeDot={{ r: 4 }}
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
      {/* 2. 원본 악플 접근 경고 및 목록 */}
      {!hasAcknowledgedWarning ? (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col">
          <div className="bg-red-50 border-b border-red-200 p-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-white rounded-full flex items-center justify-center border-2 border-red-300">
                <ShieldAlert className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-red-800 mb-2">주의: 원본 악성 댓글 열람 전 안내</h3>
                <p className="text-red-600 text-sm">
                  이 영상에서 필터링 된 {originalComments.length.toLocaleString()}개의 악성 댓글이 있습니다
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 pb-2 flex-1 flex flex-col">
            <div className="bg-red-50 rounded-xl p-6 border border-red-200">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <h4 className="text-lg font-semibold text-red-700">보호 기능 안내</h4>
              </div>
              <ul className="space-y-2 text-sm text-red-700 pl-1">
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>원본 내용을 열람하면 심리적 충격이 있을 수 있으니 주의하세요</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500">•</span>
                  <span>법적 대응이 필요하면 법률 상담 챗봇을 이용하세요</span>
                </li>
              </ul>
            </div>
            <button
              onClick={handleWarningConfirm}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-4 px-6 rounded-xl transition-colors flex items-center justify-center gap-3 text-base font-semibold mt-auto"
            >
              <ShieldAlert className="w-5 h-5" />
              원본 내용 확인하러 가기
            </button>
          </div>
        </div>
      ) : (
        <div
          className={`bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden flex flex-col ${
            shouldLockCommentCardHeight ? 'min-h-[640px]' : ''
          }`}
        >
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-gray-200 p-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center shadow-md">
                  <ShieldAlert className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">필터링된 악성 댓글</h3>
                  <p className="text-gray-600 text-sm">
                    총 {sortedOriginalComments.length.toLocaleString()}개의 댓글이 차단되었습니다.
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
                <div className="relative" ref={sortDropdownRef}>
                  <button
                    onClick={() => setShowSortDropdown((prev) => !prev)}
                    className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 flex items-center gap-2"
                  >
                    <span>{sortBy === 'date' ? '작성일 순' : '좋아요 순'}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden z-10">
                      <button
                        onClick={() => handleSortChange('date')}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          sortBy === 'date' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        작성일 순
                      </button>
                      <button
                        onClick={() => handleSortChange('likes')}
                        className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          sortBy === 'likes' ? 'bg-red-50 text-red-600 font-semibold' : 'text-gray-700'
                        }`}
                      >
                        좋아요 순
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {originalError && (
            <div className="px-6 py-4 bg-red-50 border-b border-red-100 text-sm text-red-700">
              {originalError}
            </div>
          )}

          {isOriginalLoading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="size-6 animate-spin text-red-500" />
            </div>
          ) : sortedOriginalComments.length === 0 ? (
            <div className="p-10 text-center text-sm text-gray-500">
              현재 확인 가능한 원본 악플이 없습니다.
            </div>
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {paginatedOriginalComments.map((comment) => {
                  const isVisible = visibleOriginalComments.has(comment.id);
                  return (
                    <div
                      key={comment.id}
                      className="p-4 sm:p-5 hover:bg-gray-50 transition-colors flex flex-col gap-4"
                    >
                      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
                        <div className="w-full lg:w-56 shrink-0">
                          <p className="font-semibold text-gray-900">{comment.author || '익명'}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatPublishedAt(comment.publishedAt || comment.date)}
                          </p>
                        </div>

                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-gray-800 whitespace-pre-line leading-relaxed transition-all duration-300 ${
                              !isVisible ? 'blur-md select-none pointer-events-none' : ''
                            }`}
                          >
                            {comment.content}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 w-full lg:w-auto">
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{Number(comment.likes || 0)}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                              삭제
                            </button>
                            <button
                              onClick={() => handleToggleVisibility(comment.id)}
                              className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium ${
                                isVisible
                                  ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                              }`}
                            >
                              <Eye className="w-4 h-4" />
                              {isVisible ? '숨기기' : '보기'}
                            </button>
                            <button
                              onClick={handleReportClick}
                              className="px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 text-sm font-medium"
                            >
                              <Scale className="w-4 h-4" />
                              법률 상담
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="bg-gray-50 border-t border-gray-200 p-6">
                <div className="flex items-center justify-center gap-3">
                  <button
                    onClick={handlePrevComments}
                    disabled={currentOriginalPage === 0}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    이전
                  </button>
                  <span className="text-sm text-gray-500">
                    {totalOriginalPages === 0 ? '0 / 0' : `${currentOriginalPage + 1} / ${totalOriginalPages}`}
                  </span>
                  <button
                    onClick={handleNextComments}
                    disabled={currentOriginalPage >= totalOriginalPages - 1}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    다음
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}