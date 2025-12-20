/**
 * Canvas Rendering Functions
 *
 * Canvas를 사용한 사다리 렌더링
 */

import type { LadderData, CanvasConfig, PathPoint } from './types';

/**
 * 사다리 그리기
 */
export function drawLadder(
  ctx: CanvasRenderingContext2D,
  ladder: LadderData,
  participants: string[],
  results: string[],
  config: CanvasConfig
): void {
  const { width, height, padding, lineWidth, colors } = config;
  const { columnCount, bridges, rowHeight } = ladder;

  // 캔버스 초기화
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, width, height);

  // 컬럼 간격 계산
  const usableWidth = width - padding * 2;
  const columnGap = usableWidth / (columnCount - 1);
  const totalHeight = bridges.length > 0
    ? Math.max(...bridges.map(b => b.row)) * rowHeight * columnCount
    : rowHeight * 8;

  // 1. 세로선 그리기
  ctx.strokeStyle = colors.line;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';

  for (let i = 0; i < columnCount; i++) {
    const x = padding + i * columnGap;
    const y1 = padding + 40;
    const y2 = padding + 40 + totalHeight;

    ctx.beginPath();
    ctx.moveTo(x, y1);
    ctx.lineTo(x, y2);
    ctx.stroke();
  }

  // 2. 가로선 그리기
  ctx.lineWidth = lineWidth;
  bridges.forEach(bridge => {
    const x1 = padding + bridge.fromColumn * columnGap;
    const x2 = padding + bridge.toColumn * columnGap;
    const y = padding + 40 + bridge.row * totalHeight;

    ctx.beginPath();
    ctx.moveTo(x1, y);
    ctx.lineTo(x2, y);
    ctx.stroke();
  });

  // 3. 참가자 이름 (상단)
  ctx.fillStyle = colors.text;
  ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Pretendard Variable", "Pretendard", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  participants.forEach((name, i) => {
    const x = padding + i * columnGap;
    const y = padding + 20;
    ctx.fillText(name, x, y);
  });

  // 4. 결과 텍스트 (하단)
  results.forEach((result, i) => {
    const x = padding + i * columnGap;
    const y = padding + 40 + totalHeight + 20;
    ctx.fillText(result, x, y);
  });
}

/**
 * 강조된 경로 그리기
 */
export function drawHighlightedPath(
  ctx: CanvasRenderingContext2D,
  path: PathPoint[],
  currentPoint: PathPoint,
  config: CanvasConfig
): void {
  ctx.strokeStyle = config.colors.highlight;
  ctx.lineWidth = config.lineWidth * 2;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);

  for (let i = 1; i < path.length; i++) {
    const point = path[i];

    if (
      (point.y > currentPoint.y && path[i - 1].direction === 'down') ||
      (Math.abs(point.x - currentPoint.x) < 1 &&
       Math.abs(point.y - currentPoint.y) < 1)
    ) {
      ctx.lineTo(currentPoint.x, currentPoint.y);
      break;
    }

    ctx.lineTo(point.x, point.y);
  }

  ctx.stroke();
}

/**
 * 현재 위치 마커 그리기
 */
export function drawMarker(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  config: CanvasConfig
): void {
  const radius = 8;

  // 외곽 원 (그림자)
  ctx.fillStyle = 'rgba(59, 130, 246, 0.3)';
  ctx.beginPath();
  ctx.arc(x, y, radius + 3, 0, Math.PI * 2);
  ctx.fill();

  // 내부 원
  ctx.fillStyle = config.colors.highlight;
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();

  // 중심점
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(x, y, radius / 2, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * 테마별 색상 가져오기
 */
export function getThemeColors(theme: 'light' | 'dark' | 'colorful') {
  switch (theme) {
    case 'dark':
      return {
        line: '#9CA3AF',
        text: '#F3F4F6',
        highlight: '#60A5FA',
        background: '#1F2937'
      };
    case 'colorful':
      return {
        line: '#8B5CF6',
        text: '#1F2937',
        highlight: '#EC4899',
        background: '#FEF3C7'
      };
    default: // light
      return {
        line: '#374151',
        text: '#111827',
        highlight: '#3B82F6',
        background: '#FFFFFF'
      };
  }
}
