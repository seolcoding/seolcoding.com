/**
 * InputPanel Component
 *
 * 참가자 및 결과 입력 패널
 */

import { Plus, X } from 'lucide-react';
import { Button, Input, Label, Card, CardContent } from '@mini-apps/ui';

interface InputPanelProps {
  participants: string[];
  results: string[];
  onParticipantsChange: (participants: string[]) => void;
  onResultsChange: (results: string[]) => void;
  maxCount?: number;
  minCount?: number;
  disabled?: boolean;
}

export function InputPanel({
  participants,
  results,
  onParticipantsChange,
  onResultsChange,
  maxCount = 8,
  minCount = 2,
  disabled = false
}: InputPanelProps) {
  const handleParticipantChange = (index: number, value: string) => {
    const updated = [...participants];
    updated[index] = value;
    onParticipantsChange(updated);
  };

  const handleResultChange = (index: number, value: string) => {
    const updated = [...results];
    updated[index] = value;
    onResultsChange(updated);
  };

  const addParticipant = () => {
    if (participants.length < maxCount) {
      const updated = [...participants, ''];
      onParticipantsChange(updated);

      const updatedResults = [...results, ''];
      onResultsChange(updatedResults);
    }
  };

  const removeParticipant = (index: number) => {
    if (participants.length > minCount) {
      const updatedParticipants = participants.filter((_, i) => i !== index);
      onParticipantsChange(updatedParticipants);

      const updatedResults = results.filter((_, i) => i !== index);
      onResultsChange(updatedResults);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">참가자 ({participants.length}명)</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={addParticipant}
                disabled={disabled || participants.length >= maxCount}
              >
                <Plus className="w-4 h-4 mr-1" />
                추가
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {participants.map((participant, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder={`참가자 ${index + 1}`}
                    value={participant}
                    onChange={(e) => handleParticipantChange(index, e.target.value)}
                    disabled={disabled}
                    maxLength={10}
                  />
                  {participants.length > minCount && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeParticipant(index)}
                      disabled={disabled}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <Label className="text-base font-semibold">결과 ({results.length}개)</Label>

            <div className="grid grid-cols-2 gap-3">
              {results.map((result, index) => (
                <Input
                  key={index}
                  placeholder={`결과 ${index + 1}`}
                  value={result}
                  onChange={(e) => handleResultChange(index, e.target.value)}
                  disabled={disabled}
                  maxLength={10}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-sm text-muted-foreground text-center">
        참가자 {minCount}~{maxCount}명까지 가능합니다
      </div>
    </div>
  );
}
