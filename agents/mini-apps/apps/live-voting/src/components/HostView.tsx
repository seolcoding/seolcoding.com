import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Maximize2, Minimize2, Users, Home } from 'lucide-react';
import { useLiveResults } from '@/hooks/useLiveResults';
import { ResultChart } from './ResultChart';

export function HostView() {
  const { pollId } = useParams<{ pollId: string }>();
  const navigate = useNavigate();
  const { poll, votes, results } = useLiveResults(pollId!);
  const [qrDataUrl, setQrDataUrl] = useState('');
  const [isPresentationMode, setIsPresentationMode] = useState(false);

  useEffect(() => {
    if (!pollId) {
      navigate('/');
      return;
    }

    // QR 코드 생성
    const voteUrl = `${window.location.origin}${import.meta.env.BASE_URL}vote/${pollId}`;
    QRCode.toDataURL(voteUrl, { width: 400, margin: 2 }).then(setQrDataUrl);
  }, [pollId, navigate]);

  if (!poll) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${isPresentationMode ? 'bg-blue-600 p-8' : 'bg-gray-50 p-6'}`}>
      {/* 헤더 */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className={`font-bold mb-2 ${isPresentationMode ? 'text-5xl text-white' : 'text-3xl'}`}>
              {poll.title}
            </h1>
            <div className={`flex items-center gap-2 ${isPresentationMode ? 'text-2xl text-white/90' : 'text-lg text-gray-600'}`}>
              <Users size={isPresentationMode ? 28 : 20} />
              <span>총 {votes.length}명 참여</span>
            </div>
          </div>
          <div className="flex gap-3">
            {!isPresentationMode && (
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition flex items-center gap-2"
              >
                <Home size={20} />
                홈으로
              </button>
            )}
            <button
              onClick={() => setIsPresentationMode(!isPresentationMode)}
              className="px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-100 transition shadow-md flex items-center gap-2"
            >
              {isPresentationMode ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
              {isPresentationMode ? '일반 모드' : '프레젠테이션 모드'}
            </button>
          </div>
        </div>
      </div>

      <div className={`max-w-7xl mx-auto grid ${isPresentationMode ? 'grid-cols-3 gap-8' : 'grid-cols-1 lg:grid-cols-2 gap-6'}`}>
        {/* QR 코드 */}
        <div className={`bg-white rounded-xl shadow-lg p-6 ${isPresentationMode ? 'col-span-1' : ''}`}>
          <h3 className={`font-bold mb-4 ${isPresentationMode ? 'text-2xl' : 'text-xl'}`}>투표 참여</h3>
          {qrDataUrl && (
            <div className="flex flex-col items-center">
              <img src={qrDataUrl} alt="QR Code" className={isPresentationMode ? 'w-full' : 'w-64'} />
              <p className="mt-4 text-sm text-gray-600 text-center">QR 스캔 또는 아래 링크로 접속</p>
              <p className="font-mono text-xs text-blue-600 break-all text-center mt-2 px-4">
                {window.location.origin}{import.meta.env.BASE_URL}vote/{pollId}
              </p>
            </div>
          )}
        </div>

        {/* 차트 */}
        <div className={`bg-white rounded-xl shadow-lg p-6 ${isPresentationMode ? 'col-span-2' : ''}`}>
          <h3 className={`font-bold mb-4 ${isPresentationMode ? 'text-2xl' : 'text-xl'}`}>
            실시간 결과
            {poll.type === 'ranking' && ' (Borda Count 점수)'}
          </h3>
          <ResultChart results={results} isRanking={poll.type === 'ranking'} />
        </div>
      </div>

      {/* 결과 테이블 (일반 모드만) */}
      {!isPresentationMode && (
        <div className="max-w-7xl mx-auto mt-6 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">상세 결과</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold">선택지</th>
                  {poll.type === 'ranking' ? (
                    <>
                      <th className="text-right py-3 px-4 font-semibold">순위</th>
                      <th className="text-right py-3 px-4 font-semibold">점수</th>
                    </>
                  ) : (
                    <>
                      <th className="text-right py-3 px-4 font-semibold">득표수</th>
                      <th className="text-right py-3 px-4 font-semibold">비율</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {results.map((result, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">{result.option}</td>
                    {poll.type === 'ranking' ? (
                      <>
                        <td className="text-right py-3 px-4 font-medium">{result.rank}위</td>
                        <td className="text-right py-3 px-4">{result.score}점</td>
                      </>
                    ) : (
                      <>
                        <td className="text-right py-3 px-4 font-medium">{result.count}표</td>
                        <td className="text-right py-3 px-4">{result.percentage.toFixed(1)}%</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
