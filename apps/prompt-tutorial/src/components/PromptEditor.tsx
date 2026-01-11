import { useState } from 'react';

interface PromptEditorProps {
  systemPrompt?: string;
  userPrompt?: string;
  systemPromptEditable?: boolean;
  userPromptEditable?: boolean;
  onSystemPromptChange?: (value: string) => void;
  onUserPromptChange?: (value: string) => void;
  onRun: (systemPrompt: string, userPrompt: string) => void;
  isLoading?: boolean;
}

function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      console.error('Failed to copy');
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1 rounded hover:bg-neutral-200 transition-colors ${className}`}
      title="복사"
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}

interface ReadOnlyTextareaProps {
  value: string;
  placeholder: string;
  rows: number;
}

function ReadOnlyTextarea({ value, placeholder, rows }: ReadOnlyTextareaProps) {
  return (
    <div className="relative group">
      <textarea
        value={value}
        disabled
        placeholder={placeholder}
        className="w-full px-3 py-2 rounded-lg border-2 border-neutral-200 bg-neutral-50 text-neutral-500 text-sm font-mono resize-none cursor-not-allowed"
        rows={rows}
      />
      {/* 금지 이모지 오버레이 - 호버 시 나타남 */}
      <div className="absolute inset-0 flex items-center justify-center bg-neutral-50/80 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        <span className="text-4xl">🚫</span>
      </div>
    </div>
  );
}

export function PromptEditor({
  systemPrompt = '',
  userPrompt = '',
  systemPromptEditable = false,
  userPromptEditable = true,
  onSystemPromptChange,
  onUserPromptChange,
  onRun,
  isLoading = false,
}: PromptEditorProps) {
  const [localSystemPrompt, setLocalSystemPrompt] = useState(systemPrompt);
  const [localUserPrompt, setLocalUserPrompt] = useState(userPrompt);

  const handleSystemChange = (value: string) => {
    setLocalSystemPrompt(value);
    onSystemPromptChange?.(value);
  };

  const handleUserChange = (value: string) => {
    setLocalUserPrompt(value);
    onUserPromptChange?.(value);
  };

  const handleRun = () => {
    onRun(localSystemPrompt, localUserPrompt);
  };

  return (
    <div className="space-y-4">
      {/* System Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-purple-100 text-purple-700 text-xs font-bold">
              S
            </span>
            System Prompt
            {!systemPromptEditable && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                🔒 읽기전용
              </span>
            )}
          </label>
          {localSystemPrompt && <CopyButton text={localSystemPrompt} />}
        </div>
        {systemPromptEditable ? (
          <textarea
            value={localSystemPrompt}
            onChange={(e) => handleSystemChange(e.target.value)}
            placeholder="시스템 프롬프트를 입력하세요..."
            className="w-full px-3 py-2 rounded-lg border-2 border-purple-300 bg-purple-50 text-neutral-900 text-sm font-mono resize-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all focus:outline-none"
            rows={2}
          />
        ) : (
          <ReadOnlyTextarea value={localSystemPrompt} placeholder="(비어있음)" rows={2} />
        )}
      </div>

      {/* User Prompt */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm font-medium text-neutral-700">
            <span className="inline-flex items-center justify-center w-5 h-5 rounded bg-blue-100 text-blue-700 text-xs font-bold">
              U
            </span>
            User Prompt
            {!userPromptEditable && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
                🔒 읽기전용
              </span>
            )}
          </label>
          {localUserPrompt && <CopyButton text={localUserPrompt} />}
        </div>
        {userPromptEditable ? (
          <textarea
            value={localUserPrompt}
            onChange={(e) => handleUserChange(e.target.value)}
            placeholder="프롬프트를 입력하세요..."
            className="w-full px-3 py-2 rounded-lg border-2 border-blue-300 bg-blue-50 text-neutral-900 text-sm font-mono resize-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all focus:outline-none"
            rows={4}
          />
        ) : (
          <ReadOnlyTextarea value={localUserPrompt} placeholder="(비어있음)" rows={4} />
        )}
      </div>

      {/* Run Button */}
      <button
        onClick={handleRun}
        disabled={isLoading || (!localUserPrompt.trim())}
        className={`w-full py-2.5 px-4 rounded-lg font-medium text-sm transition-all
          ${isLoading || !localUserPrompt.trim()
            ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
            : 'bg-blue-600 text-white hover:bg-blue-700 active:scale-[0.98]'
          }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            생성 중...
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            실행
          </span>
        )}
      </button>
    </div>
  );
}
