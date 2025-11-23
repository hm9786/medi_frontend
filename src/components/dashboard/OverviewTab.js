"use client";

import { useState, useEffect } from 'react'; // useEffect 추가
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, TrendingUp, Shield, Clock, Brain, Sun, Cloud, CloudRain, Zap, ArrowUpRight, Loader2 } from 'lucide-react'; // Loader2 추가
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { VideoDetailTab } from './VideoDetailTab';

// 스트레스 지수 및 날씨 정보 헬퍼 함수 (기존과 동일)
function calculateStressLevel(dailyCount, harmfulnessDistribution) {
  let severityWeight = 1.5;
  if (harmfulnessDistribution && harmfulnessDistribution.length > 0) {
    const total = harmfulnessDistribution.reduce((acc, cur) => acc + cur.count, 0);
    if (total > 0) {
      const high = harmfulnessDistribution.find(d => d.harmfulnessLevel === 'HIGH')?.count || 0;
      const medium = harmfulnessDistribution.find(d => d.harmfulnessLevel === 'MEDIUM')?.count || 0;
      const low = harmfulnessDistribution.find(d => d.harmfulnessLevel === 'LOW')?.count || 0;
      severityWeight = ((high * 3) + (medium * 2) + (low * 1)) / total;
    }
  }
  const score = dailyCount * severityWeight;
  if (score < 1) return { level: '낮음', description: '청정 구역입니다! 🌱', color: '#10B981' };
  if (score < 15) return { level: '보통', description: 'AI가 잘 막아내고 있어요 🛡️', color: '#3B82F6' };
  if (score < 50) return { level: '높음', description: '악플 공격 방어 중! ⚔️', color: '#F59E0B' };
  return { level: '매우 높음', description: '집중 모니터링 필요 🚨', color: '#EF4444' };
}

function getWeatherInfo(status) {
  if (status >= 95) return { icon: Sun, text: '화창함', color: '#FFD93D', bgColor: '#FFF9E6' };
  if (status >= 80) return { icon: Sun, text: '맑음', color: '#FFA500', bgColor: '#FFF4E6' };
  if (status >= 60) return { icon: Cloud, text: '흐림', color: '#9CA3AF', bgColor: '#F3F4F6' };
  return { icon: CloudRain, text: '뇌우', color: '#6366F1', bgColor: '#EEF2FF' };
}

export function OverviewTab({ data }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [filterPeriod, setFilterPeriod] = useState('day'); // 기본값 'day' (최근 7일)
  const [chartData, setChartData] = useState([]); // 📌 그래프 데이터 State
  const [isChartLoading, setIsChartLoading] = useState(false); // 📌 로딩 State

  // 📌 [추가] 기간이 변경될 때마다 그래프 데이터를 백엔드에서 가져옴
  useEffect(() => {
    const fetchTrendData = async () => {
      setIsChartLoading(true);
      
      // 1. 날짜 범위 계산
      const endDate = new Date();
      const startDate = new Date();
      
      if (filterPeriod === 'day') {
        startDate.setDate(endDate.getDate() - 7); // 최근 7일
      } else if (filterPeriod === 'month') {
        startDate.setMonth(endDate.getMonth() - 1); // 최근 1개월
      } else if (filterPeriod === 'year') {
        startDate.setFullYear(endDate.getFullYear() - 1); // 최근 1년
      }

      // YYYY-MM-DD 형식으로 변환
      const to = endDate.toISOString().split('T')[0];
      const from = startDate.toISOString().split('T')[0];

      try {
        // 2. API 호출
        const response = await fetch(
          `http://localhost:8080/api/user/dashboard/filtering-trend?from=${from}&to=${to}`, 
          {
            method: 'GET',
            credentials: 'include',
          }
        );

        if (response.ok) {
          const trendData = await response.json();
          
          // 3. 차트용 데이터 포맷팅
          const formattedData = trendData.map(item => ({
            name: item.date, // X축: 날짜 (YYYY-MM-DD)
            filtered: item.filteredCount, // Y축: 필터링 수
          }));
          
          setChartData(formattedData);
        } else {
          console.error("트렌드 데이터 조회 실패");
          setChartData([]);
        }
      } catch (error) {
        console.error("트렌드 데이터 로드 중 오류:", error);
        setChartData([]);
      } finally {
        setIsChartLoading(false);
      }
    };

    fetchTrendData();
  }, [filterPeriod]); // filterPeriod가 바뀔 때마다 실행

  // 데이터 추출 (기존 로직)
  const recentVideos = data?.videos || []; 
  const stats = data?.stats || {}; 
  const thisMonthFiltered = stats.thisMonthFilteredCount || 0;
  const totalFiltered = stats.totalFilteredCount || 0;
  const savedHours = Math.floor((totalFiltered * 0.5) / 60); 
  const savedMins = Math.floor((totalFiltered * 0.5) % 60);
  
  const today = new Date();
  const daysPassed = Math.max(1, today.getDate());
  const dailyAverage = thisMonthFiltered / daysPassed;
  const harmfulnessData = stats.harmfulnessLevelDistribution || [];
  const stressInfo = calculateStressLevel(dailyAverage, harmfulnessData);

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
      {/* 1. 상단 메트릭 카드 (기존 유지) */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
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
              누적 차단 {totalFiltered.toLocaleString()}건 기준
            </p>
          </CardContent>
        </Card>

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

      {/* 2. 📌 필터링 추이 그래프 (백엔드 데이터 연동됨) */}
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
            {/* 📌 셀렉트 박스: 기간 변경 시 API 재호출 */}
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
          {/* 로딩 상태 처리 */}
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
                  minTickGap={30} // 날짜가 겹치지 않게 간격 조정
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