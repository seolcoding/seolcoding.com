import { useState } from 'react';
import { useRoomStore } from '@/store/roomStore';
import { useProfileStore } from '@/store/profileStore';
import { createRoomCode } from '@/lib/roomCode';
import { Button, Card } from '@mini-apps/ui';
import { Copy, LogOut, Eye, EyeOff } from 'lucide-react';
import type { Room } from '@/types';

export const RoomManager: React.FC<{ onRoomSelect: (roomId: string) => void }> = ({ onRoomSelect }) => {
  const { rooms, createRoom, joinRoom, leaveRoom } = useRoomStore();
  const { profile, getProfileById } = useProfileStore();
  const [joinCode, setJoinCode] = useState('');
  const [newRoomName, setNewRoomName] = useState('');

  const handleCreateRoom = () => {
    if (!newRoomName.trim() || !profile) return;

    const room: Room = {
      id: createRoomCode(),
      name: newRoomName,
      createdBy: profile.id,
      members: [profile.id],
      createdAt: new Date().toISOString()
    };

    createRoom(room);
    setNewRoomName('');
  };

  const handleJoinRoom = () => {
    if (!joinCode.trim() || !profile) return;
    joinRoom(joinCode.toUpperCase(), profile.id);
    setJoinCode('');
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-6">
      {/* Room 생성 */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">🏫 새 교실 만들기</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={newRoomName}
            onChange={(e) => setNewRoomName(e.target.value)}
            placeholder="교실 이름 (예: React 부트캠프 2기)"
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
          />
          <Button
            onClick={handleCreateRoom}
            disabled={!newRoomName.trim() || !profile}
          >
            생성하기
          </Button>
        </div>
        {!profile && (
          <p className="text-sm text-red-500 mt-2">
            ⚠️ 먼저 프로필을 생성해주세요
          </p>
        )}
      </Card>

      {/* Room 참여 */}
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">🔑 교실 참여하기</h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            placeholder="6자리 코드 입력 (예: ABC123)"
            maxLength={6}
            className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500
                       font-mono text-xl tracking-widest uppercase"
          />
          <Button
            onClick={handleJoinRoom}
            disabled={joinCode.length !== 6 || !profile}
          >
            참여하기
          </Button>
        </div>
      </Card>

      {/* 내 교실 목록 */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">📚 내 교실</h2>
        {rooms.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            참여 중인 교실이 없습니다
          </Card>
        ) : (
          rooms.map(room => (
            <RoomCard
              key={room.id}
              room={room}
              onLeave={() => leaveRoom(room.id, profile!.id)}
              onSelect={() => onRoomSelect(room.id)}
              getProfileById={getProfileById}
            />
          ))
        )}
      </div>
    </div>
  );
};

// Room 카드 컴포넌트
interface RoomCardProps {
  room: Room;
  onLeave: () => void;
  onSelect: () => void;
  getProfileById: (id: string) => any;
}

const RoomCard: React.FC<RoomCardProps> = ({ room, onLeave, onSelect, getProfileById }) => {
  const [showCode, setShowCode] = useState(false);

  const members = room.members.map(id => getProfileById(id)).filter(Boolean);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(room.id);
    alert('교실 코드가 복사되었습니다!');
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{room.name}</h3>
          <p className="text-sm text-gray-500">
            참여자: {room.members.length}명
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            onClick={() => setShowCode(!showCode)}
            variant="outline"
            size="sm"
          >
            {showCode ? <EyeOff className="w-4 h-4 mr-1" /> : <Eye className="w-4 h-4 mr-1" />}
            {showCode ? '코드 숨기기' : '코드 보기'}
          </Button>
          <Button
            onClick={onLeave}
            variant="outline"
            size="sm"
          >
            <LogOut className="w-4 h-4 mr-1" />
            나가기
          </Button>
        </div>
      </div>

      {showCode && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg flex items-center justify-between">
          <span className="font-mono text-2xl font-bold tracking-widest">
            {room.id}
          </span>
          <Button onClick={copyRoomCode} size="sm">
            <Copy className="w-4 h-4 mr-1" />
            복사
          </Button>
        </div>
      )}

      {/* 참여자 프로필 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
        {members.map((member: any) => (
          <div
            key={member.id}
            className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors
                       cursor-pointer"
          >
            {member.avatarUrl ? (
              <img
                src={member.avatarUrl}
                alt={member.name}
                className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-blue-100
                              flex items-center justify-center text-2xl mx-auto mb-2 text-blue-600">
                {member.name[0]}
              </div>
            )}
            <p className="text-sm font-medium text-center truncate">
              {member.name}
            </p>
            <p className="text-xs text-gray-500 text-center truncate">
              {member.field}
            </p>
          </div>
        ))}
      </div>

      <Button onClick={onSelect} className="w-full">
        교실 입장하기
      </Button>
    </Card>
  );
};
