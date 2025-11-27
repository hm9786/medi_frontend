  "use client";
  import { DashboardContext } from "@/context/DashboardContext";
  import { apiUrl } from "@/lib/config";
  // ‼️ [삭제] import { useContext } from "react"; 
  import React from 'react';
  import { useState, useEffect, useRef } from "react";
  import { useRouter } from "next/navigation";
  import { useSelector, useDispatch } from "react-redux";
  import { logout } from "@/lib/slices/authSlice";
  import Link from "next/link";
  import {
    Home,
    User,
    Youtube,
    Video,
    LogOut,
    Settings,
    CreditCard,
    UserCircle2,
    MessageSquare,
    Moon,
    ChevronRight,
    AlertCircle,
    BarChart3, //  탭 아이콘
    Lightbulb, //  탭 아이콘
    Shield,    //  탭 아이콘
    Scale,     //  탭 아이콘 (법률 상담 챗봇봇)
    ExternalLink //  외부 링크 아이콘
  } from "lucide-react";
  import { Button } from "@/components/ui/button";
  import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
  } from "@/components/ui/dropdown-menu";
  import { Avatar, AvatarFallback } from "@/components/ui/avatar";
  import { Separator } from "@/components/ui/separator"; // ‼️ [추가]

  // 1. 사이드바 컴포넌트
  // activeTab, setActiveTab props 추가
  function Sidebar({
    isSidebarExpanded,
    currentView,
    activeTab,
    handleBackToChannels,
    setActiveTab,
    selectedChannelHandle,
    onMouseEnterSidebar,
    onMouseLeaveSidebar,
  }) {
    const youtubeChannelUrl = selectedChannelHandle
      ? `https://www.youtube.com/${selectedChannelHandle.startsWith("@") ? selectedChannelHandle : `@${selectedChannelHandle}`}`
      : "https://www.youtube.com";
    
    const isActive = (view) => currentView === view;
    const isTabActive = (tab) => activeTab === tab;

    return (
      <aside 
        onMouseEnter={onMouseEnterSidebar}
        onMouseLeave={onMouseLeaveSidebar}
        className={`
          bg-white border-r border-gray-200 flex flex-col transition-all duration-300 overflow-y-auto
          ${isSidebarExpanded ? 'w-64' : 'w-20'}
        `}
      >
        {/* h-12, text-base, font-semibold 등 디자인에 맞게 스타일 수정 */}
        <nav className="flex-1 p-3 space-y-1">
          {/* 홈 버튼 */}
          <div className="space-y-1">
            <Button
              variant={isActive('channels') ? "secondary" : "ghost"}
              onClick={handleBackToChannels}
              className={`flex items-center w-full py-2.5 h-12 rounded-lg
                ${isSidebarExpanded ? 'gap-3 justify-start px-3' : 'justify-center'}
              `}
              title={!isSidebarExpanded ? '홈' : ''}
            >
              <Home className="size-5 flex-shrink-0" />
              {isSidebarExpanded && <span className="font-medium text-base leading-[1.5]">홈</span>}
            </Button>
          </div>

          {/* 채널 상세 메뉴 (채널 선택 시에만 표시) */}
          {currentView === 'detail' && (
            <>
              <Separator className="mx-2 my-4" />
              <div className="space-y-1">
                {isSidebarExpanded && (
                  <div className="px-3 py-2 text-gray-500 text-xs uppercase tracking-wider font-medium leading-[1.5]">
                    대시보드
                  </div>
                )}
                
                <Button
                  variant={isTabActive('overview') ? "secondary" : "ghost"}
                  onClick={() => setActiveTab('overview')}
                  className={`flex items-center w-full py-2.5 h-12 rounded-lg
                    ${isSidebarExpanded ? 'gap-3 justify-start px-3' : 'justify-center'}
                  `}
                  title={!isSidebarExpanded ? '채널 대시보드' : ''}
                >
                  <BarChart3 className="size-5 flex-shrink-0" />
                  {isSidebarExpanded && <span className="font-medium text-base leading-[1.5]">채널 대시보드</span>}
                </Button>

               

                <Button
                  variant={isTabActive('badcomments') ? "secondary" : "ghost"}
                  onClick={() => setActiveTab('badcomments')}
                  className={`flex items-center w-full py-2.5 h-12 rounded-lg
                    ${isSidebarExpanded ? 'gap-3 justify-start px-3' : 'justify-center'}
                  `}
                  title={!isSidebarExpanded ? '악플 보고서' : ''}
                >
                  <Shield className="size-5 flex-shrink-0" />
                  {isSidebarExpanded && <span className="font-medium text-base leading-[1.5]">악플 보고서</span>}
                </Button>

                <Button
                  variant={isTabActive('legal') ? "secondary" : "ghost"}
                  onClick={() => setActiveTab('legal')}
                  className={`flex items-center w-full py-2.5 h-12 rounded-lg
                    ${isSidebarExpanded ? 'gap-3 justify-start px-3' : 'justify-center'}
                  `}
                  title={!isSidebarExpanded ? '법률 상담 챗봇봇' : ''}
                >
                  <Scale className="size-5 flex-shrink-0" />
                  {isSidebarExpanded && <span className="font-medium text-base leading-[1.5]">법률 상담 챗봇</span>}
                </Button>
              </div>
            </>
          )}
          
          {/* 외부 링크 그룹 (사이드바 하단에 고정) */}
          <div className="mt-auto space-y-1 pt-6 border-t">
            <a
              href={youtubeChannelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center w-full px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors
                ${isSidebarExpanded ? 'gap-3 justify-start' : 'justify-center'}
              `}
              title={!isSidebarExpanded ? 'YouTube 바로가기' : ''}
            >
              <Youtube className="size-5 flex-shrink-0" />
              {isSidebarExpanded && (
                <span className="flex items-center gap-2 leading-[1.5]">
                  YouTube
                  <ExternalLink className="size-3 text-gray-400" />
                </span>
              )}
            </a>

            <a
              href="https://studio.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`
                flex items-center w-full px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors
                ${isSidebarExpanded ? 'gap-3 justify-start' : 'justify-center'}
              `}
              title={!isSidebarExpanded ? 'YouTube Studio' : ''}
            >
              <Video className="size-5 flex-shrink-0" />
              {isSidebarExpanded && (
                <span className="flex items-center gap-2 leading-[1.5]">
                  YouTube Studio
                  <ExternalLink className="size-3 text-gray-400" />
                </span>
              )}
            </a>
          </div>
        </nav>
      </aside>
    );
  }

  // 2. 헤더 컴포넌트 (수정된 폰트 적용)
  function Header({ user, onBackToChannels }) {
    const router = useRouter();
    const dispatch = useDispatch();

    const clearGoogleSession = () => {
      try {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        iframe.src = "https://accounts.google.com/Logout";
        document.body.appendChild(iframe);
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 2000);
      } catch (error) {
        console.info("구글 세션 초기화 중 오류가 발생했지만 무시합니다.");
      }
    };

    const handleLogout = async () => {
      try {
        const isGoogleUser = user?.provider === "GOOGLE";
        const googleLogoutUrl = apiUrl("api/auth/oauth2/logout");
        const defaultLogoutUrl = apiUrl("api/auth/logout");

        if (isGoogleUser) {
          try {
            const oauthResponse = await fetch(googleLogoutUrl, {
              method: "POST",
              credentials: "include",
            });
            if (!oauthResponse.ok) {
              console.warn(`구글 로그아웃 API 오류: ${oauthResponse.status}`);
            }
            clearGoogleSession();
          } catch (error) {
            console.info("구글 로그아웃 요청 중 오류가 발생했지만 무시합니다.");
          }
        }

        const response = await fetch(defaultLogoutUrl, {
          method: "POST",
          credentials: "include",
        });
        
        if (!response.ok) {
          console.warn(`로그아웃 API 오류: ${response.status}`);
        }
      } catch (error) {
        console.info("로그아웃 중 오류가 발생했지만 무시합니다.");
      } finally {
        dispatch(logout());
        router.push("/login");
      }
    };

    return (
      <header className="w-full bg-white border-b border-slate-200 flex items-center flex-shrink-0 z-10">
        <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          {/* 왼쪽: 로고 */}
          <div className="flex items-center">
            <button
              onClick={onBackToChannels}
              className="text-lg sm:text-xl font-bold text-black transition-colors hover:opacity-80 cursor-pointer"
            >
              MEDI
            </button>
          </div>
          
          {/* 우측: 사용자 프로필 */}
          <div className="flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="size-10 rounded-full">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="size-4" />
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {/* 사용자 정보 */}
                <div className="flex items-center gap-3 p-3 border-b">
                  <Avatar className="size-10">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <User className="size-5" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-gray-900 truncate font-medium leading-[1.5]">{user?.name || '사용자'}</div>
                    <div className="text-gray-500 truncate text-sm leading-[1.5]">{user?.email || '이메일 없음'}</div>
                  </div>
                </div>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <UserCircle2 className="mr-3 h-4 w-4 text-gray-600" />
                    <span className="leading-[1.5]">내 채널</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-3 h-4 w-4 text-gray-600" />
                  <span className="leading-[1.5]">로그아웃</span> 
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
    );
  }

  // 3. 대시보드 전체 레이아웃
  export default function DashboardLayout({ children }) {
    const router = useRouter();
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/");
      }
    }, [isAuthenticated, router]);

    const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
    const [currentView, setCurrentView] = useState('channels');
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [selectedChannelHandle, setSelectedChannelHandle] = useState(null);
    const [activeTab, setActiveTab] = useState('overview');

    const handleBackToChannels = () => {
      setCurrentView('channels');
      setSelectedChannel(null);
      setSelectedChannelHandle(null);
    };

    const handleChannelSelect = (channelId, channelHandle) => {
      setSelectedChannel(channelId);
      setSelectedChannelHandle(channelHandle || null);
      setCurrentView('detail');
      setActiveTab('overview');
    };

    // pageProps -> contextValue로 이름 변경
    const collapseTimerRef = useRef(null);
    const isPointerInsideSidebarRef = useRef(false);

    const clearCollapseTimer = () => {
      if (collapseTimerRef.current) {
        clearTimeout(collapseTimerRef.current);
        collapseTimerRef.current = null;
      }
    };

    const scheduleSidebarCollapse = () => {
    clearCollapseTimer();
    setIsSidebarExpanded(false);
  };

    const handleSidebarMouseEnter = () => {
      isPointerInsideSidebarRef.current = true;
      clearCollapseTimer();
      if (!isSidebarExpanded) {
        setIsSidebarExpanded(true);
      }
    };

    const handleSidebarMouseLeave = () => {
      isPointerInsideSidebarRef.current = false;
      scheduleSidebarCollapse();
    };

    const handleMouseMoveNearSidebar = (event) => {
      if (event.clientX <= 60) {
        clearCollapseTimer();
        if (!isSidebarExpanded) {
          setIsSidebarExpanded(true);
        }
      } else if (!isPointerInsideSidebarRef.current && isSidebarExpanded) {
        scheduleSidebarCollapse();
      }
    };

    useEffect(() => {
      return () => {
        clearCollapseTimer();
      };
    }, []);

  const contextValue = {
    currentView,
    selectedChannel,
    activeTab,
    handleChannelSelect,
    selectedChannelHandle,
    setActiveTab, 
    handleBackToChannels //  handleBackToChannels도 Context에 포함
  };

  if (!isAuthenticated) {
    return null;
  }

    return (
      //  value prop에 정의된 contextValue 객체를 전달
      <DashboardContext.Provider value={contextValue}>
        <div className="flex flex-col h-screen bg-gray-50">
          <Header 
            user={user}
            onBackToChannels={handleBackToChannels}
          />
          
          <div
            className="flex flex-1 overflow-hidden"
            onMouseMove={handleMouseMoveNearSidebar}
          >
            <Sidebar 
              isSidebarExpanded={isSidebarExpanded}
              currentView={currentView}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              handleBackToChannels={handleBackToChannels}
              selectedChannelHandle={selectedChannelHandle}
              onMouseEnterSidebar={handleSidebarMouseEnter}
              onMouseLeaveSidebar={handleSidebarMouseLeave}
            />
            
            <main className="flex-1 overflow-auto">
              {/* React.cloneElement 제거. 자식(page.js)이 Context에서 값을 가져갑니다. */}
              {children}
            </main>
          </div>
        </div>
      </DashboardContext.Provider>
    );
  }