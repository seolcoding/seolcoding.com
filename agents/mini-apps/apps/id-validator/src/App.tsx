import { Tabs, TabsContent, TabsList, TabsTrigger } from '@mini-apps/ui';
import { RRNValidator } from './components/RRNValidator';
import { BRNValidator } from './components/BRNValidator';
import { CRNValidator } from './components/CRNValidator';
import { Shield, Building2, Building } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Shield className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-gray-900">
              한국 신분증 번호 검증기
            </h1>
          </div>
          <p className="text-lg text-gray-600">
            주민등록번호, 사업자등록번호, 법인등록번호의 유효성을 검증합니다
          </p>
          <p className="text-sm text-gray-600 mt-2">
            개발 및 테스트 목적 전용 - 모든 처리는 브라우저에서만 수행됩니다
          </p>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="rrn" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="rrn" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              주민등록번호
            </TabsTrigger>
            <TabsTrigger value="brn" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              사업자등록번호
            </TabsTrigger>
            <TabsTrigger value="crn" className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              법인등록번호
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rrn">
            <RRNValidator />
          </TabsContent>

          <TabsContent value="brn">
            <BRNValidator />
          </TabsContent>

          <TabsContent value="crn">
            <CRNValidator />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 text-center text-sm text-gray-600">
          <div className="border-t border-gray-200 pt-6">
            <p className="mb-2">
              이 도구는 교육 및 개발 테스트 목적으로만 사용하세요.
            </p>
            <p className="text-xs">
              실제 진위확인은 국세청, 대법원 등 공식 기관 API를 사용하세요.
            </p>
            <p className="text-xs mt-4">
              © 2025 SeolCoding. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
