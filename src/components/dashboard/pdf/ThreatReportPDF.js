import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
} from "@react-pdf/renderer";
import "./fonts"; // 한글 폰트 등록
import { pdfStyles } from "./PDFStyles";
import {
  PDFHeader,
  PDFSection,
  PDFCard,
  PDFCardHeader,
  PDFBadge,
  PDFStatCard,
  PDFDivider,
  PDFAlertBox,
  PDFListItem,
  PDFGrid,
  PDFGrid3,
  PDFSpacer,
} from "./PDFComponents";
import { PieChart } from "./charts/PieChart";
import { BarChart } from "./charts/BarChart";

/**
 * 위협 악플 보고서 PDF 템플릿
 * @param {Object} reportData - 보고서 데이터
 */
export const ThreatReportPDF = ({ reportData }) => {
  const section1 = reportData.section_1_threat_intelligence;
  const channelName = reportData.channel_name || "채널";
  const generatedAt = new Date(reportData.generated_at).toLocaleDateString("ko-KR");
  const totalComments = reportData.total_comments || 0;

  // 시간대 데이터 변환
  const timeChartData = Object.entries(
    section1.time_patterns.distribution
  ).map(([key, value]) => ({
    name: key.split(" ")[0],
    fullLabel: key,
    count: value,
    isRedZone: key === section1.time_patterns.red_zone.time_slot,
  }));

  // 위험도 데이터
  const intensityData = [
    {
      name: "심각",
      value: section1.intensity_distribution.critical,
      color: "#EF4444",
    },
    {
      name: "주의",
      value: section1.intensity_distribution.high,
      color: "#F97316",
    },
  ];

  return (
    <Document>
      {/* 페이지 1: 헤더 + 통계 + 위험도 분포 */}
      <Page size="A4" style={pdfStyles.page}>
        <PDFHeader
          title="위협 악플 보고서"
          subtitle={`| ${generatedAt} 생성`}
          description={`메디 에이전트가 총 ${totalComments}건의 위협 악플 데이터를 분석했습니다.`}
          variant="red"
        />

        <PDFSpacer height={20} />

        {/* 통계 카드 3개 */}
        <PDFGrid3
          col1={
            <PDFStatCard
              label="전체 필터링"
              value={totalComments}
              unit="건"
              color="indigo"
            />
          }
          col2={
            <PDFStatCard
              label="위험"
              value={section1.intensity_distribution.critical}
              unit="건"
              color="red"
            />
          }
          col3={
            <PDFStatCard
              label="주의"
              value={section1.intensity_distribution.high}
              unit="건"
              color="amber"
            />
          }
        />

        <PDFSpacer height={30} />

        {/* 위험도 분포 Pie Chart */}
        <PDFCard>
          <PDFCardHeader title="위험도 분포" />
          <View style={pdfStyles.chartWrapper}>
            <PieChart data={intensityData} size={200} />
          </View>
        </PDFCard>
      </Page>

      {/* 페이지 2: 주요 위협 카테고리 + 상습 악플러 */}
      <Page size="A4" style={pdfStyles.page}>
        {/* 주요 위협 카테고리 */}
        <PDFSection title="주요 위협 카테고리 (TOP 3)">
          {section1.repeat_offenders.top3_categories.map((item, idx) => (
            <View key={idx} style={pdfStyles.categoryItem}>
              <View style={pdfStyles.categoryNumber}>
                <Text style={pdfStyles.categoryNumberText}>{idx + 1}</Text>
              </View>
              <View style={pdfStyles.categoryContent}>
                <Text style={pdfStyles.categoryTitle}>{item.category}</Text>
                <Text style={pdfStyles.categoryDescription}>
                  {item.description}
                </Text>
              </View>
            </View>
          ))}
        </PDFSection>

        <PDFSpacer height={20} />

        {/* 상습 악플러 */}
        <PDFSection title="상습 악플러 프로파일링">
          {section1.repeat_offenders.offenders.map((offender, idx) => (
            <View key={idx} style={pdfStyles.offenderCard}>
              <View style={pdfStyles.offenderHeader}>
                <View style={pdfStyles.offenderAvatar}>
                  <Text style={pdfStyles.offenderAvatarText}>
                    {offender.author_name.charAt(1)}
                  </Text>
                </View>
                <View style={pdfStyles.offenderInfo}>
                  <Text style={pdfStyles.offenderName}>
                    {offender.author_name}
                  </Text>
                  <Text style={pdfStyles.offenderAttacks}>
                    [경고] {offender.total_attacks}회 공격 감지
                  </Text>
                </View>
              </View>
              <View style={pdfStyles.offenderTags}>
                {Object.entries(offender.category_distribution).map(
                  ([cat, count]) =>
                    count > 0 && (
                      <PDFBadge
                        key={cat}
                        text={`${cat} ${count}`}
                        variant="gray"
                        style={pdfStyles.offenderTag}
                      />
                    )
                )}
              </View>
            </View>
          ))}
        </PDFSection>
      </Page>

      {/* 페이지 3: 악플 집중 시간대 */}
      <Page size="A4" style={pdfStyles.page}>
        <PDFSection title="악플 집중 시간대">
          <PDFAlertBox
            message={`${section1.time_patterns.red_zone.time_slot}에 전체 악플의 ${section1.time_patterns.red_zone.percentage}%가 집중되었습니다.`}
            variant="red"
          />

          <PDFSpacer height={20} />

          <BarChart
            data={timeChartData}
            redZone={section1.time_patterns.red_zone}
            width={500}
            height={250}
          />
        </PDFSection>
      </Page>
    </Document>
  );
};

