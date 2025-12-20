/**
 * 1:1 대결 화면
 */

import { ArrowLeft } from 'lucide-react'
import { Button, Progress } from '@mini-apps/ui'
import type { Match } from '../../types'
import { getRoundName } from '../../utils/tournament'
import CandidatePanel from './CandidatePanel'

interface MatchViewProps {
  match: Match
  currentMatchIndex: number
  totalMatches: number
  currentRound: number
  onSelectWinner: (candidateId: string) => void
  onGoBack: () => void
  canGoBack: boolean
}

export default function MatchView({
  match,
  currentMatchIndex,
  totalMatches,
  currentRound,
  onSelectWinner,
  onGoBack,
  canGoBack,
}: MatchViewProps) {
  const progress = ((currentMatchIndex + 1) / totalMatches) * 100

  return (
    <div className="min-h-screen flex flex-col">
      {/* 헤더 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 space-y-3">
          {/* 뒤로가기 버튼 */}
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoBack}
              disabled={!canGoBack}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              뒤로가기
            </Button>
            <span className="text-sm text-gray-600">
              {currentMatchIndex + 1} / {totalMatches}
            </span>
          </div>

          {/* 라운드 표시 */}
          <h1 className="text-2xl font-bold text-center">
            {getRoundName(currentRound)}
          </h1>

          {/* 진행률 바 */}
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* 대결 패널 */}
      <div className="flex-1 grid md:grid-cols-2">
        <CandidatePanel
          candidate={match.candidateA}
          position="left"
          onSelect={() => onSelectWinner(match.candidateA.id)}
        />
        <CandidatePanel
          candidate={match.candidateB}
          position="right"
          onSelect={() => onSelectWinner(match.candidateB.id)}
        />
      </div>

      {/* VS 구분선 (데스크톱) */}
      <div className="hidden md:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none">
        <div className="bg-white rounded-full px-6 py-3 shadow-lg border-2 border-gray-200">
          <span className="text-3xl font-bold text-gray-700">VS</span>
        </div>
      </div>
    </div>
  )
}
