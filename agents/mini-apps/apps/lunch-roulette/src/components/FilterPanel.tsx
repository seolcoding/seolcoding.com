/**
 * 검색 반경 필터 패널
 */

import { RADIUS_OPTIONS } from '@/constants/foodCategories';
import { Button } from '@mini-apps/ui';

interface FilterPanelProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
}

export const FilterPanel: React.FC<FilterPanelProps> = ({
  radius,
  onRadiusChange,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h3 className="font-bold text-lg mb-4">검색 반경 설정</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {RADIUS_OPTIONS.map((option) => (
          <Button
            key={option.value}
            onClick={() => onRadiusChange(option.value)}
            variant={radius === option.value ? 'default' : 'outline'}
            className={`py-2 px-4 rounded-lg font-medium transition-all ${
              radius === option.value
                ? 'bg-blue-500 text-white shadow-md'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
};
