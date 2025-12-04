import React from "react";
import {
  Document,
  Page,
  View,
  Text,
} from "@react-pdf/renderer";
import "./fonts"; // 한글 폰트 등록
import { pdfStyles } from "./PDFStyles";
import {
  PDFHeader,
  PDFSection,
  PDFCard,
  PDFBadge,
  PDFDivider,
  PDFAlertBox,
  PDFListItem,
  PDFSpacer,
} from "./PDFComponents";

/**
 * 콘텐츠 방어 전략 보고서 PDF 템플릿
 * @param {Object} reportData - 보고서 데이터
 */
export const DefenseReportPDF = ({ reportData }) => {
  const section2 = reportData.section_2_defense_strategy;
  const channelName = reportData.channel_name || "채널";
  const generatedAt = new Date(reportData.generated_at).toLocaleDateString("ko-KR");
  const top3Videos = section2.top3_attacked_videos || [];
  const doGuidelines = section2.preventive_guidelines?.do_guidelines || [];
  const dontGuidelines = section2.preventive_guidelines?.dont_guidelines || [];

  // 위험도 순으로 정렬 (이모지 제거 후 텍스트로 비교)
  const sortedDontGuidelines = [...dontGuidelines].sort((a, b) => {
    const aLevel = a.risk_level?.replace(/🔴|⚠️|⚠/g, "").trim() || "";
    const bLevel = b.risk_level?.replace(/🔴|⚠️|⚠/g, "").trim() || "";
    if (aLevel === "높음" && bLevel !== "높음") return -1;
    if (aLevel !== "높음" && bLevel === "높음") return 1;
    return 0;
  });

  return (
    <Document>
      {/* 페이지 1: 헤더 + 악플 다발 영상 분석 */}
      <Page size="A4" style={pdfStyles.page}>
        <PDFHeader
          title="콘텐츠 방어 전략 보고서"
          subtitle={`${generatedAt} 분석`}
          description="악플 데이터 기반의 맞춤형 채널 방어 전략 및 가이드라인입니다."
          variant="blue"
        />

        <PDFSpacer height={20} />

        {/* 악플 다발 영상 심층 분석 */}
        <PDFSection title="악플 다발 영상 심층 분석">
          {top3Videos.map((video, idx) => {
            const triggerPoint = video.trigger_analysis?.trigger_points?.[0];
            return (
              <View key={video.video_id} style={pdfStyles.videoCard}>
                <View style={pdfStyles.videoHeader}>
                  <View
                    style={[
                      pdfStyles.videoNumber,
                      idx === 0 && pdfStyles.videoNumberRed,
                      idx === 1 && pdfStyles.videoNumberOrange,
                      idx === 2 && pdfStyles.videoNumberAmber,
                    ]}
                  >
                    <Text style={pdfStyles.videoNumberText}>{idx + 1}</Text>
                  </View>
                  <View style={pdfStyles.videoInfo}>
                    <Text style={pdfStyles.videoTitle}>{video.video_title}</Text>
                    <Text style={pdfStyles.videoAttackCount}>
                       악플 {video.attack_count}건
                    </Text>
                  </View>
                </View>

                {/* 악플 원인 */}
                {triggerPoint?.why_problematic && (
                  <View style={pdfStyles.videoSection}>
                    <Text style={pdfStyles.videoSectionTitle}>
                       악플 원인
                    </Text>
                    {triggerPoint.why_problematic
                      .split(/[.。]/)
                      .filter((s) => s.trim())
                      .slice(0, 5)
                      .map((sentence, i) => {
                        const trimmed = sentence.trim();
                        if (!trimmed || trimmed.length < 10) return null;
                        return (
                          <PDFListItem
                            key={i}
                            content={trimmed}
                            bullet="•"
                            style={pdfStyles.videoListItem}
                          />
                        );
                      })}
                  </View>
                )}

                {/* 시청자 반응 */}
                {triggerPoint?.comment_reaction && (
                  <View style={[pdfStyles.videoSection, pdfStyles.videoSectionBlue]}>
                    <Text style={[pdfStyles.videoSectionTitle, { color: "#1E40AF" }]}>
                       시청자 반응
                    </Text>
                    {triggerPoint.comment_reaction
                      .split(/[.。]/)
                      .filter((s) => s.trim())
                      .slice(0, 4)
                      .map((sentence, i) => {
                        const trimmed = sentence.trim();
                        if (!trimmed) return null;
                        return (
                          <PDFListItem
                            key={i}
                            content={trimmed}
                            bullet="•"
                            style={pdfStyles.videoListItem}
                          />
                        );
                      })}
                  </View>
                )}

                {/* 분석 결과 */}
                {video.trigger_analysis?.overall_assessment && (
                  <View style={[pdfStyles.videoSection, pdfStyles.videoSectionGreen]}>
                    <Text style={[pdfStyles.videoSectionTitle, { color: "#065F46" }]}>
                       메디 분석 결과
                    </Text>
                    <Text style={pdfStyles.videoAssessment}>
                      {video.trigger_analysis.overall_assessment}
                    </Text>
                  </View>
                )}

                {idx < top3Videos.length - 1 && <PDFDivider style={{ marginVertical: 15 }} />}
              </View>
            );
          })}
        </PDFSection>
      </Page>

      {/* 페이지 2+: 권장 가이드라인 */}
      <Page size="A4" style={pdfStyles.page}>
        <PDFSection title="채널 운영 가이드라인 - 권장 가이드라인">
          {doGuidelines.map((item, idx) => (
            <View key={idx} style={pdfStyles.guidelineCard}>
              <View style={pdfStyles.guidelineHeader}>
                <Text style={pdfStyles.guidelineTitle}>{item.guideline}</Text>
                <View style={pdfStyles.guidelineIconGreen}>
                  <Text style={pdfStyles.guidelineIconText}>✓</Text>
                </View>
              </View>

              <View style={pdfStyles.guidelineContent}>
                <View style={pdfStyles.guidelineReason}>
                  <Text style={pdfStyles.guidelineLabel}> 이유</Text>
                  <Text style={pdfStyles.guidelineText}>{item.reason}</Text>
                </View>
                <View style={pdfStyles.guidelineEffect}>
                  <Text style={[pdfStyles.guidelineLabel, { color: "#059669" }]}>
                     기대효과
                  </Text>
                  <Text style={pdfStyles.guidelineText}>{item.expected_impact}</Text>
                </View>
              </View>

              {idx < doGuidelines.length - 1 && <PDFDivider style={{ marginTop: 15 }} />}
            </View>
          ))}
        </PDFSection>
      </Page>

      {/* 페이지 3+: 주의 가이드라인 */}
      <Page size="A4" style={pdfStyles.page}>
        <PDFSection title="채널 운영 가이드라인 - 주의 가이드라인">
          {sortedDontGuidelines.map((item, idx) => (
            <View key={idx} style={pdfStyles.guidelineCard}>
              <View style={pdfStyles.guidelineHeader}>
                <Text style={pdfStyles.guidelineTitle}>{item.guideline}</Text>
                
              </View>

              <View style={pdfStyles.guidelineDontContent}>
                <Text style={pdfStyles.guidelineDontLabel}>이유</Text>
                <Text style={pdfStyles.guidelineText}>{item.reason}</Text>
              </View>

              {idx < sortedDontGuidelines.length - 1 && <PDFDivider style={{ marginTop: 15 }} />}
            </View>
          ))}
        </PDFSection>
      </Page>
    </Document>
  );
};

