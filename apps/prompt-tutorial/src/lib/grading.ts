import type { Exercise } from '@/content/chapters';
import { gradeWithLLM, type LLMGradingResult } from './llm';

// ==================== Interfaces ====================

export interface GradingResult {
  passed: boolean;
  score: number;
  details: CriteriaResult[];
  feedback: string;
  llmUsed?: boolean;
  confidence?: number;
}

export interface CriteriaResult {
  passed: boolean;
  feedback: string;
}

export interface GradingParams {
  exercise: Exercise;
  userInput: string;
  llmResponse: string;
}

// ==================== Helper Functions ====================


function convertLLMResult(llmResult: LLMGradingResult): GradingResult {
  return {
    passed: llmResult.passed,
    score: llmResult.score,
    details: [{
      passed: llmResult.passed,
      feedback: llmResult.feedback,
    }],
    feedback: llmResult.feedback,
    llmUsed: true,
    confidence: llmResult.confidence,
  };
}

// ==================== Strategy Implementation ====================

class LLMStrategy implements GradingStrategy {
  name = 'llm';

  async grade(params: GradingParams): Promise<GradingResult> {
    const { exercise, userInput, llmResponse } = params;

    try {
      const llmResult = await gradeWithLLM({
        question: exercise.description,
        userResponse: exercise.grading.target === 'response' ? llmResponse : userInput,
        criteria: exercise.grading.criteria,
        language: 'ko',
      });
      return convertLLMResult(llmResult);
    } catch (error) {
      console.error('LLM grading failed:', error);
      throw error;
    }
  }
}

interface GradingStrategy {
  name: string;
  grade(params: GradingParams): Promise<GradingResult>;
}

// ==================== Grading Service ====================

class GradingService {
  private llmStrategy: LLMStrategy = new LLMStrategy();

  async grade(params: GradingParams): Promise<GradingResult> {
    // 모든 연습문제가 LLM 채점을 사용합니다
    try {
      return await this.llmStrategy.grade(params);
    } catch (error) {
      console.error('LLM grading failed:', error);
      // LLM 실패 시 휴리스틱 폴백
      return {
        passed: false,
        score: 0,
        details: [{
          passed: false,
          feedback: '채점 오류가 발생했습니다. 다시 시도해주세요.',
        }],
        feedback: '채점 시스템 오류가 발생했습니다.',
        llmUsed: false,
      };
    }
  }
}

// ==================== Public API ====================

const gradingService = new GradingService();

export async function gradeExercise(
  exercise: Exercise,
  userInput: string,
  llmResponse: string
): Promise<GradingResult> {
  return gradingService.grade({ exercise, userInput, llmResponse });
}

export function needsLLMResponse(exercise: Exercise): boolean {
  return exercise.grading.target === 'response';
}
