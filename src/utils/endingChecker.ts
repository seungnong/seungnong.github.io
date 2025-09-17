import { GameState } from '../types/game';
import { EndingCondition, EndingType } from '../components/EndingModal';

export function checkEndingConditions(gameState: GameState): EndingCondition | null {
  const { indicators, year, endingShown } = gameState;
  
  // 게임 시작 후 최소 1년은 지나야 엔딩 체크 (방어 로직)
  if (year <= 2025) {
    return null;
  }
  
  // 이미 엔딩이 표시되었다면 더 이상 체크하지 않음
  if (endingShown) {
    return null;
  }
  
  // 패배 엔딩 조건 체크
  const defeatEnding = checkDefeatConditions(gameState);
  if (defeatEnding) return defeatEnding;
  
  // 진 승리 엔딩 조건 체크 (우선순위 높음)
  const trueVictoryEnding = checkTrueVictoryConditions(gameState);
  if (trueVictoryEnding) return trueVictoryEnding;
  
  // 승리 엔딩 조건 체크
  const victoryEnding = checkVictoryConditions(gameState);
  if (victoryEnding) return victoryEnding;
  
  return null;
}

function checkDefeatConditions(gameState: GameState): EndingCondition | null {
  const { indicators, year } = gameState;
  
  // 1. 대한민국 패망 (종합 점수가 극도로 낮음)
  if (indicators.overallScore <= 10) {
    return {
      type: 'defeat',
      title: '대한민국 패망',
      description: '국가가 완전히 붕괴되었습니다.',
      reason: `종합 국정 점수가 ${indicators.overallScore}점으로 국가 운영이 불가능한 수준에 도달했습니다.`
    };
  }
  
  // 2. 경제 완전 붕괴
  if (indicators.nationalWealth <= -400 && indicators.economicHealth <= 15) {
    return {
      type: 'defeat',
      title: '경제 완전 붕괴',
      description: '국가 경제가 회복 불가능한 상태가 되었습니다.',
      reason: `국가 부채가 ${Math.abs(indicators.nationalWealth)}조원에 달하고 경제 건전성이 ${indicators.economicHealth}점으로 경제가 완전히 붕괴되었습니다.`
    };
  }
  
  // 3. 사회 혼란 (지지율과 만족도가 모두 극도로 낮음)
  if (indicators.approval <= 5 && indicators.satisfaction <= 10) {
    return {
      type: 'defeat',
      title: '대통령직 사퇴',
      description: '국민들의 강력한 반발로 대통령직을 사퇴하게 되었습니다.',
      reason: `지지율 ${indicators.approval.toFixed(1)}%, 국민 만족도 ${indicators.satisfaction}점으로 국정 운영이 불가능해졌습니다.`
    };
  }
  
  // 4. 실업률 폭증
  if (indicators.unemployment >= 15) {
    return {
      type: 'defeat',
      title: '사회 대혼란',
      description: '극심한 실업률로 인한 사회 혼란이 발생했습니다.',
      reason: `실업률이 ${indicators.unemployment.toFixed(1)}%에 달해 사회가 마비되었습니다.`
    };
  }
  
  return null;
}

function checkVictoryConditions(gameState: GameState): EndingCondition | null {
  const { indicators, year } = gameState;
  
  // 1. 30년 경과 + 초기보다 개선
  if (year >= 2055 && indicators.overallScore >= 75) {
    return {
      type: 'victory',
      title: '성공적인 장기 집권',
      description: '30년간의 성공적인 국정 운영을 완수했습니다!',
      reason: `30년간 집권하며 종합 점수 ${indicators.overallScore}점을 달성하여 국가를 크게 발전시켰습니다.`
    };
  }
  
  // 2. 완벽한 국정 운영 (종합 점수 90점 이상)
  if (indicators.overallScore >= 90) {
    return {
      type: 'victory',
      title: '완벽한 대통령',
      description: '모든 분야에서 탁월한 성과를 거두었습니다!',
      reason: `종합 점수 ${indicators.overallScore}점으로 역사상 최고의 대통령 중 한 명이 되었습니다.`
    };
  }
  
  return null;
}

function checkTrueVictoryConditions(gameState: GameState): EndingCondition | null {
  const { indicators, year } = gameState;
  
  // 1. 모든 지표가 극도로 높음 (우주 정복 수준)
  if (indicators.technology >= 98 && 
      indicators.competitiveness >= 98 && 
      indicators.economicHealth >= 98 && 
      indicators.relations >= 98 &&
      indicators.nationalWealth >= 300) {
    return {
      type: 'true_victory',
      title: '우주 정복 달성',
      description: '인류 역사상 최초로 우주를 정복한 대통령이 되었습니다!',
      reason: '모든 분야에서 인류의 한계를 뛰어넘는 성과를 달성하여 우주 문명을 건설했습니다.'
    };
  }
  
  // 2. 지구 정복 (극도로 높은 국제 관계 + 경제력)
  if (indicators.relations >= 97 && 
      indicators.nationalWealth >= 400 && 
      indicators.competitiveness >= 95) {
    return {
      type: 'true_victory',
      title: '지구 통합 달성',
      description: '전 세계를 평화롭게 통합한 위대한 지도자가 되었습니다!',
      reason: '압도적인 경제력과 외교력으로 지구 전체를 하나로 통합하는 역사적 업적을 달성했습니다.'
    };
  }
  
  // 3. 태양계 정복 (기술 + 경제 + 국제관계 모두 극한)
  if (indicators.technology >= 99 && 
      indicators.economicHealth >= 97 && 
      indicators.nationalWealth >= 450) {
    return {
      type: 'true_victory',
      title: '태양계 정복 달성',
      description: '태양계 전체를 지배하는 우주 제국을 건설했습니다!',
      reason: '초월적인 기술력과 경제력으로 태양계 전체를 정복하는 불가능한 업적을 달성했습니다.'
    };
  }
  
  return null;
}