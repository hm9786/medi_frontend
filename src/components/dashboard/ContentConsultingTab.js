"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, TrendingUp, Users, Clock, Target, Sparkles, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

// ‼️ [수정됨] 하드코딩된 샘플 데이터 모두 제거

// data prop으로 채널의 '콘텐츠 컨설팅' 데이터를 받습니다.
export function ContentConsultingTab({ data }) {

  // ‼️ [수정됨] Props로 받은 데이터 사용 (없을 경우 빈 배열)
  const insights = data?.insights || [];
  const contentIdeas = data?.contentIdeas || [];
  const performance = data?.performance || [];

  // ‼️ [수정됨] 데이터가 로딩 중이거나 없을 때의 UI
  if (!data) {
    return (
      <Card>
        <CardContent className="pt-6 text-center text-gray-500">
          데이터를 불러오는 중입니다...
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* AI 추천 헤더 */}
      <Card className="border-2 border-medi-primary-light bg-gradient-to-br from-medi-primary-lighter to-white">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, hsl(var(--primary)) 0%, #9333EA 100%)' }}
            >
              <Sparkles className="w-7 h-7 text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">AI 콘텐츠 컨설팅</h2>
              <p className="text-gray-600">
                데이터 기반 인사이트로 더 나은 콘텐츠를 만들어보세요
              </p>
            </div>
            <Button className="font-semibold">
              맞춤 리포트 생성
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* 핵심 인사이트 */}
      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">이번 주 핵심 인사이트</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.length === 0 ? (
            <p className="text-gray-500 text-sm">인사이트가 없습니다.</p>
          ) : (
            insights.map((insight, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div 
                      className="w-12 h-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${insight.color}1A` }}
                    >
                      {/* ‼️ [수정됨] 아이콘을 동적으로 렌더링하기 위해 헬퍼 사용 */}
                      <InsightIcon iconName={insight.icon} className="w-6 h-6" style={{ color: insight.color }} />
                    </div>
                    {insight.priority === 'high' && (
                      <Badge className="bg-red-100 text-red-700">중요</Badge>
                    )}
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">{insight.title}</h4>
                  <p className="text-gray-600 mb-4">{insight.description}</p>
                  <Button variant="link" className="p-0 h-auto font-semibold" style={{ color: insight.color }}>
                    {insight.actionLabel} <ArrowRight className="w-4 h-4 ml-1" />
                  </Button>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* 콘텐츠 아이디어 제안 */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-1">AI 추천 콘텐츠 아이디어</h3>
            <p className="text-gray-500">당신의 채널에 최적화된 콘텐츠 제안</p>
          </div>
          <Button variant="outline">
            <Lightbulb className="w-4 h-4 mr-2" />
            더 많은 아이디어
          </Button>
        </div>
        <div className="space-y-4">
          {contentIdeas.length === 0 ? (
            <p className="text-gray-500 text-sm">추천 아이디어가 없습니다.</p>
          ) : (
            contentIdeas.map((idea, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  {/* ... (이하 동일) ... */}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
      
      {/* ... (성과 분석 카드 - 생략) ... */}

    </div>
  );
}

// ‼️ [추가됨] 아이콘 이름을 문자열로 받아 렌더링하는 헬퍼
const InsightIcon = ({ iconName, ...props }) => {
  switch (iconName) {
    case 'TrendingUp': return <TrendingUp {...props} />;
    case 'Users': return <Users {...props} />;
    case 'Clock': return <Clock {...props} />;
    case 'Target': return <Target {...props} />;
    default: return <Lightbulb {...props} />;
  }
};