import { StyleSheet } from "@react-pdf/renderer";

const palette = {
  red: {
    bg: "#FEE2E2",
    border: "#FCA5A5",
    text: "#B91C1C",
    badge: "#F43F5E",
  },
  blue: {
    bg: "#E0E7FF",
    border: "#A5B4FC",
    text: "#312E81",
    badge: "#4F46E5",
  },
  gray: {
    50: "#F9FAFB",
    100: "#F3F4F6",
    200: "#E5E7EB",
    300: "#D1D5DB",
    500: "#6B7280",
    700: "#374151",
    900: "#111827",
  },
  green: {
    text: "#065F46",
    bg: "#D1FAE5",
  },
};

export const pdfStyles = StyleSheet.create({
  page: {
    padding: 32,
    backgroundColor: "#FFFFFF",
    fontFamily: "NotoSansKR", // 한글 폰트 사용
  },
  section: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.gray[200],
    backgroundColor: palette.gray[50],
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 700,
    color: palette.gray[900],
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: palette.gray[700],
    paddingLeft: 8,
  },
  header: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 700,
    color: palette.gray[900],
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 10,
    color: palette.gray[500],
  },
  statRow: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flexGrow: 1,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.gray[200],
    backgroundColor: "#FFFFFF",
  },
  statValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
    marginTop: 4,
  },
  statUnit: {
    fontSize: 12,
    fontWeight: 600,
    marginLeft: 2,
  },
  grid: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  gridColumn: {
    flex: 1,
  },
  grid3: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  gridColumn3: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: palette.gray[500],
  },
  statValue: {
    fontSize: 20,
    fontWeight: 700,
    color: palette.gray[900],
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.gray[200],
    backgroundColor: "#FFFFFF",
    padding: 14,
    marginBottom: 12,
  },
  cardTitleRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: palette.gray[900],
  },
  cardDescription: {
    fontSize: 10,
    color: palette.gray[600],
    lineHeight: 1.4,
  },
  badge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 999,
    fontSize: 8,
    fontWeight: 600,
  },
  badgeText: {
    fontSize: 8,
    fontWeight: 600,
  },
  listItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  listBullet: {
    fontSize: 10,
    color: palette.gray[700],
    marginRight: 8,
    width: 10,
  },
  listText: {
    fontSize: 10,
    color: palette.gray[700],
    lineHeight: 1.4,
    flex: 1,
  },
  table: {
    width: "100%",
    borderWidth: 1,
    borderColor: palette.gray[200],
    borderRadius: 8,
    overflow: "hidden",
    marginTop: 8,
  },
  tableRow: {
    display: "flex",
    flexDirection: "row",
  },
  tableCell: {
    flex: 1,
    padding: 8,
    borderRightWidth: 1,
    borderRightColor: palette.gray[200],
  },
  tableHeaderCell: {
    backgroundColor: palette.gray[100],
    fontSize: 9,
    fontWeight: 700,
    color: palette.gray[700],
  },
  tableBodyCell: {
    fontSize: 9,
    color: palette.gray[800],
  },
  divider: {
    height: 1,
    backgroundColor: palette.gray[200],
    marginVertical: 10,
  },
  chartContainer: {
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: palette.gray[200],
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
  },
  chartTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: palette.gray[900],
    marginBottom: 6,
  },
  chartLegendRow: {
    flexDirection: "row",
    gap: 8,
    marginTop: 8,
  },
  chartLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    fontSize: 9,
    color: palette.gray[600],
  },
  chartLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pill: {
    fontSize: 8,
    fontWeight: 600,
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: 999,
    color: palette.gray[900],
    backgroundColor: palette.gray[100],
    marginRight: 4,
  },
  alertBox: {
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  alertIcon: {
    marginRight: 8,
  },
  alertText: {
    fontSize: 10,
    color: palette.gray[800],
    lineHeight: 1.4,
    flex: 1,
  },
  redAlertBox: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },
  blueAlertBox: {
    backgroundColor: "#DBEAFE",
    borderWidth: 1,
    borderColor: "#93C5FD",
  },
  greenAlertBox: {
    backgroundColor: "#D1FAE5",
    borderWidth: 1,
    borderColor: "#6EE7B7",
  },
  yellowAlertBox: {
    backgroundColor: "#FEF3C7",
    borderWidth: 1,
    borderColor: "#FCD34D",
  },
  footerText: {
    fontSize: 8,
    color: palette.gray[500],
    textAlign: "center",
    marginTop: 12,
  },
  redHeader: {
    backgroundColor: palette.red.bg,
    borderColor: palette.red.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  blueHeader: {
    backgroundColor: palette.blue.bg,
    borderColor: palette.blue.border,
    borderWidth: 1,
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
  },
  redHeaderTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: "#7F1D1D",
    marginBottom: 4,
  },
  blueHeaderTitle: {
    fontSize: 20,
    fontWeight: 700,
    color: palette.gray[900],
    marginBottom: 4,
  },
  redHeaderDesc: {
    fontSize: 11,
    color: "#991B1B",
    lineHeight: 1.5,
  },
  blueHeaderDesc: {
    fontSize: 11,
    color: palette.gray[700],
    lineHeight: 1.5,
  },
  redBadge: {
    backgroundColor: palette.red.badge,
    color: "#FFFFFF",
  },
  blueBadge: {
    backgroundColor: palette.blue.badge,
    color: "#FFFFFF",
  },
  greenBadge: {
    backgroundColor: palette.green.bg,
    color: palette.green.text,
  },
  // 차트 관련 스타일
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  chartCenterText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  chartCenterValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: palette.gray[900],
    textAlign: "center",
  },
  chartCenterLabel: {
    fontSize: 10,
    color: palette.gray[500],
    textAlign: "center",
  },
  chartLegend: {
    marginTop: 15,
    width: "100%",
  },
  chartLegendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  chartLegendColor: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  chartLegendText: {
    fontSize: 10,
    color: palette.gray[700],
  },
  redZoneAlert: {
    backgroundColor: "#FEE2E2",
    borderColor: "#FCA5A5",
    borderWidth: 1,
    borderRadius: 6,
    padding: 12,
    marginBottom: 15,
  },
  redZoneText: {
    fontSize: 11,
    color: palette.gray[900],
    lineHeight: 1.5,
  },
  redZoneBold: {
    fontWeight: "bold",
    color: "#B91C1C",
  },
  // 카테고리 아이템
  categoryItem: {
    flexDirection: "row",
    marginBottom: 12,
    padding: 12,
    backgroundColor: "#FFFFFF",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: palette.gray[200],
  },
  categoryNumber: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: palette.gray[200],
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  categoryNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: palette.gray[600],
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: palette.gray[900],
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 10,
    color: palette.gray[600],
    lineHeight: 1.4,
  },
  // 악플러 카드
  offenderCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.gray[200],
    padding: 12,
    marginBottom: 12,
  },
  offenderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  offenderAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FEE2E2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  offenderAvatarText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#B91C1C",
  },
  offenderInfo: {
    flex: 1,
  },
  offenderName: {
    fontSize: 12,
    fontWeight: "bold",
    color: palette.gray[900],
    marginBottom: 2,
  },
  offenderAttacks: {
    fontSize: 9,
    color: "#B91C1C",
    fontWeight: "medium",
  },
  offenderTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  offenderTag: {
    marginRight: 4,
    marginBottom: 4,
  },
  // 영상 카드
  videoCard: {
    marginBottom: 20,
  },
  videoHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  videoNumber: {
    width: 32,
    height: 32,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    backgroundColor: palette.gray[200],
  },
  videoNumberRed: {
    backgroundColor: "#FEE2E2",
  },
  videoNumberOrange: {
    backgroundColor: "#FEF3C7",
  },
  videoNumberAmber: {
    backgroundColor: "#FEF3C7",
  },
  videoNumberText: {
    fontSize: 16,
    fontWeight: "bold",
    color: palette.gray[600],
  },
  videoInfo: {
    flex: 1,
  },
  videoTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: palette.gray[900],
    marginBottom: 4,
  },
  videoAttackCount: {
    fontSize: 9,
    color: "#B91C1C",
    fontWeight: "medium",
  },
  videoSection: {
    backgroundColor: "#FEE2E2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    borderRadius: 6,
    padding: 12,
    marginBottom: 10,
  },
  videoSectionBlue: {
    backgroundColor: "#DBEAFE",
    borderColor: "#93C5FD",
  },
  videoSectionGreen: {
    backgroundColor: "#D1FAE5",
    borderColor: "#6EE7B7",
  },
  videoSectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#B91C1C",
    marginBottom: 8,
  },
  videoListItem: {
    marginBottom: 4,
  },
  videoAssessment: {
    fontSize: 10,
    color: palette.gray[700],
    lineHeight: 1.5,
  },
  // 가이드라인 카드
  guidelineCard: {
    marginBottom: 20,
  },
  guidelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  guidelineTitle: {
    fontSize: 12,
    fontWeight: "bold",
    color: palette.gray[900],
    flex: 1,
    lineHeight: 1.5,
  },
  guidelineIconGreen: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#D1FAE5",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  guidelineIconText: {
    fontSize: 14,
    color: "#059669",
    fontWeight: "bold",
  },
  guidelineContent: {
    flexDirection: "row",
    backgroundColor: palette.gray[50],
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.gray[200],
  },
  guidelineReason: {
    flex: 1,
    paddingRight: 12,
  },
  guidelineEffect: {
    flex: 1,
    paddingLeft: 12,
    borderLeftWidth: 1,
    borderLeftColor: palette.gray[200],
  },
  guidelineLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: palette.gray[500],
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  guidelineText: {
    fontSize: 10,
    color: palette.gray[700],
    lineHeight: 1.4,
  },
  guidelineDontContent: {
    backgroundColor: palette.gray[50],
    borderRadius: 6,
    padding: 12,
    borderWidth: 1,
    borderColor: palette.gray[200],
  },
  guidelineDontLabel: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#B91C1C",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  guidelineRiskBadge: {
    marginLeft: 8,
  },
  highlight: {
    backgroundColor: "#FEF3C7",
    paddingHorizontal: 2,
    borderRadius: 2,
    fontWeight: 700,
    color: palette.gray[900],
  },
});

export { palette };

