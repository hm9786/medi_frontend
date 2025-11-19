"use client";

// ‼️ [수정됨] useContext, useEffect, useCallback 등을 가져옵니다.
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
  Clock, //  
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

// 탭 컴포넌트들을 가져옵니다.
// (이 파일들은 front/src/components/dashboard/ 폴더에 있어야 합니다)
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { MentalCareTab } from "@/components/dashboard/MentalCareTab";
import { ContentConsultingTab } from "@/components/dashboard/ContentConsultingTab";
import { BadCommentsTab } from "@/components/dashboard/BadCommentsTab";

// Context를 가져옵니다.
import { DashboardContext } from "@/context/DashboardContext";

// 1. 채널 목록 뷰 (currentView === 'channels')
// (handleChannelSelect를 props로 받는 것은 그대로 둡니다. DashboardPage에서 전달할 것이기 때문입니다.)
function ChannelListView({ handleChannelSelect, channels, onSyncChannels, onDeleteChannel, onAddChannel }) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

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
    expiryDate.setDate(expiryDate.getDate() + 60); // 60일 후 만료 가정
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
            <h2 className="text-2xl font-medium text-black mb-1 leading-[1.5]">내 채널 관리</h2>
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
            
            return (
              <Card
                key={channel.id}
                className="hover:shadow-lg transition-shadow relative cursor-pointer"
                onClick={() => handleChannelSelect(channel.id)} // ‼️ Context의 함수 사용
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between mb-4">
                    {channel.thumbnailUrl ? (
                      <Image
                        src={channel.thumbnailUrl}
                        alt={channel.channelName || '채널'}
                        width={48}
                        height={48}
                        className="size-12 rounded-xl object-cover flex-shrink-0"
                      />
                    ) : (
                      <div 
                        className="size-12 rounded-xl flex items-center justify-center flex-shrink-0 bg-red-600"
                      >
                        <Youtube className="size-6 text-white" />
                      </div>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="size-8 -mt-1 -mr-2">
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
                  
                  <h3 className="text-lg font-medium text-gray-900 mb-1 truncate leading-[1.5]">{channel.channelName || '채널명 없음'}</h3>
                  <p className="text-gray-500 mb-4 truncate leading-[1.5]">{channel.channelHandle || channel.youtubeChannelId || '핸들 없음'}</p>
                  
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-gray-600 text-sm leading-[1.5]">필터링된 댓글</span>
                    <span className="text-gray-900 font-bold text-lg leading-[1.5]">{channel.filteredComments?.toLocaleString() || 0}개</span>
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

// 2. 채널 상세 뷰
function ChannelDetailView({ channelId, activeTab }) {
  const [channel, setChannel] = useState(null); // 채널 기본 정보
  
  // 탭별 데이터를 저장할 State
  const [overviewData, setOverviewData] = useState(null);
  const [mentalCareData, setMentalCareData] = useState(null);
  const [consultingData, setConsultingData] = useState(null);
  const [badCommentsData, setBadCommentsData] = useState(null);
  
  const [isLoading, setIsLoading] = useState(true); // 탭 컨텐츠 로딩
  const [isHeaderLoading, setIsHeaderLoading] = useState(true); // 채널 헤더 로딩

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
        // Overview 탭: 채널별 비디오 목록 조회
        if (activeTab === 'overview') {
          const videosResponse = await fetch(`http://localhost:8080/api/youtube/videos/channel/${channelId}`, {
            method: "GET",
            credentials: "include",
          });
          
          if (videosResponse.ok) {
            const videos = await videosResponse.json();
            // 비디오 데이터를 OverviewTab 형식에 맞게 변환
            const formattedVideos = videos.map(video => ({
              id: video.id,
              title: video.title,
              thumbnail: video.thumbnailUrl,
              date: new Date(video.publishedAt).toLocaleDateString('ko-KR'),
              viewCount: video.viewCount,
              likeCount: video.likeCount,
              commentCount: video.commentCount,
              youtubeVideoId: video.youtubeVideoId,
            }));
            
            setOverviewData({
              videos: formattedVideos,
              categories: [], // 추후 필터링된 댓글 카테고리 API가 추가되면 여기에 추가
              monthlyData: [], // 추후 월별 데이터 API가 추가되면 여기에 추가
            });
          } else {
            console.error("비디오 목록 로드 실패:", videosResponse.status);
            setOverviewData({ videos: [], categories: [], monthlyData: [] });
          }
        } else if (activeTab === 'mental') {
          // 멘탈 케어 탭: 추후 API가 추가되면 여기에 구현
          setMentalCareData({});
        } else if (activeTab === 'consulting') {
          // 콘텐츠 컨설팅 탭: 추후 API가 추가되면 여기에 구현
          setConsultingData({});
        } else if (activeTab === 'badcomments') {
          // 원본 악플보기 탭: 추후 API가 추가되면 여기에 구현
          setBadCommentsData({});
        }
      } catch (err) {
        console.error("탭 데이터 로드 실패:", err);
        // 에러 발생 시 빈 데이터 설정
        if (activeTab === 'overview') {
          setOverviewData({ videos: [], categories: [], monthlyData: [] });
        } else if (activeTab === 'mental') {
          setMentalCareData({});
        } else if (activeTab === 'consulting') {
          setConsultingData({});
        } else if (activeTab === 'badcomments') {
          setBadCommentsData({});
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchTabData();
  }, [channelId, activeTab]); // channelId 또는 activeTab이 변경되면 데이터를 다시 가져옵니다.

  
  // 채널 헤더 로딩 중 UI
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

  if (!channel) return <div className="p-8 leading-[1.5]">채널 정보를 불러오지 못했습니다.</div>; // 채널 로드 실패

  // 탭별로 로딩/데이터 상태를 관리하여 렌더링
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
      case 'mental':
        return <MentalCareTab data={mentalCareData} />;
      case 'consulting':
        return <ContentConsultingTab data={consultingData} />;
      case 'badcomments':
        return <BadCommentsTab data={badCommentsData} />;
      default:
        return <OverviewTab data={overviewData} />;
    }
  };

  // (날짜 계산 로직 - layout.js의 것과 동일)
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
      {/* 채널 헤더 */}
      <div className="mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Image
                src={channel.thumbnailUrl}
                alt={channel.channelName}
                width={80}
                height={80}
                className="size-20 rounded-full object-cover ring-4 ring-white shadow-sm"
              />
              <div className="flex-1">
                <h1 className="text-2xl font-medium text-gray-900 mb-2 leading-[1.5]">{channel.channelName}</h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600 mb-3 leading-[1.5]">
                  <span>{channel.channelHandle}</span>
                  <span>•</span>
                  <span>{channel.subscriberCount?.toLocaleString() || 0} 구독자</span>
                  <span>•</span>
                  <Badge variant="outline" className="text-red-600 border-red-200 bg-red-50">
                    <Youtube className="size-3 mr-1" />
                    YouTube
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">채널 설정</Button>
                {getChannelStatus(channel.lastSyncedAt) === 'warning' && (
                  <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50">
                    <Clock className="size-3 mr-1" />
                    재연동 필요 ({getAuthExpiry(channel.lastSyncedAt)})
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ⬇️ [수정됨] 탭 컨텐츠 렌더링 함수 호출 */}
      {renderTabContent()}
    </div>
  );
}


