"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Search, TrendingUp, Shield, Clock, Brain, Sun, Cloud, CloudRain, Zap, ArrowUpRight, Loader2, ChevronLeft, ChevronRight, Calendar, List } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { VideoDetailTab } from './VideoDetailTab';
import { apiUrl } from '@/lib/config';



// 날씨 정보 헬퍼 (영상별 건전도용)
function getWeatherInfo(status) {
  if (status >= 95) return { icon: Sun, text: '화창함', color: '#FFD93D', bgColor: '#FFF9E6' };
  if (status >= 80) return { icon: Sun, text: '맑음', color: '#FFA500', bgColor: '#FFF4E6' };
  if (status >= 60) return { icon: Cloud, text: '흐림', color: '#9CA3AF', bgColor: '#F3F4F6' };
  return { icon: CloudRain, text: '뇌우', color: '#6366F1', bgColor: '#EEF2FF' };
}

// 채널 악플 현황 날씨 정보 헬퍼 (필터링 댓글 비율 기준)
function getChannelWeatherInfo(filteringRatio) {
  if (filteringRatio >= 0 && filteringRatio < 1) {
    return { icon: Sun, text: '맑음', color: '#FFA500' };
  } else if (filteringRatio >= 1 && filteringRatio < 5) {
    return { icon: Cloud, text: '흐림', color: '#9CA3AF' };
  } else if (filteringRatio >= 5 && filteringRatio < 10) {
    return { icon: CloudRain, text: '우천', color: '#6366F1' };
  } else {
    return { icon: CloudRain, text: '뇌우', color: '#EF4444' };
  }
}

function formatPublishedDate(publishedAt) {
  if (!publishedAt) return '방금 전';
  const date = new Date(publishedAt);
  if (Number.isNaN(date.getTime())) return '방금 전';
  // 로컬 시간대 기준으로 날짜 추출 (UTC가 아닌)
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// YouTube 썸네일 품질 개선
function getHighResThumbnail(url) {
  // null, undefined, 빈 문자열 체크
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return url || '';
  }
  
  // ytimg.com 또는 img.youtube.com 포함하는 경우 고화질로 변환
  if (url.includes('ytimg.com') || url.includes('img.youtube.com')) {
    return url
      .replace('default.jpg', 'hqdefault.jpg')
      .replace('mqdefault.jpg', 'hqdefault.jpg')
      .replace('sddefault.jpg', 'hqdefault.jpg')
      .replace('hqdefault.jpg', 'hqdefault.jpg'); // ensure highest available
  }
  
  // 다른 형식의 URL이면 원본 그대로 반환
  return url;
}

