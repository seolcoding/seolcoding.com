/**
 * 월세 → 전세 변환 컴포넌트
 */

import { Card, CardHeader, CardTitle, CardContent, Label, Slider, NumberInput } from '@mini-apps/ui';
import { useCalculatorStore } from '../store/useCalculatorStore';
import { wolseToJeonse } from '../lib/rentCalculator';
import { CurrencyDisplay } from './CurrencyDisplay';
import { InfoTooltip } from './InfoTooltip';

export function WolseToJeonseConverter() {
  const {
    depositForJeonse,
    monthlyRent,
    conversionRateWolse,
    setDepositForJeonse,
    setMonthlyRent,
    setConversionRateWolse,
  } = useCalculatorStore();

  const jeonseEquivalent = wolseToJeonse(depositForJeonse, monthlyRent, conversionRateWolse);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 입력 영역 */}
      <Card>
        <CardHeader>
          <CardTitle>입력</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="deposit-jeonse">월세 보증금</Label>
            <NumberInput
              id="deposit-jeonse"
              value={depositForJeonse}
              onChange={(value) => setDepositForJeonse(value || 0)}
              min={0}
              suffix="원"
            />
          </div>

          <div>
            <Label htmlFor="monthly-rent">월세</Label>
            <NumberInput
              id="monthly-rent"
              value={monthlyRent}
              onChange={(value) => setMonthlyRent(value || 0)}
              min={0}
              suffix="원"
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Label htmlFor="conversion-rate-wolse">전월세 전환율</Label>
              <InfoTooltip content="법정 상한은 기준금리 + 2% (현재 약 4.5%)" />
            </div>
            <div className="space-y-2">
              <Slider
                id="conversion-rate-wolse"
                value={[conversionRateWolse]}
                onValueChange={([value]) => setConversionRateWolse(value)}
                min={0.1}
                max={10}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>0.1%</span>
                <span className="font-semibold">{conversionRateWolse.toFixed(1)}%</span>
                <span>10%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 결과 영역 */}
      <Card className="bg-green-50">
        <CardHeader>
          <CardTitle>결과</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">전세 환산액</p>
            <CurrencyDisplay
              value={jeonseEquivalent}
              className="text-3xl font-bold text-green-600"
            />
          </div>

          <div className="pt-4 border-t border-green-200">
            <p className="text-sm text-gray-600 mb-2">계산 공식</p>
            <p className="text-xs text-gray-500">
              전세 = 보증금 + (월세 × 12 ÷ 전환율)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              = {depositForJeonse.toLocaleString()} + ({monthlyRent.toLocaleString()}
              × 12 ÷ {conversionRateWolse}%)
            </p>
            <p className="text-xs text-gray-500 mt-1">
              = <CurrencyDisplay value={jeonseEquivalent} />
            </p>
          </div>

          <div className="pt-4 border-t border-green-200">
            <p className="text-sm text-gray-600 mb-2">월세와 비교</p>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>현재 월세:</span>
                <span className="font-semibold">
                  보증금 <CurrencyDisplay value={depositForJeonse} /> + 월세 <CurrencyDisplay value={monthlyRent} />
                </span>
              </div>
              <div className="flex justify-between">
                <span>전세 환산:</span>
                <span className="font-semibold">
                  <CurrencyDisplay value={jeonseEquivalent} />
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
