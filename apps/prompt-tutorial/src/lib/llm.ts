import OpenAI from 'openai';

// OpenRouter 기본 설정
const DEFAULT_MODEL = 'openai/gpt-oss-120b';

// API Base URL: 환경변수 > Production Worker > Dev 직접 호출
const DEFAULT_BASE_URL = import.meta.env.VITE_API_BASE_URL
  || (import.meta.env.PROD
    ? 'https://openrouter-proxy.seolcoding.workers.dev/v1'
    : 'https://openrouter.ai/api/v1');

// Worker 사용 여부 확인 (export for Header component)
export const isUsingWorker = DEFAULT_BASE_URL.includes('workers.dev')
  || DEFAULT_BASE_URL.includes('localhost:8787');

const API_KEY_STORAGE_KEY = 'openai_api_key';
const OPENROUTER_API_KEY_STORAGE_KEY = 'openrouter_api_key';

// API 공급자 타입
type APIProvider = 'openrouter' | 'openai';

interface APIConfig {
  provider: APIProvider;
  apiKey: string;
  baseURL: string;
  model: string;
}

// 환경 변수 또는 localStorage에서 API 설정 가져오기
function getAPIConfig(): APIConfig {
  // Worker 사용 시 API 키 불필요 (Worker가 주입)
  if (isUsingWorker) {
    return {
      provider: 'openrouter',
      apiKey: 'worker-proxy',  // OpenAI SDK 요구사항 (실제 사용 안함)
      baseURL: DEFAULT_BASE_URL,
      model: DEFAULT_MODEL,
    };
  }

  // 1. OpenRouter API 키 (우선 - 무료/저렴)
  let openrouterKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
  if (typeof window !== 'undefined' && !openrouterKey) {
    openrouterKey = localStorage.getItem(OPENROUTER_API_KEY_STORAGE_KEY) || '';
  }

  if (openrouterKey) {
    return {
      provider: 'openrouter',
      apiKey: openrouterKey,
      baseURL: DEFAULT_BASE_URL,
      model: DEFAULT_MODEL,
    };
  }

  // 2. OpenAI API 키 (개인용)
  let openaiKey = import.meta.env.VITE_OPENAI_API_KEY || '';
  if (typeof window !== 'undefined' && !openaiKey) {
    openaiKey = localStorage.getItem(API_KEY_STORAGE_KEY) || '';
  }

  if (openaiKey) {
    return {
      provider: 'openai',
      apiKey: openaiKey,
      baseURL: 'https://api.openai.com/v1',
      model: 'gpt-4.1-mini',
    };
  }

  // 3. API 키 없음 - OpenRouter 기본 모델 사용
  return {
    provider: 'openrouter',
    apiKey: '',
    baseURL: DEFAULT_BASE_URL,
    model: DEFAULT_MODEL,
  };
}

let openaiClient: OpenAI | null = null;
let cachedConfig: APIConfig | null = null;

function getClient(): OpenAI {
  const config = getAPIConfig();

  // API 키가 없는 경우에도 클라이언트는 생성 (실제 호출 시 에러 처리)
  // OpenRouter는 API 키가 필요하지만, UX를 위해 우선 클라이언트 생성

  // 설정이 변경되면 클라이언트 재생성
  if (!openaiClient || !cachedConfig ||
      cachedConfig.apiKey !== config.apiKey ||
      cachedConfig.baseURL !== config.baseURL) {
    cachedConfig = config;
    openaiClient = new OpenAI({
      apiKey: config.apiKey,
      baseURL: config.baseURL,
      dangerouslyAllowBrowser: true,
    });
  }
  return openaiClient;
}

// 현재 사용 중인 모델 정보 반환
export function getCurrentModel(): string {
  const config = getAPIConfig();
  if (config.provider === 'openrouter') {
    if (config.model === DEFAULT_MODEL) {
      return 'GPT-OSS 120B (OpenRouter)';
    }
    return config.model;
  }
  return 'GPT-4.1 Mini';
}

// 현재 API 공급자 반환
export function getCurrentProvider(): APIProvider {
  return getAPIConfig().provider;
}