// 메인 대시보드 페이지
// props를 받지 않고, Context에서 직접 가져옵니다.
export default function DashboardPage() {
  
  // layout.js의 Provider로부터 상태와 함수를 가져옵니다.
  const { 
    currentView, 
    selectedChannel, 
    activeTab, 
    handleChannelSelect 
  } = useContext(DashboardContext);
  
  // `view` 변수 대신 `currentView`를 직접 사용합니다.
  
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 채널 목록 가져오기 (DB에서 조회)
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

  // 채널 동기화 (수동만)
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

      const data = await response.json();
      setChannels(data || []);
      alert("채널 동기화가 완료되었습니다.");
    } catch (err) {
      alert(err.message || "채널 동기화에 실패했습니다.");
    }
  }, []); // fetchChannels 의존성 제거 (동기화 후 반환값 사용)

  // 채널 추가 (Google OAuth 연결)
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

  // 채널 삭제
  const handleDeleteChannel = async (channelId) => {
    // window.confirm 사용
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

  // currentView가 'channels'일 때만 채널 목록을 가져옵니다.
  useEffect(() => {
    if (currentView === 'channels') {
      fetchChannels();
    }
  }, [currentView, fetchChannels]);

  // Context에서 가져온 값으로 뷰를 결정합니다.
  if (currentView === 'detail' && selectedChannel) {
    return <ChannelDetailView channelId={selectedChannel} activeTab={activeTab} />;
  }

  // 기본값: 채널 목록
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