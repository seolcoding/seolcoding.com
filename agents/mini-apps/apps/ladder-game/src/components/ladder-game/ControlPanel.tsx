/**
 * ControlPanel Component
 *
 * 사다리 생성/리셋 및 설정 제어
 */

import { Shuffle, RotateCcw, Settings } from 'lucide-react';
import {
  Button,
  Label,
  Slider,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@mini-apps/ui';
import type { LadderConfig } from '../../lib/ladder/types';

interface ControlPanelProps {
  disabled: boolean;
  config: LadderConfig;
  hasLadder: boolean;
  onStart: () => void;
  onReset: () => void;
  onConfigChange: (config: Partial<LadderConfig>) => void;
}

export function ControlPanel({
  disabled,
  config,
  hasLadder,
  onStart,
  onReset,
  onConfigChange
}: ControlPanelProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      <Button
        onClick={onStart}
        disabled={disabled}
        size="lg"
        className="flex-1 min-w-[150px]"
      >
        <Shuffle className="w-4 h-4 mr-2" />
        {hasLadder ? '사다리 재생성' : '사다리 생성'}
      </Button>

      {hasLadder && (
        <Button
          onClick={onReset}
          variant="outline"
          size="lg"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          초기화
        </Button>
      )}

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="lg">
            <Settings className="w-4 h-4 mr-2" />
            설정
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3">사다리 설정</h4>
            </div>

            <div className="space-y-2">
              <Label>가로선 밀도</Label>
              <div className="flex items-center gap-3">
                <Slider
                  value={[config.density]}
                  onValueChange={([value]) => onConfigChange({ density: value })}
                  min={0.3}
                  max={0.8}
                  step={0.1}
                  className="flex-1"
                />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {Math.round(config.density * 100)}%
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>테마</Label>
              <Select
                value={config.theme}
                onValueChange={(value) => onConfigChange({ theme: value as typeof config.theme })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">밝은 테마</SelectItem>
                  <SelectItem value="dark">어두운 테마</SelectItem>
                  <SelectItem value="colorful">컬러풀 테마</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>결과 공개 방식</Label>
              <Select
                value={config.revealMode}
                onValueChange={(value) => onConfigChange({ revealMode: value as typeof config.revealMode })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="manual">수동 공개 (클릭)</SelectItem>
                  <SelectItem value="sequential">순차 공개</SelectItem>
                  <SelectItem value="simultaneous">일괄 공개</SelectItem>
                  <SelectItem value="instant">즉시 공개</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