export function OverviewTab({ data, channel }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoPage, setVideoPage] = useState(0);
  
  // 📌 그래프용 State
  const [filterPeriod, setFilterPeriod] = useState('day'); // day, month, year
  const [chartData, setChartData] = useState([]);
  const [isChartLoading, setIsChartLoading] = useState(false);
  
  // 📌 삭제 확인 다이얼로그 State
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false); // 삭제 중 상태
  
  // 📌 영상별 필터링 통계 State
  const [videoStats, setVideoStats] = useState({}); // { videoId: { totalFilteredCount, totalCommentCount, filteringRatio } }
  
  // 📌 시간대별 필터링 데이터 (API에서 조회)
  const [timePatternData, setTimePatternData] = useState(null);
  const [isTimePatternLoading, setIsTimePatternLoading] = useState(false);

  // 1. 데이터 추출
  const stats = data?.stats || {};
  const channelId = stats.channelId || channel?.id; // 📌 그래프 조회 시 필요

  const thisMonthFiltered = stats.thisMonthFilteredCount || 0;
  const totalFiltered = stats.totalFilteredCount || 0;
  const todayFiltered = stats.todayFilteredCount || 0;



  // 2. 📌 [구현완료] 그래프 데이터 Fetching (기간 변경 시 실행)
  useEffect(() => {
    const fetchTrendData = async () => {
      if (!channelId) return;

      setIsChartLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      
      // 기간에 따른 시작 날짜 계산
      if (filterPeriod === 'hour') {
        startDate.setHours(endDate.getHours() - 72); // 최근 72시간 (3일)
      } else if (filterPeriod === 'day') {
        startDate.setDate(endDate.getDate() - 7); // 최근 7일
      } else if (filterPeriod === 'month') {
        startDate.setMonth(endDate.getMonth() - 1); // 최근 1개월 (30일)
      } else if (filterPeriod === 'year') {
        startDate.setFullYear(endDate.getFullYear() - 1); // 최근 1년
      }

      // 시간대별일 때는 날짜+시간 형식, 그 외에는 날짜만
      const to = filterPeriod === 'hour' 
        ? endDate.toISOString().slice(0, 16) // 'YYYY-MM-DDTHH:mm'
        : endDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const from = filterPeriod === 'hour'
        ? startDate.toISOString().slice(0, 16) // 'YYYY-MM-DDTHH:mm'
        : startDate.toISOString().split('T')[0]; // 'YYYY-MM-DD'
      const periodType =
        filterPeriod === 'hour' ? 'hourly' :
        filterPeriod === 'day' ? 'daily' : 
        filterPeriod === 'month' ? 'monthly' : 'yearly';

      try {
        // 📌 분석 시간(analyzed_at) 기준 통계 API 호출 (AgentController)
        const response = await fetch(
          apiUrl(
            `api/v1/analysis/comments/stats?channelId=${channelId}` +
              `&period=${periodType}&startDate=${from}&endDate=${to}`
          ),
          { method: 'GET', credentials: 'include' }
        );

        if (response.ok) {
          const trendData = await response.json();
          const statsArray = Array.isArray(trendData?.stats) ? trendData.stats : [];

          // Recharts용 데이터 변환 (날짜 문자열 그대로 사용)
          const formattedData = statsArray.map((item) => ({
            name: item.date,
            filtered: item.filteredCount ?? 0,
          }));
          setChartData(formattedData);
        } else {
          console.error("그래프 데이터 조회 실패");
          setChartData([]);
        }
      } catch (error) {
        console.error("트렌드 데이터 로드 오류:", error);
        setChartData([]);
      } finally {
        setIsChartLoading(false);
      }
    };

    fetchTrendData();
  }, [filterPeriod, channelId]); // 기간이나 채널이 바뀌면 재실행

  // 3. 📌 [구현완료] 시간대별 악플 통계 데이터 Fetching
  useEffect(() => {
    const fetchTimePatterns = async () => {
      if (!channelId) return;

      setIsTimePatternLoading(true);
      
      try {
        const response = await fetch(
          apiUrl(`api/youtube/analysis/channel/${channelId}/dashboard/time-patterns`),
          { method: 'GET', credentials: 'include' }
        );

        if (response.ok) {
          const data = await response.json();
          setTimePatternData({
            distribution: data.distribution || {},
            red_zone: data.red_zone || {
              time_slot: '',
              count: 0,
              percentage: 0
            }
          });
        } else {
          // 404 = 아직 분석 결과가 없는 정상 케이스이므로 조용히 빈 상태로 처리
          if (response.status !== 404) {
            console.error("시간대 별 악플 통계 조회 실패:", response.status);
          }
          setTimePatternData(null);
        }
      } catch (error) {
        console.error("시간대 별 악플 통계 로드 오류:", error);
        setTimePatternData(null);
      } finally {
        setIsTimePatternLoading(false);
      }
    };

    fetchTimePatterns();
  }, [channelId]); // 채널이 바뀌면 재실행

  // 채널 통계 계산 및 영상 목록 필터링
  const recentVideos = data?.videos || [];
  const filteredVideos = recentVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    const dateA = new Date(a.publishedAt || 0).getTime();
    const dateB = new Date(b.publishedAt || 0).getTime();
    return dateB - dateA;
  });

  const videosPerPage = 6;
  const totalVideoPages = Math.max(1, Math.ceil(sortedVideos.length / videosPerPage));
  const clampedVideoPage = Math.min(videoPage, totalVideoPages - 1);
  const paginatedVideos = sortedVideos.slice(
    clampedVideoPage * videosPerPage,
    (clampedVideoPage + 1) * videosPerPage
  );

  const handlePrevVideos = () => {
    setVideoPage(prev => Math.max(0, prev - 1));
  };

  const handleNextVideos = () => {
    setVideoPage(prev => Math.min(totalVideoPages - 1, prev + 1));
  };

  useEffect(() => {
    setVideoPage(0);
  }, [searchQuery]);

  // 📌 영상별 필터링 통계 가져오기
  useEffect(() => {
    const fetchVideoStats = async () => {
      const recentVideos = data?.videos || [];
      if (recentVideos.length === 0) return;

      const statsPromises = recentVideos.map(async (video) => {
        try {
          const response = await fetch(
            apiUrl(`api/user/dashboard/videos/${video.id}/filtering-statistics`),
            { method: 'GET', credentials: 'include' }
          );
          
          if (response.ok) {
            const stats = await response.json();
            const totalFilteredCount = stats.totalFilteredCount || 0;
            const totalCommentCount = stats.totalCommentCount || 0;
            const filteringRatio = totalCommentCount > 0 
              ? (totalFilteredCount / totalCommentCount) * 100 
              : 0;
            
            return {
              videoId: video.id,
              totalFilteredCount,
              totalCommentCount,
              filteringRatio
            };
          }
          return null;
        } catch (error) {
          console.error(`영상 ${video.id} 통계 조회 실패:`, error);
          return null;
        }
      });

      const results = await Promise.all(statsPromises);
      const statsMap = {};
      results.forEach((result) => {
        if (result) {
          statsMap[result.videoId] = {
            totalFilteredCount: result.totalFilteredCount,
            totalCommentCount: result.totalCommentCount,
            filteringRatio: result.filteringRatio
          };
        }
      });
      
      setVideoStats(statsMap);
    };

    fetchVideoStats();
  }, [data?.videos]);

  // 영상 선택 시 페이지 상단으로 스크롤
  useEffect(() => {
    if (selectedVideo) {
      const scrollToTop = () => {
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
      
      return () => {
        clearTimeout(timer);
      };
    }
  }, [selectedVideo]);

  if (selectedVideo) {
    return <VideoDetailTab video={selectedVideo} onBack={() => setSelectedVideo(null)} />;
  }

  if (!data) {
    return <div className="p-8 text-center text-gray-500">데이터를 불러오는 중입니다...</div>;
  }
  // 백엔드 응답의 camelCase 필드명 그대로 사용 (null일 수 있음)
  const totalViews = channel?.totalViewCount ?? 0;
  const totalComments = channel?.totalCommentCount ?? 0;
  const totalVideos = channel?.totalVideoCount ?? 0;

  // 재연동 필요 여부 확인
  const getChannelStatus = (lastSyncedAt) => {
    if (!lastSyncedAt) return { status: 'warning', authExpiry: 'D-?' };
    const syncedDate = new Date(lastSyncedAt);
    const expiryDate = new Date(syncedDate);
    expiryDate.setDate(expiryDate.getDate() + 60);
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return { 
        status: 'warning', 
        authExpiry: diffDays > 0 ? `D-${diffDays}` : '만료됨' 
      };
    }
    return { status: 'normal', authExpiry: null };
  };
  
  const channelStatus = channel ? getChannelStatus(channel.lastSyncedAt) : null;
  const isVideoDetailView = selectedVideo !== null;

  return (
    <div className="space-y-6">
      {/* 채널 대시보드 제목 */}
      {!isVideoDetailView && channel && (
        <h2 className="text-black mb-6" style={{ fontWeight: 700, fontSize: '34px' }}>
          채널 대시보드
        </h2>
      )}
      
      {/* 채널 정보 카드 - 영상 대시보드일 때는 숨김 */}
      {!isVideoDetailView && channel && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* 왼쪽 카드: 썸네일 + 채널명 + 핸들명 */}
          <Card className="h-full">
            <CardContent className="pt-4 pb-4 px-4 h-full flex flex-col">
              <div className="flex flex-col items-center gap-2 flex-1 justify-center">
                <div className="w-20 h-20 flex-shrink-0">
                  <img
                    src={channel.thumbnailUrl}
                    alt={channel.channelName}
                    className="w-full h-full rounded-full object-cover ring-2 ring-gray-100"
                    style={{ width: '80px', height: '80px', maxWidth: '80px', maxHeight: '80px', minWidth: '80px', minHeight: '80px' }}
                  />
                </div>
                <div className="text-center mt-1">
                  <h1 className="text-gray-900 mb-1 font-semibold text-lg leading-tight line-clamp-2">{channel.channelName}</h1>
                  <p className="text-gray-600 text-sm truncate">{channel.channelHandle}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 중간 카드: 구독자수, 총 조회수, 총 동영상 수 */}
          <Card>
            <CardContent className="pt-4 pb-4">
              <div className="grid grid-cols-2 lg:flex lg:flex-col gap-3 h-full lg:justify-center">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-3 lg:border-b border-gray-100">
                  <span className="text-gray-600 text-sm lg:text-base">구독자 수</span>
                  <span className="text-gray-900 font-semibold lg:font-normal">{(channel.subscriberCount ?? 0).toLocaleString()}명</span>
                </div>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between pb-3 lg:border-b border-gray-100">
                  <span className="text-gray-600 text-sm lg:text-base">총 조회수</span>
                  <span className="text-gray-900 font-semibold lg:font-normal">{totalViews.toLocaleString()}회</span>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <span className="text-gray-600 text-sm lg:text-base">총 동영상 수</span>
                  <span className="text-gray-900 font-semibold lg:font-normal">{totalVideos}개</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 오른쪽 카드 섹션: 해당 채널에서 필터링 현황 (왼쪽) + 빈 카드 (오른쪽) */}
          <Card>
            <CardContent className="pt-5 pb-5 h-full flex flex-col justify-between">
              <div>
                <p className="text-sm text-gray-500 mt-3">해당 채널에서 필터링 된 댓글</p>
                <p className="text-3xl font-bold text-red-600 mt-12">{totalFiltered.toLocaleString()}건</p>
              </div>
              <button 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-4 rounded-full transition-colors mt-6"
                onClick={() => setShowDeleteDialog(true)}
              >
                필터링 된 댓글 삭제하기
              </button>
            </CardContent>
          </Card>
          
          {/* 오른쪽 카드: 채널 악플 현황 날씨 */}
          <Card>
            <CardContent className="pt-5 pb-5 h-full flex flex-col items-center justify-center">
              {(() => {
                // 필터링 댓글 비율 계산
                // totalComments: youtube_videos 테이블의 comment_count 합계 (stats.totalCommentCount)
                // totalFiltered: 필터링된 댓글 수 (stats.totalFilteredCount)
                const totalComments = stats.totalCommentCount || 0;
                const filteringRatio = totalComments > 0 
                  ? (totalFiltered / totalComments) * 100 
                  : 0;
                
                // 날씨 정보 가져오기
                const weatherInfo = getChannelWeatherInfo(filteringRatio);
                const WeatherIcon = weatherInfo.icon;
                
                // 데이터가 없거나 표시할 수 없는 경우
                if (totalComments === 0 || isNaN(filteringRatio)) {
                  return (
                    <div className="flex flex-col items-center justify-center gap-4">
                      <Cloud className="size-16 text-gray-300" />
                      <p className="text-sm text-gray-500 mt-12">
                        채널 날씨 데이터를 표시할 수 없습니다
                      </p>
                    </div>
                  );
                }
                
                return (
                  <div className="flex flex-col items-center justify-between h-full w-full">
                    <div className="flex-1 flex items-center justify-center">
                      <WeatherIcon className="size-32" style={{ color: weatherInfo.color }} />
                    </div>
                    <p className="text-sm text-gray-600 text-center pb-2">
                      현재 채널의 날씨는 <span className="font-bold text-gray-900" style={{ color: weatherInfo.color }}>{weatherInfo.text}</span>입니다
                    </p>
                  </div>
                );
              })()}
            </CardContent>
          </Card>
        </div>
      )}

      {/* 2. 📌 [구현완료] 필터링 추이 그래프 */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="size-5 text-gray-500" />
                  댓글 필터링 추이
                </CardTitle>
                <CardDescription>
                  {filterPeriod === 'hour' && '최근 72시간(3일)간의 활동입니다 (6시간 단위)'}
                  {filterPeriod === 'day' && '최근 7일간의 활동입니다'}
                  {filterPeriod === 'month' && '최근 30일간의 활동입니다'}
                  {filterPeriod === 'year' && '최근 1년간의 활동입니다'}
                </CardDescription>
              </div>
              {/* 기간 선택 셀렉트 박스 */}
              <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">시간대별 (72시간)</SelectItem>
                  <SelectItem value="day">일별 (7일)</SelectItem>
                  <SelectItem value="month">월별 (30일)</SelectItem>
                  <SelectItem value="year">연도별 (1년)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isChartLoading ? (
              <div className="h-[480px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={480}>
                <LineChart data={chartData.length > 0 ? chartData : [{name: '데이터 없음', filtered: 0}]}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    axisLine={{ stroke: '#E5E7EB' }} 
                    minTickGap={filterPeriod === 'hour' ? 20 : 30}
                    tickFormatter={(value) => {
                      if (filterPeriod === 'hour') {
                        // "2025-01-15 00:00" → "01/15 00시"
                        const [date, time] = value.split(' ');
                        if (date && time) {
                          const [year, month, day] = date.split('-');
                          const hour = time.split(':')[0];
                          return `${month}/${day} ${hour}시`;
                        }
                      }
                      return value;
                    }}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280', fontSize: 12 }} 
                    axisLine={{ stroke: '#E5E7EB' }}
                    label={{ value: '필터링된 댓글 수 (건)', angle: -90, position: 'insideLeft', style: { textAnchor: 'middle', fill: '#6B7280' } }}
                    tickFormatter={(value) => Math.round(value).toString()}
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                    formatter={(value) => [`${Number(value).toLocaleString()}건`, '필터링된 댓글']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="filtered" 
                    stroke="#EF4444" 
                    strokeWidth={3}
                    dot={{ fill: '#EF4444', r: 5 }}
                    activeDot={{ r: 7 }}
                    name="필터링된 댓글" 
                    animationDuration={1000}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        <Card className="h-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="size-5 text-gray-500" />
                  악플 집중 시간대
                </CardTitle>
                <CardDescription>
                  {(() => {
                    if (!timePatternData) {
                      return '시간대 별 악플 집중 현황입니다';
                    }
                    const totalCount = Object.values(timePatternData.distribution).reduce((sum, val) => sum + val, 0);
                    if (totalCount > 0 && timePatternData.red_zone.count > 0) {
                      return (
                        <span>
                          <span className="font-semibold text-gray-900">{timePatternData.red_zone.time_slot}</span>에 
                          전체 악플의 <span className="font-semibold text-red-600">{timePatternData.red_zone.percentage}%</span>가 집중되었습니다
                        </span>
                      );
                    }
                    return '시간대 별 악플 집중 현황입니다';
                  })()}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isTimePatternLoading ? (
              <div className="h-[480px] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              </div>
            ) : !timePatternData ? (
              <div className="h-[480px] flex items-center justify-center">
                <p className="text-sm text-gray-500">시간대 별 악플 통계 데이터를 불러올 수 없습니다</p>
              </div>
            ) : (() => {
              // 시간대 데이터 변환 (Object -> Array for Chart)
              const timeChartData = Object.entries(timePatternData.distribution).map(([key, value]) => ({
                name: key.split(' ')[0], // "새벽 (00-06시)" -> "새벽"
                fullLabel: key,
                count: value,
                isRedZone: key === timePatternData.red_zone.time_slot
              }));
              
              return (
                <ResponsiveContainer width="100%" height={480}>
                  <BarChart data={timeChartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#6B7280', fontSize: 12 }} 
                      axisLine={{ stroke: '#E5E7EB' }} 
                      minTickGap={30}
                    />
                    <YAxis 
                      tick={{ fill: '#6B7280', fontSize: 12 }} 
                      axisLine={{ stroke: '#E5E7EB' }}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          return (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-3">
                              <p className="font-bold text-gray-900 mb-1">{data.fullLabel}</p>
                              <p className="text-sm text-gray-600">악플 수: <span className="font-semibold">{data.count}건</span></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                      {timeChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.isRedZone ? '#EF4444' : '#E5E7EB'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              );
            })()}
          </CardContent>
        </Card>
      </div>

      {/* 3. 민심 온도계 및 영상 목록 (기존 유지) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="size-5 text-gray-500" />
            영상 목록
          </CardTitle>
          <CardDescription>현재 채널에 등록된 최신 20개 영상 별 댓글 현황(날씨)을 확인할 수 있습니다. 영상 클릭 시 영상 대시보드로 이동합니다</CardDescription>
          
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder="영상 제목 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="text-sm text-gray-500">
              총 <span className="font-medium text-gray-900">{sortedVideos.length}</span>개 영상
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedVideos.map((video) => {
              // 영상별 필터링 통계 가져오기
              const stats = videoStats[video.id];
              let weatherInfo = null;
              let WeatherIcon = null;
              
              // VideoDetailTab과 동일한 방식으로 계산 (video.commentCount 사용)
              const totalComments = video.commentCount || 0;
              const filteredComments = stats?.totalFilteredCount || 0;
              
              if (totalComments > 0) {
                const filteringRatio = (filteredComments / totalComments) * 100;
                
                if (!isNaN(filteringRatio)) {
                  weatherInfo = getChannelWeatherInfo(filteringRatio);
                  WeatherIcon = weatherInfo.icon;
                }
              }

              return (
                <div
                  key={video.id}
                  className="group flex flex-col rounded-3xl border border-gray-100 bg-white hover:border-primary/30 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => {
                    // 클릭 시 즉시 스크롤 처리
                    window.scrollTo(0, 0);
                    setSelectedVideo(video);
                  }}
                >
                  <div className="relative w-full pt-[56.25%] overflow-hidden rounded-3xl bg-gray-100">
                    {(video.thumbnail || video.thumbnailUrl) && (
                      <img
                        src={video.thumbnail || video.thumbnailUrl}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 px-3 pb-3 pt-4 flex-1">
                    <div className="flex items-start gap-2">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold text-sm text-gray-900 line-clamp-2">
                          {video.title}
                        </h5>
                      </div>
                    </div>
                    <div className="mt-auto">
                      <div className="flex items-center justify-between text-xs text-gray-500 pb-2">
                        <span>조회수 {video.viewCount?.toLocaleString()}회</span>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1.5" />
                          <span>{formatPublishedDate(video.publishedAt || video.published_at)}</span>
                        </div>
                      </div>
                      {weatherInfo && WeatherIcon && (
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                          <div
                            className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                            style={{ backgroundColor: `${weatherInfo.color}20` }}
                          >
                            <WeatherIcon className="h-4 w-4" style={{ color: weatherInfo.color }} />
                            <span className="text-xs font-semibold" style={{ color: weatherInfo.color }}>
                              {weatherInfo.text}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handlePrevVideos}
              disabled={clampedVideoPage === 0}
            >
              <ChevronLeft className="w-4 h-4" />
              이전
            </button>
            <span className="text-sm text-gray-500">
              {clampedVideoPage + 1} / {totalVideoPages}
            </span>
            <button
              className="flex items-center gap-1.5 px-3 py-2 rounded-md border border-gray-200 text-sm text-gray-700 disabled:opacity-40 disabled:cursor-not-allowed"
              onClick={handleNextVideos}
              disabled={clampedVideoPage >= totalVideoPages - 1}
            >
              다음
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 필터링 된 댓글 삭제 확인 다이얼로그 */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>필터링 된 댓글을 삭제하시겠습니까?</AlertDialogTitle>
            <div className="text-sm text-muted-foreground space-y-3 pt-2">
              <div>
                이 채널에서 필터링 된 총{' '}
                <span className="font-bold text-red-600">{totalFiltered.toLocaleString()}건</span>의 댓글이 YouTube에서 영구적으로 삭제됩니다
              </div>
              <div className="font-semibold text-gray-900">
                삭제된 댓글은 복원할 수 없습니다
              </div>
              <div className="text-sm text-gray-600">
                댓글을 검토하거나 개별로 삭제하고 싶다면, 영상 대시보드에서 해당 댓글을 확인하실 수 있습니다
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
              onClick={async () => {
                if (!channel?.id) {
                  alert('채널 정보를 찾을 수 없습니다.');
                  return;
                }

                setIsDeleting(true);
                try {
                  const response = await fetch(
                    apiUrl(`api/youtube/comments/channel/${channel.id}/filtered`),
                    {
                      method: 'DELETE',
                      credentials: 'include',
                    }
                  );

                  if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.message || `댓글 삭제 실패: ${response.status}`);
                  }

                  const result = await response.json();
                  const successCount = result.successCount || 0;
                  const failureCount = result.failureCount || 0;
                  const totalRequested = result.totalRequested || 0;

                  // 성공 메시지 표시
                  if (failureCount === 0) {
                    alert(`성공적으로 ${successCount.toLocaleString()}개의 댓글이 삭제되었습니다.`);
                  } else {
                    alert(
                      `삭제 완료: ${successCount.toLocaleString()}개 성공, ${failureCount}개 실패\n` +
                      `(최대 500개까지만 한 번에 삭제됩니다. 나머지는 개별 삭제하거나 다시 시도해주세요.)`
                    );
                  }

                  // 다이얼로그 닫기
                  setShowDeleteDialog(false);
                  
                  // 페이지 새로고침하여 최신 데이터 반영 (선택사항)
                  // window.location.reload();
                } catch (error) {
                  console.error('댓글 삭제 실패:', error);
                  alert(error.message || '댓글 삭제에 실패했습니다. 잠시 후 다시 시도해주세요.');
                } finally {
                  setIsDeleting(false);
                }
              }}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  삭제 중...
                </>
              ) : (
                '삭제하기'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}