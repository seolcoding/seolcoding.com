/**
 * 전월세 계산기 메인 컴포넌트
 */

import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@mini-apps/ui';
import { JeonseToWolseConverter } from './JeonseToWolseConverter';
import { WolseToJeonseConverter } from './WolseToJeonseConverter';
import { CostComparisonChart } from './CostComparisonChart';
import { Calculator, TrendingUp } from 'lucide-react';

export function RentCalculator() {
  const [activeTab, setActiveTab] = useState<'jeonse-to-wolse' | 'wolse-to-jeonse'>('jeonse-to-wolse');

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* 헤더 */}
      <header className="text-center space-y-4">
        <div className="flex items-center justify-center gap-3">
          <Calculator className="w-10 h-10 text-blue-600" />
          <h1 className="text-4xl font-bold text-gray-900">전세/월세 계산기</h1>
        </div>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          전세와 월세를 비교하고, 실제 부담액을 계산하세요.
          법정 전월세 전환율을 적용한 정확한 계산을 제공합니다.
        </p>
      </header>

      {/* 변환 탭 */}
      <section>
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
            <TabsTrigger value="jeonse-to-wolse">전세 → 월세</TabsTrigger>
            <TabsTrigger value="wolse-to-jeonse">월세 → 전세</TabsTrigger>
          </TabsList>

          <div className="mt-6">
            <TabsContent value="jeonse-to-wolse">
              <JeonseToWolseConverter />
            </TabsContent>

            <TabsContent value="wolse-to-jeonse">
              <WolseToJeonseConverter />
            </TabsContent>
          </div>
        </Tabs>
      </section>

      {/* 비용 비교 분석 */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">비용 비교 분석</h2>
        </div>
        <CostComparisonChart />
      </section>

      {/* 안내 문구 */}
      <footer className="text-center text-sm text-gray-500 pt-8 border-t">
        <p>
          본 계산기는 참고용 도구이며, 법적 구속력이 없습니다.
          실제 계약 시에는 반드시 전문가(공인중개사, 변호사)와 상담하시기 바랍니다.
        </p>
      </footer>
    </div>
  );
}
