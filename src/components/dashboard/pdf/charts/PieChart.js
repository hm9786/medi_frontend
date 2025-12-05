import React from "react";
import { View, Text, Svg, Path, G, Circle } from "@react-pdf/renderer";
import { calculatePieChart, createArcPath } from "./ChartUtils";
import { pdfStyles } from "../PDFStyles";

/**
 * Pie Chart 컴포넌트 (도넛 차트)
 * @param {Array} data - [{ name, value, color }, ...]
 * @param {number} size - 차트 크기 (기본: 180)
 * @param {number} innerRadius - 내부 반지름 비율 (0~1, 기본: 0.6)
 * @param {boolean} showLegend - 범례 표시 여부 (기본: true)
 */
export const PieChart = ({
  data,
  size = 180,
  innerRadius = 0.6,
  showLegend = true,
}) => {
  const centerX = size / 2;
  const centerY = size / 2;
  const outerRadius = size * 0.35;
  const innerR = outerRadius * innerRadius;

  const calculatedData = calculatePieChart(data);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <View style={pdfStyles.chartContainer}>
      <View style={{ position: 'relative', width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {calculatedData.map((item, index) => {
            const path = createArcPath(
              centerX,
              centerY,
              outerRadius,
              innerR,
              item.startAngle,
              item.endAngle
            );

            return (
              <Path key={index} d={path} fill={item.color} stroke="#FFFFFF" strokeWidth={2} />
            );
          })}
          
          {/* 중앙 텍스트 */}
          <G>
            <Text
              x={centerX}
              y={centerY - 5}
              style={{
                fontSize: 20,
                fontWeight: 'bold',
                fill: '#111827',
                textAnchor: 'middle',
              }}
            >
              {total}
            </Text>
            <Text
              x={centerX}
              y={centerY + 10}
              style={{
                fontSize: 9,
                fill: '#6B7280',
                textAnchor: 'middle',
              }}
            >
              Total
            </Text>
          </G>
        </Svg>
      </View>

      {/* 범례 */}
      {showLegend && (
        <View style={pdfStyles.chartLegend}>
          {calculatedData.map((item, index) => (
            <View key={index} style={pdfStyles.chartLegendItem}>
              <View
                style={[
                  pdfStyles.chartLegendColor,
                  { backgroundColor: item.color },
                ]}
              />
              <Text style={pdfStyles.chartLegendText}>
                {item.name}: {item.value} ({item.percentage}%)
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

