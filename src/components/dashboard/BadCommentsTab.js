"use client";

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useState, useMemo } from 'react'; // ‼️ useMemo 추가
import { 
  AlertTriangle, 
  Search, 
  Eye, 
  EyeOff, 
  Trash2, 
  Flag, 
  Clock,
  MessageSquare,
  Shield,
  CheckCircle2,
  MoreVertical
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

// ‼️ [수정됨] 하드코딩된 샘플 데이터 모두 제거

const categoryLabels = {
  excessive: { label: '과도함', color: 'bg-red-100 text-red-700' },
  sexual: { label: '성적 콘텐츠', color: 'bg-pink-100 text-pink-700' },
  profanity: { label: '욕설', color: 'bg-orange-100 text-orange-700' },
  spam: { label: '스팸', color: 'bg-purple-100 text-purple-700' },
  important: { label: '중요 발언', color: 'bg-yellow-100 text-yellow-700' }
};

// data prop으로 채널의 '악성 댓글' 데이터를 받습니다.
export function BadCommentsTab({ data }) {
  // ‼️ [수정됨] UI 상태(필터, 동의 여부)는 유지합니다.
  const [hasAgreed, setHasAgreed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [reviewFilter, setReviewFilter] = useState('all');
  const [blurComments, setBlurComments] = useState(true);

  // ‼️ [수정됨] Props로 받은 데이터 사용
  const badComments = data?.comments || [];
  const commentTrendData = data?.trendData || [];
  const categoryDistribution = data?.categoryDistribution || [];
  const stats = data?.stats || {};

  // ‼️ [수정됨] 필터링 로직을 useMemo로 감싸 성능 최적화
  const filteredComments = useMemo(() => {
    return badComments.filter(comment => {
      const matchesSearch = comment.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           comment.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           comment.videoTitle.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || comment.category === categoryFilter;
      const matchesReview = reviewFilter === 'all' || 
                           (reviewFilter === 'reviewed' && comment.isReviewed) ||
                           (reviewFilter === 'unreviewed' && !comment.isReviewed);
      return matchesSearch && matchesCategory && matchesReview;
    });
  }, [badComments, searchQuery, categoryFilter, reviewFilter]);

  const unreviewedCount = badComments.filter(c => !c.isReviewed).length;

  // 주의 메시지 화면 (수정 없음)
  if (!hasAgreed) {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <Card className="max-w-2xl w-full border-2 border-amber-300 bg-amber-50">
          <CardContent className="pt-12 pb-12 px-8">
            <div className="text-center mb-8">
              <div className="size-20 rounded-full bg-amber-600 flex items-center justify-center mx-auto mb-6">
                <AlertTriangle className="size-10 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">⚠️ 주의: 원본 악플 내용 포함</h2>
              {/* ... (이하 동일) ... */}
            </div>
            <div className="flex flex-col gap-3">
              <Button
                className="w-full text-white py-6"
                onClick={() => setHasAgreed(true)}
              >
                내용을 확인했으며, 계속 진행합니다
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

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

  // 실제 탭 내용
  return (
    <div className="space-y-6">
      {/* 경고 배너 (수정 없음) */}
      <Card className="border-2 border-amber-200 bg-amber-50">
        {/* ... (이하 동일) ... */}
      </Card>

      {/* 댓글 추이 */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">댓글 추이</CardTitle>
          <p className="text-gray-500">최근 7일간 전체 채널 댓글 현황</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={commentTrendData}>
              {/* ... (이하 동일) ... */}
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 유해 카테고리 분포 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">유해 카테고리 분포</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie data={categoryDistribution} /* ... */ >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            {/* ... (이하 동일) ... */}
          </CardContent>
        </Card>

        {/* 악플 TOP 키워드 (데이터가 없으면 표시 안 함) */}
        {data.topKeywords && data.topKeywords.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-bold">악플 TOP 키워드</CardTitle>
            </CardHeader>
            <CardContent>
              {/* ... (이하 동일) ... */}
            </CardContent>
          </Card>
        )}
      </div>

      {/* 통계 요약 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-gray-600 mb-2">차단된 댓글</p>
            <p className="text-gray-900 text-3xl font-bold">{filteredComments.length}</p>
          </CardContent>
        </Card>
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <p className="text-orange-900 font-medium mb-2">확인 필요</p>
            <p className="text-orange-900 text-3xl font-bold">{unreviewedCount}</p>
          </CardContent>
        </Card>
        {/* ... (다른 통계 카드) ... */}
      </div>

      {/* 필터 및 검색 (수정 없음) */}
      <Card>
        {/* ... (이하 동일) ... */}
      </Card>

      {/* 댓글 목록 */}
      <div className="space-y-3">
        {filteredComments.map((comment) => (
          <Card key={comment.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              {/* ... (이하 동일) ... */}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 빈 상태 */}
      {filteredComments.length === 0 && (
        <Card>
          {/* ... (이하 동일) ... */}
        </Card>
      )}
    </div>
  );
}