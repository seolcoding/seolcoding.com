import { InputForm } from './components/InputForm';
import { ResultCard } from './components/ResultCard';
import { DeductionBreakdown } from './components/DeductionBreakdown';
import { DeductionChart } from './components/DeductionChart';
import { SalarySimulator } from './components/SalarySimulator';
import { TooltipProvider } from '@mini-apps/ui';
import { Calculator } from 'lucide-react';

function App() {
  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calculator className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">급여 실수령액 계산기</h1>
                <p className="text-sm text-muted-foreground">
                  연봉 협상 시 얼마를 받게 될까요?
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Input Form */}
            <div className="lg:col-span-1">
              <InputForm />
            </div>

            {/* Middle Column: Results */}
            <div className="lg:col-span-1 space-y-6">
              <ResultCard />
              <DeductionBreakdown />
            </div>

            {/* Right Column: Charts */}
            <div className="lg:col-span-1 space-y-6">
              <DeductionChart />
            </div>
          </div>

          {/* Full Width: Simulator */}
          <div className="mt-6">
            <SalarySimulator />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t mt-16">
          <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
            <p>2025년 기준 4대보험료율 및 간이세액표 적용</p>
            <p className="mt-1">
              실제 급여명세서와 차이가 있을 수 있으며, 참고용으로만 사용하시기 바랍니다.
            </p>
          </div>
        </footer>
      </div>
    </TooltipProvider>
  );
}

export default App;
