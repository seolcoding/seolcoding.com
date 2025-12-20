/**
 * 음식점 정보 카드
 */

import { MapPin, Phone, ExternalLink } from 'lucide-react';
import type { Restaurant } from '@/types/food';
import { Card } from '@mini-apps/ui';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({
  restaurant,
}) => {
  const distanceText =
    restaurant.distance < 1000
      ? `${restaurant.distance}m`
      : `${(restaurant.distance / 1000).toFixed(1)}km`;

  return (
    <Card className="p-6 space-y-4 animate-fade-in">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          {restaurant.name}
        </h3>
        <p className="text-sm text-gray-600">{restaurant.category}</p>
      </div>

      <div className="space-y-3">
        {/* 거리 */}
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-700">
              현재 위치에서 {distanceText}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {restaurant.roadAddress || restaurant.address}
            </p>
          </div>
        </div>

        {/* 전화번호 */}
        {restaurant.phone && (
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-green-500 flex-shrink-0" />
            <a
              href={`tel:${restaurant.phone}`}
              className="text-sm text-gray-700 hover:text-blue-600 transition-colors"
            >
              {restaurant.phone}
            </a>
          </div>
        )}

        {/* 카카오맵 링크 */}
        <div className="flex items-center gap-3">
          <ExternalLink className="w-5 h-5 text-purple-500 flex-shrink-0" />
          <a
            href={restaurant.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            카카오맵에서 보기
          </a>
        </div>
      </div>
    </Card>
  );
};
