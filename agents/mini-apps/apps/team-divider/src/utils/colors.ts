import type { TeamColor } from '@/types/team';

/**
 * Tailwind 기반 팀 색상 팔레트
 */
const TEAM_COLORS: TeamColor[] = [
  { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-300' },
  { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-300' },
  { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-300' },
  { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-300' },
  { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-300' },
  { bg: 'bg-pink-100', text: 'text-pink-800', border: 'border-pink-300' },
  { bg: 'bg-indigo-100', text: 'text-indigo-800', border: 'border-indigo-300' },
  { bg: 'bg-teal-100', text: 'text-teal-800', border: 'border-teal-300' },
];

/**
 * HSL 기반 동적 색상 생성 (팀이 8개 초과 시)
 */
export function generateTeamColors(teamCount: number): TeamColor[] {
  if (teamCount <= TEAM_COLORS.length) {
    return TEAM_COLORS.slice(0, teamCount);
  }

  // HSL 색상 공간에서 균등 분배
  const colors: TeamColor[] = [];
  for (let i = 0; i < teamCount; i++) {
    const hue = (360 / teamCount) * i;
    colors.push({
      bg: `hsl(${hue}, 70%, 90%)`,
      text: `hsl(${hue}, 70%, 30%)`,
      border: `hsl(${hue}, 70%, 60%)`,
    });
  }

  return colors;
}

/**
 * 색상 이름 가져오기
 */
export function getColorName(hue: number): string {
  if (hue < 30) return '빨강';
  if (hue < 90) return '주황';
  if (hue < 150) return '노랑';
  if (hue < 210) return '초록';
  if (hue < 270) return '파랑';
  if (hue < 330) return '보라';
  return '분홍';
}
