import { useTeamStore } from '@/store/useTeamStore';
import { Card, Button, Input } from '@mini-apps/ui';
import { Users, UserCheck } from 'lucide-react';

export function TeamSettings() {
  const { participants, settings, setSettings } = useTeamStore();

  const handleModeChange = (mode: 'byTeamCount' | 'byMemberCount') => {
    if (mode === 'byTeamCount') {
      setSettings({ mode, teamCount: 2 });
    } else {
      setSettings({ mode, memberCount: 4 });
    }
  };

  const calculatePreview = () => {
    if (participants.length === 0) return null;

    if (settings.mode === 'byTeamCount' && settings.teamCount) {
      const membersPerTeam = Math.ceil(participants.length / settings.teamCount);
      return {
        teams: settings.teamCount,
        membersPerTeam,
      };
    }

    if (settings.mode === 'byMemberCount' && settings.memberCount) {
      const teams = Math.ceil(participants.length / settings.memberCount);
      return {
        teams,
        membersPerTeam: settings.memberCount,
      };
    }

    return null;
  };

  const preview = calculatePreview();

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-bold mb-4">팀 설정</h2>

      {/* Mode Selection */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <Button
          variant={settings.mode === 'byTeamCount' ? 'default' : 'outline'}
          onClick={() => handleModeChange('byTeamCount')}
          className="h-auto py-4 flex flex-col items-center gap-2"
        >
          <Users className="w-6 h-6" />
          <span>팀 수 지정</span>
        </Button>
        <Button
          variant={settings.mode === 'byMemberCount' ? 'default' : 'outline'}
          onClick={() => handleModeChange('byMemberCount')}
          className="h-auto py-4 flex flex-col items-center gap-2"
        >
          <UserCheck className="w-6 h-6" />
          <span>팀당 인원 지정</span>
        </Button>
      </div>

      {/* Team Count Input */}
      {settings.mode === 'byTeamCount' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">팀 수</label>
          <Input
            type="number"
            min="2"
            max="20"
            value={settings.teamCount || ''}
            onChange={(e) =>
              setSettings({ ...settings, teamCount: Number(e.target.value) })
            }
            placeholder="팀 수 입력 (예: 5)"
          />
        </div>
      )}

      {/* Member Count Input */}
      {settings.mode === 'byMemberCount' && (
        <div className="space-y-2">
          <label className="block text-sm font-medium">팀당 인원</label>
          <Input
            type="number"
            min="1"
            max="50"
            value={settings.memberCount || ''}
            onChange={(e) =>
              setSettings({ ...settings, memberCount: Number(e.target.value) })
            }
            placeholder="팀당 인원 입력 (예: 4)"
          />
        </div>
      )}

      {/* Preview */}
      {preview && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-2">예상 결과</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <p>총 참가자: {participants.length}명</p>
            <p>팀 수: {preview.teams}개</p>
            <p>팀당 인원: 약 {preview.membersPerTeam}명</p>
          </div>
        </div>
      )}
    </Card>
  );
}
