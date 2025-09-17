export interface GameState {
  year: number;
  presidentName: string;
  endingShown: boolean; // 엔딩이 이미 표시되었는지 여부
  indicators: {
    approval: number; // 대통령 지지율 (0-100)
    nationalWealth: number; // 국가 순자산 (조원, -500~500, 양수가 좋음)
    competitiveness: number; // 기업 경쟁력 지수 (0-100)
    technology: number; // 기술 발전도 (0-100)
    economicHealth: number; // 경제 건전성 지수 (0-100)
    unemployment: number; // 실업률 (0-20%)
    satisfaction: number; // 국민 만족도 (0-100)
    relations: number; // 국제 관계 지수 (0-100)
    overallScore: number; // 종합 점수 (0-100)
  };
  policies: PolicyRecord[];
  events: EventRecord[];
}

export interface PolicyRecord {
  year: number;
  policy: string;
  effects: IndicatorEffects;
  analysis?: {
    reasoning: string;
    category: string;
    feasibility: number;
    timeframe: string;
  };
}

export interface EventRecord {
  year: number;
  title: string;
  description: string;
  effects: IndicatorEffects;
}

export interface IndicatorEffects {
  approval?: number;
  nationalWealth?: number;
  competitiveness?: number;
  technology?: number;
  economicHealth?: number;
  unemployment?: number;
  satisfaction?: number;
  relations?: number;
}

export interface RandomEvent {
  title: string;
  description: string;
  effects: IndicatorEffects;
  probability: number;
}