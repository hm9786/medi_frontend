import React from "react";
import { View, Text, StyleSheet } from "@react-pdf/renderer";
import { pdfStyles } from "./PDFStyles";

/**
 * PDF 헤더 컴포넌트
 * @param {string} title - 보고서 제목
 * @param {string} subtitle - 부제목 (생성일 등)
 * @param {string} description - 설명 텍스트
 * @param {string} variant - 'red' | 'blue' (색상 테마)
 */
export const PDFHeader = ({ title, subtitle, description, variant = "red" }) => {
  const headerStyle =
    variant === "red" ? pdfStyles.redHeader : pdfStyles.blueHeader;
  const titleStyle =
    variant === "red" ? pdfStyles.redHeaderTitle : pdfStyles.blueHeaderTitle;
  const descStyle =
    variant === "red" ? pdfStyles.redHeaderDesc : pdfStyles.blueHeaderDesc;

  return (
    <View style={headerStyle}>
      {subtitle && (
        <Text style={pdfStyles.headerSubtitle}>{subtitle}</Text>
      )}
      <Text style={titleStyle}>{title}</Text>
      {description && <Text style={descStyle}>{description}</Text>}
    </View>
  );
};

/**
 * PDF 섹션 컨테이너
 * @param {string} title - 섹션 제목
 * @param {React.ReactNode} children - 섹션 내용
 * @param {object} style - 추가 스타일
 */
export const PDFSection = ({ title, children, style }) => {
  return (
    <View style={[pdfStyles.section, style]}>
      {title && <Text style={pdfStyles.sectionTitle}>{title}</Text>}
      {children}
    </View>
  );
};

/**
 * PDF 카드 컴포넌트
 * @param {React.ReactNode} children - 카드 내용
 * @param {object} style - 추가 스타일
 */
export const PDFCard = ({ children, style }) => {
  return <View style={[pdfStyles.card, style]}>{children}</View>;
};

/**
 * PDF 카드 헤더
 * @param {string} title - 카드 제목
 * @param {React.ReactNode} icon - 아이콘 (선택)
 */
export const PDFCardHeader = ({ title, icon }) => {
  return (
    <View style={pdfStyles.cardHeader}>
      {icon && <View style={pdfStyles.cardIcon}>{icon}</View>}
      <Text style={pdfStyles.cardTitle}>{title}</Text>
    </View>
  );
};

/**
 * PDF 배지/태그 컴포넌트
 * @param {string} text - 배지 텍스트
 * @param {string} variant - 'red' | 'blue' | 'gray' | 'green'
 * @param {object} style - 추가 스타일
 */
export const PDFBadge = ({ text, variant = "gray", style }) => {
  const badgeStyle =
    variant === "red"
      ? pdfStyles.redBadge
      : variant === "blue"
      ? pdfStyles.blueBadge
      : variant === "green"
      ? pdfStyles.greenBadge
      : pdfStyles.grayBadge;

  return (
    <View style={[badgeStyle, style]}>
      <Text style={pdfStyles.badgeText}>{text}</Text>
    </View>
  );
};

/**
 * PDF 통계 카드 (3개 그리드용)
 * @param {string} label - 라벨
 * @param {string|number} value - 값
 * @param {string} unit - 단위 (예: '건')
 * @param {string} color - 색상 ('red' | 'amber' | 'indigo')
 */
export const PDFStatCard = ({ label, value, unit = "", color = "indigo" }) => {
  const colorMap = {
    red: { bg: "#FEE2E2", text: "#B91C1C" },
    amber: { bg: "#FEF3C7", text: "#D97706" },
    indigo: { bg: "#E0E7FF", text: "#4F46E5" },
  };

  const colors = colorMap[color] || colorMap.indigo;

  return (
    <View
      style={[
        pdfStyles.statCard,
        { backgroundColor: colors.bg, borderColor: colors.text + "40" },
      ]}
    >
      <Text style={[pdfStyles.statLabel, { color: colors.text }]}>
        {label}
      </Text>
      <View style={pdfStyles.statValueContainer}>
        <Text style={[pdfStyles.statValue, { color: colors.text }]}>
          {value}
        </Text>
        {unit && (
          <Text style={[pdfStyles.statUnit, { color: colors.text }]}>
            {unit}
          </Text>
        )}
      </View>
    </View>
  );
};

/**
 * PDF 구분선
 * @param {object} style - 추가 스타일
 */
export const PDFDivider = ({ style }) => {
  return <View style={[pdfStyles.divider, style]} />;
};

