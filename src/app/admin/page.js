"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  ArrowLeft,
  Loader2,
  Shield,
  ShieldAlert,
  Users,
  Filter,
  Activity,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiUrl } from "@/lib/config";

export default function AdminPage() {
  const router = useRouter();
  const { isAuthenticated, initialized, user } = useSelector(
    (state) => state.auth
  );

  const [quota, setQuota] = useState(null);
  const [totalUsers, setTotalUsers] = useState(null);
  const [totalFiltering, setTotalFiltering] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isForbidden, setIsForbidden] = useState(false);
  const [loadError, setLoadError] = useState(null);

  const isAdmin = isAuthenticated && user?.role === "ADMIN";

  // 인증/권한 가드: 세션 확인 완료 후 관리자가 아니면 대시보드로 이동
  useEffect(() => {
    if (initialized && (!isAuthenticated || user?.role !== "ADMIN")) {
      router.push("/dashboard");
    }
  }, [initialized, isAuthenticated, user, router]);

  // 관리자 통계 데이터 로드
  useEffect(() => {
    if (!initialized || !isAdmin) return;

    const fetchAdminStats = async () => {
      setIsLoading(true);
      setIsForbidden(false);
      setLoadError(null);

      try {
        const [quotaRes, usersRes, filteringRes] = await Promise.all([
          fetch(apiUrl("api/admin/statistics/youtube-quota"), {
            method: "GET",
            credentials: "include",
          }),
          fetch(apiUrl("api/admin/statistics/total-users"), {
            method: "GET",
            credentials: "include",
          }),
          fetch(apiUrl("api/admin/statistics/total-filtering"), {
            method: "GET",
            credentials: "include",
          }),
        ]);

        // 하나라도 401/403이면 관리자 권한 없음 처리
        if (
          [quotaRes, usersRes, filteringRes].some(
            (res) => res.status === 401 || res.status === 403
          )
        ) {
          setIsForbidden(true);
          return;
        }

        if (quotaRes.ok) {
          setQuota(await quotaRes.json());
        }
        if (usersRes.ok) {
          setTotalUsers(await usersRes.json());
        }
        if (filteringRes.ok) {
          setTotalFiltering(await filteringRes.json());
        }

        if (!quotaRes.ok && !usersRes.ok && !filteringRes.ok) {
          setLoadError("관리자 통계를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
        }
      } catch (error) {
        console.error("관리자 통계 로드 실패:", error);
        setLoadError("관리자 통계를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAdminStats();
  }, [initialized, isAdmin]);

  // 세션 확인 중 로딩 스피너
  if (!initialized) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  // 쿼터 계산
  const dailyLimit = quota?.dailyLimit || 0;
  const usedUnits = quota?.usedUnits || 0;
  const remainingUnits = quota?.remainingUnits ?? Math.max(0, dailyLimit - usedUnits);
  const usagePercent = dailyLimit > 0 ? Math.min(100, (usedUnits / dailyLimit) * 100) : 0;
  const byOperation = quota?.byOperation || {};
  const operationEntries = Object.entries(byOperation).sort((a, b) => b[1] - a[1]);

  // 사용률에 따른 진행 바 색상 (70% 초과: 주황, 90% 초과: 빨강)
  const progressColorClass =
    usagePercent > 90
      ? "[&>[data-slot=progress-indicator]]:bg-red-500"
      : usagePercent > 70
        ? "[&>[data-slot=progress-indicator]]:bg-amber-500"
        : "";
  const usageTextColor =
    usagePercent > 90
      ? "text-red-600"
      : usagePercent > 70
        ? "text-amber-600"
        : "text-primary";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="w-full bg-white border-b border-slate-200 flex items-center flex-shrink-0 z-10">
        <div className="w-full flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-lg sm:text-xl font-bold text-black transition-colors hover:opacity-80"
            >
              MEDI
            </Link>
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Shield className="size-4 text-primary" />
              관리자 페이지
            </span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="size-4" />
            대시보드로 돌아가기
          </Link>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <h2 className="text-black font-bold text-3xl">관리자 대시보드</h2>

        {isLoading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : isForbidden ? (
          <Card>
            <CardContent className="py-16 flex flex-col items-center justify-center gap-4">
              <ShieldAlert className="size-12 text-red-500" />
              <p className="text-lg font-semibold text-gray-900">
                관리자 권한이 필요합니다
              </p>
              <p className="text-sm text-gray-500">
                해당 페이지에 접근할 수 있는 권한이 없습니다.
              </p>
            </CardContent>
          </Card>
        ) : loadError ? (
          <Card>
            <CardContent className="py-16 flex flex-col items-center justify-center gap-4">
              <ShieldAlert className="size-12 text-gray-400" />
              <p className="text-sm text-gray-500">{loadError}</p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* 요약 카드 2개 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base text-gray-600">
                    <Users className="size-5 text-primary" />
                    전체 사용자 수
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalUsers !== null ? Number(totalUsers).toLocaleString() : "-"}
                    <span className="text-base font-medium text-gray-500 ml-1">명</span>
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-2 text-base text-gray-600">
                    <Filter className="size-5 text-primary" />
                    총 필터링 수
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold text-gray-900">
                    {totalFiltering !== null ? Number(totalFiltering).toLocaleString() : "-"}
                    <span className="text-base font-medium text-gray-500 ml-1">건</span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* YouTube API 쿼터 카드 */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="size-5 text-gray-500" />
                  YouTube API 쿼터
                </CardTitle>
                <CardDescription>
                  {quota?.date
                    ? `${quota.date} 기준 일일 쿼터 사용 현황입니다`
                    : "일일 쿼터 사용 현황입니다"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {quota ? (
                  <>
                    <div className="space-y-2">
                      <div className="flex items-end justify-between">
                        <p className="text-sm text-gray-600">
                          사용량{" "}
                          <span className="font-semibold text-gray-900">
                            {usedUnits.toLocaleString()}
                          </span>{" "}
                          / {dailyLimit.toLocaleString()} units
                        </p>
                        <p className={`text-sm font-semibold ${usageTextColor}`}>
                          {usagePercent.toFixed(1)}%
                        </p>
                      </div>
                      <Progress value={usagePercent} className={progressColorClass} />
                      <p className="text-sm text-gray-500">
                        남은 쿼터{" "}
                        <span className="font-semibold text-gray-900">
                          {remainingUnits.toLocaleString()}
                        </span>{" "}
                        units
                      </p>
                    </div>

                    {/* 작업별 사용량 테이블 */}
                    {operationEntries.length > 0 ? (
                      <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">
                          작업별 사용량
                        </p>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>작업</TableHead>
                              <TableHead className="text-right">사용량 (units)</TableHead>
                              <TableHead className="text-right">비중</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {operationEntries.map(([opName, units]) => (
                              <TableRow key={opName}>
                                <TableCell className="font-medium">{opName}</TableCell>
                                <TableCell className="text-right">
                                  {Number(units).toLocaleString()}
                                </TableCell>
                                <TableCell className="text-right text-gray-500">
                                  {usedUnits > 0
                                    ? `${((units / usedUnits) * 100).toFixed(1)}%`
                                    : "-"}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">
                        오늘 사용된 API 작업이 없습니다.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-gray-500">
                    쿼터 정보를 불러올 수 없습니다.
                  </p>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
