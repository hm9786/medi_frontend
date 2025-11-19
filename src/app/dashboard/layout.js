"use client";
import { DashboardContext } from "@/context/DashboardContext";
// ‼️ [삭제] import { useContext } from "react"; 
import React from 'react';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/slices/authSlice";
import Link from "next/link";
import {
  Menu,
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
  Heart,     //  탭 아이콘
  Lightbulb, //  탭 아이콘
  Shield,    //  탭 아이콘
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
function Sidebar({ isSidebarExpanded, currentView, activeTab, handleBackToChannels, setActiveTab }) {
  
  const isActive = (view) => currentView === view;
  const isTabActive = (tab) => activeTab === tab;

  return (
    <aside 
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
                title={!isSidebarExpanded ? '전체 요약' : ''}
              >
                <BarChart3 className="size-5 flex-shrink-0" />
                {isSidebarExpanded && <span className="font-medium text-base leading-[1.5]">전체 요약</span>}
              </Button>

              <Button
                variant={isTabActive('mental') ? "secondary" : "ghost"}
                onClick={() => setActiveTab('mental')}
                className={`flex items-center w-full py-2.5 h-12 rounded-lg
                  ${isSidebarExpanded ? 'gap-3 justify-start px-3' : 'justify-center'}
                `}
                title={!isSidebarExpanded ? '멘탈 케어' : ''}
              >
                <Heart className="size-5 flex-shrink-0" />
                {isSidebarExpanded && <span className="font-medium text-base leading-[1.5]">멘탈 케어</span>}
              </Button>

              <Button
                variant={isTabActive('consulting') ? "secondary" : "ghost"}
                onClick={() => setActiveTab('consulting')}
                className={`flex items-center w-full py-2.5 h-12 rounded-lg
                  ${isSidebarExpanded ? 'gap-3 justify-start px-3' : 'justify-center'}
                `}
                title={!isSidebarExpanded ? '콘텐츠 컨설팅' : ''}
              >
                <Lightbulb className="size-5 flex-shrink-0" />
                {isSidebarExpanded && <span className="font-medium text-base leading-[1.5]">콘텐츠 컨설팅</span>}
              </Button>

              <Button
                variant={isTabActive('badcomments') ? "secondary" : "ghost"}
                onClick={() => setActiveTab('badcomments')}
                className={`flex items-center w-full py-2.5 h-12 rounded-lg
                  ${isSidebarExpanded ? 'gap-3 justify-start px-3' : 'justify-center'}
                `}
                title={!isSidebarExpanded ? '원본 악플보기' : ''}
              >
                <Shield className="size-5 flex-shrink-0" />
                {isSidebarExpanded && <span className="font-medium text-base leading-[1.5]">원본 악플보기</span>}
              </Button>
            </div>
            <Separator className="mx-2 my-4" />
          </>
        )}
        
        {/* 외부 링크 그룹 (사이드바 하단에 고정) */}
        <div className="mt-auto space-y-1 pt-6 border-t">
           <a
            href="https://www.youtube.com"
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
function Header({ onToggleSidebar, user }) {
  const router = useRouter();
  const dispatch = useDispatch();

  const handleLogout = async () => {
    try {
      const isGoogleUser = user?.provider === "GOOGLE";
      const logoutUrl = isGoogleUser 
        ? "http://localhost:8080/api/auth/oauth2/logout"
        : "http://localhost:8080/api/auth/logout";
      
      await fetch(logoutUrl, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("로그아웃 API 오류:", error);
    } finally {
      dispatch(logout());
      router.push("/");
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center flex-shrink-0 z-10">
      <div className="flex items-center justify-between w-full">
        {/* 왼쪽: 로고 및 메뉴 토글 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="size-10 rounded-full" // h-10 w-10 -> size-10
          >
            <Menu className="size-5 text-gray-700" />
          </Button>
          <Link
            href="/dashboard"
            className="text-black text-4xl font-bold font-['Comic_Neue'] leading-none flex items-center"
          >
            Medi
          </Link>
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
              <DropdownMenuItem>
                <CreditCard className="mr-3 h-4 w-4 text-gray-600" />
                <span className="leading-[1.5]">결제 및 멤버십</span>
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

  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentView, setCurrentView] = useState('channels');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  const handleBackToChannels = () => {
    setCurrentView('channels');
    setSelectedChannel(null);
  };

  const handleChannelSelect = (channelId) => {
    setSelectedChannel(channelId);
    setCurrentView('detail');
    setActiveTab('overview');
  };

  // pageProps -> contextValue로 이름 변경
  const contextValue = {
    currentView,
    selectedChannel,
    activeTab,
    handleChannelSelect,
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
          onToggleSidebar={() => setIsSidebarExpanded(!isSidebarExpanded)}
          user={user}
        />
        
        <div className="flex flex-1 overflow-hidden">
          <Sidebar 
            isSidebarExpanded={isSidebarExpanded}
            currentView={currentView}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            handleBackToChannels={handleBackToChannels}
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