/**
 * PDF 경고/알림 박스
 * @param {string} message - 메시지
 * @param {string} variant - 'red' | 'blue' | 'green' | 'yellow'
 * @param {React.ReactNode} icon - 아이콘 (선택)
 */
export const PDFAlertBox = ({ message, variant = "red", icon }) => {
  const alertStyle =
    variant === "red"
      ? pdfStyles.redAlertBox
      : variant === "blue"
      ? pdfStyles.blueAlertBox
      : variant === "green"
      ? pdfStyles.greenAlertBox
      : pdfStyles.yellowAlertBox;

  return (
    <View style={alertStyle}>
      {icon && <View style={pdfStyles.alertIcon}>{icon}</View>}
      <Text style={pdfStyles.alertText}>{message}</Text>
    </View>
  );
};

/**
 * PDF 리스트 아이템
 * @param {string|React.ReactNode} content - 리스트 내용
 * @param {string} bullet - 불릿 문자 (기본: '•')
 * @param {object} style - 추가 스타일
 */
export const PDFListItem = ({ content, bullet = "•", style }) => {
  return (
    <View style={[pdfStyles.listItem, style]}>
      <Text style={pdfStyles.listBullet}>{bullet}</Text>
      {typeof content === "string" ? (
        <Text style={pdfStyles.listText}>{content}</Text>
      ) : (
        <View style={pdfStyles.listText}>{content}</View>
      )}
    </View>
  );
};

/**
 * PDF 테이블 컴포넌트
 * @param {Array} headers - 테이블 헤더 배열
 * @param {Array} rows - 테이블 행 데이터 배열
 * @param {object} style - 추가 스타일
 */
export const PDFTable = ({ headers, rows, style }) => {
  return (
    <View style={[pdfStyles.table, style]}>
      {/* 헤더 */}
      <View style={pdfStyles.tableRow}>
        {headers.map((header, index) => (
          <View
            key={index}
            style={[
              pdfStyles.tableHeaderCell,
              index === 0 && pdfStyles.tableFirstCell,
              index === headers.length - 1 && pdfStyles.tableLastCell,
            ]}
          >
            <Text style={pdfStyles.tableHeaderText}>{header}</Text>
          </View>
        ))}
      </View>
      {/* 행들 */}
      {rows.map((row, rowIndex) => (
        <View
          key={rowIndex}
          style={[
            pdfStyles.tableRow,
            rowIndex % 2 === 0 && pdfStyles.tableRowEven,
          ]}
        >
          {row.map((cell, cellIndex) => (
            <View
              key={cellIndex}
              style={[
                pdfStyles.tableCell,
                cellIndex === 0 && pdfStyles.tableFirstCell,
                cellIndex === row.length - 1 && pdfStyles.tableLastCell,
              ]}
            >
              {typeof cell === "string" ? (
                <Text style={pdfStyles.tableCellText}>{cell}</Text>
              ) : (
                cell
              )}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

/**
 * PDF 그리드 레이아웃 (2열)
 * @param {React.ReactNode} left - 왼쪽 컬럼
 * @param {React.ReactNode} right - 오른쪽 컬럼
 * @param {object} style - 추가 스타일
 */
export const PDFGrid = ({ left, right, style }) => {
  return (
    <View style={[pdfStyles.grid, style]}>
      <View style={pdfStyles.gridColumn}>{left}</View>
      <View style={pdfStyles.gridColumn}>{right}</View>
    </View>
  );
};

/**
 * PDF 3열 그리드 레이아웃
 * @param {React.ReactNode} col1 - 첫 번째 컬럼
 * @param {React.ReactNode} col2 - 두 번째 컬럼
 * @param {React.ReactNode} col3 - 세 번째 컬럼
 * @param {object} style - 추가 스타일
 */
export const PDFGrid3 = ({ col1, col2, col3, style }) => {
  return (
    <View style={[pdfStyles.grid3, style]}>
      <View style={pdfStyles.gridColumn3}>{col1}</View>
      <View style={pdfStyles.gridColumn3}>{col2}</View>
      <View style={pdfStyles.gridColumn3}>{col3}</View>
    </View>
  );
};

/**
 * PDF 텍스트 하이라이트
 * @param {string} children - 하이라이트할 텍스트
 * @param {object} style - 추가 스타일
 */
export const PDFHighlight = ({ children, style }) => {
  return (
    <Text style={[pdfStyles.highlight, style]}>
      {children}
    </Text>
  );
};

/**
 * PDF 빈 공간 (Spacer)
 * @param {number} height - 높이 (기본: 16)
 */
export const PDFSpacer = ({ height = 16 }) => {
  return <View style={{ height }} />;
};

