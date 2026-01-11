import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getCurrentModel, getCurrentProvider, setApiKey, getStoredApiKey, validateApiKey } from '@/lib/llm';
import { resetAllProgress } from '@/lib/storage';

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [currentModel] = useState(getCurrentModel());
  const [currentProvider] = useState(getCurrentProvider());
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 저장된 API 키가 있으면 마스킹하여 표시
    const storedKey = getStoredApiKey();
    if (storedKey) {
      setApiKeyInput(maskApiKey(storedKey));
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function maskApiKey(key: string): string {
    if (key.length <= 8) return key;
    return key.slice(0, 7) + '...' + key.slice(-4);
  }

  async function handleSaveApiKey() {
    // 마스킹된 값이면 변경 없음
    if (apiKeyInput.includes('...')) {
      setMenuOpen(false);
      return;
    }

    const trimmedKey = apiKeyInput.trim();
    if (!trimmedKey) {
      setValidationError('API 키를 입력해주세요.');
      return;
    }

    if (!trimmedKey.startsWith('sk-') && !trimmedKey.startsWith('sk-or-')) {
      setValidationError('올바른 API 키 형식이 아닙니다. (sk- 또는 sk-or-로 시작)');
      return;
    }

    setIsValidating(true);
    setValidationError('');

    try {
      const isValid = await validateApiKey(trimmedKey);
      if (isValid) {
        setApiKey(trimmedKey);
        setApiKeyInput(maskApiKey(trimmedKey));
        setMenuOpen(false);
        window.location.reload();
      } else {
        setValidationError('API 키가 유효하지 않습니다. 다시 확인해주세요.');
      }
    } catch {
      setValidationError('API 키 검증 중 오류가 발생했습니다.');
    } finally {
      setIsValidating(false);
    }
  }

  function handleClearApiKey() {
    setApiKey('');
    setApiKeyInput('');
    setValidationError('');
  }

  function handleInputFocus() {
    // 포커스 시 마스킹된 값이면 비우기
    if (apiKeyInput.includes('...')) {
      setApiKeyInput('');
    }
  }

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
          <div className="hidden sm:block">
            <div className="font-semibold text-neutral-900">Anthropic 공식 프롬프트 엔지니어링 코스</div>
            <div className="text-xs text-neutral-500">AI와 효과적으로 대화하는 방법을 배워보세요</div>
            <div className="text-xs text-neutral-400">공식 코스의 주피터 노트북을 한국어로 번역하고 웹앱으로 리팩터링했습니다</div>
          </div>
          <span className="font-semibold text-neutral-900 sm:hidden">Anthropic PE</span>
        </Link>

        <div className="flex items-center gap-2">
          {/* Reset Progress Button */}
          <button
            onClick={() => {
              if (confirm('모든 진행 상황과 API 키를 초기화하시겠습니까?\n처음부터 다시 시작합니다.')) {
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

          {/* API Key Button */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors bg-blue-50 text-blue-700 hover:bg-blue-100"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{currentModel}</span>
            <svg className={`w-4 h-4 transition-transform ${menuOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-neutral-200 p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-neutral-700">
                    {currentProvider === 'openrouter' ? 'OpenRouter' : 'OpenAI'} API
                  </span>
                  <span className="text-xs text-blue-600">{currentModel}</span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-neutral-500">
                    API 키 ({currentProvider === 'openrouter' ? 'OpenRouter (sk-or-)' : 'OpenAI (sk-)'})
                  </label>
                  <input
                    type="text"
                    value={apiKeyInput}
                    onChange={(e) => {
                      setApiKeyInput(e.target.value);
                      setValidationError('');
                    }}
                    onFocus={handleInputFocus}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
                    placeholder={currentProvider === 'openrouter' ? 'sk-or-...' : 'sk-...'}
                    disabled={currentProvider === 'openrouter'}
                    className={`w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                      ${currentProvider === 'openrouter'
                        ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-200'
                        : 'border-neutral-200'
                      }`}
                  />

                  {/* OpenRouter 안내 메시지 */}
                  {currentProvider === 'openrouter' && (
                    <div className="p-2 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700 flex items-start gap-1">
                        <svg className="w-3 h-3 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>API 키 없이 사용 가능합니다. <strong>개발자가 비용을 부담합니다.</strong></span>
                      </p>
                    </div>
                  )}

                  {validationError && (
                    <p className="text-xs text-red-600">{validationError}</p>
                  )}
                </div>

                {/* 버튼들 - OpenRouter는 저장 버튼 숨김 */}
                <div className="flex gap-2">
                  {currentProvider === 'openai' && (
                    <>
                      <button
                        onClick={handleSaveApiKey}
                        disabled={isValidating}
                        className="flex-1 px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        {isValidating ? '검증 중...' : '저장'}
                      </button>
                      {apiKeyInput && (
                        <button
                          onClick={handleClearApiKey}
                          className="px-3 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          삭제
                        </button>
                      )}
                    </>
                  )}
                  {currentProvider === 'openrouter' && (
                    <div className="flex-1 text-center text-xs text-neutral-400 py-2">
                      OpenRouter API (개발자 부담)
                    </div>
                  )}
                </div>

                <p className="text-xs text-neutral-400">
                  API 키는 브라우저에 로컬 저장되며 서버로 전송되지 않습니다.
                </p>
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </header>
  );
}
