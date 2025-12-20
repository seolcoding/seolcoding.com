/**
 * Lunch Roulette - 점심 메뉴 룰렛 앱
 * 2단계 룰렛: 카테고리 선택 → 음식점 선택
 */

import { useEffect } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useAppStore } from '@/store/useAppStore';
import { loadKakaoMapScript } from '@/lib/kakao/init';
import { CategoryRoulette } from '@/components/CategoryRoulette';
import { RestaurantRoulette } from '@/components/RestaurantRoulette';
import { RestaurantCard } from '@/components/RestaurantCard';
import { FilterPanel } from '@/components/FilterPanel';
import { ShareButtons } from '@/components/ShareButtons';
import { Button } from '@mini-apps/ui';
import { AlertCircle, MapPin, RefreshCw } from 'lucide-react';

function App() {
  const { latitude, longitude, error: locationError, loading } = useGeolocation();
  const {
    step,
    location,
    selectedCategory,
    selectedRestaurant,
    radius,
    setLocation,
    setCategory,
    setSelectedRestaurant,
    setRadius,
    reset,
    goToCategory,
  } = useAppStore();

  // 위치 정보 업데이트
  useEffect(() => {
    if (latitude !== null && longitude !== null) {
      setLocation(latitude, longitude, locationError || undefined);
    }
  }, [latitude, longitude, locationError, setLocation]);

  // Kakao Maps SDK 로드
  useEffect(() => {
    loadKakaoMapScript().catch((err) => {
      console.error('Kakao Maps SDK 로드 실패:', err);
    });
  }, []);

  // 로딩 중
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin-slow w-16 h-16 mx-auto border-4 border-orange-500 border-t-transparent rounded-full" />
          <p className="text-lg text-gray-600">위치 정보를 가져오는 중...</p>
        </div>
      </div>
    );
  }

  // 위치 정보 오류
  if (location.error && !location.latitude) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center space-y-4 max-w-md">
          <AlertCircle className="w-16 h-16 mx-auto text-orange-500" />
          <h2 className="text-2xl font-bold text-gray-900">위치 정보 필요</h2>
          <p className="text-gray-600">{location.error}</p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  const currentLatitude = location.latitude || latitude || 37.5666805;
  const currentLongitude = location.longitude || longitude || 126.9784147;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 위치 정보 표시 */}
        {location.error && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
            <MapPin className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">{location.error}</p>
          </div>
        )}

        {/* 필터 패널 (카테고리 및 음식점 선택 단계) */}
        {(step === 'category' || step === 'restaurant') && (
          <div className="mb-6">
            <FilterPanel radius={radius} onRadiusChange={setRadius} />
          </div>
        )}

        {/* 1단계: 카테고리 룰렛 */}
        {step === 'category' && (
          <CategoryRoulette onCategorySelected={setCategory} />
        )}

        {/* 2단계: 음식점 룰렛 */}
        {step === 'restaurant' && selectedCategory && (
          <RestaurantRoulette
            category={selectedCategory}
            latitude={currentLatitude}
            longitude={currentLongitude}
            radius={radius}
            onRestaurantSelected={setSelectedRestaurant}
            onBack={goToCategory}
          />
        )}

        {/* 3단계: 결과 표시 */}
        {step === 'result' && selectedRestaurant && (
          <div className="space-y-6 py-8 animate-fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-3xl font-bold text-gray-900">
                오늘의 점심 메뉴는?
              </h2>
              <p className="text-lg text-gray-600">
                {selectedCategory?.emoji} {selectedCategory?.name}
              </p>
            </div>

            <RestaurantCard restaurant={selectedRestaurant} />

            <ShareButtons
              placeName={selectedRestaurant.name}
              placeUrl={selectedRestaurant.url}
            />

            <div className="flex gap-3 justify-center">
              <Button onClick={goToCategory} variant="outline">
                카테고리 다시 선택
              </Button>
              <Button onClick={reset}>
                <RefreshCw className="w-4 h-4 mr-2" />
                처음부터 다시
              </Button>
            </div>
          </div>
        )}

        {/* 푸터 */}
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Made with ❤️ by SeolCoding</p>
          <p className="mt-1">
            위치 기반 맛집 추천 서비스 | Powered by Kakao Maps
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
