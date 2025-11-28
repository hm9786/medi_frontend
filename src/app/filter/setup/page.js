"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, AlertTriangle, Shield, Ban, UserX, Eye, Heart, MessageSquare, XCircle, Loader2, Bell, ChevronLeft } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiUrl } from "@/lib/config";

// 카테고리 정보 (공통)
const CATEGORIES = [
  {
    id: "profanity",
    name: "욕설·비속어",
    description: "욕설이나 비속어가 포함된 댓글을 필터링합니다",
    icon: Ban,
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  {
    id: "hate_speech",
    name: "혐오·차별 발언",
    description: "혐오나 차별적 표현이 포함된 댓글을 필터링합니다",
    icon: AlertTriangle,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    id: "personal_attack",
    name: "인신공격·모욕",
    description: "개인을 직접 공격하거나 모욕하는 댓글을 필터링합니다",
    icon: UserX,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    id: "appearance",
    name: "외모·신체 비하",
    description: "외모나 신체를 비하하는 댓글을 필터링합니다",
    icon: Eye,
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  },
  {
    id: "sexual",
    name: "성적 발언·희롱",
    description: "성적인 내용이나 희롱이 포함된 댓글을 필터링합니다",
    icon: Heart,
    color: "text-rose-600",
    bgColor: "bg-rose-50"
  },
  {
    id: "spam",
    name: "스팸·광고·도배",
    description: "스팸, 광고, 도배성 댓글을 필터링합니다",
    icon: MessageSquare,
    color: "text-gray-600",
    bgColor: "bg-gray-50"
  }
];

export default function FilterSetupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const step = searchParams.get("step") || "1";
  const channelId = searchParams.get("channelId");
  const categoriesParam = searchParams.get("categories");
  const descriptionParam = searchParams.get("description");
  const dislikeExamplesParam = searchParams.get("dislikeExamples");
  const allowExamplesParam = searchParams.get("allowExamples");
  
  // Step 1 상태
  const [selectedCategories, setSelectedCategories] = useState(
    categoriesParam ? categoriesParam.split(",") : []
  );
  
  // Step 2 상태
  const [userFilteringDescription, setUserFilteringDescription] = useState(
    descriptionParam ? decodeURIComponent(descriptionParam) : ""
  );
  
  // Step 3 상태
  const [examples, setExamples] = useState([]); // 예시 댓글 목록
  const [isLoadingExamples, setIsLoadingExamples] = useState(false); // 예시 댓글 로딩 중
  const [dislikeExamples, setDislikeExamples] = useState(
    dislikeExamplesParam ? JSON.parse(decodeURIComponent(dislikeExamplesParam)) : []
  ); // 숨기고 싶은 댓글 (commentText 배열)
  const [allowExamples, setAllowExamples] = useState(
    allowExamplesParam ? JSON.parse(decodeURIComponent(allowExamplesParam)) : []
  ); // 괜찮은 댓글 (commentText 배열)
  const [skippedExamples, setSkippedExamples] = useState([]); // 건너뛴 댓글 (commentText 배열)
  
  // Step 4 상태
  const [emailNotificationEnabled, setEmailNotificationEnabled] = useState(true);
  const [notificationTimeUnit, setNotificationTimeUnit] = useState("HOURLY"); // "HOURLY" or "DAILY"
  const [notificationThreshold, setNotificationThreshold] = useState(10);
  const [notificationEmail, setNotificationEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Step 1: 카테고리 선택/해제
  const handleCategoryToggle = (categoryId) => {
    setSelectedCategories((prev) => {
      if (prev.includes(categoryId)) {
        return prev.filter((id) => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  // Step 2: 텍스트 입력값 변경
  const handleDescriptionChange = (value) => {
    setUserFilteringDescription(value);
  };
  
  // Step 3: 예시 댓글 조회
  const fetchExamples = useCallback(async () => {
    if (selectedCategories.length === 0) return;
    
    setIsLoadingExamples(true);
    try {
      const response = await fetch(apiUrl("api/filter/examples"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          categories: selectedCategories,
          limit: 10,
          mixDifficulty: true
        })
      });
      
      if (!response.ok) {
        throw new Error("예시 댓글 조회 실패");
      }
      
      const data = await response.json();
      // 중복된 댓글 제거 (commentText 기준)
      const uniqueExamples = [];
      const seenComments = new Set();
      if (data && Array.isArray(data)) {
        for (const example of data) {
          if (example.commentText && !seenComments.has(example.commentText)) {
            seenComments.add(example.commentText);
            uniqueExamples.push(example);
          }
        }
      }
      setExamples(uniqueExamples);
    } catch (error) {
      console.error("예시 댓글 조회 오류:", error);
      alert("예시 댓글을 불러오는데 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoadingExamples(false);
    }
  }, [selectedCategories]);
  
  // Step 3: 예시 댓글 자동 조회 (Step 3로 이동 시)
  useEffect(() => {
    if (step === "3" && selectedCategories.length > 0 && examples.length === 0) {
      fetchExamples();
    }
  }, [step, selectedCategories, examples.length, fetchExamples]);
  
  // Step 3: 댓글 라벨링 (숨기기)
  const handleDislike = (commentText) => {
    if (dislikeExamples.includes(commentText)) {
      // 이미 선택됨 - 제거
      setDislikeExamples((prev) => prev.filter((text) => text !== commentText));
    } else {
      // 새로 선택 - allow와 skipped에서 제거하고 dislike에 추가
      setAllowExamples((prev) => prev.filter((text) => text !== commentText));
      setSkippedExamples((prev) => prev.filter((text) => text !== commentText));
      setDislikeExamples((prev) => [...prev, commentText]);
    }
  };
  
  // Step 3: 댓글 라벨링 (허용)
  const handleAllow = (commentText) => {
    if (allowExamples.includes(commentText)) {
      // 이미 선택됨 - 제거
      setAllowExamples((prev) => prev.filter((text) => text !== commentText));
    } else {
      // 새로 선택 - dislike와 skipped에서 제거하고 allow에 추가
      setDislikeExamples((prev) => prev.filter((text) => text !== commentText));
      setSkippedExamples((prev) => prev.filter((text) => text !== commentText));
      setAllowExamples((prev) => [...prev, commentText]);
    }
  };

  // Step 1: 다음 버튼 활성화 여부
  const isStep1NextEnabled = selectedCategories.length > 0;

  // Step 1: 다음 단계로 이동
  const handleStep1Next = () => {
    if (isStep1NextEnabled) {
      const params = new URLSearchParams();
      if (channelId) params.set("channelId", channelId);
      params.set("step", "2");
      params.set("categories", selectedCategories.join(","));
      router.push(`/filter/setup?${params.toString()}`);
    }
  };

  // Step 2: 이전 단계로 이동
  const handleStep2Prev = () => {
    const params = new URLSearchParams();
    if (channelId) params.set("channelId", channelId);
    params.set("step", "1");
    params.set("categories", selectedCategories.join(","));
    router.push(`/filter/setup?${params.toString()}`);
  };

  // Step 2: 다음 단계로 이동
  const handleStep2Next = () => {
    const params = new URLSearchParams();
    if (channelId) params.set("channelId", channelId);
    params.set("step", "3");
    params.set("categories", selectedCategories.join(","));
    // 텍스트 설명 데이터를 쿼리 파라미터로 전달
    if (userFilteringDescription.trim()) {
      params.set("description", encodeURIComponent(userFilteringDescription));
    }
    router.push(`/filter/setup?${params.toString()}`);
  };
  
  // Step 3: 이전 단계로 이동
  const handleStep3Prev = () => {
    const params = new URLSearchParams();
    if (channelId) params.set("channelId", channelId);
    params.set("step", "2");
    params.set("categories", selectedCategories.join(","));
    if (userFilteringDescription.trim()) {
      params.set("description", encodeURIComponent(userFilteringDescription));
    }
    router.push(`/filter/setup?${params.toString()}`);
  };
  
  // Step 3: 다음 단계로 이동
  const handleStep3Next = () => {
    const totalSelected = dislikeExamples.length + allowExamples.length;
    if (totalSelected < 3) {
      alert("예시 댓글을 최소 3개 이상 선택해주세요.");
      return;
    }
    
    const params = new URLSearchParams();
    if (channelId) params.set("channelId", channelId);
    params.set("step", "4");
    params.set("categories", selectedCategories.join(","));
    if (userFilteringDescription.trim()) {
      params.set("description", encodeURIComponent(userFilteringDescription));
    }
    params.set("dislikeExamples", JSON.stringify(dislikeExamples));
    params.set("allowExamples", JSON.stringify(allowExamples));
    router.push(`/filter/setup?${params.toString()}`);
  };
  
  // Step 4: 이전 단계로 이동
  const handleStep4Prev = () => {
    const params = new URLSearchParams();
    if (channelId) params.set("channelId", channelId);
    params.set("step", "3");
    params.set("categories", selectedCategories.join(","));
    if (userFilteringDescription.trim()) {
      params.set("description", encodeURIComponent(userFilteringDescription));
    }
    params.set("dislikeExamples", JSON.stringify(dislikeExamples));
    params.set("allowExamples", JSON.stringify(allowExamples));
    router.push(`/filter/setup?${params.toString()}`);
  };
  
  // Step 4: 최종 제출
  const handleStep4Submit = async () => {
    // 최소 검증 (프론트엔드에서도 체크)
    const totalSelected = dislikeExamples.length + allowExamples.length;
    if (totalSelected < 3) {
      alert("예시 댓글을 최소 3개 이상 선택해주세요.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      // channelId 파싱 (문자열일 수 있음)
      let parsedChannelId = null;
      if (channelId) {
        const parsed = parseInt(channelId);
        if (!isNaN(parsed)) {
          parsedChannelId = parsed;
        }
      }
      
      const requestBody = {
        channelId: parsedChannelId,
        selectedCategories: selectedCategories,
        userFilteringDescription: userFilteringDescription.trim() || null,
        dislikeExamples: dislikeExamples,
        allowExamples: allowExamples,
        emailNotificationSettings: {
          enabled: emailNotificationEnabled,
          timeUnit: emailNotificationEnabled ? notificationTimeUnit : null,
          threshold: emailNotificationEnabled ? notificationThreshold : null,
          email: emailNotificationEnabled && notificationEmail.trim() ? notificationEmail.trim() : null
        }
      };
      
      // 디버깅: 요청 데이터 로그
      console.log("📤 [필터 설정] 저장 요청:", JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(apiUrl("api/filter/preferences"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody)
      });
      
      if (!response.ok) {
        // 에러 응답 처리
        let errorMessage = "설정 저장에 실패했습니다.";
        let errorDetails = null;
        try {
          const errorData = await response.json();
          console.error("❌ [필터 설정] 에러 응답:", errorData);
          if (errorData.message) {
            errorMessage = errorData.message;
          } else if (errorData.error) {
            errorMessage = errorData.error;
          }
          errorDetails = errorData;
        } catch (e) {
          // JSON 파싱 실패 시 기본 메시지 사용
          console.error("❌ [필터 설정] 에러 응답 파싱 실패:", e);
          const errorText = await response.text();
          console.error("❌ [필터 설정] 에러 응답 텍스트:", errorText);
          if (response.status === 401) {
            errorMessage = "로그인이 필요합니다. 다시 로그인해주세요.";
          } else if (response.status === 400) {
            errorMessage = "입력한 정보를 확인해주세요.";
          } else if (response.status === 500) {
            errorMessage = "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
          }
        }
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      console.log("설정 저장 성공:", responseData);
      
      // 성공 시 대시보드로 이동
      router.push(`/dashboard?youtube=connected`);
    } catch (error) {
      console.error("설정 저장 오류:", error);
      alert(error.message || "설정 저장에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 1 렌더링
  const renderStep1 = () => (
    <>
      {/* 진행 표시기 */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
            1
          </div>
          <span className="text-sm font-bold text-black">카테고리 선택</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-semibold">
            2
          </div>
          <span className="text-sm font-medium text-gray-400">키워드 입력</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-semibold">
            3
          </div>
          <span className="text-sm font-medium text-gray-400">예시 댓글 확인</span>
        </div>
        <div className="w-12 h-0.5 bg-gray-300"></div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-semibold">
            4
          </div>
          <span className="text-sm font-medium text-gray-400">최종 확인</span>
        </div>
      </div>

      {/* 제목 */}
      <div className="text-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-2 tracking-tight">
          필터링할 카테고리를 선택해주세요
        </h1>
        <p className="text-base text-gray-600">
          선택한 카테고리의 댓글이 자동으로 필터링됩니다
        </p>
      </div>

      {/* 카테고리 선택 영역 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((category) => {
          const Icon = category.icon;
          const isSelected = selectedCategories.includes(category.id);
          
          return (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all relative active:scale-[0.98] ${
                isSelected
                  ? "border-2 border-blue-600 bg-blue-50 shadow-md"
                  : "border border-gray-200 hover:border-gray-300 hover:shadow-md hover:-translate-y-1"
              }`}
              onClick={() => handleCategoryToggle(category.id)}
            >
              {/* 선택 시 우측 상단 체크 배지 */}
              {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              )}
              
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  {/* 아이콘 배경 */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full ${category.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Label
                      htmlFor={category.id}
                      className="text-lg font-semibold text-gray-900 cursor-pointer block mb-2"
                    >
                      {category.name}
                    </Label>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 선택된 카테고리 개수 표시 */}
      {selectedCategories.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
          <CheckCircle2 className="w-4 h-4 text-blue-600" />
          <span>
            <span className="font-semibold text-blue-600">{selectedCategories.length}개</span>의 카테고리가 선택되었습니다
          </span>
        </div>
      )}

      {/* 하단 버튼 영역 */}
      <div className="flex w-full justify-end gap-4 mt-8">
        <Button
          variant="outline"
          size="lg"
          className="h-14 px-8 rounded-lg text-base"
          asChild
        >
          <Link href="/dashboard">취소</Link>
        </Button>
        <Button
          size="lg"
          className={`h-14 px-8 rounded-lg text-base font-semibold transition-all ${
            isStep1NextEnabled
              ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
              : "bg-blue-100 text-blue-400 cursor-not-allowed"
          }`}
          disabled={!isStep1NextEnabled}
          onClick={handleStep1Next}
        >
          다음
        </Button>
      </div>
    </>
  );

  // Step 2 렌더링
  const renderStep2 = () => {
    return (
      <>
        {/* 진행 표시기 */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              1
            </div>
            <span className="text-sm font-medium text-gray-600">카테고리 선택</span>
          </div>
          <div className="w-12 h-0.5 bg-blue-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              2
            </div>
            <span className="text-sm font-bold text-black">필터링 설명</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-semibold">
              3
            </div>
            <span className="text-sm font-medium text-gray-400">예시 댓글 확인</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-semibold">
              4
            </div>
            <span className="text-sm font-medium text-gray-400">최종 확인</span>
          </div>
        </div>

        {/* 질문 카드 (제목 포함) */}
        <Card className="border border-gray-200 bg-gray-50">
          <CardContent className="p-6">
            {/* 제목 (카드 내부로 이동) */}
            <div className="mb-6">
              <h1 className="text-3xl sm:text-4xl font-bold text-black mb-3 tracking-tight">
                AI에게 차단 기준을 설명해주세요
              </h1>
              <p className="text-base text-gray-600">
                키워드나 문장으로 자유롭게 입력해주세요 (선택사항)
              </p>
            </div>

            {/* 질문 (간소화) */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">
                어떤 댓글을 차단하고 싶으신가요?
              </h2>
              <p className="text-s text-gray-500">
                현재 유튜브 스튜디오를 통해서나 직접 삭제 및 차단하고 있는 댓글 기준을 설명해주세요
              </p>
              <p className="text-s text-gray-500">
                문장 형식 또는 키워드 형식으로 자유롭게 입력해주세요
              </p>
            </div>

            {/* 텍스트 입력 영역 */}
            <div className="space-y-2">
              <Label htmlFor="filtering-description" className="text-sm font-medium text-gray-700">
                설명 입력
              </Label>
              <textarea
                id="filtering-description"
                value={userFilteringDescription}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder="예시: 저를 비난하는 건 괜찮지만, 가족을 욕하는 댓글은 무조건 막아주세요. 광고나 스팸 댓글도 필터링해주세요."
                    
                className="w-full min-h-[200px] px-4 py-3 text-base rounded-lg border border-gray-300 bg-white resize-y focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all placeholder:text-gray-400"
                rows={8}
              />
              <p className="text-xs text-gray-500">
                {userFilteringDescription.length}자 입력됨
              </p>
            </div>
          </CardContent>
        </Card>

        {/* 하단 버튼 영역 */}
        <div className="flex w-full justify-end gap-4 mt-8">
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-8 rounded-lg text-base"
            onClick={handleStep2Prev}
          >
            이전
          </Button>
          <Button
            size="lg"
            className="h-14 px-8 rounded-lg text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
            onClick={handleStep2Next}
          >
            다음
          </Button>
        </div>
      </>
    );
  };

  // Step 3 렌더링
  const renderStep3 = () => {
    const totalSelected = dislikeExamples.length + allowExamples.length;
    const isNextEnabled = totalSelected >= 3;
    const progressPercentage = examples.length > 0 ? (totalSelected / examples.length) * 100 : 0;
    
    // 카테고리 한글명 매핑
    const getCategoryName = (categoryId) => {
      const category = CATEGORIES.find((cat) => cat.id === categoryId);
      return category ? category.name : categoryId;
    };
    
    // 댓글의 라벨 상태 확인
    const getCommentLabel = (commentText) => {
      if (dislikeExamples.includes(commentText)) return "dislike";
      if (allowExamples.includes(commentText)) return "allow";
      if (skippedExamples.includes(commentText)) return "skipped";
      return null;
    };
    
    return (
      <>
        {/* 진행 표시기 */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              1
            </div>
            <span className="text-sm font-medium text-gray-600">카테고리 선택</span>
          </div>
          <div className="w-12 h-0.5 bg-blue-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              2
            </div>
            <span className="text-sm font-medium text-gray-600">필터링 설명</span>
          </div>
          <div className="w-12 h-0.5 bg-blue-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              3
            </div>
            <span className="text-sm font-bold text-black">예시 댓글 확인</span>
          </div>
          <div className="w-12 h-0.5 bg-gray-300"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-400 flex items-center justify-center font-semibold">
              4
            </div>
            <span className="text-sm font-medium text-gray-400">최종 확인</span>
          </div>
        </div>

        {/* 제목 */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-2 tracking-tight">
            예시 댓글을 확인하고 분류해주세요
          </h1>
          <p className="text-base text-gray-600">
            AI가 학습할 수 있도록 댓글을 분류해주세요
          </p>
        </div>

        {/* 진행 상황 시각화 (Progress Bar) */}
        <Card className="border border-gray-200 bg-white mb-6 sticky top-20 z-10 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  진행 상황
                </span>
                <span className={`text-sm font-bold ${
                  totalSelected >= 3 ? "text-blue-600" : "text-blue-500"
                }`}>
                  {totalSelected}/{examples.length || 0} 완료
                  {totalSelected >= 3 && (
                    <CheckCircle2 className="w-4 h-4 inline-block ml-1" />
                  )}
                </span>
              </div>
              <div className="text-xs text-gray-500">
                최소 3개 이상 필요
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300 bg-blue-600"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
          </CardContent>
        </Card>

        {/* 예시 댓글 영역 */}
        {isLoadingExamples ? (
          <Card className="border border-gray-200">
            <CardContent className="p-12 flex flex-col items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">예시 댓글을 불러오는 중...</p>
            </CardContent>
          </Card>
        ) : examples.length === 0 ? (
          <Card className="border border-gray-200">
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">예시 댓글을 불러올 수 없습니다.</p>
              <Button onClick={fetchExamples} variant="outline">
                다시 시도
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {examples.map((example) => {
              const label = getCommentLabel(example.commentText);
              const isDislike = label === "dislike";
              const isAllow = label === "allow";
              const isSkipped = label === "skipped";
              
              return (
                <Card
                  key={example.id}
                  className={`border transition-all ${
                    isDislike
                      ? "border-red-300 bg-red-50"
                      : isAllow
                      ? "border-blue-300 bg-blue-50"
                      : isSkipped
                      ? "border-gray-300 bg-gray-100"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <CardContent className="p-4">
                    {/* 데스크톱: 가로 레이아웃, 모바일: 세로 레이아웃 */}
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      {/* 댓글 내용 영역 */}
                      <div className="flex-1 min-w-0">
                        {/* 카테고리 태그 */}
                        <div className="mb-2">
                          <Badge variant="outline" className="text-xs">
                            {getCategoryName(example.categoryId)}
                          </Badge>
                        </div>
                        
                        {/* 댓글 텍스트 */}
                        <p className={`text-base leading-relaxed ${
                          isSkipped
                            ? "text-gray-600 line-through"
                            : "text-gray-900"
                        }`}>
                          {example.commentText}
                        </p>
                      </div>
                      
                      {/* 버튼 그룹 영역 */}
                      <div className="flex gap-2 md:flex-shrink-0">
                        {/* 숨기기 버튼 */}
                        <Button
                          type="button"
                          size="sm"
                          className={`px-4 py-2 text-sm font-medium transition-all ${
                            isDislike
                              ? "bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-sm"
                              : "bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                          }`}
                          onClick={() => handleDislike(example.commentText)}
                        >
                          <XCircle className="w-4 h-4 mr-1.5" />
                          {isDislike ? "선택됨" : "숨기기"}
                        </Button>
                        
                        {/* 건너뛰기 버튼 */}
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className={`px-3 py-2 text-xs transition-all ${
                            isSkipped
                              ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            if (isSkipped) {
                              // 건너뛰기 취소
                              setSkippedExamples((prev) => prev.filter((text) => text !== example.commentText));
                            } else {
                              // 건너뛰기: dislike와 allow에서 모두 제거하고 skipped에 추가
                              setDislikeExamples((prev) => prev.filter((text) => text !== example.commentText));
                              setAllowExamples((prev) => prev.filter((text) => text !== example.commentText));
                              setSkippedExamples((prev) => [...prev, example.commentText]);
                            }
                          }}
                        >
                          {isSkipped ? "건너뛰기 취소" : "건너뛰기"}
                        </Button>
                        
                        {/* 허용 버튼 */}
                        <Button
                          type="button"
                          size="sm"
                          className={`px-4 py-2 text-sm font-medium transition-all ${
                            isAllow
                              ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600 shadow-sm"
                              : "bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200"
                          }`}
                          onClick={() => handleAllow(example.commentText)}
                        >
                          <CheckCircle2 className="w-4 h-4 mr-1.5" />
                          {isAllow ? "선택됨" : "허용"}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* 하단 버튼 영역 */}
        <div className="flex w-full justify-end gap-4 mt-8">
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-8 rounded-lg text-base"
            onClick={handleStep3Prev}
          >
            이전
          </Button>
          <Button
            size="lg"
            className={`h-14 px-8 rounded-lg text-base font-semibold transition-all ${
              isNextEnabled
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg"
                : "bg-blue-100 text-blue-400 cursor-not-allowed"
            }`}
            disabled={!isNextEnabled}
            onClick={handleStep3Next}
          >
            다음
          </Button>
        </div>
      </>
    );
  };

  // Step 4 렌더링
  const renderStep4 = () => {
    // 카테고리 한글명 매핑
    const getCategoryName = (categoryId) => {
      const category = CATEGORIES.find((cat) => cat.id === categoryId);
      return category ? category.name : categoryId;
    };
    
    return (
      <>
        {/* 진행 표시기 */}
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              1
            </div>
            <span className="text-sm font-medium text-gray-600">카테고리 선택</span>
          </div>
          <div className="w-12 h-0.5 bg-blue-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              2
            </div>
            <span className="text-sm font-medium text-gray-600">필터링 설명</span>
          </div>
          <div className="w-12 h-0.5 bg-blue-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              3
            </div>
            <span className="text-sm font-medium text-gray-600">예시 댓글 확인</span>
          </div>
          <div className="w-12 h-0.5 bg-blue-600"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold">
              4
            </div>
            <span className="text-sm font-bold text-black">최종 확인</span>
          </div>
        </div>

        {/* 제목 */}
        <div className="text-center mb-6">
          <h1 className="text-4xl sm:text-5xl font-bold text-black mb-2 tracking-tight">
            알림 설정 및 검토
          </h1>
          <p className="text-base text-gray-600">
            필터링 내역을 놓치지 않도록 알림을 설정하고, 최종 설정을 확인합니다.
          </p>
        </div>

        {/* 이메일 알림 설정 카드 */}
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  이메일 알림 받기
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setEmailNotificationEnabled(!emailNotificationEnabled)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  emailNotificationEnabled ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    emailNotificationEnabled ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              필터링된 댓글이 일정 개수 이상일 때 리포트를 발송합니다.
            </p>

            {emailNotificationEnabled && (
              <div className="space-y-6">
                {/* 알림 주기와 최소 알림 기준을 2열 Grid로 배치 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 알림 주기 */}
                  <div className="space-y-2">
                    <Label htmlFor="notification-time-unit" className="text-sm font-medium text-gray-700">
                      알림 주기 (빈도)
                    </Label>
                    <Select value={notificationTimeUnit} onValueChange={setNotificationTimeUnit}>
                      <SelectTrigger id="notification-time-unit" className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOURLY">시간당</SelectItem>
                        <SelectItem value="DAILY">일당</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* 최소 알림 기준 */}
                  <div className="space-y-2">
                    <Label htmlFor="notification-threshold" className="text-sm font-medium text-gray-700">
                      최소 알림 기준
                    </Label>
                    <div className="relative">
                      <Input
                        id="notification-threshold"
                        type="number"
                        min="1"
                        value={notificationThreshold}
                        onChange={(e) => setNotificationThreshold(parseInt(e.target.value) || 1)}
                        className="w-full pr-16"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500 pointer-events-none">
                        개 이상
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      필터링 건수가 이 숫자보다 적으면 알림을 보내지 않습니다.
                    </p>
                  </div>
                </div>

                {/* 알림 받을 이메일 */}
                <div className="space-y-2">
                  <Label htmlFor="notification-email" className="text-sm font-medium text-gray-700">
                    알림 받을 이메일
                  </Label>
                  <Input
                    id="notification-email"
                    type="email"
                    value={notificationEmail}
                    onChange={(e) => setNotificationEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full"
                  />
                  <p className="text-xs text-gray-500">
                    비워두면 계정 기본 이메일로 발송됩니다.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* 설정 요약 카드 */}
        <Card className="border border-gray-200 bg-white">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              설정 요약
            </h2>
            
            <div className="space-y-4">
              {/* 필터링 유형 */}
              <div className="py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700 block mb-2">필터링 유형</span>
                <div className="flex flex-wrap gap-2">
                  {selectedCategories.length > 0 ? (
                    selectedCategories.map((catId) => (
                      <Badge key={catId} variant="outline" className="text-xs">
                        {getCategoryName(catId)}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      설정 안 함
                    </Badge>
                  )}
                </div>
              </div>

              {/* 등록된 차단 키워드/설명 */}
              <div className="py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700 block mb-2">등록된 차단 키워드</span>
                <div>
                  {userFilteringDescription.trim() ? (
                    <p className="text-sm text-gray-900">{userFilteringDescription}</p>
                  ) : (
                    <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                      설정 안 함
                    </Badge>
                  )}
                </div>
              </div>

              {/* 예시 라벨링 결과 */}
              <div className="py-3 border-b border-gray-100">
                <span className="text-sm font-medium text-gray-700 block mb-2">예시 라벨링 결과</span>
                <div className="flex gap-2">
                  <span className="text-sm text-gray-900">
                    숨기기: <span className="font-semibold">{dislikeExamples.length}개</span>
                  </span>
                  <span className="text-gray-300">|</span>
                  <span className="text-sm text-gray-900">
                    허용: <span className="font-semibold">{allowExamples.length}개</span>
                  </span>
                </div>
              </div>

              {/* 모니터링 강도 (선택사항) */}
              <div className="py-3">
                <span className="text-sm font-medium text-gray-700 block mb-2">모니터링 강도</span>
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                  기본값
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 하단 버튼 영역 */}
        <div className="flex w-full justify-end gap-4 mt-8">
          <Button
            variant="outline"
            size="lg"
            className="h-14 px-8 rounded-lg text-base"
            onClick={handleStep4Prev}
            disabled={isSubmitting}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            이전 단계
          </Button>
          <Button
            size="lg"
            className="h-14 px-8 rounded-lg text-base font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all"
            onClick={handleStep4Submit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                설정 완료 및 시작하기
              </>
            )}
          </Button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 네비게이션 */}
      <Navigation hideButtons={true} />

      {/* 메인 콘텐츠 */}
      <main className="min-h-screen flex flex-col items-center pt-12 pb-20 px-4">
        <div className="w-full max-w-4xl flex flex-col gap-8">
          {step === "1" && renderStep1()}
          {step === "2" && renderStep2()}
          {step === "3" && renderStep3()}
          {step === "4" && renderStep4()}
        </div>
      </main>
    </div>
  );
}
