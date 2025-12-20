import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, Input, Label } from '@mini-apps/ui';
import { Target } from 'lucide-react';
import { calculateRequiredGPA } from '../lib/gpa';

interface SimulatorProps {
  currentGPA: number;
  currentCredits: number;
}

export function Simulator({ currentGPA, currentCredits }: SimulatorProps) {
  const [targetGPA, setTargetGPA] = useState(4.0);
  const [remainingCredits, setRemainingCredits] = useState(20);

  const result = calculateRequiredGPA({
    currentGPA,
    currentCredits,
    targetGPA,
    remainingCredits
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          목표 학점 시뮬레이터
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <Label htmlFor="current-gpa">현재 누적 GPA</Label>
            <Input
              id="current-gpa"
              type="number"
              value={currentGPA.toFixed(2)}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="current-credits">현재 이수 학점</Label>
            <Input
              id="current-credits"
              type="number"
              value={currentCredits}
              disabled
              className="bg-gray-50"
            />
          </div>

          <div>
            <Label htmlFor="target-gpa">목표 GPA</Label>
            <Input
              id="target-gpa"
              type="number"
              step="0.1"
              min="0"
              max="4.5"
              value={targetGPA}
              onChange={(e) => setTargetGPA(Number(e.target.value))}
            />
          </div>

          <div>
            <Label htmlFor="remaining-credits">남은 이수 학점</Label>
            <Input
              id="remaining-credits"
              type="number"
              min="1"
              value={remainingCredits}
              onChange={(e) => setRemainingCredits(Number(e.target.value))}
            />
          </div>
        </div>

        <div className={`p-4 rounded-lg ${
          result.isAchievable && result.requiredGPA > 0
            ? 'bg-blue-50 border border-blue-200'
            : result.isAchievable && result.requiredGPA <= 0
            ? 'bg-green-50 border border-green-200'
            : 'bg-red-50 border border-red-200'
        }`}>
          <p className="text-lg font-semibold mb-2">
            {result.message}
          </p>
          {result.isAchievable && result.requiredGPA > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm text-gray-700">
                필요 평점: <span className="font-bold text-blue-600 text-xl">{result.requiredGPA.toFixed(2)}</span> / 4.5
              </p>
              <p className="text-xs text-gray-600">
                {remainingCredits}학점 동안 평균적으로 이 점수 이상을 유지해야 합니다.
              </p>
            </div>
          )}
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
          <p className="font-semibold mb-1">계산 방법:</p>
          <p>목표 총 평점 = 목표 GPA × (현재 학점 + 남은 학점)</p>
          <p>필요 평점 = (목표 총 평점 - 현재 총 평점) / 남은 학점</p>
        </div>
      </CardContent>
    </Card>
  );
}