export interface ModelInfo {
  id: string;
  name: string;
  description: string;
  inputTokenLimit?: number;
  outputTokenLimit?: number;
}

export function setApiKey(apiKey: string): void {
  if (typeof window !== 'undefined') {
    if (apiKey) {
      localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(API_KEY_STORAGE_KEY);
    }
    openaiClient = null;
    cachedConfig = null;
  }
}

export function clearApiKey(): void {
  setApiKey('');
}

export function getSelectedModel(): string {
  return DEFAULT_MODEL;
}

export function setSelectedModel(_modelId: string): void {
  // 고정 모델 사용
}

export async function fetchAvailableModels(): Promise<ModelInfo[]> {
  return [{
    id: DEFAULT_MODEL,
    name: 'GPT-4.1 Mini',
    description: 'OpenAI GPT-4.1 Mini model',
  }];
}

export function getCachedModels(): ModelInfo[] {
  return [{
    id: DEFAULT_MODEL,
    name: 'GPT-4.1 Mini',
    description: 'OpenAI GPT-4.1 Mini model',
  }];
}

export interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface CompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  onChunk?: (chunk: string) => void;
}

function isRateLimitError(error: unknown): boolean {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('rate limit') ||
      message.includes('rate_limit') ||
      message.includes('quota') ||
      message.includes('429') ||
      message.includes('too many requests')
    );
  }
  return false;
}

function getErrorMessage(error: unknown): string {
  if (isRateLimitError(error)) {
    return '⏳ API 요청 한도에 도달했습니다.\n\n잠시 후 다시 시도해주세요.';
  }

  if (error instanceof Error) {
    if (error.message.includes('API key') || error.message.includes('api_key') || error.message.includes('401') || error.message.includes('Incorrect API key')) {
      return '🔑 API 키가 유효하지 않습니다.\n\nOpenRouter API 키를 확인해주세요.\nhttps://openrouter.ai/keys 에서 무료로 발급받을 수 있습니다.';
    }
    if (error.message.includes('network') || error.message.includes('fetch')) {
      return '🌐 네트워크 연결에 문제가 있습니다.\n\n인터넷 연결을 확인하고 다시 시도해주세요.';
    }
    return error.message;
  }

  return '오류가 발생했습니다.';
}

