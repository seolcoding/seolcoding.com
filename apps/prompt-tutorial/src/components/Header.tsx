import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { resetAllProgress } from '@/lib/storage';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
            {/* Anthropic 'A' logo */}
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-600"/>
              <text x="12" y="17" textAnchor="middle" fontSize="10" fontWeight="bold" fill="currentColor" className="text-amber-700">a</text>
            </svg>
          </div>
          <span className="hidden sm:block font-semibold text-neutral-900">Anthropic 공식 프롬프트 엔지니어링 코스</span>
          <span className="font-semibold text-neutral-900 sm:hidden">Anthropic PE</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Reset Progress Button */}
          <button
            onClick={() => {
              if (confirm('모든 진행 상황을 초기화하시겠습니까?\n처음부터 다시 시작합니다.')) {
                resetAllProgress();
                window.location.reload();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-neutral-500 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden sm:inline">초기화</span>
          </button>

          {/* Model Info Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>무료</span>
            <svg className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              <span className="text-xs text-green-700">API 비용은 개발자가 부담합니다 😇</span>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}
