import React, { useState } from 'react';
import { Crown, MapPin, Users } from 'lucide-react';

interface GameStartProps {
  onStartGame: (presidentName: string) => void;
}

export function GameStart({ onStartGame }: GameStartProps) {
  const [presidentName, setPresidentName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (presidentName.trim()) {
      onStartGame(presidentName.trim());
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white rounded-full p-4 shadow-lg">
              <Crown className="w-16 h-16 text-blue-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            대한민국 대통령 시뮬레이터
          </h1>
          <p className="text-xl text-blue-100 mb-2">Republic of Korea Presidential Simulator</p>
          <p className="text-blue-200">2025년, 당신이 대한민국의 대통령이 되어 국정을 운영해보세요</p>
        </div>

        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-6 h-6 text-blue-600" />
              <h2 className="text-2xl font-semibold text-gray-800">게임 설정</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 p-4 bg-blue-50 rounded-lg">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">2025년</div>
                <div className="text-sm text-gray-600">시작 연도</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">5년</div>
                <div className="text-sm text-gray-600">대통령 임기</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">8개</div>
                <div className="text-sm text-gray-600">핵심 지표</div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="presidentName" className="block text-lg font-medium text-gray-700 mb-2">
                  대통령 이름을 입력하세요:
                </label>
                <input
                  type="text"
                  id="presidentName"
                  value={presidentName}
                  onChange={(e) => setPresidentName(e.target.value)}
                  placeholder="예: 홍길동"
                  className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  maxLength={20}
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={!presidentName.trim()}
                className="w-full bg-blue-600 text-white px-6 py-4 text-lg font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <Crown className="w-6 h-6" />
                대통령직 수행 시작
              </button>
            </form>
          </div>
          
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              게임 특징:
            </h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>연도별 턴제 방식으로 정책을 제안하고 시행</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>현실적인 랜덤 이벤트가 매년 발생</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>8개 핵심 지표 실시간 모니터링</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>한국의 실제 정치, 경제 상황 반영</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-600 font-bold">•</span>
                <span>게임 진행 상황 저장 및 불러오기 지원</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}