export async function streamCompletion(
  messages: Message[],
  options: CompletionOptions = {}
): Promise<string> {
  const client = getClient();
  const { model = DEFAULT_MODEL, temperature = 0.7, maxTokens = 8192, onChunk } = options;

  try {
    const stream = await client.chat.completions.create({
      model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature,
      max_tokens: maxTokens,
      stream: true,
    });

    let fullContent = '';

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || '';
      if (text) {
        fullContent += text;
        onChunk?.(text);
      }
    }

    return fullContent;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function getCompletion(
  messages: Message[],
  options: Omit<CompletionOptions, 'onChunk'> = {}
): Promise<string> {
  const client = getClient();
  const { model = DEFAULT_MODEL, temperature = 0.7, maxTokens = 8192 } = options;

  try {
    const response = await client.chat.completions.create({
      model,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
      temperature,
      max_tokens: maxTokens,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export function isApiKeyConfigured(): boolean {
  return !!getAPIConfig().apiKey;
}

export function getStoredApiKey(): string {
  return getAPIConfig().apiKey;
}

export function getModelName(): string {
  return 'GPT-4.1 Mini';
}

export async function validateApiKey(apiKey: string): Promise<boolean> {
  if (!apiKey || !apiKey.startsWith('sk-') && !apiKey.startsWith('sk-or-')) {
    return false;
  }

  try {
    const testClient = new OpenAI({
      apiKey,
      dangerouslyAllowBrowser: true,
    });

    // 간단한 API 호출로 검증
    await testClient.models.list();
    return true;
  } catch {
    return false;
  }
}

// LLM 기반 채점 결과
export interface LLMGradingResult {
  passed: boolean;
  score: number; // 0-100
  feedback: string; // 한국어 피드백
  confidence: number; // 0-1 신뢰도
}

/**
 * LLM을 사용하여 답변을 채점합니다.
 * @param question 문제 설명
 * @param expectedAnswer 예상 답변 (선택 사항)
 * @param userResponse 사용자 답변 또는 LLM 응답
 * @param criteria 채점 기준 (선택 사항)
 */
export async function gradeWithLLM(params: {
  question: string;
  expectedAnswer?: string;
  userResponse: string;
  criteria?: string;
  language?: 'ko' | 'en';
}): Promise<LLMGradingResult> {
  const { question, expectedAnswer, userResponse, criteria, language = 'ko' } = params;

  const systemPrompt = language === 'ko'
    ? `당신은 프롬프트 엔지니어링 튜토리얼의 전문 채점자입니다. 학생의 답변을 공정하고 정확하게 채점해주세요.

## 채점 원칙
1. **의미 우선**: 의미가 맞으면 정답으로 인정합니다 (형식보다 의미 우선)
2. **언어 무시**: 한국어/영어 등 언어 차이는 무시하고 내용만 평가합니다
3. **부분 점수**: 부분적으로 맞으면 점수를 부여합니다 (0-100점 사이)
4. **유연한 판단**: 핵심 개념이 포함되어 있으면 정답으로 인정

## 피드백 작성 가이드
- **정답 (80-100점)**: 구체적으로 칭찬 + 무엇이 잘되었는지
  - 예: "완벽합니다! [구체적 요소]를 잘 적용했습니다."
- **부분 정답 (40-79점)**: 무엇이 맞았는지 + 무엇을 개선하면 좋을지
  - 예: "좋은 시작입니다! [맞은 부분]은 잘했지만, [개선점]을 고려해보세요."
- **오답 (0-39점)**: 왜 틀렸는지 + 구체적인 개선 제안
  - 예: "아직 맞지 않습니다. [핵심 개념]을 포함해보세요."

## 신뢰도 (confidence) 가이드
- 0.9-1.0: 명확한 정답/오답 (예상 답변과 완전 일치 또는 불일치)
- 0.7-0.8: 높은 신뢰도 (핵심 개념이 포함됨)
- 0.5-0.6: 중간 신뢰도 (부분적으로 맞지만 개선 필요)
- 0.3-0.4: 낮은 신뢰도 (모호하거나 불분명)

## 응답 형식 (반드시 JSON만 반환):
{
  "passed": true/false,
  "score": 0-100,
  "feedback": "한국어 피드백 (위 가이드에 따라 구체적이고 격려적으로 작성)",
  "confidence": 0.0-1.0
}`
    : `You are an expert grader for prompt engineering tutorials. Grade student responses fairly and accurately.

## Grading Principles
1. **Meaning First**: If the meaning is correct, accept as correct (prioritize meaning over form)
2. **Ignore Language**: Ignore language differences (Korean/English) and focus only on content
3. **Partial Credit**: Award partial credit for partially correct answers (0-100 scale)
4. **Flexible Judgment**: If core concepts are present, mark as correct

## Feedback Writing Guide
- **Correct (80-100)**: Specific praise + what was done well
  - Example: "Perfect! You effectively applied [specific element]."
- **Partially Correct (40-79)**: What was right + what to improve
  - Example: "Good start! [correct part] is good, but consider [improvement]."
- **Incorrect (0-39)**: Why it's wrong + specific improvement suggestions
  - Example: "Not quite right yet. Try including [core concept]."

## Confidence Guide
- 0.9-1.0: Clear correct/incorrect (exact match or mismatch)
- 0.7-0.8: High confidence (core concepts present)
- 0.5-0.6: Medium confidence (partially correct but needs improvement)
- 0.3-0.4: Low confidence (ambiguous or unclear)

## Response Format (JSON only):
{
  "passed": true/false,
  "score": 0-100,
  "feedback": "English feedback (specific and encouraging based on the guide above)",
  "confidence": 0.0-1.0
}`;

  // Build structured user prompt
  let userPrompt = `## 문제 설명\n${question}\n\n`;
  userPrompt += `## 학생 답변\n${userResponse}\n\n`;

  if (expectedAnswer) {
    userPrompt += `## 예상 답변 (참고용)\n${expectedAnswer}\n\n`;
  }

  if (criteria) {
    userPrompt += `## 채점 기준\n${criteria}\n\n`;
  }

  userPrompt += language === 'ko'
    ? '위 정보를 바탕으로 학생 답변을 채점하고, JSON 형식으로만 응답해주세요. 다른 텍스트는 포함하지 마세요.'
    : 'Grade the student response based on the information above. Respond in JSON format only. Do not include any other text.';

  try {
    const response = await getCompletion([
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ], {
      temperature: 0.2, // 낮은 temperature로 일관성 있는 채점
      maxTokens: 500,
    });

    // JSON 파싱
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      // 파싱 실패 시 휴리스틱 채점
      return heuristicGrading(params);
    }

    const result = JSON.parse(jsonMatch[0]);

    const score = Math.min(100, Math.max(0, result.score || 0));
    const passed = result.passed ?? false;
    const confidence = result.confidence || 0.8;
    let feedback = result.feedback || (language === 'ko' ? '채점이 완료되었습니다.' : 'Grading completed.');

    // 신뢰도가 낮은 경우 추가 메시지
    if (confidence < 0.5) {
      const disclaimer = language === 'ko'
        ? ' (신뢰도가 낮아 정확한 채점을 위해 다시 시도해보시는 것을 권장합니다.)'
        : ' (Low confidence - we recommend trying again for accurate grading.)';
      feedback += disclaimer;
    }

    return {
      passed,
      score,
      feedback,
      confidence,
    };
  } catch (error) {
    console.error('LLM grading failed, falling back to heuristic:', error);
    return heuristicGrading(params);
  }
}

/**
 * 휴리스틱 채점 (LLM 실패 시 또는 빠른 채점용)
 */
function heuristicGrading(params: {
  question: string;
  expectedAnswer?: string;
  userResponse: string;
  language?: 'ko' | 'en';
}): LLMGradingResult {
  const { expectedAnswer, userResponse, language = 'ko' } = params;
  const response = userResponse.toLowerCase().trim();

  // 빈 답변 체크
  if (response.length === 0) {
    return {
      passed: false,
      score: 0,
      feedback: language === 'ko' ? '답변이 비어있습니다. 답변을 입력해주세요.' : 'Response is empty. Please provide an answer.',
      confidence: 1.0,
    };
  }

  // 예상 답변이 있는 경우 키워드 매칭
  if (expectedAnswer) {
    const expected = expectedAnswer.toLowerCase();
    const responseWords = new Set(response.split(/\s+/));
    const expectedWords = expected.split(/\s+/).filter(w => w.length > 3); // 4글자 이상 단어만

    const matchCount = expectedWords.filter(word => responseWords.has(word)).length;
    const matchRatio = matchCount / Math.max(expectedWords.length, 1);

    if (matchRatio >= 0.5) {
      // 50% 이상 매칭 = 정답
      return {
        passed: true,
        score: Math.min(100, Math.round(matchRatio * 100)),
        feedback: language === 'ko'
          ? `좋습니다! 핵심 내용을 잘 파악했습니다. (${Math.round(matchRatio * 100)}% 일치)`
          : `Good job! You captured the key concepts. (${Math.round(matchRatio * 100)}% match)`,
        confidence: 0.7,
      };
    }
  }

  // 의미 있는 응답인지 확인 (최소 길이 및 키워드)
  const hasMeaningfulContent = response.length >= 10 &&
    (response.includes('?') || response.includes('.') || response.includes(',') ||
     response.includes('는') || response.includes('은') || response.includes('이') ||
     response.includes('가') || response.includes('를') || response.includes('을'));

  if (hasMeaningfulContent) {
    return {
      passed: true,
      score: 75, // 휴리스틱 정답
      feedback: language === 'ko'
        ? '의미 있는 답변입니다. LLM로 정확한 채점을 받아보세요.'
        : 'Meaningful response. Get accurate grading from LLM.',
      confidence: 0.5,
    };
  }

  return {
    passed: false,
    score: 0,
    feedback: language === 'ko'
      ? '답변이 너무 짧거나 불분명합니다. 다시 시도해주세요.'
      : 'Response is too short or unclear. Please try again.',
    confidence: 0.6,
  };
}
