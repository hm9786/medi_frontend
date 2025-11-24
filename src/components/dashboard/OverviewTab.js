"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, TrendingUp, Shield, Clock, Brain, Sun, Cloud, CloudRain, Zap, ArrowUpRight, Loader2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VideoDetailTab } from './VideoDetailTab';

// 스트레스 지수 계산 헬퍼
function calculateStressLevel(dailyCount) {
  if (dailyCount < 1) return { level: '낮음', description: '아직 필터링된 댓글이 많이 없어요', color: '#10B981' };
  if (dailyCount < 10) return { level: '보통', description: '조금씩 댓글 관리가 되고 있어요!', color: '#3B82F6' };
  if (dailyCount < 30) return { level: '높음', description: '크리에이터님 고생많으셨네요 필터링되는 댓글이 많습니다 !', color: '#F59E0B' };
  return { level: '매우 높음', description: '위험해요 AI 풀가동 !', color: '#EF4444' };
}

// 날씨 정보 헬퍼
function getWeatherInfo(status) {
  if (status >= 95) return { icon: Sun, text: '화창함', color: '#FFD93D', bgColor: '#FFF9E6' };
  if (status >= 80) return { icon: Sun, text: '맑음', color: '#FFA500', bgColor: '#FFF4E6' };
  if (status >= 60) return { icon: Cloud, text: '흐림', color: '#9CA3AF', bgColor: '#F3F4F6' };
  return { icon: CloudRain, text: '뇌우', color: '#6366F1', bgColor: '#EEF2FF' };
}

