/**
 * 후보자 패널 (좌/우)
 */

import type { Candidate } from '../../types'

interface CandidatePanelProps {
  candidate: Candidate
  position: 'left' | 'right'
  onSelect: () => void
}

export default function CandidatePanel({
  candidate,
  position,
  onSelect,
}: CandidatePanelProps) {
  return (
    <button
      onClick={onSelect}
      className={`
        relative group cursor-pointer overflow-hidden
        transition-all duration-300 ease-out
        hover:scale-105 active:scale-95
        ${position === 'left' ? 'md:border-r-2' : 'md:border-l-2'}
        border-gray-200 hover:shadow-2xl
      `}
    >
      {/* 배경 이미지 */}
      <div className="absolute inset-0">
        <img
          src={candidate.imageUrl}
          alt={candidate.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60" />
      </div>

      {/* 후보자 이름 */}
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <h2 className="text-white text-2xl md:text-4xl font-bold drop-shadow-lg">
          {candidate.name}
        </h2>
      </div>

      {/* 호버 효과 */}
      <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/10 transition-colors duration-300" />

      {/* 선택 표시 (모바일) */}
      <div className="md:hidden absolute top-4 right-4">
        <div className="bg-white/90 rounded-full p-2 shadow-lg">
          <svg
            className="w-6 h-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={3}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>
    </button>
  )
}
