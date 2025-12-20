import { useState } from 'react';
import { useProfileStore } from '@/store/profileStore';
import { nanoid } from 'nanoid';
import { Button } from '@mini-apps/ui';
import { FIELD_OPTIONS } from '@/constants/fields';
import { INTEREST_TAGS } from '@/constants/interests';
import type { Profile } from '@/types';

export const ProfileForm: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { createProfile } = useProfileStore();
  const [formData, setFormData] = useState<Partial<Profile>>({
    name: '',
    tagline: '',
    field: '',
    interests: [],
    contacts: {
      email: '',
      github: '',
      linkedin: '',
      website: ''
    },
    avatarUrl: ''
  });

  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const handleAddInterest = (interest: string) => {
    if (selectedInterests.length < 5 && !selectedInterests.includes(interest)) {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setSelectedInterests(selectedInterests.filter(i => i !== interest));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const profile: Profile = {
      id: nanoid(),
      name: formData.name!,
      tagline: formData.tagline!,
      field: formData.field!,
      interests: selectedInterests,
      contacts: formData.contacts!,
      avatarUrl: formData.avatarUrl,
      createdAt: new Date().toISOString()
    };

    createProfile(profile);
    onComplete();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">프로필 만들기</h1>
        <p className="text-gray-600">학력이 아닌 관심사로 연결되는 네트워킹</p>
      </div>

      {/* 프로필 이미지 */}
      <div className="flex flex-col items-center gap-4">
        {formData.avatarUrl ? (
          <img
            src={formData.avatarUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center">
            <span className="text-4xl">👤</span>
          </div>
        )}
        <label className="px-4 py-2 bg-blue-500 text-white rounded-lg cursor-pointer hover:bg-blue-600">
          프로필 사진 업로드
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
        </label>
      </div>

      {/* 이름 */}
      <div>
        <label className="block text-sm font-medium mb-2">이름 *</label>
        <input
          type="text"
          required
          maxLength={20}
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="홍길동"
        />
      </div>

      {/* 한줄 소개 */}
      <div>
        <label className="block text-sm font-medium mb-2">한줄 소개 *</label>
        <input
          type="text"
          required
          maxLength={30}
          value={formData.tagline}
          onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="웹 개발에 열정이 있는 주니어 개발자"
        />
        <p className="text-sm text-gray-500 mt-1">
          {formData.tagline?.length || 0}/30
        </p>
      </div>

      {/* 전공/분야 */}
      <div>
        <label className="block text-sm font-medium mb-2">전공/분야 *</label>
        <select
          required
          value={formData.field}
          onChange={(e) => setFormData({ ...formData, field: e.target.value })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="">선택해주세요</option>
          {FIELD_OPTIONS.map(field => (
            <option key={field} value={field}>{field}</option>
          ))}
        </select>
      </div>

      {/* 관심사 태그 */}
      <div>
        <label className="block text-sm font-medium mb-2">
          관심사 태그 (최대 5개)
        </label>

        {/* 선택된 태그 */}
        <div className="flex flex-wrap gap-2 mb-4 min-h-[50px] p-3 bg-gray-50 rounded-lg">
          {selectedInterests.length === 0 ? (
            <span className="text-gray-400 text-sm">아래에서 관심사를 선택해주세요</span>
          ) : (
            selectedInterests.map(interest => (
              <span
                key={interest}
                className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm
                           flex items-center gap-2"
              >
                {interest}
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="hover:text-red-200"
                >
                  ✕
                </button>
              </span>
            ))
          )}
        </div>

        {/* 태그 선택 */}
        <div className="flex flex-wrap gap-2">
          {INTEREST_TAGS.map(tag => (
            <button
              key={tag}
              type="button"
              onClick={() => handleAddInterest(tag)}
              disabled={selectedInterests.includes(tag) || selectedInterests.length >= 5}
              className={`px-3 py-1 rounded-full text-sm transition-colors
                ${selectedInterests.includes(tag)
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
                ${selectedInterests.length >= 5 && !selectedInterests.includes(tag)
                  ? 'opacity-50 cursor-not-allowed'
                  : ''
                }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* 연락처 (선택) */}
      <div className="space-y-3">
        <label className="block text-sm font-medium">연락처 (선택)</label>

        <input
          type="email"
          value={formData.contacts?.email}
          onChange={(e) => setFormData({
            ...formData,
            contacts: { ...formData.contacts!, email: e.target.value }
          })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="이메일 (선택)"
        />

        <input
          type="url"
          value={formData.contacts?.github}
          onChange={(e) => setFormData({
            ...formData,
            contacts: { ...formData.contacts!, github: e.target.value }
          })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="GitHub 프로필 URL (선택)"
        />

        <input
          type="url"
          value={formData.contacts?.linkedin}
          onChange={(e) => setFormData({
            ...formData,
            contacts: { ...formData.contacts!, linkedin: e.target.value }
          })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="LinkedIn 프로필 URL (선택)"
        />

        <input
          type="url"
          value={formData.contacts?.website}
          onChange={(e) => setFormData({
            ...formData,
            contacts: { ...formData.contacts!, website: e.target.value }
          })}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="개인 웹사이트 URL (선택)"
        />
      </div>

      <Button
        type="submit"
        className="w-full py-3 bg-blue-600 hover:bg-blue-700
                   text-white font-bold rounded-lg hover:shadow-xl
                   transform hover:scale-105 transition-all"
      >
        프로필 생성하기
      </Button>
    </form>
  );
};