export function OverviewTab({ data }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // 📌 그래프용 State
  const [filterPeriod, setFilterPeriod] = useState('day'); // day, month, year
  const [chartData, setChartData] = useState([]);
  const [isChartLoading, setIsChartLoading] = useState(false);

  // 1. 데이터 추출
  const stats = data?.stats || {};
  const channelId = stats.channelId; // 📌 그래프 조회 시 필요

  const thisMonthFiltered = stats.thisMonthFilteredCount || 0;
  const totalFiltered = stats.totalFilteredCount || 0;
  const todayFiltered = stats.todayFilteredCount || 0;
  
  // 시간 절약 계산
  const totalSavedSeconds = thisMonthFiltered * 12;
  const savedHours = Math.floor(totalSavedSeconds / 3600);
  const savedMins = Math.floor((totalSavedSeconds % 3600) / 60);
  
  // 스트레스 지수 계산
  const today = new Date();
  const daysPassed = Math.max(1, today.getDate());
  const dailyAverage = thisMonthFiltered / daysPassed;
  const stressInfo = calculateStressLevel(dailyAverage);

  // 2. 📌 [구현완료] 그래프 데이터 Fetching (기간 변경 시 실행)
  useEffect(() => {
    const fetchTrendData = async () => {
      if (!channelId) return;

      setIsChartLoading(true);
      
      const endDate = new Date();
      const startDate = new Date();
      
      // 기간에 따른 시작 날짜 계산
      if (filterPeriod === 'day') {
        startDate.setDate(endDate.getDate() - 7); // 최근 7일
      } else if (filterPeriod === 'month') {
        startDate.setMonth(endDate.getMonth() - 1); // 최근 1개월 (30일)
      } else if (filterPeriod === 'year') {
        startDate.setFullYear(endDate.getFullYear() - 1); // 최근 1년
      }

      const to = endDate.toISOString().split('T')[0];
      const from = startDate.toISOString().split('T')[0];

      try {
        // 백엔드 API 호출 (channelId 필터링 포함)
        const response = await fetch(
          `http://localhost:8080/api/user/dashboard/filtering-trend?from=${from}&to=${to}&channelId=${channelId}`, 
          { method: 'GET', credentials: 'include' }
        );

        if (response.ok) {
          const trendData = await response.json();
          // Recharts용 데이터 변환
          const formattedData = trendData.map(item => ({
            name: item.date,
            filtered: item.filteredCount,
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

  // 영상 목록 필터링
  const recentVideos = data?.videos || []; 
  const filteredVideos = recentVideos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sortedVideos = [...filteredVideos].sort((a, b) => {
    const dateA = new Date(a.publishedAt || 0).getTime();
    const dateB = new Date(b.publishedAt || 0).getTime();
    return dateB - dateA;
  });

  if (selectedVideo) {
    return <VideoDetailTab video={selectedVideo} onBack={() => setSelectedVideo(null)} />;
  }

  if (!data) {
    return <div className="p-8 text-center text-gray-500">데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="space-y-6">
      {/* 1. 상단 메트릭 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        
        {/* 카드 1: 이번 달 차단된 악플 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 달 차단된 악플</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" style={{ color: 'var(--medi-primary)' }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: 'var(--medi-primary-dark)' }}>
              {thisMonthFiltered.toLocaleString()}개
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="inline-flex items-center text-green-600">
                <TrendingUp className="mr-1 h-3 w-3" /> Live
              </span>{' '}
              실시간 보호 중
            </p>
          </CardContent>
        </Card>

        {/* 카드 2: MEDI가 아껴드린 시간 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">MEDI가 아껴드린 시간</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-700">
              약 {savedHours}시간 {savedMins}분
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              이번 달 필터링 기준 
            </p>
          </CardContent>
        </Card>

        {/* 카드 3: 감소된 스트레스 지수 */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">감소된 스트레스 지수</CardTitle>
            <Brain className="h-4 w-4" style={{ color: stressInfo.color }} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" style={{ color: stressInfo.color }}>
              {stressInfo.level}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {stressInfo.description}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 2. 📌 [구현완료] 필터링 추이 그래프 */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>필터링 추이</CardTitle>
              <CardDescription>
                {filterPeriod === 'day' && '최근 7일간의 활동입니다'}
                {filterPeriod === 'month' && '최근 30일간의 활동입니다'}
                {filterPeriod === 'year' && '최근 1년간의 활동입니다'}
              </CardDescription>
            </div>
            {/* 기간 선택 셀렉트 박스 */}
            <Select value={filterPeriod} onValueChange={setFilterPeriod}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">일별 (7일)</SelectItem>
                <SelectItem value="month">월별 (30일)</SelectItem>
                <SelectItem value="year">연별 (1년)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isChartLoading ? (
            <div className="h-[350px] flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <AreaChart data={chartData.length > 0 ? chartData : [{name: '데이터 없음', filtered: 0}]}>
                <defs>
                  <linearGradient id="colorFiltered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F9DDE" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#4F9DDE" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  axisLine={{ stroke: '#E5E7EB' }} 
                  minTickGap={30}
                />
                <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={{ stroke: '#E5E7EB' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'white', border: '1px solid #E5E7EB', borderRadius: '8px' }}
                  formatter={(value) => [`${value}건`, '차단된 댓글']}
                />
                <Area 
                  type="monotone" 
                  dataKey="filtered" 
                  stroke="#4F9DDE" 
                  strokeWidth={2}
                  fill="url(#colorFiltered)" 
                  name="필터링 댓글" 
                  animationDuration={1000}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 3. 민심 온도계 및 영상 목록 (기존 유지) */}
      <Card>
        <CardHeader>
          <CardTitle>영상별 민심 온도계</CardTitle>
          <CardDescription>영상별 댓글 분위기를 한눈에 파악하세요</CardDescription>
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
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {sortedVideos.map((video) => {
              const score = (video.id * 17) % 41 + 60; 
              const weather = getWeatherInfo(score);
              const WeatherIcon = weather.icon;

              return (
                <div
                  key={video.id}
                  className="group flex items-center justify-between p-4 rounded-lg border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer bg-white"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-24 h-14 rounded object-cover flex-shrink-0 bg-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-sm text-gray-900 line-clamp-1 mb-1">{video.title}</h5>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>조회수 {video.viewCount?.toLocaleString()}</span>
                        <span>•</span>
                        <span>댓글 {video.commentCount?.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1 ml-4">
                    <div
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full"
                      style={{ backgroundColor: weather.bgColor }}
                    >
                      <WeatherIcon className="h-4 w-4" style={{ color: weather.color }} />
                      <span className="text-xs font-bold" style={{ color: weather.color }}>
                        {weather.text}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">건전도 {score}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}