"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * 기존 "원본 악플 보기" 탭의 콘텐츠를 전부 제거하고
 * 임시 안내 문구만 노출하도록 단순화했습니다.
 */
export function BadCommentsTab() {
  return (
    <Card className="border-dashed border-gray-200">
      <CardHeader>
        <CardTitle className="text-xl font-semibold">악플 보고서 보기</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-gray-600 leading-relaxed">
        악플 보고서 기능이 곧 새롭게 제공될 예정입니다. 준비되는 대로
        최신 리포트를 확인하실 수 있도록 안내드릴게요.
      </CardContent>
    </Card>
  );
}