import React from "react";
import { View, Text, Svg, Rect, G, Line } from "@react-pdf/renderer";
import { normalizeBarChart } from "./ChartUtils";
import { pdfStyles } from "../PDFStyles";

/**
 * Bar Chart 컴포넌트
 * @param {Array} data - [{ name, count, isRedZone? }, ...]
 * @param {Object} redZone - { time_slot, count, percentage } (선택)
 * @param {number} width - 차트 너비 (기본: 400)
 * @param {number} height - 차트 높이 (기본: 200)
 */
export const BarChart = ({
  data,
  redZone = null,
  width = 400,
  height = 200,
}) => {
  const { maxValue, normalizedData } = normalizeBarChart(data);
  const chartHeight = height - 60; // 여백 제외
  const chartWidth = width - 80; // 여백 제외
  const barWidth = Math.min(40, (chartWidth / normalizedData.length) - 10);
  const spacing = (chartWidth - barWidth * normalizedData.length) / (normalizedData.length + 1);

  return (
    <View style={pdfStyles.chartContainer}>
      {/* 레드존 알림 (있는 경우) */}
      {redZone && (
        <View style={pdfStyles.redZoneAlert}>
          <Text style={pdfStyles.redZoneText}>
            <Text style={pdfStyles.redZoneBold}>{redZone.time_slot}</Text>에 전체 악플의{" "}
            <Text style={pdfStyles.redZoneBold}>{redZone.percentage}%</Text>가 집중되었습니다.
          </Text>
        </View>
      )}

      {/* 차트 */}
      <Svg width={width} height={height}>
        {/* Y축 그리드 라인 */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = 20 + chartHeight * (1 - ratio);
          return (
            <Line
              key={ratio}
              x1={60}
              y1={y}
              x2={width - 20}
              y2={y}
              stroke="#E5E7EB"
              strokeWidth={0.5}
            />
          );
        })}

        {/* 막대 그래프 */}
        {normalizedData.map((item, index) => {
          const barHeight = (item.normalizedValue / maxValue) * chartHeight;
          const x = 60 + spacing + index * (barWidth + spacing);
          const y = 20 + chartHeight - barHeight;
          const isRed = item.isRedZone;

          return (
            <G key={index}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill={isRed ? "#EF4444" : "#E5E7EB"}
                rx={4}
              />
              {/* 값 표시 */}
              {item.normalizedValue > 0 && (
                <Text
                  x={x + barWidth / 2}
                  y={y - 8}
                  style={{
                    fontSize: 10,
                    fill: "#374151",
                    textAnchor: "middle",
                  }}
                >
                  {item.count}
                </Text>
              )}
              {/* 라벨 */}
              <Text
                x={x + barWidth / 2}
                y={height - 15}
                style={{
                  fontSize: 9,
                  fill: "#6B7280",
                  textAnchor: "middle",
                }}
              >
                {item.name?.split(" ")[0] || item.name}
              </Text>
            </G>
          );
        })}

        {/* Y축 라벨 */}
        {[0, 0.5, 1].map((ratio) => {
          const value = Math.round(maxValue * ratio);
          const y = 20 + chartHeight * (1 - ratio);
          return (
            <Text
              key={ratio}
              x={55}
              y={y + 3}
              style={{
                fontSize: 9,
                fill: "#6B7280",
                textAnchor: "end",
              }}
            >
              {value}
            </Text>
          );
        })}
      </Svg>
    </View>
  );
};

