import { useMemo } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { useRoomStore } from '@/store/roomStore';
import { findMatches, getInterestFrequency } from '@/lib/matching';
import { Card } from '@mini-apps/ui';

interface MatchingViewProps {
  roomId: string;
}

export const MatchingView: React.FC<MatchingViewProps> = ({ roomId }) => {
  const { profile, getProfileById } = useProfileStore();
  const { getRoomById } = useRoomStore();

  const room = getRoomById(roomId);
  if (!room || !profile) return null;

  const roomProfiles = room.members
    .map(id => getProfileById(id))
    .filter(Boolean) as any[];

  const matches = useMemo(
    () => findMatches(profile, roomProfiles),
    [profile, roomProfiles]
  );

  const interestFrequency = useMemo(
    () => getInterestFrequency(roomProfiles),
    [roomProfiles]
  );

  // 태그 클라우드 렌더링 (빈도수에 따라 크기 조정)
  const maxFrequency = Math.max(...Array.from(interestFrequency.values()));

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* 관심사 태그 클라우드 */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">☁️ 인기 관심사</h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {Array.from(interestFrequency.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([interest, count]) => {
              const size = Math.max(14, Math.min(32, (count / maxFrequency) * 32));
              return (
                <span
                  key={interest}
                  className="px-4 py-2 bg-blue-600
                             text-white rounded-full font-medium shadow-md
                             hover:shadow-lg transition-shadow"
                  style={{ fontSize: `${size}px` }}
                >
                  {interest} ({count})
                </span>
              );
            })}
        </div>
      </Card>

      {/* 매칭된 수강생 */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">🤝 나와 관심사가 비슷한 사람</h2>

        {matches.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            공통 관심사를 가진 사람이 없습니다
          </div>
        ) : (
          <div className="space-y-4">
            {matches.map(({ profile: matchedProfile, commonInterests, score }) => (
              <div
                key={matchedProfile.id}
                className="p-5 border-2 border-gray-100 rounded-xl hover:border-blue-300
                           transition-colors"
              >
                <div className="flex items-start gap-4">
                  {matchedProfile.avatarUrl ? (
                    <img
                      src={matchedProfile.avatarUrl}
                      alt={matchedProfile.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-purple-100
                                    flex items-center justify-center text-2xl text-purple-600">
                      {matchedProfile.name[0]}
                    </div>
                  )}

                  <div className="flex-1">
                    <h3 className="text-lg font-bold">{matchedProfile.name}</h3>
                    <p className="text-gray-600 text-sm mb-2">{matchedProfile.tagline}</p>
                    <p className="text-sm text-gray-500 mb-3">{matchedProfile.field}</p>

                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                        공통 관심사 {score}개
                      </span>
                      {commonInterests.map(interest => (
                        <span
                          key={interest}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                        >
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};
