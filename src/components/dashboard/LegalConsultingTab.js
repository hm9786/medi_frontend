"use client";

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, Scale, Loader2, AlertCircle, Bot, User } from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { apiUrl } from '@/lib/config';

// ScrollArea 대신 기본 div 스크롤을 사용하기 위해 import 제거
// import { ScrollArea } from '@/components/ui/scroll-area';

export function LegalConsultingTab({ data, channelId }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      content: '안녕하세요! 유튜브 법률 상담 AI입니다. \n악플 신고나 법적 대응에 대해 궁금한 점을 물어보세요.\n(예: "이 댓글 모욕죄 성립될까?", "명예훼손 판례 찾아줘")',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // 메시지가 추가될 때마다 스크롤 하단으로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    if (!channelId) {
      const errorMessage = {
        id: Date.now(),
        type: 'bot',
        content: '채널 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      return;
    }

    // 1. 사용자 메시지 화면에 즉시 추가
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      // 2. 대화 히스토리 구성 (백엔드 DTO 형식에 맞춤)
      const conversationHistory = messages
        .filter(msg => msg.id !== 1)
        .map(msg => ({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        }));

      // 3. 백엔드 API 요청
      const response = await fetch(apiUrl('api/chatbot/chat'), {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          // ✅ 백엔드 DTO(@JsonProperty)와 일치하도록 snake_case 사용
          channel_id: String(channelId),
          message: userMessage.content,
          conversation_history: conversationHistory
        }),
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("로그인이 필요합니다.");
        if (response.status === 500) throw new Error("챗봇 서버 연결 실패");
        throw new Error(`서버 오류: ${response.status}`);
      }

      const resData = await response.json();

      if (!resData.success) {
        throw new Error(resData.response || "AI 응답 실패");
      }

      // 4. 봇 응답 추가
      const botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        content: resData.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);

    } catch (error) {
      console.error('법률 상담 오류:', error);
      
      let errorMsg = '죄송합니다. 잠시 후 다시 시도해주세요.';
      if (error.message === "로그인이 필요합니다.") {
        errorMsg = "로그인 세션이 만료되었습니다. 다시 로그인해주세요.";
      } else if (error.message.includes("Connection refused") || error.message.includes("서버 오류: 500")) {
        errorMsg = "챗봇 서버가 실행되지 않았습니다. 관리자에게 문의해주세요.";
      }

      const errorMessage = {
        id: Date.now() + 2,
        type: 'bot',
        content: errorMsg,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="space-y-6 h-[calc(100vh-220px)] min-h-[600px]">
      <Card className="h-full flex flex-col border-gray-200 shadow-sm">
        <CardHeader className="border-b pb-4 bg-white rounded-t-xl flex-shrink-0">
          <div className="flex items-center gap-2">
            <Scale className="size-6 text-blue-600" />
            <div>
              <CardTitle className="text-lg">법률 AI 상담소</CardTitle>
              <CardDescription className="text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3 text-orange-500" />
                AI 답변은 법적 효력이 없으며 참고용으로만 활용하세요.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        {/* ✅ 수정됨: flex-1 overflow-hidden으로 전체 영역을 잡고 */}
        <CardContent className="flex-1 p-0 flex flex-col overflow-hidden bg-slate-50">
          
          {/* ✅ 수정됨: ScrollArea 대신 기본 div에 overflow-y-auto 적용하여 확실한 스크롤 보장 */}
          <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.type === 'bot' && (
                    <Avatar className="w-8 h-8 border bg-white shadow-sm flex-shrink-0">
                      <AvatarFallback className="bg-blue-50 text-blue-600">
                        <Bot size={16} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                  
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap shadow-sm ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white rounded-tr-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-tl-none'
                    }`}
                  >
                    {message.content}
                    <p className={`text-[10px] mt-1 text-right ${
                      message.type === 'user' ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {message.timestamp.toLocaleTimeString('ko-KR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>

                  {message.type === 'user' && (
                    <Avatar className="w-8 h-8 border bg-white shadow-sm flex-shrink-0">
                      <AvatarFallback className="bg-gray-100 text-gray-600">
                        <User size={16} />
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="w-8 h-8 border bg-white shadow-sm flex-shrink-0">
                    <AvatarFallback className="bg-blue-50 text-blue-600">
                      <Bot size={16} />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                    <span className="text-xs text-gray-500">법률 데이터를 분석 중입니다...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="궁금한 내용을 입력하세요..."
                className="flex-1 focus-visible:ring-blue-600"
                disabled={isLoading}
              />
              <Button
                onClick={handleSend}
                disabled={!inputValue.trim() || isLoading}
                className="shrink-0 bg-blue-600 hover:bg-blue-700 text-white w-12"
              >
                {isLoading ? <Loader2 className="size-5 animate-spin" /> : <Send className="size-5" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}