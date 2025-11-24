"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import Image from "next/image";
import {
  Plus,
  Youtube,
  MoreVertical,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardContent, 
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge"; 

import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { ContentConsultingTab } from "@/components/dashboard/ContentConsultingTab";
import { BadCommentsTab } from "@/components/dashboard/BadCommentsTab";
import { LegalConsultingTab } from "@/components/dashboard/LegalConsultingTab";

import { DashboardContext } from "@/context/DashboardContext";

// 1. 채널 목록 뷰 (기존 동일)
function ChannelListView({ handleChannelSelect, channels, onSyncChannels, onDeleteChannel, onAddChannel }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [channelStats, setChannelStats] = useState({}); 

  useEffect(() => {
    if (channels && channels.length > 0) {
      channels.forEach(async (channel) => {
        try {
          const response = await fetch(`http://localhost:8080/api/user/dashboard/channels/${channel.id}/filtering-statistics`, {
            method: "GET",
            credentials: "include",
          });
          if (response.ok) {
            const data = await response.json();
            setChannelStats((prev) => ({
              ...prev,
              [channel.id]: data.totalFilteredCount || 0
            }));
          }
        } catch (error) {
          console.error(`채널 ${channel.id} 통계 로드 실패:`, error);
        }
      });
    }
  }, [channels]);

  const handleSync = async () => {
    setIsSyncing(true);
    try {
      await onSyncChannels();
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDelete = async (channelId) => {
    if (!window.confirm("정말로 이 채널을 삭제하시겠습니까?")) {
      return;
    }
    setDeletingId(channelId);
    try {
      await onDeleteChannel(channelId);
    } finally {
      setDeletingId(null);
    }
  };

  const getAuthExpiry = (lastSyncedAt) => {
    if (!lastSyncedAt) return "D-?";
    const syncedDate = new Date(lastSyncedAt);
    const expiryDate = new Date(syncedDate);
    expiryDate.setDate(expiryDate.getDate() + 60); 
    const today = new Date();
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? `D-${diffDays}` : "만료됨";
  };

  const getChannelStatus = (lastSyncedAt) => {
    if (!lastSyncedAt) return "warning";
    const syncedDate = new Date(lastSyncedAt);
    const daysSinceSync = Math.floor((new Date() - syncedDate) / (1000 * 60 * 60 * 24));
    return daysSinceSync > 30 ? "warning" : "active";
  };

  return (
    <div className="p-8">
      {/* 채널 목록 헤더 */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-3xl font-medium text-black mb-1 leading-[1.5]">내 채널 관리</h2>
            <p className="text-gray-600 leading-[1.5]">등록된 채널 {channels?.length || 0}개</p>
          </div>
          <div className="flex flex-col md:items-end gap-2">
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={handleSync}
                disabled={isSyncing}
              >
                {isSyncing ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                동기화
              </Button>
              <Button 
                onClick={onAddChannel}
              >
                <Plus className="mr-2 h-4 w-4" />
                채널 추가
              </Button>
            </div>
            <p className="text-gray-600 text-sm leading-[1.5]">
              <span className="text-gray-900 font-medium">{channels?.length || 0}</span>
              <span className="text-gray-400"> / 5</span>
              <span className="ml-1">채널 활성화</span>
            </p>
          </div>
        </div>
      </div>

      {/* 채널 목록 표시 */}
      {channels?.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <Youtube className="h-12 w-12 mb-4 text-gray-300" />
          <p className="text-lg font-medium mb-2 leading-[1.5]">등록된 채널이 없습니다</p>
          <p className="text-sm mb-4 leading-[1.5]">채널을 추가하거나 동기화해주세요</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {channels?.map(channel => {
            const status = getChannelStatus(channel.lastSyncedAt);
            const authExpiry = getAuthExpiry(channel.lastSyncedAt);
            const filteredCount = channelStats[channel.id] || 0;
            
            return (
              <Card
                key={channel.id}
                className="hover:shadow-lg transition-shadow relative cursor-pointer"
                onClick={() => handleChannelSelect(
                  channel.id,
                  channel.channelHandle || channel.youtubeChannelId || ""
                )}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-6 mb-4">
                    {channel.thumbnailUrl ? (
                      <img
                        src={channel.thumbnailUrl}
                        alt={channel.channelName || '채널'}
                        className="w-20 h-20 rounded-2xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div 
                        className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 bg-red-600"
                      >
                        <Youtube className="size-8 text-white" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0 ml-2">
                      <h3 className="text-3xl font-semibold text-gray-900 mb-4 truncate leading-[1.5]">
                        {channel.channelName || '채널명 없음'}
                      </h3>
                      <p className="text-gray-500 mt-2 truncate leading-[1.5]">
                        {channel.channelHandle || channel.youtubeChannelId || '핸들 없음'}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="size-8 -mt-14 -mr-4">
                          <MoreVertical className="size-4 text-gray-500" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>
                          {status === 'warning' ? (
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="size-4 text-orange-600" />
                              <div>
                                <div className="text-orange-600 font-medium leading-[1.5]">재연동 필요</div>
                                <div className="text-xs text-gray-500 leading-[1.5]">{authExpiry}</div>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="size-4 text-green-600" />
                              <div>
                                <div className="text-green-600 font-medium leading-[1.5]">연동 활성</div>
                                <div className="text-xs text-gray-500 leading-[1.5]">만료: {authExpiry}</div>
                              </div>
                            </div>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600 focus:text-red-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(channel.id);
                          }}
                          disabled={deletingId === channel.id}
                        >
                          {deletingId === channel.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : (
                            <AlertCircle className="mr-2 h-4 w-4" />
                          )}
                          채널 삭제
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-gray-600 text-sm leading-[1.5]">필터링된 댓글</span>
                    <span className="text-gray-900 font-bold text-lg leading-[1.5]">{filteredCount.toLocaleString()}개</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

// 2. 채널 상세 뷰 (수정됨)
function ChannelDetailView({ channelId, activeTab }) {
  const [channel, setChannel] = useState(null); 
  
  // 탭별 데이터를 저장할 State
  const [overviewData, setOverviewData] = useState(null);
  const [consultingData, setConsultingData] = useState(null);
  const [badCommentsData, setBadCommentsData] = useState(null);
  const [legalData, setLegalData] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true); 
  const [isHeaderLoading, setIsHeaderLoading] = useState(true); 

  // 채널 기본 정보(헤더) Fetching
  useEffect(() => {
    const fetchChannel = async () => {
      if (!channelId) return;
      setIsHeaderLoading(true);
      try {
        const response = await fetch(`http://localhost:8080/api/youtube/channels/${channelId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) throw new Error("채널 정보 로드 실패");
        const data = await response.json();
        setChannel(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsHeaderLoading(false);
      }
    };
    fetchChannel();
  }, [channelId]);

  // 'activeTab'이 바뀔 때마다 해당 탭의 데이터를 Fetching
  useEffect(() => {
    const fetchTabData = async () => {
      if (!channelId || !activeTab) return;
      
      setIsLoading(true);
      
      try {
        // Overview 탭: 채널별 비디오 목록 조회 + 채널 통계 조회
        if (activeTab === 'overview') {
          const videosResponse = await fetch(`http://localhost:8080/api/youtube/videos/channel/${channelId}`, {
            method: "GET",
            credentials: "include",
          });
          
          const statsResponse = await fetch(`http://localhost:8080/api/user/dashboard/channels/${channelId}/filtering-statistics`, {
            method: "GET",
            credentials: "include",
          });
          
          let formattedVideos = [];
          let channelStatistics = {}; 

          if (videosResponse.ok) {
            const videos = await videosResponse.json();
            formattedVideos = videos.map(video => ({
              id: video.id,
              title: video.title,
              thumbnail: video.thumbnailUrl,
              date: new Date(video.publishedAt).toLocaleDateString('ko-KR'),
              viewCount: video.viewCount,
              likeCount: video.likeCount,
              commentCount: video.commentCount,
              youtubeVideoId: video.youtubeVideoId,
            }));
          }

          if (statsResponse.ok) {
            channelStatistics = await statsResponse.json();
          }
            
          setOverviewData({
            videos: formattedVideos,
            stats: channelStatistics, 
            categories: channelStatistics.categoryDistribution || [], 
            monthlyData: [], 
          });

        } else if (activeTab === 'consulting') {
          setConsultingData({});
        } else if (activeTab === 'badcomments') {
          setBadCommentsData({});
        } else if (activeTab === 'legal') {
          // 📌 [중요] 여기서 channelId를 반드시 포함시켜야 챗봇이 채널 정보를 알 수 있습니다.
          setLegalData({ channelId: channelId });
        }
      } catch (err) {
        console.error("탭 데이터 로드 실패:", err);
        if (activeTab === 'overview') {
          setOverviewData({ videos: [], stats: {}, categories: [], monthlyData: [] });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTabData();
  }, [channelId, activeTab]);

  
  if (isHeaderLoading) {
    return (
      <div className="p-8">
        <Card className="mb-8">
          <CardContent className="pt-6 h-[158px] flex justify-center items-center">
            <Loader2 className="size-8 animate-spin text-gray-400" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!channel) return <div className="p-8 leading-[1.5]">채널 정보를 불러오지 못했습니다.</div>; 

  const renderTabContent = () => {
    if (isLoading) {
      return (
        <Card>
          <CardContent className="pt-6 h-[400px] flex justify-center items-center">
            <Loader2 className="size-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewTab data={overviewData} />;
      case 'consulting':
        return <ContentConsultingTab data={consultingData} />;
      case 'badcomments':
        return <BadCommentsTab data={badCommentsData} />;
      case 'legal':
        // 📌 LegalConsultingTab에 legalData와 channelId 전달
        return <LegalConsultingTab data={legalData} channelId={channel?.youtubeChannelId} />;
      default:
        return <OverviewTab data={overviewData} />;
    }
  };

  return (
    <div className="p-8">
      {/* 채널 헤더 */}
      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <img
                src={channel.thumbnailUrl}
                alt={channel.channelName}
                className="size-20 rounded-full object-cover ring-4 ring-white shadow-sm"
              />
              <div className="flex-1">
                <h1 className="text-3xl font-medium font-['Inter'] text-gray-900 mb-2 leading-[1.5]">{channel.channelName}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-black mb-3 leading-[1.5]">
                  <span>{channel.channelHandle}</span>
                  <span>•</span>
                  <span> 구독자 {(channel.subscriberCount || channel.subscriber_count || 0).toLocaleString()}명 </span>
                </div>
              </div>

            </div>
          </CardContent>
        </Card>
      </div>

      {renderTabContent()}
    </div>
  );
}

export default function DashboardPage() {
  
  const { 
    currentView, 
    selectedChannel, 
    activeTab, 
    handleChannelSelect 
  } = useContext(DashboardContext);
  
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchChannels = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/api/youtube/channels/my", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          setError("인증이 필요합니다. 다시 로그인해주세요.");
          return;
        }
        const errorText = await response.text();
        throw new Error(`서버 오류: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      setChannels(data || []);
    } catch (err) {
      setError(err.message || "채널 목록을 가져오는데 실패했습니다.");
    }
  }, []);

  const handleSyncChannels = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8080/api/youtube/channels/sync?syncVideos=true", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("인증이 필요합니다. 다시 로그인해주세요."); return;
        }
        throw new Error(`동기화 실패: ${response.status}`);
      }

      await response.json();
      await fetchChannels();
      alert("채널 동기화가 완료되었습니다.");
    } catch (err) {
      alert(err.message || "채널 동기화에 실패했습니다.");
    }
  }, [fetchChannels]); 

  const handleAddChannel = async () => {
    try {
      const authResponse = await fetch("http://localhost:8080/api/auth/me", {
        method: "GET",
        credentials: "include",
      });

      if (!authResponse.ok) {
        if (authResponse.status === 401) {
          alert("인증이 필요합니다. 다시 로그인해주세요."); return;
        }
        throw new Error("세션 확인 실패");
      }
      window.location.href = "http://localhost:8080/api/youtube/connect";
    } catch (err) {
      alert("채널 추가에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const handleDeleteChannel = async (channelId) => {
    if (!window.confirm("정말로 이 채널을 삭제하시겠습니까?")) {
      return;
    }
    try {
      const response = await fetch(`http://localhost:8080/api/youtube/channels/${channelId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        if (response.status === 401) {
          alert("인증이 필요합니다. 다시 로그인해주세요."); return;
        }
        if (response.status === 404) {
          alert("채널을 찾을 수 없습니다."); return;
        }
        throw new Error(`삭제 실패: ${response.status}`);
      }
      await fetchChannels();
      alert("채널이 삭제되었습니다.");
    } catch (err) {
      alert(err.message || "채널 삭제에 실패했습니다.");
    }
  };

  useEffect(() => {
    if (currentView === 'channels') {
      fetchChannels();
    }
  }, [currentView, fetchChannels]);

  if (currentView === 'detail' && selectedChannel) {
    return <ChannelDetailView channelId={selectedChannel} activeTab={activeTab} />;
  }

  return (
    <ChannelListView 
      handleChannelSelect={handleChannelSelect}
      channels={channels}
      onSyncChannels={handleSyncChannels}
      onDeleteChannel={handleDeleteChannel}
      onAddChannel={handleAddChannel}
    />
  );
}