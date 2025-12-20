import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import html2canvas from 'html2canvas';
import { Button } from '@mini-apps/ui';
import { Download } from 'lucide-react';
import type { Profile } from '@/types';

interface ProfileCardProps {
  profile: Profile;
  onDownload?: () => void;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ profile, onDownload }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const shareUrl = `${window.location.origin}/profile/${profile.id}`;

  const handleDownload = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2, // 고해상도
        logging: false,
        useCORS: true // 외부 이미지 처리
      });

      // Canvas를 Blob으로 변환
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `${profile.name}-profile-card.png`;
          link.click();
          URL.revokeObjectURL(url);
          onDownload?.();
        }
      }, 'image/png');
    } catch (error) {
      console.error('카드 다운로드 실패:', error);
    }
  };

  return (
    <div className="space-y-4">
      {/* 카드 미리보기 (Canvas로 변환될 영역) */}
      <div
        ref={cardRef}
        className="w-[600px] h-[800px] bg-white
                   p-12 rounded-2xl shadow-2xl border-4 border-gray-200"
      >
        {/* 헤더 영역 */}
        <div className="flex items-start gap-6 mb-8">
          {/* 프로필 이미지 */}
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
              crossOrigin="anonymous"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-blue-100
                            flex items-center justify-center text-4xl border-4 border-white shadow-lg text-blue-600">
              {profile.name[0]}
            </div>
          )}

          {/* 이름 & 소개 */}
          <div className="flex-1">
            <h2 className="text-4xl font-bold text-gray-800 mb-2">
              {profile.name}
            </h2>
            <p className="text-xl text-gray-600 mb-3">
              {profile.tagline}
            </p>
            <div className="inline-block px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-medium">
              {profile.field}
            </div>
          </div>
        </div>

        {/* 관심사 태그 */}
        {profile.interests.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-bold text-gray-700 mb-3 flex items-center gap-2">
              🏷️ 관심사
            </h3>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map(interest => (
                <span
                  key={interest}
                  className="px-4 py-2 bg-white text-gray-700 rounded-full text-sm
                             shadow-md border border-gray-200"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 연락처 */}
        <div className="mb-8 space-y-3">
          {profile.contacts.email && (
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-xl">📧</span>
              <span className="text-base">{profile.contacts.email}</span>
            </div>
          )}
          {profile.contacts.github && (
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-xl">🐙</span>
              <span className="text-base">{profile.contacts.github}</span>
            </div>
          )}
          {profile.contacts.linkedin && (
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-xl">💼</span>
              <span className="text-base">{profile.contacts.linkedin}</span>
            </div>
          )}
          {profile.contacts.website && (
            <div className="flex items-center gap-3 text-gray-700">
              <span className="text-xl">🌐</span>
              <span className="text-base">{profile.contacts.website}</span>
            </div>
          )}
        </div>

        {/* QR 코드 */}
        <div className="flex flex-col items-center gap-3 mt-auto pt-8 border-t-2 border-gray-200">
          <QRCodeSVG
            value={shareUrl}
            size={120}
            level="H"
            includeMargin={true}
            bgColor="#ffffff"
            fgColor="#000000"
          />
          <p className="text-sm text-gray-600">
            QR 코드를 스캔하여 프로필 보기
          </p>
        </div>
      </div>

      {/* 다운로드 버튼 */}
      <Button
        onClick={handleDownload}
        className="w-full py-3 bg-green-600 hover:bg-green-700
                   text-white font-bold rounded-lg hover:shadow-xl
                   transform hover:scale-105 transition-all"
      >
        <Download className="w-5 h-5 mr-2" />
        프로필 카드 다운로드 (PNG)
      </Button>
    </div>
  );
};
