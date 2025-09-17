import React, { useState, useEffect } from 'react';
import { Vote, Dice1, Dice2, Dice3, Dice4, Dice5, Dice6, Crown, X } from 'lucide-react';

interface ElectionModalProps {
  isOpen: boolean;
  onElectionResult: (won: boolean) => void;
  approvalRating: number;
  year: number;
  presidentName: string;
}

export function ElectionModal({ isOpen, onElectionResult, approvalRating, year, presidentName }: ElectionModalProps) {
  const [isRolling, setIsRolling] = useState(false);
  const [diceValue, setDiceValue] = useState(1);
  const [showResult, setShowResult] = useState(false);
  const [electionWon, setElectionWon] = useState(false);

  const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];
  const DiceIcon = diceIcons[diceValue - 1];

  useEffect(() => {
    if (isOpen) {
      setShowResult(false);
      setIsRolling(false);
      setDiceValue(1);
    }
  }, [isOpen]);

  const rollDice = () => {
    setIsRolling(true);
    setShowResult(false);
    
    // 주사위 굴리기 애니메이션
    let rollCount = 0;
    const rollInterval = setInterval(() => {
      setDiceValue(Math.floor(Math.random() * 6) + 1);
      rollCount++;
      
      if (rollCount >= 20) {
        clearInterval(rollInterval);
        
        // 최종 결과 계산
        const randomValue = Math.random() * 100;
        const won = randomValue <= approvalRating;
        
        setTimeout(() => {
          setIsRolling(false);
          setElectionWon(won);
          setShowResult(true);
        }, 500);
      }
    }, 100);
  };

  const handleContinue = () => {
    onElectionResult(electionWon);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-8 text-center">
          <div className="mb-6">
            <Vote className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{year}년 대통령 선거</h2>
            <p className="text-gray-600">
              {presidentName} 대통령의 재선 도전
            </p>
          </div>

          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <div className="text-lg font-semibold text-blue-900 mb-2">현재 지지율</div>
            <div className="text-3xl font-bold text-blue-600">{approvalRating.toFixed(1)}%</div>
            <div className="text-sm text-blue-700 mt-1">재당선 확률</div>
          </div>

          {!showResult && !isRolling && (
            <button
              onClick={rollDice}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
            >
              <Dice1 className="w-6 h-6" />
              선거 결과 확인하기
            </button>
          )}

          {isRolling && (
            <div className="py-8">
              <div className="animate-bounce mb-4">
                <DiceIcon className="w-16 h-16 text-blue-600 mx-auto animate-spin" />
              </div>
              <p className="text-lg font-medium text-gray-700">선거 결과 집계 중...</p>
            </div>
          )}

          {showResult && (
            <div className="py-6">
              {electionWon ? (
                <div className="text-center">
                  <Crown className="w-20 h-20 text-yellow-500 mx-auto mb-4 animate-pulse" />
                  <h3 className="text-3xl font-bold text-green-600 mb-2">🎉 재당선! 🎉</h3>
                  <p className="text-lg text-gray-700 mb-6">
                    축하합니다! {presidentName} 대통령이 재선에 성공했습니다.
                  </p>
                  <button
                    onClick={handleContinue}
                    className="w-full bg-green-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200"
                  >
                    다음 임기 시작하기
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <X className="w-20 h-20 text-red-500 mx-auto mb-4" />
                  <h3 className="text-3xl font-bold text-red-600 mb-2">낙선</h3>
                  <p className="text-lg text-gray-700 mb-6">
                    아쉽게도 {presidentName} 대통령이 재선에 실패했습니다.
                  </p>
                  <button
                    onClick={handleContinue}
                    className="w-full bg-red-600 text-white px-6 py-4 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200"
                  >
                    새로운 대통령으로 시작하기
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}