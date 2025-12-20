import { useTeamStore } from '@/store/useTeamStore';
import { Card } from '@mini-apps/ui';
import { QrCode } from 'lucide-react';

export function QRCodeDisplay() {
  const { teams, qrCodes, isGeneratingQR } = useTeamStore();

  if (isGeneratingQR) {
    return (
      <Card className="p-8">
        <div className="text-center">
          <QrCode className="w-12 h-12 animate-pulse mx-auto mb-4 text-gray-600" />
          <p className="text-lg font-medium text-gray-900">QR 코드 생성 중...</p>
          <p className="text-sm text-gray-600 mt-2">
            {teams.flat().length}개의 QR 코드를 생성하고 있습니다
          </p>
        </div>
      </Card>
    );
  }

  if (qrCodes.size === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">QR 코드</h2>
      <p className="text-sm text-gray-600 mb-6">
        각 참가자에게 QR 코드를 스캔하여 팀 배정 결과를 확인할 수 있습니다
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {teams.map((team, teamIndex) =>
          team.map((member) => {
            const qrDataUrl = qrCodes.get(member.id);

            return (
              <div
                key={member.id}
                className="bg-white border-2 border-gray-200 rounded-lg p-3 text-center hover:shadow-lg transition-shadow"
              >
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`${member.name} QR`}
                    className="w-full h-auto mb-2 rounded"
                  />
                ) : (
                  <div className="w-full aspect-square bg-gray-100 rounded mb-2 flex items-center justify-center">
                    <QrCode className="w-8 h-8 text-gray-400" />
                  </div>
                )}
                <p className="font-bold text-sm text-gray-900">
                  팀 {teamIndex + 1}
                </p>
                <p className="text-xs text-gray-600 truncate">{member.name}</p>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
