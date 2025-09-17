import React from 'react';
import { Trophy, Skull, AlertTriangle, Star, Rocket, Globe } from 'lucide-react';

export type EndingType = 'defeat' | 'victory' | 'true_victory';

export interface EndingCondition {
  type: EndingType;
  title: string;
  description: string;
  reason: string;
}

interface EndingModalProps {
  isOpen: boolean;
  ending: EndingCondition | null;
  onRestart: () => void;
  onContinue?: () => void;
  year: number;
  presidentName: string;
}

export function EndingModal({ isOpen, ending, onRestart, onContinue, year, presidentName }: EndingModalProps) {
  if (!isOpen || !ending) return null;

  const getEndingIcon = () => {
    switch (ending.type) {
      case 'defeat':
        return <Skull className="w-20 h-20 text-red-500 mx-auto mb-4" />;
      case 'victory':
        return <Trophy className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-bounce" />;
      case 'true_victory':
        return <Star className="w-20 h-20 text-purple-500 mx-auto mb-4 animate-pulse" />;
    }
  };

  const getEndingColor = () => {
    switch (ending.type) {
      case 'defeat':
        return 'from-red-900 to-red-700';
      case 'victory':
        return 'from-yellow-600 to-orange-600';
      case 'true_victory':
        return 'from-purple-600 to-pink-600';
    }
  };

  const getEndingEmoji = () => {
    switch (ending.type) {
      case 'defeat':
        return '💀';
      case 'victory':
        return '🏆';
      case 'true_victory':
        return '🌟✨🚀';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full">
        <div className={`bg-gradient-to-r ${getEndingColor()} text-white p-6 rounded-t-xl`}>
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-2">게임 종료</h2>
            <p className="text-lg opacity-90">{year}년 • {presidentName} 대통령</p>
          </div>
        </div>

        <div className="p-8 text-center">
          {getEndingIcon()}
          
          <h3 className="text-2xl font-bold text-gray-800 mb-2">
            {getEndingEmoji()} {ending.title}
          </h3>
          
          <p className="text-lg text-gray-700 mb-4">
            {ending.description}
          </p>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-gray-600 font-medium mb-1">종료 사유:</p>
            <p className="text-gray-800">{ending.reason}</p>
          </div>

          {ending.type === 'true_victory' && (
            <div className="mb-6 p-4 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Rocket className="w-6 h-6 text-purple-600" />
                <Globe className="w-6 h-6 text-purple-600" />
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-purple-800 font-bold text-lg">
                🎊 역사상 최고의 대통령! 🎊
              </p>
              <p className="text-purple-700 text-sm mt-1">
                당신은 인류 역사에 길이 남을 위대한 업적을 달성했습니다!
              </p>
            </div>
          )}

          <div className="space-y-3">
            {ending.type === 'defeat' ? (
              <button
                onClick={onRestart}
                className="w-full bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
              >
                새 게임 시작하기
              </button>
            ) : (
              <>
                {onContinue && (
                  <button
                    onClick={onContinue}
                    className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    계속 플레이하기
                  </button>
                )}
                <button
                  onClick={onRestart}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  새 게임 시작하기
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}