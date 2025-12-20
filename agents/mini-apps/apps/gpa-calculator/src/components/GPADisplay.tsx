import { Card, CardHeader, CardTitle, CardContent } from '@mini-apps/ui';
import { TrendingUp, Award, BookMarked } from 'lucide-react';
import type { GPAResult } from '../types';

interface GPADisplayProps {
  cumulative: GPAResult;
  major: GPAResult;
  general: GPAResult;
}

export function GPADisplay({ cumulative, major, general }: GPADisplayProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">누적 GPA</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{cumulative.gpa.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            총 {cumulative.earnedCredits}학점 이수
          </p>
          <p className="text-xs text-muted-foreground">
            평점 계산: {cumulative.totalCredits}학점
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">전공 GPA</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{major.gpa > 0 ? major.gpa.toFixed(2) : '-'}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {major.earnedCredits > 0 ? `${major.earnedCredits}학점 이수` : '전공 과목 없음'}
          </p>
          <p className="text-xs text-muted-foreground">
            {major.totalCredits > 0 ? `평점 계산: ${major.totalCredits}학점` : ''}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">교양 GPA</CardTitle>
          <BookMarked className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{general.gpa > 0 ? general.gpa.toFixed(2) : '-'}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {general.earnedCredits > 0 ? `${general.earnedCredits}학점 이수` : '교양 과목 없음'}
          </p>
          <p className="text-xs text-muted-foreground">
            {general.totalCredits > 0 ? `평점 계산: ${general.totalCredits}학점` : ''}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
