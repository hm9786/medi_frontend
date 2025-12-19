/**
 * 차트 계산 유틸리티 함수
 */

/**
 * Pie Chart 데이터 계산
 * @param {Array} data - [{ name, value, color }, ...]
 * @returns {Array} 계산된 각도 정보가 포함된 데이터
 */
export const calculatePieChart = (data) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let currentAngle = -90; // 12시 방향부터 시작

  return data.map((item) => {
    const percentage = item.value / total;
    const angle = percentage * 360;
    const startAngle = currentAngle;
    const endAngle = currentAngle + angle;

    currentAngle = endAngle;

    return {
      ...item,
      startAngle,
      endAngle,
      percentage: (percentage * 100).toFixed(1),
    };
  });
};

/**
 * SVG Arc Path 생성 (도넛 차트용)
 * @param {number} cx - 중심 X 좌표
 * @param {number} cy - 중심 Y 좌표
 * @param {number} outerRadius - 외부 반지름
 * @param {number} innerRadius - 내부 반지름
 * @param {number} startAngle - 시작 각도 (도)
 * @param {number} endAngle - 끝 각도 (도)
 * @returns {string} SVG Path d 속성
 */
export const createArcPath = (
  cx,
  cy,
  outerRadius,
  innerRadius,
  startAngle,
  endAngle
) => {
  const toRadians = (angle) => (angle * Math.PI) / 180;

  const startRad = toRadians(startAngle);
  const endRad = toRadians(endAngle);

  const x1 = cx + outerRadius * Math.cos(startRad);
  const y1 = cy + outerRadius * Math.sin(startRad);
  const x2 = cx + outerRadius * Math.cos(endRad);
  const y2 = cy + outerRadius * Math.sin(endRad);

  const x3 = cx + innerRadius * Math.cos(endRad);
  const y3 = cy + innerRadius * Math.sin(endRad);
  const x4 = cx + innerRadius * Math.cos(startRad);
  const y4 = cy + innerRadius * Math.sin(startRad);

  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

  return [
    `M ${x1} ${y1}`, // 외부 호 시작점으로 이동
    `A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${x2} ${y2}`, // 외부 호
    `L ${x3} ${y3}`, // 내부 점으로 선
    `A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}`, // 내부 호
    "Z", // 닫기
  ].join(" ");
};

/**
 * Bar Chart 데이터 정규화
 * @param {Array} data - [{ name, count, ... }, ...]
 * @returns {Object} { maxValue, normalizedData }
 */
export const normalizeBarChart = (data) => {
  const maxValue = Math.max(...data.map((d) => d.count || 0));
  return {
    maxValue: maxValue || 1, // 0으로 나누기 방지
    normalizedData: data.map((item) => ({
      ...item,
      normalizedValue: item.count || 0,
    })),
  };
};

