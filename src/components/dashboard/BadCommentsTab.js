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
  "generated_at": "2025-12-06T22:00:10.236107",
  "total_comments": 57,
  "statistics_summary": {
    "total_filtered": 57,
    "repeat_offenders_count": 2
  },
  "section_1_threat_intelligence": {
    "section_title": "🔍 위협 인텔리전스",
    "generated_at": "2025-12-06T21:58:42.199940",
    "repeat_offenders": {
      "top3_categories": [
        {
          "category": "인신공격/외모비하",
          "description": "특정 크리에이터를 직접 겨냥한 욕설·모욕, 외모·능력·정체성 등을 폄하하는 표적화된 공격이 대다수입니다."
        },
        {
          "category": "성적 대상화/성희롱",
          "description": "성적 제안·희롱·노골적 성적 표현(섹드립)으로 대상에게 수치심이나 피해를 주는 발언이 다수 존재합니다."
        },
        {
          "category": "성별 비하/여성혐오",
          "description": "여성(혹은 특정 성별)을 일반화·경멸하는 표현과 혐오적 비하가 반복적으로 나타납니다."
        }
      ],
      "offenders": [
        {
          "author_name": "@석-b7e",
          "total_attacks": 3,
          "category_distribution": {
            "인신공격/외모비하": 3,
            "성적 대상화/성희롱": 0,
            "성별 비하/여성혐오": 2
          }
        },
        {
          "author_name": "@JAYJAY-em6mz",
          "total_attacks": 2,
          "category_distribution": {
            "인신공격/외모비하": 1,
            "성적 대상화/성희롱": 0,
            "성별 비하/여성혐오": 1
          }
        }
      ],
      "status": "발견됨"
    },
    "intensity_distribution": {
      "critical": 11,
      "high": 46,
      "total": 57
    },
    "time_patterns": {
      "distribution": {
        "새벽 (00-06시)": 17,
        "오전 (06-12시)": 20,
        "오후 (12-18시)": 15,
        "저녁 (18-22시)": 3,
        "심야 (22-24시)": 2
      },
      "red_zone": {
        "time_slot": "오전 (06-12시)",
        "count": 20,
        "percentage": 35.1
      }
    }
  },
  "section_2_defense_strategy": {
    "section_title": "🛡️ 콘텐츠 방어 전략",
    "generated_at": "2025-12-06T22:00:10.236107",
    "top3_attacked_videos": [
      {
        "video_id": "1psIOlLouP0",
        "video_title": "한국에서 연애 못하면 일본여자 만나면 될까?",
        "video_thumbnail": "https://i.ytimg.com/vi/1psIOlLouP0/hqdefault.jpg",
        "attack_count": 10,
        "transcript_preview": "스크립트 정보 없음",
        "trigger_analysis": {
          "trigger_points": [
            {
              "trigger_quote": "[추정] \"한국에서 연애 못하면 일본여자 만나면 되지\"",
              "why_problematic": "특정 국적·성별(일본여자 vs 한국여자)을 단순 비교해 일본여성을 대체 가능하고 더 호의적인 대상으로 일반화하는 발언입니다. 여성들을 '해결책'으로 소비하고 한국 여성에 대해 깎아내리는 서술은 성차별적·국적차별적 고정관념을 조장하고 대상 집단의 자존감과 정체성에 대한 공격으로 인식됩니다.",
              "comment_reaction": "크리에이터 능력·인격 공격('이분 잘 모르시네', '퇴물'), 집단 비방(한국여자 비하), '가스라이팅'·'정신병' 같은 강한 표현으로 분노·혐오 표출."
            },
            {
              "trigger_quote": "[추정] \"일본여자들은 리액션이 좋고 작은 것에도 고마워할 줄 알아서 한국 남자한테 더 잘 맞는다\"",
              "why_problematic": "일본 여성의 성격을 단일하고 수동적인 특성으로 환원하고, 한국 여성은 까다롭다는 식의 비교는 성별·국적에 대한 고정관념과 성적 대상화로 이어집니다. 또한 '한국 남자'의 문제를 타국 여성과의 관계 해결로 제시하는 방식은 책임전가·편견을 부추깁니다.",
              "comment_reaction": "일부는 내용의 사실성·전문성 부족을 지적('잘 모르는 내용을 주워들었다'), 일부는 집단·개인에 대한 모욕(연령·외모·정신 상태 비하), 가스라이팅·정신승리 비난 등 감정적 반발."
            }
          ],
          "overall_assessment": "스크립트가 제공되지 않아 발언은 댓글들을 바탕으로 추정했습니다. 댓글 패턴으로 보아 '국적·성별을 단일화해 비교·대체'하는 표현이 핵심 트리거로 작용해 강한 분노와 집단 비하 반응을 유발한 것으로 판단됩니다."
        }
      },
      {
        "video_id": "-4M7Wq0em8g",
        "video_title": "내가 잘생겼는지 예쁜지 궁금할 때 아는 방법",
        "video_thumbnail": "https://i.ytimg.com/vi/-4M7Wq0em8g/hqdefault.jpg",
        "attack_count": 8,
        "transcript_preview": "스크립트 정보 없음",
        "trigger_analysis": {
          "trigger_points": [
            {
              "trigger_quote": "명확한 트리거 식별 어려움",
              "why_problematic": "스크립트 원문이 제공되지 않아 특정 발언을 인용할 수 없습니다. 다만 악플 패턴으로 미루어볼 때 영상에서 (1) 출연자 외모나 성형 여부를 직접적으로 언급하거나 확대해서 보여주는 장면(또는 발언), (2) 신체 특정 부위(예: 코)를 비하하거나 조롱할 만한 표현/연출, 혹은 (3) 폭력성 또는 성적·학대 관련한 묘사가 있었을 가능성이 큽니다. 이러한 요소는 개인을 표적화하여 모욕·수치심을 유발하고, 일부 댓글처럼 아동·청소년 연관 성적 서술을 촉발할 경우 플랫폼 안전 정책 위반 민감도를 크게 높입니다.",
              "comment_reaction": "댓글들은 주로 외모 비하(성형 의혹·못생김·코 비뚤다 등), 인신공격(폭력적이라는 지적 포함), 그리고 한 건은 미성년자 관련 성적 서술을 포함한 고발성 발언으로 나뉩니다. 전반적으로 댓글자들은 영상이나 출연자의 외모/과거에 대해 표적화된 조롱·비난을 즉각적으로 쏟아내며, 일부는 감정적인 분노(조롱·모욕·비하)로 반응하고 있습니다."
            }
          ],
          "overall_assessment": "스크립트가 없어 정확한 발언을 특정하기는 어렵습니다. 제공된 악플은 주로 외모·성형 관련 지적과 표적화된 모욕(및 한 건의 아동·청소년 관련 성적 서술)으로 구성되어 있어, 영상 내 외모 언급·노출·논란성 묘사가 분노 유발의 핵심 트리거였을 가능성이 높습니다."
        }
      },
      {
        "video_id": "yaQoGDn64a8",
        "video_title": "나이들수록 주변에 괜찮은사람이 없는 이유",
        "video_thumbnail": "https://i.ytimg.com/vi/yaQoGDn64a8/hqdefault.jpg",
        "attack_count": 7,
        "transcript_preview": "스크립트 정보 없음",
        "trigger_analysis": {
          "trigger_points": [
            {
              "trigger_quote": "결혼했다고 해서 괜찮은 사람이 아님(※댓글에서 유추된 발언)",
              "why_problematic": "결혼 여부로 사람의 '괜찮음'을 일반화하는 표현으로 특정 집단을 편견적으로 규정합니다. 근거 없는 일반화는 시청자의 공감을 잃게 하고, 대상 집단(기혼자/미혼자)을 불필요하게 폄하하게 됩니다.",
              "comment_reaction": "시청자들이 '일반화의 오류'를 지적하며 반박(논리적 비판)하는 대신 감정적으로 격앙되어 조롱·모욕(예: '쇼츠.. 결혼했다고 해서 괜찮은 사람이 아님 ㅋㅋ')으로 응수함."
            },
            {
              "trigger_quote": "사람들에게 '하자'가 있다/하자 있는 사람들(※댓글에서 유추된 발언)",
              "why_problematic": "사람을 '하자'처럼 결함 있는 물건 취급하는 표현은 비하·비인간화로 받아들여질 수 있어 강한 반발을 일으킵니다. 개인의 결점을 일반화·비하하는 어조는 대화의 의도를 넘어 인신공격을 유발합니다.",
              "comment_reaction": "직접적인 인신공격·조롱(예: '모지라', '너도 참 ...')로 반응하며 감정적 충돌이 확대됨."
            },
            {
              "trigger_quote": "\"뭐 잘생긴 사람은 궁금하지 않아서 클릭하지 않는다\"(※댓글 인용문 추정)",
              "why_problematic": "특정 외모군을 깎아내리거나 무시하는 듯한 표현은 청중에게 거만하거나 모순적으로 비춰질 수 있습니다. 특히 제작자 외모에 대한 민감도가 높은 플랫폼에서는 발언이 개인 공격으로 확산될 위험이 큽니다.",
              "comment_reaction": "제작자 외모·성형·탈모 등 개인 신체·외모 공격으로 반응(예: '성형', '탈모' 언급)하며 내용 비판을 넘어선 악플이 다수 발생함."
            }
          ],
          "overall_assessment": "댓글들을 종합하면 시청자의 분노는 '집단을 규정·비하하는 일반화 발언'과 '사람을 결함으로 표현하는 모욕적 어조'에서 촉발된 것으로 보입니다. 스크립트가 제공되지 않아 문구는 댓글을 통해 추정한 것이므로, 원문 확인 시 일부 식별은 달라질 수 있습니다."
        }
      }
    ],
    "preventive_guidelines": {
      "do_guidelines": [
        {
          "guideline": "업로드 시간 조정: 오전 06-12시(레드존)을 피하고 시청자 반응이 보다 온화한 오후·저녁 시간에 게시하거나 예약 업로드를 사용하세요.",
          "reason": "분석 결과 오전 시간대에 악플·감정적 반응이 집중됩니다. 즉시 노출을 줄이면 초기 악성 댓글 확산을 막을 수 있습니다.",
          "expected_impact": "초기 악플 발생 빈도 감소, 모더레이션 부담 완화, 커뮤니티 분위기 관리 용이"
        },
        {
          "guideline": "출시 전 민감도 체크와 내부 검토를 시행하세요: 제목·썸네일·설명에 '국적·나이·성별 일반화' 표현이 없는지 검토하고, 필요시 외부감수자(또는 신뢰할 수 있는 팀원)에게 피드백을 받으세요.",
          "reason": "'한국에서 연애 못하면 일본여자…', '나이들수록 주변에…'처럼 민감한 주제는 잘못된 표현 하나로 대상화·비하·오해를 유발합니다.",
          "expected_impact": "오해의 소지 제거로 특정 그룹 대상 공격 감소, 조회수는 유지하면서 부정적 반응 최소화"
        },
        {
          "guideline": "댓글 중재와 필터링을 강화하세요: 금칙어 자동필터, 신고 우선 처리, '댓글 보류(사전승인)' 옵션, 레드존에 맞춘 모더레이터 근무 스케줄을 적용하세요.",
          "reason": "악성댓글은 업로드 직후 집중 발생하므로 자동화와 인력 배치가 피해 확산을 막는 핵심입니다.",
          "expected_impact": "악성 댓글 비공개·삭제 속도 향상, 커뮤니티 규범 유지, 건전한 토론 환경 조성"
        },
        {
          "guideline": "문제 제기는 하되 해결 중심·공감형 어조로 구성하세요: 개인 탓·일반화 대신 사례·데이터·전문가 의견을 인용하고, 보조 설명(예: '개인적 경험입니다', '모든 경우가 아닙니다')을 명시하세요.",
          "reason": "공격적 표현은 감정적 분노를 촉발해 악플 유입을 늘립니다. 건설적 프레임은 논쟁을 줄이고 대화로 유도합니다.",
          "expected_impact": "댓글의 질 향상, 개인공격 감소, 긍정적 참여자 비율 증가"
        },
        {
          "guideline": "위기 대응 매뉴얼을 마련하고 고정 공지·핀댓글을 준비하세요: 악플 폭주 시 사용할 표준 응답문구, 신고 절차 안내, 법적·플랫폼 대응 기준을 정리해 팀과 공유하세요.",
          "reason": "사전 계획이 없으면 초기 대응이 혼선되어 상황이 악화됩니다. 고정 공지로 시청자에게 명확한 규칙을 제시하세요.",
          "expected_impact": "신속하고 일관된 대응, 브랜드 신뢰 유지, 장기적 피해·법적 리스크 감소"
        }
      ],
      "dont_guidelines": [
        {
          "guideline": "특정 국가·성별·연령을 일반화하거나 희화화하는 제목·표현을 사용하지 마세요.",
          "reason": "대상화·스테레오타이핑이 집단적 분노와 혐오성 댓글을 유발하며 플랫폼 제재 대상이 될 수 있습니다.",
          "risk_level": "🔴높음"
        },
        {
          "guideline": "논쟁 유도형 클릭베이트(과도한 자극적 문구·도발적 썸네일)를 사용하지 마세요.",
          "reason": "클릭률은 오를 수 있으나 트롤과 악성 댓글을 불러와 커뮤니티 질서를 해칩니다.",
          "risk_level": "🔴높음"
        },
        {
          "guideline": "레드존(오전 06-12시)에 라이브 방송이나 논쟁 유발 콘텐츠를 게시하지 마세요.",
          "reason": "해당 시간대는 부정적 반응이 집중되는 시간대이므로 관리·대응이 어려워집니다.",
          "risk_level": "🔴높음"
        },
        {
          "guideline": "악플에 감정적으로 대응하거나 공개적으로 논쟁을 심화시키지 마세요 (개인 공격·보복성 댓글 금지).",
          "reason": "감정적 대응은 상황을 증폭시키고 추가 악성 댓글과 확산을 초래합니다.",
          "risk_level": "🟠중간"
        },
        {
          "guideline": "댓글 관리 및 신고 절차를 무시하거나 모더레이션을 해제해 방치하지 마세요.",
          "reason": "관리 부재는 악성댓글의 자연 증폭을 허용해 채널 이미지와 시청자 안전을 해칩니다.",
          "risk_level": "🔴높음"
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
                      video_thumbnail: video.video_thumbnail || video.image_url || "https://i.ytimg.com/vi/rppeR7bHeQw/default.jpg",
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
  const section2 = reportData.section_2_defense_strategy;

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

  // 위험 레벨 계산 (critical이 많으면 높음)
  const getRiskLevel = () => {
    const critical = section1.intensity_distribution.critical || 0;
    const high = section1.intensity_distribution.high || 0;
    const total = critical + high;
    if (total === 0) return "낮음";
    const criticalRatio = critical / total;
    if (criticalRatio >= 0.3) return "매우 높음";
    if (criticalRatio >= 0.15) return "높음";
    if (criticalRatio >= 0.05) return "보통";
    return "낮음";
  };

  // 위험 시간대 (레드존 시간대에서 앞부분만 추출)
  const getRiskTime = () => {
    const redZoneTime = section1.time_patterns.red_zone.time_slot || "";
    return redZoneTime.split(' ')[0] || "없음"; // "오전 (06-12시)" -> "오전"
  };

  // 권장 건수 및 주의 건수
  const doGuidelinesCount = section2?.preventive_guidelines?.do_guidelines?.length || 0;
  const dontGuidelinesCount = section2?.preventive_guidelines?.dont_guidelines?.length || 0;

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

          {/* 심각(크리티컬) */}
          <Card className="shadow-sm border-slate-200">
            <CardContent className="px-6 py-4 md:py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                  <TriangleAlert className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-xs text-slate-500">심각</p>
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

                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                  <div className="flex flex-col md:flex-row gap-2 text-xs md:text-sm md:flex-1 md:min-w-0">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mr-2" />
                      위험 레벨: <span className="ml-1 font-semibold">{getRiskLevel()}</span>
                    </div>
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-100 whitespace-nowrap">
                      <span className="w-2 h-2 rounded-full bg-rose-500 mr-2" />
                      위험 시간: <span className="ml-1 font-semibold">{getRiskTime()}</span>
                    </div>
                  </div>

                  <div className="flex justify-end md:block">
                    <button
                      type="button"
                      className="inline-flex items-center text-xs font-medium text-gray-900 group-hover:text-black whitespace-nowrap"
                    >
                      상세 보기
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
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

                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-4">
                  <div className="flex flex-col md:flex-row gap-2 text-xs md:text-sm md:flex-1 md:min-w-0">
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 border whitespace-nowrap">
                      권장 건수{" "}
                      <span className="ml-1 font-semibold text-slate-900">
                        {doGuidelinesCount}건
                      </span>
                    </div>
                    
                    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-slate-50 text-slate-700 border whitespace-nowrap">
                      주의 건수{" "}
                      <span className="ml-1 font-semibold text-slate-900">
                        {dontGuidelinesCount}건
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-end md:block">
                    <button
                      type="button"
                      className="inline-flex items-center text-xs font-medium text-gray-900 group-hover:text-black whitespace-nowrap"
                    >
                      상세 보기
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
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
                        <span className="text-3xl font-extrabold text-gray-900">총 {reportData.total_comments}건</span>
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
                              <div>
                                <h4 className="font-bold text-gray-900">{offender.author_name}</h4>
                                <p className="text-xs text-red-500 font-medium">⚠️ {offender.total_attacks}건 악플 감지</p>
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
                          전체 악플의 <span className="font-bold text-red-600">{section1.time_patterns.red_zone.percentage}%</span>가 집중되었습니다
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
                                <div className="relative w-[156px] h-[88px] rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                  {/* 썸네일 이미지 (비율 고정) */}
                                  <img
                                    src={video.video_thumbnail || video.image_url || "https://i.ytimg.com/vi/rppeR7bHeQw/default.jpg"}
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
                              <div className="flex-1 min-w-0 ml-2">
                                <h4 className="text-base font-bold text-gray-900 line-clamp-1 mb-1.5">
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
                          // 🔴높음이 먼저, 🟠중간이 나중
                          if (a.risk_level === "🔴높음" && b.risk_level !== "🔴높음") return -1;
                          if (a.risk_level !== "🔴높음" && b.risk_level === "🔴높음") return 1;
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