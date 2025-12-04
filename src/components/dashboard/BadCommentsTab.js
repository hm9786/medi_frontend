 "use client";

import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, TriangleAlert, UserCheck, ArrowRight, AlertTriangle, UserX, Clock, Target, Siren, TrendingUp, FileText, MessageSquare, CheckCircle, ThumbsUp, ThumbsDown, PlaySquare, ShieldCheck, CheckCircle2, XCircle, ChevronDown, ChevronUp, Lightbulb, XOctagon, PlayCircle, Info, Loader2, Circle, TrendingUp as TrendingUpIcon, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { apiUrl } from "@/lib/config";
import { pdf } from "@react-pdf/renderer";

/**
 * 기존 "원본 악플 보기" 탭의 콘텐츠를 전부 제거하고
 * 임시 안내 문구만 노출하도록 단순화했습니다.
 */

// 하이라이트 텍스트 컴포넌트
function HighlightText({ children }) {
  return (
    <span className="font-bold text-gray-900 bg-yellow-100/80 px-1 rounded mx-0.5">
      {children}
    </span>
  );
}

// 하드코딩된 보고서 데이터 (백엔드 연동 전 임시 데이터)
const initialReportData = {
  "channel_name": "서빈감각",
  "generated_at": "2025-11-28T17:35:22.773177",
  "total_comments": 34,
  "section_1_threat_intelligence": {
    "section_title": "🔍 위협 인텔리전스",
    "generated_at": "2025-11-28T17:33:39.826850",
    "repeat_offenders": {
      "top3_categories": [
        {
          "category": "인신공격",
          "description": "크리에이터·댓글작성자 개인의 외모·품성·능력 등을 모욕하거나 비하하는 직접적 개인 공격성 발언이 다수 존재함"
        },
        {
          "category": "성별 비하",
          "description": "여성(또는 특정 성별)을 대상으로 한 일반화·모욕·혐오 표현(페미 비하, 결혼 강요 등)이 빈번하게 나타남"
        },
        {
          "category": "성적 대상화",
          "description": "노골적 성적 표현·성희롱·미성년자 성적 대상화 등 플랫폼 규정상 절대 허용 불가한 성적 발언이 반복됨"
        }
      ],
      "offenders": [
        {
          "author_name": "@석-b7e",
          "total_attacks": 3,
          "category_distribution": {
            "인신공격": 1,
            "성별 비하": 2,
            "성적 대상화": 0
          }
        },
        {
          "author_name": "@chaosytk77",
          "total_attacks": 2,
          "category_distribution": {
            "인신공격": 2,
            "성별 비하": 0,
            "성적 대상화": 0
          }
        }
      ]
    },
    "intensity_distribution": {
      "critical": 19,
      "high": 15,
      "total": 34
    },
    "time_patterns": {
      "distribution": {
        "새벽 (00-06시)": 12,
        "오전 (06-12시)": 4,
        "오후 (12-18시)": 12,
        "저녁 (18-22시)": 3,
        "심야 (22-24시)": 3
      },
      "red_zone": {
        "time_slot": "새벽 (00-06시)",
        "count": 12,
        "percentage": 35.3
      }
    }
  },
  "section_2_defense_strategy": {
    "section_title": "🛡️ 콘텐츠 방어 전략",
    "generated_at": "2025-11-28T17:34:05.504607",
    "top3_attacked_videos": [
      {
        "video_id": "lCZUOdpVpPg",
        "video_title": "여자들이 대화할수록 만나고 싶어지는 남자 특징",
        "image_url": "https://i.ytimg.com/vi/rppeR7bHeQw/default.jpg",
        "attack_count": 14,
        "transcript": "스크립트 없음",
        "trigger_analysis": {
          "trigger_points": [
            {
              "trigger_quote": "명확한 트리거 식별 어려움",
              "why_problematic": "제공된 자료에 영상의 스크립트(자막)가 없어 영상 속 특정 문장을 직접 인용하거나 확정적으로 지목할 수 없음. 다만 제목('여자들이 대화할수록 만나고 싶어지는 남자 특징')과 악플 내용들을 통해 유추하면, '여성의 호감을 일반화·규정하거나 성적·외모 기준으로 여성/남성을 평가·대상화하는 조언'이 분노의 촉발 요인일 가능성이 높음. 또한 영상에서 특정 개인(크리에이터)의 외모·성적 경험·성향 등을 언급했을 경우 개인·집단 공격을 유발했을 것으로 보임.",
              "comment_reaction": "샘플 악플들은 공통적으로 (1) 크리에이터/화자의 외모·성형을 비하('성형티', '콧구멍')하는 인신공격, (2) 여성 집단을 일반화·모욕하거나 성적 대상화(노골적 성적 표현 포함), (3) 폭력·협박적 표현, (4) 영상 내용이 현실과 동떨어졌다는 비판('이딴 거 보면서 여자 못 만난다') 및 조언 거부 반응을 보임. 즉, 영상의 조언이 성적·외모 중심적이거나 여성의 행동을 규정하는 톤이라면 이런 유형의 반응을 촉발했음."
            }
          ],
          "overall_assessment": "스크립트가 없어 특정 문장 자체를 지목하긴 불가능하나, 제목과 악플 패턴으로 볼 때 '여성의 감정이나 매력을 단편적으로 규정하거나 성적/외모 관점으로 대상화하는 내용'이 주된 트리거로 추정됨. 그 결과 외모 공격, 성적 대상화, 폭력적·모욕적 반응, 영상 신뢰성에 대한 반발이 혼재한 악플이 다수 발생한 것으로 보임."
        }
      },
      {
        "video_id": "bgKZ353pjKM",
        "video_title": "데이트코스 매번 안 짜오는 남친한테 말 하는 방법",
        "image_url": "https://i.ytimg.com/vi/rppeR7bHeQw/default.jpg",
        "attack_count": 6,
        "transcript": "스크립트 없음",
        "trigger_analysis": {
          "trigger_points": [
            {
              "trigger_quote": "명확한 트리거 식별 어려움",
              "why_problematic": "제공된 자료에 스크립트(자막)가 없어 영상 내 특정 문장이나 발언을 정확히 인용할 수 없습니다. 다만 영상 제목('데이트코스 매번 안 짜오는 남친한테 말 하는 방법')과 달린 악플 내용을 비교하면, 시청자들은 영상의 조언·태도(특히 연애 상황에서 한쪽 성별을 지칭하거나 역할을 규정하는 부분)를 여성비하·일반화로 받아들였을 가능성이 큽니다. 또 '남자/여자는 ~하다' 식의 일반화, 상대를 깎아내리는 표현, 또는 갈등 상황을 부추기는 어조가 있었던 것으로 추정되며, 이런 요소가 화를 불러일으킬 수 있습니다. (단, 이는 스크립트 부재로 인한 해석적 추론임)",
              "comment_reaction": "악플들은 공통적으로 영상(또는 영상의 화자/대상)을 향한 성별 일반화·모욕, 폭력적 은유·위협, 여성비하와 같은 강한 공격적 반응을 보입니다. 구체적 패턴은: (1) 여성 집단을 비하·일반화(예: '모든 여자가…', '비정상녀'), (2) 개인/시청자를 모욕(예: '븅신'), (3) 폭력적 은유·위협성 표현(예: '밟혀봐야 정신차리지'), (4) 관계·성(性的) 문제에 대한 적대적 일반화(예: '남자는 몇 번 자고나면 실증난다') 및 (5) 삶/결혼·법적 불이익을 들어 위협·경멸을 표현(예: '이혼할때 재산 반띵')."
            }
          ],
          "overall_assessment": "스크립트가 제공되지 않아 특정 문장 자체를 정확히 지목하긴 불가능하지만, 영상 주제와 악플 내용을 연결해 보면 시청자들은 영상의 조언 방식이나 성별에 대한 진술을 '일방적·비하적'으로 받아들여 강하게 반응한 것으로 보입니다. 악플들은 주로 성별 일반화·모욕·폭력적 은유라는 공통된 분노 패턴을 보이며, 이는 영상의 표현 방식(어조·대상 지칭)이나 메시지 해석이 문제였을 가능성을 시사합니다."
        }
      },
      {
        "video_id": "yaQoGDn64a8",
        "video_title": "나이들수록 주변에 괜찮은사람이 없는 이유",
        "image_url": "https://i.ytimg.com/vi/rppeR7bHeQw/default.jpg",
        "attack_count": 3,
        "transcript": "스크립트 없음",
        "trigger_analysis": {
          "trigger_points": [
            {
              "trigger_quote": "명확한 트리거 식별 어려움",
              "why_problematic": "제공된 데이터에 영상 스크립트(자막)가 없어 영상 내 특정 발언이나 문장을 직접 인용할 수 없습니다. 따라서 어떤 문구가 분노를 촉발했는지 정확히 식별할 근거가 부족합니다. 다만 악플 내용으로 미루어볼 때 시청자들은 크리에이터의 외모(성형 관련 언급)와 '자기 지식/태도'에 대한 평가(아는 것이 전부인 태도, 잘난 척 등)에 불쾌감을 표출하고 있으며, 이는 영상에서의 말투·표현·태도(예: 단정적·교조적 표현, 타인 비난을 유도하는 일반화) 때문에 촉발되었을 가능성이 있습니다.",
              "comment_reaction": "악플들은 주로 개인공격(외모비하), 모욕적·성별비하적 표현, 그리고 스팸/홍보로 분류됩니다. 즉 시청자 반응의 패턴은 (1) 외모 지적·비하, (2) 크리에이터의 태도('아는 게 전부', '잘난 척')에 대한 분노 표출, (3) 관련 없는 링크 삽입 등으로 요약됩니다. 그러나 이 패턴이 특정 문장과 직접 연결되는지는 스크립트 부재로 명확히 확인되지 않습니다."
            }
          ],
          "overall_assessment": "스크립트가 제공되지 않아 특정 발언을 정확히 지목하기 어렵습니다. 다만 댓글들은 제작자의 외모와 전달 방식(자기 확신·비하적 어조로 비춰졌을 가능성)에 주로 반응하고 있으므로, 영상의 표현 방식(어조·일반화·단정적 주장)이 분노를 유발했을 가능성이 높습니다."
        }
      }
    ],
    "preventive_guidelines": {
      "do_guidelines": [
        {
          "guideline": "업로드 시간은 새벽(00-06시)을 피하고 시청자 활동이 많은 시간대로 예약하세요. 추천 시간대: 오전 09:00-12:00, 오후 13:00-16:00, 저녁 18:00-21:00(대상 시청자 타임존 고려).",
          "reason": "분석에서 악플이 새벽에 집중됨. 활동 시간이 많은 시간대에 게시하면 댓글 유입은 많되 악의적·무작위 공격 비중이 낮아지고 즉각적인 모니터링이 용이합니다.",
          "expected_impact": "새벽 레드존 노출 감소로 초기 악플 수가 줄고, 건강한 상호작용과 시청자 참여율(좋아요·응답)이 향상됩니다."
        },
        {
          "guideline": "논쟁적 주제는 중립적·정보형 프레임으로 구성하고 제목·설명에 '개인 의견', '사례 기반' 같은 면책·맥락 문구를 넣으세요. 다양한 관점(예: 전문가 인용, 통계, 사례)을 함께 제공하세요.",
          "reason": "절대화·일반화된 주장은 특정 집단을 자극해 공격을 촉발하기 쉬움. 맥락과 근거를 제시하면 오해와 분노를 줄일 수 있습니다.",
          "expected_impact": "공격성 높은 댓글 발생 빈도 감소, 토론의 품질 향상 및 신고·차단 리스크 감소."
        },
        {
          "guideline": "사전 필터·자동화 도구를 적극 활용하세요: 문제 키워드 블랙리스트, 댓글 사전검토(신규 업로드 6–12시간), 슬로우모드, 신고 감지 자동화, 신뢰할 수 있는 모더레이터 지정.",
          "reason": "많은 악플은 초기 시간대에 급격히 늘어나며 자동화로 첫 물결을 차단하면 확산을 막을 수 있습니다.",
          "expected_impact": "노출되는 악성 댓글 수 급감, 커뮤니티 분위기 안정화, 운영자(크리에이터)의 정신적 부담 경감."
        },
        {
          "guideline": "레드존(00-06시)에 맞춘 모니터링 체계를 만드세요: 이 시간대에 알림·대시보드 집중, 악성 댓글 급증 시 실시간 경고(슬랙/메일/휴대폰 푸시), 가능하면 교대 모더레이터 대기.",
          "reason": "데이터에서 새벽이 공격 시간대임이 확인되었으므로 이 시간대 집중 대응이 가장 효율적입니다.",
          "expected_impact": "악플 초기 진압으로 이슈 확산 차단, 빠른 삭제·차단으로 2차 유입 감소, 브랜드·채널 평판 보호."
        },
        {
          "guideline": "제목과 썸네일은 자극적 단정형 표현을 피하고 질문형·정보 제공형으로 바꾸세요. 영상 내·설명란·고정댓글에 커뮤니티 가이드라인과 바람직한 댓글 예시를 명시하세요.",
          "reason": "자극적 제목·이미지는 의도적 도발을 유발해 악플을 증폭시킴. 초반에 기준을 명확히 제시하면 건전한 댓글 문화를 유도할 수 있습니다.",
          "expected_impact": "도발성 반응 감소, 신고·차단 필요성 저감, 건설적인 피드백 비율 상승."
        }
      ],
      "dont_guidelines": [
        {
          "guideline": "성별·나이·집단을 일반화하거나 단정하는 표현 사용(예: '여자들이 ~', '나이들수록 ~')을 피하세요.",
          "reason": "집단을 대상화·일반화하면 해당 집단의 방어적·공격적 반응과 집단 간 갈등을 초래하기 쉽습니다.",
          "risk_level": "🔴 높음"
        },
        {
          "guideline": "비하·조롱·모욕을 유발하는 표현(예: 개인 비난, 조롱적 별칭, '무능하다' 식의 단정적 폄하)을 사용하지 마세요.",
          "reason": "명백한 공격적 표현은 악플을 정당화시키고 커뮤니티 규정 위반 및 플랫폼 제재로 이어질 수 있습니다.",
          "risk_level": "🔴 높음"
        },
        {
          "guideline": "확정적·절대적 주장 또는 단편적 사례로 '모두' 또는 '항상'을 단정짓는 클릭베이트형 제목(예: '모두가 틀렸다')을 쓰지 마세요.",
          "reason": "과장·극단화는 반론을 불러와 분쟁성 댓글과 집단적 공격을 촉발합니다.",
          "risk_level": "🟠 중간"
        },
        {
          "guideline": "논쟁을 유도하는 직접적 도발형 질문(예: 특정 집단을 겨냥한 '왜 너희는…')이나 상대를 몰아붙이는 레토릭을 피하세요.",
          "reason": "개인 공격과 감정적 반응을 유발해 토론이 빠르게 악화될 수 있습니다.",
          "risk_level": "🟠 중간"
        },
        {
          "guideline": "새벽(00-06시)에 자동 업로드하거나 해당 시간대에 라이브 알림·논쟁 유발 공지를 보내지 마세요.",
          "reason": "분석상 이 시간대에 악플러 활동이 집중되어 있고, 모니터링이 어려워 피해가 커질 가능성이 높습니다.",
          "risk_level": "🔴 높음"
        }
      ]
    }
  }
};

