import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Label, Badge } from '@mini-apps/ui';
import { CheckCircle2, XCircle, Info, Sparkles } from 'lucide-react';
import { validateCRN, type CRNValidationResult } from '../lib/validators/crn';
import { generateTestCRN } from '../lib/generators/crnGenerator';
import { formatCRN } from '../lib/utils/formatters';

export function CRNValidator() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<CRNValidationResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCRN(e.target.value);
    setInput(formatted);

    // 실시간 검증 (13자리 입력 시)
    const numbers = formatted.replace(/[^0-9]/g, '');
    if (numbers.length === 13 || numbers.length === 14) {
      setResult(validateCRN(formatted));
    } else {
      setResult(null);
    }
  };

  const handleValidate = () => {
    const validationResult = validateCRN(input);
    setResult(validationResult);
  };

  const handleGenerate = () => {
    const testNumber = generateTestCRN();
    const formatted = formatCRN(testNumber);
    setInput(formatted);
    setResult(validateCRN(formatted));
  };

  const handleClear = () => {
    setInput('');
    setResult(null);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>법인등록번호 검증</CardTitle>
          <CardDescription>
            법인등록번호의 유효성을 체크섬 알고리즘으로 검증합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crn-input">법인등록번호</Label>
            <Input
              id="crn-input"
              placeholder="NNNNNN-NNNNNNN"
              value={input}
              onChange={handleInputChange}
              maxLength={14}
              className="font-mono text-lg"
            />
            <p className="text-sm text-muted-foreground">
              13자리 또는 14자리 숫자를 입력하세요 (하이픈은 자동 삽입됩니다)
            </p>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleValidate} disabled={input.length < 14}>
              검증하기
            </Button>
            <Button variant="outline" onClick={handleGenerate}>
              <Sparkles className="w-4 h-4 mr-2" />
              테스트 번호 생성
            </Button>
            <Button variant="ghost" onClick={handleClear}>
              초기화
            </Button>
          </div>

          {result && (
            <Card className={result.isValid ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  {result.isValid ? (
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
                  )}
                  <div className="flex-1 space-y-3">
                    <p className={`font-semibold ${result.isValid ? 'text-green-900' : 'text-red-900'}`}>
                      {result.message}
                    </p>

                    {result.details && (
                      <div className="space-y-2 text-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-muted-foreground">등기관서 코드:</span>
                            <Badge variant="outline" className="ml-2 font-mono">
                              {result.details.registryCode}
                            </Badge>
                          </div>
                          <div>
                            <span className="text-muted-foreground">법인 종류 코드:</span>
                            <Badge variant="outline" className="ml-2 font-mono">
                              {result.details.corporateTypeCode}
                            </Badge>
                          </div>
                        </div>

                        {result.details.checksumPassed === undefined && (
                          <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                            <p className="text-xs text-blue-900">
                              2025년 1월 31일 이후 발급된 법인등록번호는 14자리로 변경되어
                              체크섬 검증이 적용되지 않습니다.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-start gap-2">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900 space-y-1">
              <p className="font-semibold">안내사항</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>법인등록번호는 공개 정보이지만, 형식 검증만 가능합니다.</li>
                <li>실제 진위확인은 대법원 등기소 API를 사용하세요.</li>
                <li>생성된 테스트 번호는 실제 등록된 번호가 아니며 법적 효력이 없습니다.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
