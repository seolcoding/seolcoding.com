/**
 * 2단계 룰렛: 음식점 선택
 */

import { useEffect, useState } from 'react';
import { Wheel } from 'react-custom-roulette';
import type { WheelData } from 'react-custom-roulette/dist/components/Wheel/types';
import type { FoodCategory, Restaurant } from '@/types/food';
import { searchPlaces } from '@/lib/kakao/places';
import { Button } from '@mini-apps/ui';
import { AlertCircle, ArrowLeft } from 'lucide-react';

interface RestaurantRouletteProps {
  category: FoodCategory;
  latitude: number;
  longitude: number;
  radius: number;
  onRestaurantSelected: (restaurant: Restaurant) => void;
  onBack: () => void;
}

export const RestaurantRoulette: React.FC<RestaurantRouletteProps> = ({
  category,
  latitude,
  longitude,
  radius,
  onRestaurantSelected,
  onBack,
}) => {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        setLoading(true);
        setError(null);

        const results = await searchPlaces({
          latitude,
          longitude,
          radius,
          keyword: category.name,
          sort: 'distance',
        });

        setRestaurants(results);
      } catch (err) {
        console.error('음식점 검색 실패:', err);
        setError('음식점 검색 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [category, latitude, longitude, radius]);

  const handleSpinClick = () => {
    if (!mustSpin && restaurants.length > 0) {
      const newPrizeNumber = Math.floor(
        Math.random() * Math.min(restaurants.length, 10)
      );
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  const handleStopSpinning = () => {
    setMustSpin(false);
    onRestaurantSelected(restaurants[prizeNumber]);
  };

  if (loading) {
    return (
      <div className="text-center py-12 space-y-4">
        <div className="animate-spin-slow w-16 h-16 mx-auto border-4 border-blue-500 border-t-transparent rounded-full" />
        <p className="text-lg text-gray-600">
          {category.emoji} {category.name} 음식점 검색 중...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-4">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          다시 시도
        </Button>
      </div>
    );
  }

  if (restaurants.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-2xl mb-4">
          주변에 {category.emoji} {category.name} 음식점이 없습니다 😢
        </p>
        <p className="text-gray-600 mb-6">검색 반경을 늘려보세요</p>
        <Button onClick={onBack} variant="outline">
          <ArrowLeft className="w-4 h-4 mr-2" />
          카테고리 다시 선택
        </Button>
      </div>
    );
  }

  const displayRestaurants = restaurants.slice(0, 10);
  const data: WheelData[] = displayRestaurants.map((restaurant) => ({
    option: restaurant.name,
    style: { backgroundColor: category.color, textColor: '#fff' },
  }));

  return (
    <div className="space-y-8 py-8">
      <div className="text-center space-y-2">
        <Button
          onClick={onBack}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          카테고리 다시 선택
        </Button>

        <h2 className="text-2xl md:text-3xl font-bold">
          {category.emoji} {category.name} 음식점 룰렛
        </h2>
        <p className="text-gray-600">
          {restaurants.length}개의 음식점을 찾았습니다
        </p>
      </div>

      <div className="flex flex-col items-center gap-8">
        <div className="relative">
          {/* 룰렛 포인터 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10">
            <div
              className="w-0 h-0 border-l-[20px] border-l-transparent
                          border-r-[20px] border-r-transparent
                          border-t-[40px] border-t-red-500
                          drop-shadow-lg"
            />
          </div>

          <Wheel
            mustStartSpinning={mustSpin}
            prizeNumber={prizeNumber}
            data={data}
            onStopSpinning={handleStopSpinning}
            backgroundColors={[category.color, '#3e3e3e']}
            textColors={['#ffffff']}
            outerBorderColor="#FFD700"
            outerBorderWidth={8}
            innerBorderColor="#FFA500"
            innerBorderWidth={5}
            innerRadius={20}
            radiusLineColor="#666"
            radiusLineWidth={2}
            fontSize={16}
            fontWeight={700}
            perpendicularText={false}
            textDistance={60}
            spinDuration={1.2}
          />

          {/* 중앙 장식 */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                        w-12 h-12 bg-orange-500
                        rounded-full shadow-xl border-4 border-white
                        flex items-center justify-center text-xl pointer-events-none"
          >
            {category.emoji}
          </div>
        </div>

        <Button
          onClick={handleSpinClick}
          disabled={mustSpin}
          size="lg"
          className="px-8 py-4 bg-purple-600 hover:bg-purple-700
                     text-white text-xl font-bold rounded-full shadow-lg
                     disabled:opacity-50 transform hover:scale-105 transition-all"
        >
          {mustSpin ? '음식점 고르는 중...' : '🎲 음식점 뽑기'}
        </Button>
      </div>
    </div>
  );
};