export function BadCommentsTab({ data }) {
  const [openThreatReport, setOpenThreatReport] = useState(false);
  const [openDefenseReport, setOpenDefenseReport] = useState(false);
  const [expandedVideos, setExpandedVideos] = useState({});
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  // 보고서 생성 폴링 및 취소 관리를 위한 ref
  const pollIntervalRef = useRef(null);
  const isReportCancelledRef = useRef(false);

  // 선택된 채널 정보 (페이지에서 내려주는 데이터)
  const channelDbId = data?.channelDbId || data?.channelId;
  const youtubeChannelId = data?.youtubeChannelId;
  const channelNameFromProps = data?.channelName || "";

  // 보고서 데이터 (초기에는 하드코딩된 데이터 사용 - 백엔드 연동 전 임시)
  const [reportData, setReportData] = useState(initialReportData);

  // 보고서 생성 로딩 모달 상태
  const [openReportLoading, setOpenReportLoading] = useState(false);
  // idle | in_progress | done
  const [threatStatus, setThreatStatus] = useState("idle");
  const [defenseStatus, setDefenseStatus] = useState("idle");

  // 폴링 interval 정리
  const clearReportPolling = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
  };

  // 로딩 모달에서 X 버튼/바깥 클릭으로 닫을 때 보고서 생성 취소
  const handleCancelReportGeneration = () => {
    isReportCancelledRef.current = true;
    clearReportPolling();
    setThreatStatus("idle");
    setDefenseStatus("idle");
  };

  // 로딩 모달 열림/닫힘 제어 (닫힐 때 진행 중이면 취소 처리)
  const handleReportDialogOpenChange = (open) => {
    if (!open) {
      // 아직 생성이 끝나지 않은 상태에서 닫히면 "취소"로 처리
      if (threatStatus !== "done" || defenseStatus !== "done") {
        handleCancelReportGeneration();
      }
      setOpenReportLoading(false);
    } else {
      // 새로 열릴 때는 이전 취소 상태/interval 초기화
      isReportCancelledRef.current = false;
      clearReportPolling();
      setOpenReportLoading(true);
    }
  };

  // 언마운트 시 폴링 정리
  useEffect(() => {
    return () => {
      clearReportPolling();
    };
  }, []);

  // PDF 생성 및 다운로드 함수
  const generateThreatReportPDF = async () => {
    if (!reportData) {
      console.error("보고서 데이터가 없습니다.");
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const React = await import("react");
      const { ThreatReportPDF: ThreatPDF } = await import("./pdf/ThreatReportPDF");
      const blob = await pdf(React.createElement(ThreatPDF, { reportData })).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `위협_악플_보고서_${reportData.channel_name || "채널"}_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const generateDefenseReportPDF = async () => {
    if (!reportData) {
      console.error("보고서 데이터가 없습니다.");
      return;
    }

    setIsGeneratingPDF(true);
    try {
      const React = await import("react");
      const { DefenseReportPDF: DefensePDF } = await import("./pdf/DefenseReportPDF");
      const blob = await pdf(React.createElement(DefensePDF, { reportData })).toBlob();
      
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `콘텐츠_방어_전략_보고서_${reportData.channel_name || "채널"}_${new Date().toISOString().split("T")[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("PDF 생성 중 오류 발생:", error);
      alert("PDF 생성에 실패했습니다. 다시 시도해주세요.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // 보고서 생성 + 로딩 플로우 시작
  const startReportGenerationFlow = async () => {
    if (!channelDbId || !youtubeChannelId) {
      console.warn("채널 ID가 없어 보고서를 생성할 수 없습니다.");
      return;
    }

    // 새 요청 시작 시 취소 상태/폴링 초기화
    isReportCancelledRef.current = false;
    clearReportPolling();

    setOpenReportLoading(true);
    setThreatStatus("in_progress");
    setDefenseStatus("idle");

    try {
      // 1) 리포트 생성 요청 (큐에 작업 추가)
      console.log("📤 보고서 생성 요청 전송 중...");
      await fetch(apiUrl("/api/reports"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          channelId: youtubeChannelId,
          data: {},
        }),
      });
      console.log("✅ 보고서 생성 요청 완료 (에이전트 처리 대기 중)");

      // 2) 폴링: 5초마다 메타데이터 조회 시도 (최대 10분 = 120회)
      let pollCount = 0;
      const maxPolls = 120; // 10분 (5초 * 120)
      const pollInterval = 5000; // 5초

      const pollForReport = async () => {
        return new Promise((resolve, reject) => {
          const interval = setInterval(async () => {
            pollCount++;
            console.log(`🔄 보고서 조회 시도 (${pollCount}/${maxPolls})...`);

            // 사용자가 로딩 모달을 닫아 생성 플로우를 취소한 경우
            if (isReportCancelledRef.current) {
              clearInterval(interval);
              pollIntervalRef.current = null;
              reject(new Error("REPORT_GENERATION_CANCELLED"));
              return;
            }

            try {
              // 메타데이터 조회 시도
              const metaRes = await fetch(
                apiUrl(`/api/youtube/analysis/channel/${channelDbId}/metadata`),
                {
                  method: "GET",
                  credentials: "include",
                }
              );

              if (metaRes.ok) {
                // 성공! 폴링 중단
                clearInterval(interval);
                pollIntervalRef.current = null;
                console.log("✅ 보고서 데이터 발견! 전체 데이터 조회 시작...");

                // 위협 인텔리전스 상태를 "완료"로 변경
                setThreatStatus("done");
                setDefenseStatus("in_progress");

                const meta = await metaRes.json();

                // 나머지 데이터 조회 (병렬)
                const [threatRes, defenseRes] = await Promise.all([
                  fetch(
                    apiUrl(`/api/youtube/analysis/channel/${channelDbId}/threat-intelligence`),
                    {
                      method: "GET",
                      credentials: "include",
                    }
                  ),
                  fetch(
                    apiUrl(`/api/youtube/analysis/channel/${channelDbId}/defense-strategy`),
                    {
                      method: "GET",
                      credentials: "include",
                    }
                  ),
                ]);

                if (!threatRes.ok || !defenseRes.ok) {
                  throw new Error("위협 인텔리전스/방어 전략 조회 실패");
                }

                const threat = await threatRes.json();
                const defense = await defenseRes.json();
                const defenseSection = defense.section_2_defense_strategy || defense;

                  // 응답을 새로운 구조에 맞게 매핑
                const reportData = {
                  channel_name: meta.channelName,
                  generated_at: meta.generatedAt,
                  total_comments: meta.totalComments,
                  section_1_threat_intelligence: {
                    section_title: threat.section_title || "🔍 위협 인텔리전스",
                    generated_at: threat.generated_at || meta.generatedAt,
                    repeat_offenders: threat.repeat_offenders || {},
                    intensity_distribution: threat.intensity_distribution || {
                      critical: 0,
                      high: 0,
                      total: 0,
                    },
                    time_patterns: threat.time_patterns || {
                      distribution: {},
                      red_zone: { time_slot: "", count: 0, percentage: 0 },
                    },
                  },
                  section_2_defense_strategy: {
                    section_title: defenseSection.section_title || "🛡️ 콘텐츠 방어 전략",
                    generated_at: defenseSection.generated_at || meta.generatedAt,
                    top3_attacked_videos: (defenseSection.top3_attacked_videos || []).map((video) => ({
                      ...video,
                      image_url: video.image_url || "https://i.ytimg.com/vi/rppeR7bHeQw/default.jpg",
                    })),
                    preventive_guidelines: defenseSection.preventive_guidelines || {
                      do_guidelines: [],
                      dont_guidelines: [],
                    },
                  },
                };

                resolve(reportData);
              } else if (pollCount >= maxPolls) {
                // 최대 시도 횟수 초과
                clearInterval(interval);
                pollIntervalRef.current = null;
                reject(new Error("보고서 생성 시간 초과 (10분)"));
              }
              // 아직 데이터 없음 - 계속 폴링
            } catch (error) {
              if (pollCount >= maxPolls) {
                clearInterval(interval);
                pollIntervalRef.current = null;
                reject(error);
              }
              // 에러 발생해도 계속 재시도
              console.log(`⚠️ 조회 실패, 재시도 중... (${pollCount}/${maxPolls})`);
            }
          }, pollInterval);

          // interval id를 ref에 저장해서 외부에서도 정리 가능하도록
          pollIntervalRef.current = interval;
        });
      };

      // 폴링 시작
      const reportData = await pollForReport();

      // 데이터 설정
      setReportData(reportData);

      // 모든 데이터 수신 완료 → 콘텐츠 방어 전략 보고서 "생성 완료"
      setDefenseStatus("done");

      console.log("🎉 보고서 생성 완료!");

      // "생성 완료" 메시지를 사용자가 볼 수 있도록 약간의 딜레이 후 모달 닫기
      setTimeout(() => {
        setOpenReportLoading(false);
      }, 1500);
    } catch (error) {
      // 사용자가 로딩 모달을 닫아서 취소한 경우에는 에러 알림을 띄우지 않음
      if (error?.message === "REPORT_GENERATION_CANCELLED") {
        console.log("⏹ 보고서 생성 플로우가 사용자에 의해 취소되었습니다.");
      } else {
        console.error("❌ 보고서 생성/조회 실패:", error);
        alert("보고서 생성에 실패했습니다. 다시 시도해주세요.");
      }
      setThreatStatus("idle");
      setDefenseStatus("idle");
      setOpenReportLoading(false);
    }
  };

  // 로딩 모달이 열린 뒤 20초가 지나면
  // 1) 위협 악플 보고서를 "생성 완료"로 표시
  // 2) 콘텐츠 방어 전략 보고서를 "생성 중"으로 전환
  useEffect(() => {
    if (!openReportLoading) return;

    const timer = setTimeout(() => {
      setThreatStatus((prev) => (prev === "in_progress" ? "done" : prev));
      setDefenseStatus((prev) => (prev === "idle" ? "in_progress" : prev));
    }, 20000);

    return () => clearTimeout(timer);
  }, [openReportLoading]);

  // reportData가 없을 때는 빈 화면 표시 (하드코딩 데이터 사용으로 이 부분은 실행되지 않음)
  if (!reportData) {
    return (
      <>
        <div className="w-full flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center gap-6">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight">
              메디 보고서
            </h1>
            <Button
              type="button"
              className="text-base md:text-lg px-8 py-6"
              onClick={startReportGenerationFlow}
            >
              보고서 생성하기
            </Button>
          </div>
        </div>

        {/* 보고서 생성 로딩 모달 */}
        <Dialog open={openReportLoading} onOpenChange={handleReportDialogOpenChange}>
          <DialogContent
            className="!w-[420px] sm:!w-[460px] !h-auto !max-h-none max-w-[95vw] py-7 px-7 flex flex-col items-center gap-6"
            onClose={() => handleReportDialogOpenChange(false)}
          >
            <div className="flex flex-col items-center gap-3">
              {(threatStatus !== "done" || defenseStatus !== "done") && (
                <div className="w-10 h-10 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin" />
              )}
              <DialogTitle className="text-base font-semibold text-gray-900 text-center">
                메디 보고서를 생성하는 중입니다
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 text-center">
                최대 3분 걸릴 수 있어요. 창을 닫지 말고 조금만 기다려 주세요.
              </DialogDescription>
            </div>

            <div className="w-full space-y-3 text-sm">
              {/* 위협 악플 보고서 상태 */}
              <div className="flex items-center gap-3 px-1">
                {threatStatus === "done" ? (
                  <CheckCircle2 className="flex-shrink-0 size-5 text-green-600" />
                ) : threatStatus === "in_progress" ? (
                  <Loader2 className="flex-shrink-0 size-5 text-indigo-500 animate-spin" />
                ) : (
                  <Circle className="flex-shrink-0 size-5 text-gray-300" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    위협 악플 보고서
                  </span>
                  <span className="text-xs text-gray-500">
                    {threatStatus === "done"
                      ? "생성 완료"
                      : threatStatus === "in_progress"
                      ? "생성 중"
                      : "생성 대기"}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-2" />

              {/* 콘텐츠 방어 전략 보고서 상태 */}
              <div className="flex items-center gap-3 px-1">
                {defenseStatus === "done" ? (
                  <CheckCircle2 className="flex-shrink-0 size-5 text-green-600" />
                ) : defenseStatus === "in_progress" ? (
                  <Loader2 className="flex-shrink-0 size-5 text-indigo-500 animate-spin" />
                ) : (
                  <Circle className="flex-shrink-0 size-5 text-gray-300" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    콘텐츠 방어 전략 보고서
                  </span>
                  <span className="text-xs text-gray-500">
                    {defenseStatus === "done"
                      ? "생성 완료"
                      : defenseStatus === "in_progress"
                      ? "생성 중"
                      : "생성 대기"}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  const section1 = reportData.section_1_threat_intelligence;

  // 시간대 데이터 변환 (Object -> Array for Chart)
  const timeChartData = Object.entries(section1.time_patterns.distribution).map(([key, value]) => ({
    name: key.split(' ')[0], // "새벽 (00-06시)" -> "새벽"
    fullLabel: key,
    count: value,
    isRedZone: key === section1.time_patterns.red_zone.time_slot
  }));

  // 위험도 데이터 변환 (for Pie Chart)
  const intensityData = [
    { name: '심각', value: section1.intensity_distribution.critical, color: '#EF4444' },
    { name: '주의', value: section1.intensity_distribution.high, color: '#F97316' },
  ];

  return (
    <div className="w-full flex justify-center">
      {/* 대시보드 스타일의 좌측 정렬 컨테이너 */}
      <div className="w-full max-w-6xl px-6 md:px-8 lg:px-10 py-8 space-y-8">
        {/* 상단 타이틀 + 채널 정보 */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
              메디 보고서
            </h1>
            <p className="mt-1 text-sm md:text-base text-slate-500">
              채널{" "}
              <span className="font-semibold text-slate-900">
                {reportData.channel_name || channelNameFromProps}
              </span>
              의 악플 보고서와 콘텐츠 방어 전략 보고서입니다
            </p>
          </div>
        </div>

        {/* 통계 카드 - 3개의 개별 카드로 구성 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {/* 전체 필터링 */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="px-6 py-4 md:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">전체 필터링</p>
                  <p className="text-xl md:text-2xl font-extrabold text-slate-900 leading-tight">
                    {reportData.total_comments}
                    <span className="text-sm font-semibold ml-0.5">건</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 위험(크리티컬) */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="px-6 py-4 md:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <TriangleAlert className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">위험</p>
                  <p className="text-xl md:text-2xl font-extrabold text-rose-500 leading-tight">
                    {section1.intensity_distribution.critical}
                    <span className="text-sm font-semibold ml-0.5">건</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 주의(High) */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="px-6 py-4 md:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-50 text-amber-500">
                  <TriangleAlert className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">주의</p>
                  <p className="text-xl md:text-2xl font-extrabold text-amber-500 leading-tight">
                    {section1.intensity_distribution.high}
                    <span className="text-sm font-semibold ml-0.5">건</span>
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 하단 메인 리포트 카드 2개 병렬 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 왼쪽: 위협 인텔리전스 리포트 */}
          <Card 
            className="group flex flex-col shadow-sm border border-slate-200 border-t-4 border-t-rose-500 hover:shadow-md hover:border-rose-400 transition-all cursor-pointer"
            onClick={() => setOpenThreatReport(true)}
          >
            <CardContent className="flex h-full gap-6 px-6 py-6">
              {/* 텍스트/배지 영역 */}
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1.5">
                    위협 악플 보고서
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2">
                    악플러들의 작성 패턴과 상습 악플러를 분석해, 우선 대응이 필요한
                    핵심 악플러을 정리한 보고서입니다
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2 text-xs md:text-sm flex-1 min-w-0">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mr-2" />
                      위험 레벨 <span className="ml-1 font-semibold">높음</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mr-2" />
                      위험 시간: <span className="ml-1 font-semibold">새벽</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center text-xs font-medium text-indigo-600 group-hover:text-indigo-700 whitespace-nowrap flex-shrink-0"
                  >
                    상세 보기
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 오른쪽: 콘텐츠 방어 전략 리포트 */}
          <Card 
            className="group flex flex-col shadow-sm border border-slate-200 border-t-4 border-t-indigo-500 hover:shadow-md hover:border-indigo-400 transition-all cursor-pointer"
            onClick={() => setOpenDefenseReport(true)}
          >
            <CardContent className="flex h-full gap-6 px-6 py-6">
              {/* 텍스트/배지 영역 */}
              <div className="flex-1 flex flex-col justify-between h-full">
                <div>
                  <h3 className="text-xl md:text-2xl font-semibold text-gray-900 mb-1.5">
                    콘텐츠 방어 전략 보고서
                  </h3>
                  <p className="text-xs md:text-sm text-gray-600 leading-relaxed line-clamp-2">
                    공격이 집중되는 콘텐츠와 악플러를 분석해, 채널 방어를 위한
                    업로드·운영 가이드라인을 제공합니다
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-2 text-xs md:text-sm flex-1 min-w-0">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 border">
                      권장 건수{" "}
                      <span className="ml-1 font-semibold text-slate-900">
                        5건
                      </span>
                    </div>
                    
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 border">
                      주의 건수{" "}
                      <span className="ml-1 font-semibold text-slate-900">
                        6건
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="inline-flex items-center text-xs font-medium text-indigo-600 group-hover:text-indigo-700 whitespace-nowrap flex-shrink-0"
                  >
                    상세 보기
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 위협 악플 보고서 모달 */}
        <Dialog open={openThreatReport} onOpenChange={setOpenThreatReport}>
          <DialogContent 
            className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-gray-50/50"
            onClose={() => setOpenThreatReport(false)}
          >
            {/* 헤더 - 위협 카드(레드 톤) 색감과 맞춤 (호버 외곽선보다 한 톤 밝은 레드 계열) */}
            <div className="p-4 md:p-6 bg-rose-100 border-b border-rose-300 text-rose-900 shrink-0">
              <DialogHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 mb-1">
                      <span className="text-rose-500 text-xs md:text-sm font-medium">
                        | {new Date(reportData.generated_at).toLocaleDateString()} 생성
                      </span>
                    </div>
                    <DialogTitle className="text-xl md:text-2xl font-bold text-rose-950">
                      위협 악플 보고서
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm md:text-base text-rose-800">
                      메디 에이전트가 총{" "}
                      <span className="font-bold text-rose-900">
                        {reportData.total_comments}건
                      </span>
                      의 위협 악플 데이터를 분석했습니다.
                    </DialogDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={generateThreatReportPDF}
                    disabled={isGeneratingPDF}
                    className="bg-rose-600 hover:bg-rose-700 text-white shrink-0 w-full md:w-auto self-start md:self-auto disabled:opacity-50"
                    size="sm"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="w-4 h-4 md:mr-2 animate-spin" />
                        <span className="hidden sm:inline">생성 중...</span>
                        <span className="sm:hidden">생성 중</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 md:mr-2" />
                        <span className="hidden sm:inline">PDF 다운로드</span>
                        <span className="sm:hidden">다운로드</span>
                      </>
                    )}
                  </Button>
                </div>
              </DialogHeader>
            </div>

            <ScrollArea className="flex-1 min-h-0">
              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* 1. 위험도 분포 (도넛 차트) */}
                  <Card className="border-none shadow-sm lg:col-span-1">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Target className="size-5 text-red-500" />
                        위험도 분포
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center justify-center min-h-[200px]">
                      <div className="w-full h-[180px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={intensityData}
                              cx="50%"
                              cy="50%"
                              innerRadius={50}
                              outerRadius={70}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {intensityData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip 
                              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                            />
                            <Legend verticalAlign="bottom" height={36}/>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="text-center mt-2">
                        <span className="text-3xl font-extrabold text-gray-900">{reportData.total_comments}건</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* 2. 악플 유형 분석 (Top 3) */}
                  <Card className="border-none shadow-sm lg:col-span-2">
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="size-5 text-orange-500" />
                        주요 위협 카테고리 (TOP 3)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {section1.repeat_offenders.top3_categories.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50/80 border border-gray-100 hover:bg-white hover:shadow-sm transition-all">
                          <div className={`
                            flex items-center justify-center size-8 rounded-lg shrink-0 font-bold text-lg
                            ${idx === 0 ? 'bg-red-100 text-red-600' : idx === 1 ? 'bg-orange-100 text-orange-600' : 'bg-gray-200 text-gray-600'}
                          `}>
                            {idx + 1}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1">{item.category}</h4>
                            <p className="text-sm text-gray-600 leading-relaxed keep-all">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 3. 상습 악플러 */}
                  <Card className="border-none shadow-sm h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <UserX className="size-5 text-gray-500" />
                        상습 악플러 프로파일링
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {section1.repeat_offenders.offenders.map((offender, idx) => (
                        <div key={idx} className="bg-white border rounded-xl p-4 shadow-sm">
                          <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                              <div className="size-10 rounded-full bg-red-50 flex items-center justify-center text-red-600 font-bold">
                                {offender.author_name.charAt(1)}
                              </div>
                              <div>
                                <h4 className="font-bold text-gray-900">{offender.author_name}</h4>
                                <p className="text-xs text-red-500 font-medium">⚠️ {offender.total_attacks}회 공격 감지</p>
                              </div>
                            </div>
                          </div>
                          {/* 공격 유형 태그 나열 */}
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(offender.category_distribution).map(([cat, count]) => (
                              count > 0 && (
                                <Badge key={cat} variant="secondary" className="text-[10px] bg-gray-100 text-gray-600 font-normal">
                                  {cat} <span className="ml-1 font-bold text-gray-800">{count}</span>
                                </Badge>
                              )
                            ))}
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  {/* 4. 시간대 분석 (Bar Chart) */}
                  <Card className="border-none shadow-sm h-full">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="size-5 text-gray-500" />
                        악플 집중 시간대
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-red-50 p-3 rounded-lg mb-4 flex gap-3 items-start border border-red-100">
                        <TrendingUp className="size-5 text-red-600 mt-0.5 shrink-0" />
                        <div className="text-sm">
                          <span className="font-bold text-gray-900">{section1.time_patterns.red_zone.time_slot}</span>에 
                          전체 악플의 <span className="font-bold text-red-600">{section1.time_patterns.red_zone.percentage}%</span>가 집중되었습니다.
                        </div>
                      </div>

                      <div className="h-[200px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={timeChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                            <Tooltip 
                              cursor={{fill: 'transparent'}}
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  const data = payload[0].payload;
                                  return (
                                    <div className="bg-gray-900 text-white text-xs p-2 rounded shadow-lg">
                                      <p className="font-bold mb-1">{data.fullLabel}</p>
                                      <p>공격 수: {data.count}건</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]} barSize={40}>
                              {timeChartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.isRedZone ? '#EF4444' : '#E5E7EB'} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* 콘텐츠 방어 전략 보고서 모달 */}
        <Dialog open={openDefenseReport} onOpenChange={setOpenDefenseReport}>
          <DialogContent 
            className="max-w-5xl max-h-[90vh] flex flex-col p-0 overflow-hidden bg-gray-50/50"
            onClose={() => setOpenDefenseReport(false)}
          >
            {/* 헤더 - 방어 카드(블루/인디고 톤) 색감과 맞춤 (호버 외곽선보다 한 톤 밝은 인디고 계열) */}
            <div className="p-4 md:p-6 bg-indigo-100 border-b border-indigo-300 text-slate-900 shrink-0">
              <DialogHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-indigo-600 text-xs md:text-sm font-medium">
                        {new Date(reportData.generated_at).toLocaleDateString()} 분석
                      </span>
                    </div>
                    <DialogTitle className="text-xl md:text-2xl font-bold tracking-tight text-slate-900">
                      콘텐츠 방어 전략 보고서
                    </DialogTitle>
                    <DialogDescription className="mt-1 text-sm md:text-base text-slate-700">
                      악플 데이터 기반의 맞춤형 채널 방어 전략 및 가이드라인입니다.
                    </DialogDescription>
                  </div>
                  <Button
                    type="button"
                    onClick={generateDefenseReportPDF}
                    disabled={isGeneratingPDF}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0 w-full md:w-auto self-start md:self-auto disabled:opacity-50"
                    size="sm"
                  >
                    {isGeneratingPDF ? (
                      <>
                        <Loader2 className="w-4 h-4 md:mr-2 animate-spin" />
                        <span className="hidden sm:inline">생성 중...</span>
                        <span className="sm:hidden">생성 중</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 md:mr-2" />
                        <span className="hidden sm:inline">PDF 다운로드</span>
                        <span className="sm:hidden">다운로드</span>
                      </>
                    )}
                  </Button>
                </div>
              </DialogHeader>
            </div>

            <ScrollArea className="flex-1 min-h-0 bg-white">
              <div className="p-8 space-y-10">
                {/* 악플 다발 영상 분석 (Accordion) */}
                <section>
                  <h3 className="text-lg font-bold text-gray-900 mb-5 flex items-center gap-2 border-l-4 border-red-500 pl-3">
                    악플 다발 영상 심층 분석
                  </h3>
                  <div className="space-y-3">
                    {(reportData.section_2_defense_strategy?.top3_attacked_videos || []).map((video, idx) => {
                      const isExpanded = expandedVideos[video.video_id];
                      const triggerPoint = video.trigger_analysis?.trigger_points?.[0];
                      return (
                        <Card 
                          key={video.video_id} 
                          className={`border rounded-xl shadow-sm transition-all ${
                            isExpanded ? 'border-red-200 ring-1 ring-red-100' : 'border-gray-200'
                          } hover:shadow-md`}
                          style={{ minHeight: 96 }}
                        >
                          <CardHeader 
                            className="pb-3 cursor-pointer px-4"
                            onClick={() => setExpandedVideos(prev => ({
                              ...prev,
                              [video.video_id]: !prev[video.video_id]
                            }))}
                          >
                            <div className="flex items-center justify-between gap-4">
                              {/* 왼쪽: 썸네일 + 순위 배지 */}
                              <div className="flex items-center gap-3">
                                <div className="relative w-[96px] h-[54px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  {/* 썸네일 이미지 (비율 고정) */}
                                  <img
                                    src={video.image_url || "https://i.ytimg.com/vi/rppeR7bHeQw/default.jpg"}
                                    alt={video.video_title}
                                    className="w-full h-full object-cover"
                                  />
                                  {/* 좌측 상단 순위 뱃지 */}
                                  <div
                                    className={`
                                      absolute top-1 left-1 px-2 py-0.5 rounded-full text-[11px] font-semibold
                                      ${idx === 0 ? 'bg-red-600 text-white' : idx === 1 ? 'bg-orange-500 text-white' : 'bg-amber-500 text-white'}
                                    `}
                                  >
                                    {idx + 1}위
                                  </div>
                                </div>
                              </div>

                              {/* 중앙: 제목 + 악플 개수 */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-bold text-gray-900 line-clamp-1 mb-1.5">
                                  {video.video_title}
                                </h4>
                                <div className="flex items-center gap-2 text-xs">
                                  <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-50 text-red-600 font-medium">
                                    <AlertTriangle className="size-3 mr-1" />
                                    악플 {video.attack_count}건
                                  </span>
                                </div>
                              </div>

                              {/* 오른쪽: 펼치기 아이콘 */}
                              <div className="flex-shrink-0">
                                {isExpanded ? (
                                  <ChevronUp className="size-5 text-gray-400" />
                                ) : (
                                  <ChevronDown className="size-5 text-gray-400" />
                                )}
                              </div>
                            </div>
                          </CardHeader>
                          {isExpanded && (
                            <CardContent className="pt-0 px-4 pb-4 space-y-4">
                              {/* 트리거 포인트 - 문제 원인 */}
                              <div className="bg-red-50/50 rounded-lg p-4 border border-red-100">
                                <h5 className="text-sm font-bold text-red-800 mb-3 flex items-center gap-2">
                                  <AlertTriangle className="size-4" /> 악플 원인
                                </h5>
                                <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                                  {triggerPoint?.why_problematic ? (
                                    triggerPoint.why_problematic.split(/[.。]/).filter(s => s.trim()).slice(0, 5).map((sentence, i) => {
                                      const trimmed = sentence.trim();
                                      if (!trimmed || trimmed.length < 10) return null;
                                      return (
                                        <div key={i} className="flex gap-2.5">
                                          <span className="text-red-500 shrink-0 font-bold mt-0.5">•</span>
                                          <span className="flex-1">{trimmed}</span>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <p>데이터 없음</p>
                                  )}
                                </div>
                              </div>

                              {/* 시청자 반응 - 댓글 분석 */}
                              <div className="bg-blue-50/50 rounded-lg p-4 border border-blue-100">
                                <h5 className="text-sm font-bold text-blue-800 mb-3 flex items-center gap-2">
                                  <MessageSquare className="size-4" /> 시청자 반응
                                </h5>
                                <div className="text-sm text-gray-700 leading-relaxed space-y-2">
                                  {triggerPoint?.comment_reaction ? (
                                    triggerPoint.comment_reaction.split(/[.。]/).filter(s => s.trim()).slice(0, 4).map((sentence, i) => {
                                      const trimmed = sentence.trim();
                                      if (!trimmed) return null;
                                      return (
                                        <div key={i} className="flex gap-2.5">
                                          <span className="text-blue-500 shrink-0 font-bold mt-0.5">•</span>
                                          <span className="flex-1">{trimmed}</span>
                                        </div>
                                      );
                                    })
                                  ) : (
                                    <p>데이터 없음</p>
                                  )}
                                </div>
                              </div>

                              {/* 분석 결론 */}
                              <div className="bg-green-50/50 rounded-lg p-4 border border-green-100">
                                <h5 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
                                  <CheckCircle className="size-4" /> 메디 분석 결과
                                </h5>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  <span className="font-bold text-gray-900 bg-yellow-100/80 px-1 rounded">
                                    {video.trigger_analysis?.overall_assessment?.split(/[.。]/)[0] || "데이터 없음"}
                                  </span>
                                  {video.trigger_analysis?.overall_assessment?.split(/[.。]/).slice(1).join('. ') && (
                                    <span className="ml-1">
                                      {video.trigger_analysis.overall_assessment.split(/[.。]/).slice(1).join('. ')}
                                    </span>
                                  )}
                                </p>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                </section>

                {/* 채널 운영 가이드라인 (Tabs) */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 border-l-4 border-blue-500 pl-3">
                      채널 운영 가이드라인
                    </h3>
                  </div>
                  
                  <Tabs defaultValue="do" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-6 p-1 bg-gray-100 rounded-xl relative">
                      {/* 가운데 구분선 */}
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-8 bg-gray-300 z-10" />
                      
                      <TabsTrigger 
                        value="do" 
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-green-700 data-[state=active]:shadow-sm font-bold relative z-20"
                      >
                        <ThumbsUp className="size-4 mr-2" /> 권장 가이드라인
                      </TabsTrigger>
                      <TabsTrigger 
                        value="dont" 
                        className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-red-700 data-[state=active]:shadow-sm font-bold relative z-20"
                      >
                        <ThumbsDown className="size-4 mr-2" /> 주의 가이드라인
                      </TabsTrigger>
                    </TabsList>

                    {/* DO 탭 */}
                    <TabsContent value="do" className="space-y-4">
                      {(reportData.section_2_defense_strategy?.preventive_guidelines?.do_guidelines || []).map((item, idx) => (
                        <div key={idx} className="group relative bg-white border border-gray-200 rounded-xl p-6 hover:border-green-500 hover:shadow-lg transition-all duration-300">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-green-500 rounded-l-xl" />
                          <div className="pl-4">
                            {/* 헤더 & 뱃지 */}
                            <div className="flex items-start justify-between mb-4">
                              <h4 className="text-lg font-bold text-gray-900 leading-snug w-[85%]">
                                {item.guideline}
                              </h4>
                              <div className="bg-green-100 p-2 rounded-full text-green-600 shadow-sm shrink-0 group-hover:bg-green-600 group-hover:text-white transition-colors">
                                <CheckCircle2 className="size-5" />
                              </div>
                            </div>

                            {/* 상세 내용 (Grid로 정보 구조화) */}
                            <div className="grid md:grid-cols-2 gap-4 bg-gray-50/80 rounded-lg p-4 border border-gray-100">
                              {/* WHY 섹션 */}
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider">
                                  <Info className="size-3.5" /> 이유
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {item.reason}
                                </p>
                              </div>

                              {/* EFFECT 섹션 */}
                              <div className="space-y-1.5 relative md:pl-4 md:border-l md:border-gray-200">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider">
                                  <TrendingUpIcon className="size-3.5" /> 기대효과
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  <span className="font-semibold text-blue-600">{item.expected_impact}</span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>

                    {/* DON'T 탭 - 위험도 순으로 정렬 */}
                    <TabsContent value="dont" className="space-y-4">
                      {[...(reportData.section_2_defense_strategy?.preventive_guidelines?.dont_guidelines || [])]
                        .sort((a, b) => {
                          // 🔴 높음이 먼저, 🟠 중간이 나중
                          if (a.risk_level === "🔴 높음" && b.risk_level !== "🔴 높음") return -1;
                          if (a.risk_level !== "🔴 높음" && b.risk_level === "🔴 높음") return 1;
                          return 0;
                        })
                        .map((item, idx) => (
                        <div key={idx} className="group relative bg-white border border-gray-200 rounded-xl p-5 hover:border-red-400 hover:shadow-md transition-all duration-300">
                          <div className="absolute top-0 left-0 w-1.5 h-full bg-red-500 rounded-l-xl" />
                          <div className="pl-4">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="text-lg font-bold text-gray-900 leading-snug w-[85%]">
                                {item.guideline}
                              </h4>
                              <Badge variant="secondary" className="bg-red-50 text-red-600 border-red-100 shrink-0 text-xs font-bold px-2.5 py-1">
                                <span className="mr-1.5">{item.risk_level}</span>
                                <span className="text-red-400"></span>
                              </Badge>
                            </div>
                            <div className="mt-3 bg-gray-50 rounded-lg p-3 flex gap-3 items-start">
                              <XOctagon className="size-4 text-red-500 mt-0.5 shrink-0" />
                              <div>
                                <span className="text-xs font-bold text-red-700 block mb-0.5 uppercase tracking-wider">이유</span>
                                <p className="text-sm text-gray-600">{item.reason}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </section>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>

        {/* 보고서 생성 로딩 모달 (위협 + 방어 전략) */}
        <Dialog open={openReportLoading} onOpenChange={handleReportDialogOpenChange}>
          <DialogContent
            className="!w-[420px] sm:!w-[460px] !h-auto !max-h-none max-w-[95vw] py-7 px-7 flex flex-col items-center gap-6"
            onClose={() => handleReportDialogOpenChange(false)}
          >
            <div className="flex flex-col items-center gap-3">
              {(threatStatus !== "done" || defenseStatus !== "done") && (
                <div className="w-10 h-10 rounded-full border-2 border-indigo-200 border-t-indigo-500 animate-spin" />
              )}
              <DialogTitle className="text-base font-semibold text-gray-900 text-center">
                메디 보고서를 생성하는 중입니다
              </DialogTitle>
              <DialogDescription className="text-xs text-gray-500 text-center">
                최대 3분 걸릴 수 있어요. 창을 닫지 말고 조금만 기다려 주세요.
              </DialogDescription>
            </div>

            <div className="w-full space-y-3 text-sm">
              {/* 위협 악플 보고서 상태 */}
              <div className="flex items-center gap-3 px-1">
                {threatStatus === "done" ? (
                  <CheckCircle2 className="flex-shrink-0 size-5 text-green-600" />
                ) : threatStatus === "in_progress" ? (
                  <Loader2 className="flex-shrink-0 size-5 text-indigo-500 animate-spin" />
                ) : (
                  <Circle className="flex-shrink-0 size-5 text-gray-300" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    위협 악플 보고서
                  </span>
                  <span className="text-xs text-gray-500">
                    {threatStatus === "done"
                      ? "생성 완료"
                      : threatStatus === "in_progress"
                      ? "생성 중"
                      : "생성 대기"}
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-200 my-2" />

              {/* 콘텐츠 방어 전략 보고서 상태 */}
              <div className="flex items-center gap-3 px-1">
                {defenseStatus === "done" ? (
                  <CheckCircle2 className="flex-shrink-0 size-5 text-green-600" />
                ) : defenseStatus === "in_progress" ? (
                  <Loader2 className="flex-shrink-0 size-5 text-indigo-500 animate-spin" />
                ) : (
                  <Circle className="flex-shrink-0 size-5 text-gray-300" />
                )}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-900">
                    콘텐츠 방어 전략 보고서
                  </span>
                  <span className="text-xs text-gray-500">
                    {defenseStatus === "done"
                      ? "생성 완료"
                      : defenseStatus === "in_progress"
                      ? "생성 중"
                      : "생성 대기"}
                  </span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}