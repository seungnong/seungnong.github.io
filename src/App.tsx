import React, { useState, useEffect } from 'react';
import { GameStart } from './components/GameStart';
import { ApiKeySetup } from './components/ApiKeySetup';
import { GameDashboard } from './components/GameDashboard';
import { PolicyInput } from './components/PolicyInput';
import { EventLog } from './components/EventLog';
import { GameControls } from './components/GameControls';
import { PolicyAnalysisModal } from './components/PolicyAnalysisModal';
import { ElectionModal } from './components/ElectionModal';
import { EndingModal, EndingCondition } from './components/EndingModal';
import { GameState, EventRecord, PolicyRecord } from './types/game';
import { 
  createInitialGameState, 
  applyEffects, 
  getRandomEvent, 
  saveGame, 
  loadGame 
} from './utils/gameLogic';
import { analyzePolicyWithLLM } from './utils/policyAnalyzer';
import { checkEndingConditions } from './utils/endingChecker';

function App() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [policySubmitted, setPolicySubmitted] = useState(false);
  const [yearTransition, setYearTransition] = useState(false);
  const [isAnalyzingPolicy, setIsAnalyzingPolicy] = useState(false);
  const [showAnalysisModal, setShowAnalysisModal] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<any>(null);
  const [showElectionModal, setShowElectionModal] = useState(false);
  const [showEndingModal, setShowEndingModal] = useState(false);
  const [currentEnding, setCurrentEnding] = useState<EndingCondition | null>(null);

  useEffect(() => {
    // Gemini API 키를 전역 변수로 설정
    const apiKey = 'AIzaSyDdVoyPwsaxGphaQOzQ8hCAC8hdNyhdr6E';
    (window as any).__GEMINI_API_KEY__ = apiKey;
    
    const savedGame = loadGame();
    if (savedGame) {
      setGameState(savedGame);
      setPolicySubmitted(savedGame.policies.some(p => p.year === savedGame.year));
    }
  }, []);

  // 엔딩 조건 체크
  useEffect(() => {
    if (gameState) {
      const ending = checkEndingConditions(gameState);
      if (ending) {
        setCurrentEnding(ending);
        setShowEndingModal(true);
        // 엔딩이 표시되었음을 기록
        const updatedGameState = { ...gameState, endingShown: true };
        setGameState(updatedGameState);
        saveGame(updatedGameState);
      }
    }
  }, [gameState]);

  const handleStartGame = (presidentName: string) => {
    const initialState = createInitialGameState(presidentName);
    setGameState(initialState);
    setPolicySubmitted(false);
    saveGame(initialState);
  };

  const handleSubmitPolicy = async (policy: string) => {
    if (!gameState) return;

    setIsAnalyzingPolicy(true);
    
    try {
      const analysis = await analyzePolicyWithLLM(policy, gameState.year);
      
      // 분석 결과 모달 표시
      setCurrentAnalysis({
        policy,
        ...analysis
      });
      setShowAnalysisModal(true);
      
      // 정책 효과 적용
      const policyEffects = analysis.effects;
    const newIndicators = applyEffects(gameState.indicators, policyEffects);
    
    const policyRecord: PolicyRecord = {
      year: gameState.year,
      policy,
        effects: policyEffects,
        analysis: {
          reasoning: analysis.reasoning,
          category: analysis.category,
          feasibility: analysis.feasibility,
          timeframe: analysis.timeframe
        }
    };

    const newGameState: GameState = {
      ...gameState,
      indicators: newIndicators,
      policies: [...gameState.policies, policyRecord]
    };

    setGameState(newGameState);
    setPolicySubmitted(true);
    saveGame(newGameState);
    } catch (error) {
      console.error('정책 분석 중 오류 발생:', error);
      alert('정책 분석 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsAnalyzingPolicy(false);
    }
  };

  const handleNextYear = () => {
    if (!gameState || !policySubmitted) return;

    // 5년마다 선거 체크 (2030, 2035, 2040, ...)
    const nextYear = gameState.year + 1;
    if (nextYear > 2025 && (nextYear - 2025) % 5 === 0) {
      setShowElectionModal(true);
      return;
    }

    proceedToNextYear();
  };

  const proceedToNextYear = () => {
    setYearTransition(true);
    
    setTimeout(async () => {
      // 랜덤 이벤트 발생
      const randomEvent = await getRandomEvent(gameState.year + 1, gameState.indicators);
      let newIndicators = { ...gameState.indicators };
      let newEvents = [...gameState.events];

      if (randomEvent) {
        newIndicators = applyEffects(newIndicators, randomEvent.effects);
        const eventRecord: EventRecord = {
          year: gameState.year + 1,
          title: randomEvent.title,
          description: randomEvent.description,
          effects: randomEvent.effects
        };
        newEvents = [...newEvents, eventRecord];
      }

      // 자연적 변화 (미세한 랜덤 변화)
      const naturalChanges = {
        approval: (Math.random() - 0.5) * 2, // -1 ~ 1
        satisfaction: (Math.random() - 0.5) * 1.5, // -0.75 ~ 0.75
        economicHealth: (Math.random() - 0.5) * 2, // -1 ~ 1
        unemployment: (Math.random() - 0.5) * 0.3 // -0.15 ~ 0.15
      };
      
      newIndicators = applyEffects(newIndicators, naturalChanges);

      const newGameState: GameState = {
        ...gameState,
        year: gameState.year + 1,
        indicators: newIndicators,
        events: newEvents
      };

      setGameState(newGameState);
      setPolicySubmitted(false);
      setYearTransition(false);
      saveGame(newGameState);
    }, 1500);
  };

  const handleElectionResult = (won: boolean) => {
    setShowElectionModal(false);
    
    if (won) {
      // 재당선 - 계속 진행
      proceedToNextYear();
    } else {
      // 낙선 - 게임 리셋
      handleResetGame();
    }
  };

  const handleEndingRestart = () => {
    setShowEndingModal(false);
    setCurrentEnding(null);
    handleResetGame();
  };

  const handleEndingContinue = () => {
    setShowEndingModal(false);
    setCurrentEnding(null);
  };

  const handleSaveGame = () => {
    if (gameState) {
      saveGame(gameState);
      alert('게임이 저장되었습니다!');
    }
  };

  const handleLoadGame = () => {
    const savedGame = loadGame();
    if (savedGame) {
      setGameState(savedGame);
      setPolicySubmitted(savedGame.policies.some(p => p.year === savedGame.year));
      alert('게임이 불러와졌습니다!');
    } else {
      alert('저장된 게임이 없습니다.');
    }
  };

  const handleResetGame = () => {
    if (confirm('정말로 새 게임을 시작하시겠습니까? 현재 진행상황이 모두 사라집니다.')) {
      setGameState(null);
      setPolicySubmitted(false);
      localStorage.removeItem('korea-president-sim');
    }
  };

  if (!gameState) {
    return <GameStart onStartGame={handleStartGame} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {yearTransition && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-xl shadow-2xl text-center">
            <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-800">연도가 진행되고 있습니다...</h3>
            <p className="text-gray-600 mt-2">{gameState.year + 1}년으로 이동 중</p>
          </div>
        </div>
      )}
      
      <div className="container mx-auto px-4 py-8 space-y-8">
        <GameDashboard gameState={gameState} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-8">
            <PolicyInput 
              onSubmitPolicy={handleSubmitPolicy}
              disabled={policySubmitted || yearTransition}
              isAnalyzing={isAnalyzingPolicy}
            />
            <GameControls
              onNextYear={handleNextYear}
              onSaveGame={handleSaveGame}
              onLoadGame={handleLoadGame}
              onResetGame={handleResetGame}
              disabled={!policySubmitted || yearTransition}
            />
          </div>
          
          <EventLog gameState={gameState} />
        </div>
        
        {policySubmitted && !yearTransition && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <p className="text-green-800 font-medium">
              {gameState.year}년 행동이 실행되었습니다. "1년 후" 버튼을 클릭하여 다음 연도로 진행하세요.
            </p>
          </div>
        )}
        
        {gameState.year >= 2030 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">첫 번째 임기 완료!</h3>
            <p className="text-blue-800">
              {gameState.presidentName} 대통령의 첫 번째 5년 임기가 완료되었습니다. 
              다음 연도로 진행하면 재선 도전이 시작됩니다.
            </p>
          </div>
        )}
        
        {gameState.year >= 2055 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <h3 className="text-2xl font-bold text-blue-900 mb-2">30년 장기 집권!</h3>
            <p className="text-blue-800">
              {gameState.presidentName} 대통령이 30년간 집권하고 있습니다. 
              현재 종합 점수: {gameState.indicators.overallScore}점
            </p>
          </div>
        )}
      </div>
      
      <PolicyAnalysisModal
        isOpen={showAnalysisModal}
        onClose={() => setShowAnalysisModal(false)}
        analysis={currentAnalysis}
      />
      
      <ElectionModal
        isOpen={showElectionModal}
        onElectionResult={handleElectionResult}
        approvalRating={gameState?.indicators.approval || 0}
        year={gameState?.year ? gameState.year + 1 : 2030}
        presidentName={gameState?.presidentName || ''}
      />
      
      <EndingModal
        isOpen={showEndingModal}
        ending={currentEnding}
        onRestart={handleEndingRestart}
        onContinue={currentEnding?.type !== 'defeat' ? handleEndingContinue : undefined}
        year={gameState?.year || 2025}
        presidentName={gameState?.presidentName || ''}
      />
    </div>
  );
}

export default App;