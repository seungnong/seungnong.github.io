import { GameState, IndicatorEffects, RandomEvent } from '../types/game';
import { randomEvents } from '../data/events';
import { generateRandomEventWithLLM } from './eventGenerator';

export function createInitialGameState(presidentName: string): GameState {
  const initialIndicators = {
    approval: 52, // 신임 대통령 초기 지지율
    nationalWealth: -120, // 국가 순부채 120조원
    competitiveness: 68,
    technology: 72,
    economicHealth: 65, // 경제 건전성 지수
    unemployment: 3.2,
    satisfaction: 58,
    relations: 65,
    overallScore: 0 // 임시값, 아래에서 계산됨
  };

  // 종합 점수 계산
  const calculatedScore = calculateOverallScore(initialIndicators);
  initialIndicators.overallScore = calculatedScore;

  return {
    year: 2025,
    presidentName,
    endingShown: false,
    indicators: initialIndicators,
    policies: [],
    events: []
  };
}

export function applyEffects(indicators: GameState['indicators'], effects: IndicatorEffects): GameState['indicators'] {
  const newIndicators = { ...indicators };
  
  Object.entries(effects).forEach(([key, value]) => {
    if (value !== undefined) {
      const currentValue = newIndicators[key as keyof GameState['indicators']];
      const newValue = currentValue + value;
      
      // 지표별 범위 제한
      switch (key) {
        case 'approval':
        case 'competitiveness':
        case 'technology':
        case 'economicHealth':
        case 'satisfaction':
        case 'relations':
        case 'overallScore':
          newIndicators[key as keyof GameState['indicators']] = Math.max(0, Math.min(100, newValue));
          break;
        case 'nationalWealth':
          newIndicators.nationalWealth = Math.max(-500, Math.min(500, newValue));
          break;
        case 'unemployment':
          newIndicators.unemployment = Math.max(0, Math.min(20, newValue));
          break;
      }
    }
  });
  
  // 종합 점수 계산
  newIndicators.overallScore = calculateOverallScore(newIndicators);
  
  return newIndicators;
}

export function calculateOverallScore(indicators: GameState['indicators']): number {
  // 각 지표를 0-100 점수로 정규화
  const approvalScore = indicators.approval;
  const wealthScore = Math.max(0, Math.min(100, (indicators.nationalWealth + 200) / 4)); // -200~200을 0~100으로
  const competitivenessScore = indicators.competitiveness;
  const technologyScore = indicators.technology;
  const economicScore = indicators.economicHealth;
  const unemploymentScore = Math.max(0, 100 - (indicators.unemployment * 5)); // 실업률이 낮을수록 높은 점수
  const satisfactionScore = indicators.satisfaction;
  const relationsScore = indicators.relations;
  
  // 가중평균 계산 (중요도에 따라 가중치 부여)
  const weightedScore = (
    approvalScore * 0.15 +        // 지지율 15%
    wealthScore * 0.15 +          // 국가재정 15%
    competitivenessScore * 0.12 + // 기업경쟁력 12%
    technologyScore * 0.12 +      // 기술발전도 12%
    economicScore * 0.15 +        // 경제건전성 15%
    unemploymentScore * 0.13 +    // 실업률(역산) 13%
    satisfactionScore * 0.13 +    // 국민만족도 13%
    relationsScore * 0.05         // 국제관계 5%
  );
  
  return Math.round(weightedScore);
}

export async function getRandomEvent(currentYear: number, currentIndicators: any): Promise<RandomEvent | null> {
  // 30% 확률로 LLM 생성 이벤트, 70% 확률로 기존 이벤트 또는 이벤트 없음
  const shouldGenerateLLMEvent = Math.random() < 0.3;
  
  if (shouldGenerateLLMEvent) {
    try {
      const generatedEvent = await generateRandomEventWithLLM(currentYear, currentIndicators);
      if (generatedEvent) {
        return {
          title: generatedEvent.title,
          description: generatedEvent.description,
          effects: generatedEvent.effects,
          probability: 1.0
        };
      }
    } catch (error) {
      console.error('LLM 이벤트 생성 실패:', error);
    }
  }
  
  // 기존 랜덤 이벤트 로직
  const random = Math.random();
  let cumulativeProbability = 0;
  
  for (const event of randomEvents) {
    cumulativeProbability += event.probability;
    if (random <= cumulativeProbability) {
      return event;
    }
  }
  
  return null;
}

export function saveGame(gameState: GameState): void {
  localStorage.setItem('korea-president-sim', JSON.stringify(gameState));
}

export function loadGame(): GameState | null {
  const saved = localStorage.getItem('korea-president-sim');
  if (!saved) return null;
  
  try {
    const loadedGame = JSON.parse(saved);
    const initialState = createInitialGameState(loadedGame.presidentName || '대통령');
    
    // 저장된 게임 상태와 초기 상태를 병합하여 누락된 속성들을 보완
    return {
      ...initialState,
      ...loadedGame,
      endingShown: loadedGame.endingShown || false,
      indicators: {
        ...initialState.indicators,
        ...loadedGame.indicators
      }
    };
  } catch (error) {
    console.error('게임 로드 중 오류 발생:', error);
    return null;
  }
}