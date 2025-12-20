import { useEffect, useState } from 'react';
import type { Participant } from '@/types/team';
import { generateTeamColors } from '@/utils/colors';
import { Card } from '@mini-apps/ui';
import Confetti from 'react-confetti';
import { Users } from 'lucide-react';

interface TeamResultProps {
  teams: Participant[][];
  showConfetti?: boolean;
}

export function TeamResult({ teams, showConfetti = false }: TeamResultProps) {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const colors = generateTeamColors(teams.length);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.3}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {teams.map((team, index) => {
          const color = colors[index];
          const isHSL = color.bg.startsWith('hsl');

          return (
            <Card
              key={index}
              className={`p-6 border-2 ${!isHSL ? color.bg + ' ' + color.border : ''}`}
              style={
                isHSL
                  ? {
                      backgroundColor: color.bg,
                      borderColor: color.border,
                    }
                  : {}
              }
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${!isHSL ? color.text + ' bg-white/50' : ''}`}
                  style={
                    isHSL
                      ? {
                          color: color.text,
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                        }
                      : {}
                  }
                >
                  <Users className="w-6 h-6" />
                </div>
                <div>
                  <h3
                    className={`text-2xl font-bold ${!isHSL ? color.text : ''}`}
                    style={isHSL ? { color: color.text } : {}}
                  >
                    팀 {index + 1}
                  </h3>
                  <p className="text-sm opacity-75">{team.length}명</p>
                </div>
              </div>

              <ul className="space-y-2">
                {team.map((member, idx) => (
                  <li
                    key={member.id}
                    className="flex items-center gap-2 bg-white/70 px-3 py-2 rounded backdrop-blur-sm"
                  >
                    <span className="font-bold text-gray-500 min-w-[24px]">
                      {idx + 1}.
                    </span>
                    <span className="font-medium text-gray-800">
                      {member.name}
                    </span>
                  </li>
                ))}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
