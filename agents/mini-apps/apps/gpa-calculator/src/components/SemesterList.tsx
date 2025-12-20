import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '@mini-apps/ui';
import { Trash2, BookOpen } from 'lucide-react';
import type { Semester, Course, GPAScale } from '../types';
import { calculateSemesterGPA } from '../lib/gpa';

interface SemesterListProps {
  semesters: Semester[];
  scale: GPAScale;
  onDeleteSemester: (semesterId: string) => void;
  onDeleteCourse: (semesterId: string, courseId: string) => void;
}

export function SemesterList({ semesters, scale, onDeleteSemester, onDeleteCourse }: SemesterListProps) {
  if (semesters.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-gray-500">
          <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>등록된 학기가 없습니다.</p>
          <p className="text-sm mt-2">새 학기를 추가하고 과목을 등록해보세요.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {semesters.map((semester) => {
        const result = calculateSemesterGPA(semester.courses, scale);

        return (
          <Card key={semester.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>{semester.name}</CardTitle>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">
                    학기 GPA: {result.gpa.toFixed(2)}
                  </Badge>
                  <Badge variant="outline">
                    이수: {result.earnedCredits}학점
                  </Badge>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDeleteSemester(semester.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </CardHeader>
            <CardContent>
              {semester.courses.length === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  등록된 과목이 없습니다.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2">과목명</th>
                        <th className="text-center py-2">학점</th>
                        <th className="text-center py-2">성적</th>
                        <th className="text-center py-2">구분</th>
                        <th className="text-center py-2">P/F</th>
                        <th className="text-center py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {semester.courses.map((course) => (
                        <CourseRow
                          key={course.id}
                          course={course}
                          onDelete={() => onDeleteCourse(semester.id, course.id)}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}

interface CourseRowProps {
  course: Course;
  onDelete: () => void;
}

function CourseRow({ course, onDelete }: CourseRowProps) {
  const getCategoryText = (category: string) => {
    if (category === 'major') return '전공';
    if (category === 'general') return '교양';
    if (category === 'teaching') return '교직';
    return category;
  };

  return (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-2">{course.name}</td>
      <td className="text-center">{course.credit}</td>
      <td className="text-center">
        <Badge variant={course.grade.startsWith('A') ? 'default' : 'secondary'}>
          {course.grade}
        </Badge>
      </td>
      <td className="text-center text-xs text-gray-600">
        {getCategoryText(course.category)}
      </td>
      <td className="text-center text-xs">
        {course.isPassFail ? 'Y' : 'N'}
      </td>
      <td className="text-center">
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
        >
          <Trash2 className="w-3 h-3" />
        </Button>
      </td>
    </tr>
  );
}
