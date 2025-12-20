import { useTeamStore } from '@/store/useTeamStore';
import { Button } from '@mini-apps/ui';
import { ParticipantInput } from '@/components/ParticipantInput';
import { TeamSettings } from '@/components/TeamSettings';
import { TeamResult } from '@/components/TeamResult';
import { QRCodeDisplay } from '@/components/QRCodeDisplay';
import { ExportButtons } from '@/components/ExportButtons';
import { Shuffle, RotateCcw } from 'lucide-react';

function App() {
  const { participants, isShuffled, teams, divideTeams, reset } = useTeamStore();

  const canShuffle = participants.length >= 2;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            팀 나누기
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            공정한 랜덤 알고리즘으로 팀을 자동 분배하고, QR 코드로 결과를 공유하세요
          </p>
        </header>

        {!isShuffled ? (
          /* Input Phase */
          <div className="space-y-6">
            <ParticipantInput />
            <TeamSettings />

            <div className="flex justify-center pt-4">
              <Button
                onClick={divideTeams}
                disabled={!canShuffle}
                size="lg"
                className="px-12 py-6 text-lg"
              >
                <Shuffle className="w-6 h-6 mr-3" />
                팀 나누기
              </Button>
            </div>

            {!canShuffle && participants.length > 0 && (
              <p className="text-center text-sm text-red-600">
                최소 2명 이상의 참가자가 필요합니다
              </p>
            )}
          </div>
        ) : (
          /* Result Phase */
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                팀 분배 완료!
              </h2>
              <p className="text-gray-600">
                총 {teams.length}개 팀, {participants.length}명이 배정되었습니다
              </p>
            </div>

            <TeamResult teams={teams} showConfetti={true} />

            <QRCodeDisplay />

            <ExportButtons />

            <div className="flex justify-center pt-4">
              <Button onClick={reset} size="lg" variant="outline">
                <RotateCcw className="w-5 h-5 mr-2" />
                다시 하기
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-gray-500">
          <p>
            Fisher-Yates 알고리즘을 사용하여 공정한 랜덤 분배를 보장합니다
          </p>
          <p className="mt-2">
            Made with ❤️ by SeolCoding
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
