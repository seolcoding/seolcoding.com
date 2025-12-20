import React, { useState } from 'react';
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Card, CardHeader, CardTitle, CardContent, Switch } from '@mini-apps/ui';
import { Plus } from 'lucide-react';
import type { Course, Grade, CourseCategory } from '../types';
import { ALL_GRADES } from '../lib/gradeSystem';

interface CourseInputProps {
  onAddCourse: (course: Omit<Course, 'id'>) => void;
}

export function CourseInput({ onAddCourse }: CourseInputProps) {
  const [name, setName] = useState('');
  const [credit, setCredit] = useState<number>(3);
  const [grade, setGrade] = useState<Grade>('A+');
  const [category, setCategory] = useState<CourseCategory>('general');
  const [isPassFail, setIsPassFail] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert('과목명을 입력해주세요.');
      return;
    }

    onAddCourse({
      name: name.trim(),
      credit,
      grade,
      category,
      isPassFail
    });

    // Reset form
    setName('');
    setCredit(3);
    setGrade('A+');
    setCategory('general');
    setIsPassFail(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>과목 추가</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="course-name">과목명</Label>
              <Input
                id="course-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="예: 미적분학"
                required
              />
            </div>

            <div>
              <Label htmlFor="course-credit">학점</Label>
              <Select value={credit.toString()} onValueChange={(v) => setCredit(Number(v))}>
                <SelectTrigger id="course-credit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0.5">0.5학점</SelectItem>
                  <SelectItem value="1">1학점</SelectItem>
                  <SelectItem value="1.5">1.5학점</SelectItem>
                  <SelectItem value="2">2학점</SelectItem>
                  <SelectItem value="2.5">2.5학점</SelectItem>
                  <SelectItem value="3">3학점</SelectItem>
                  <SelectItem value="3.5">3.5학점</SelectItem>
                  <SelectItem value="4">4학점</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="course-grade">성적</Label>
              <Select value={grade} onValueChange={(v) => setGrade(v as Grade)}>
                <SelectTrigger id="course-grade">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ALL_GRADES.map(g => (
                    <SelectItem key={g} value={g}>
                      {g}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="course-category">과목 구분</Label>
              <Select value={category} onValueChange={(v) => setCategory(v as CourseCategory)}>
                <SelectTrigger id="course-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="major">전공</SelectItem>
                  <SelectItem value="general">교양</SelectItem>
                  <SelectItem value="teaching">교직</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="pass-fail"
              checked={isPassFail}
              onCheckedChange={setIsPassFail}
            />
            <Label htmlFor="pass-fail">Pass/Fail 과목</Label>
          </div>

          <Button type="submit" className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            과목 추가
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
