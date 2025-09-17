import { IndicatorEffects } from '../types/game';

export interface PolicyAnalysis {
  effects: IndicatorEffects;
  reasoning: string;
  category: string;
  feasibility: number; // 1-10 실현 가능성
  timeframe: 'immediate' | 'short-term' | 'long-term';
}

export async function analyzePolicyWithLLM(policy: string, currentYear: number): Promise<PolicyAnalysis> {
  const apiKey = (window as any).__GEMINI_API_KEY__ || 'AIzaSyDdVoyPwsaxGphaQOzQ8hCAC8hdNyhdr6E';
  
  if (!apiKey) {
    console.warn('Gemini API 키가 설정되지 않았습니다. 시뮬레이션 모드로 실행합니다.');
    return await simulateLLMAnalysis(policy, currentYear);
  }

  const prompt = `
당신은 대한민국의 정책 분석 전문가입니다. ${currentYear}년 현재 상황에서 다음 정책을 분석해주세요:

대통령 행동: "${policy}"

이 행동이 다음 8개 지표에 미치는 영향을 -10부터 +10 사이의 숫자로 평가해주세요:

1. 대통령 지지율 (approval): 국민들이 이 정책을 얼마나 지지할지
2. 국가 순자산 (nationalWealth): 국가 재정에 미치는 영향 (양수는 자산 증가, 음수는 자산 감소)
3. 기업 경쟁력 (competitiveness): 기업들의 경쟁력에 미치는 영향
4. 기술 발전도 (technology): 기술 혁신과 발전에 미치는 영향
5. 경제 건전성 (economicHealth): 현재 경제 상황의 건전성에 미치는 영향 (0-100)
6. 실업률 (unemployment): 실업률 변화 (양수는 실업률 증가, 음수는 감소)
7. 국민 만족도 (satisfaction): 국민들의 전반적인 만족도
8. 국제 관계 (relations): 다른 나라들과의 관계에 미치는 영향

또한 다음 정보도 제공해주세요:
- 행동 카테고리 (정책, 외교, 소통, 인사, 경제, 사회 등)
- 실현 가능성 (1-10점)
- 효과 발현 시기 (immediate/short-term/long-term)
- 분석 근거 (200자 이내)

응답은 반드시 다음 JSON 형식으로만 해주세요. 다른 텍스트는 포함하지 마세요:
{
  "effects": {
    "approval": 숫자,
    "nationalWealth": 숫자,
    "competitiveness": 숫자,
    "technology": 숫자,
    "economicHealth": 숫자,
    "unemployment": 숫자,
    "satisfaction": 숫자,
    "relations": 숫자
  },
  "reasoning": "분석 근거",
  "category": "행동 카테고리",
  "feasibility": 숫자,
  "timeframe": "immediate/short-term/long-term 중 하나"
}
`;

  try {
    const { GoogleGenerativeAI } = await import('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const result = await model.generateContent({
      contents: [{
        role: 'user',
        parts: [{
          text: prompt
        }]
      }],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1000,
      }
    });

    const response = await result.response;
    const content = response.text();

    if (!content) {
      throw new Error('Gemini API 응답이 비어있습니다.');
    }

    // JSON 파싱
    let parsedResponse;
    try {
      // JSON 블록에서 실제 JSON 부분만 추출
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      console.log(jsonString);
      parsedResponse = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      console.error('원본 응답:', content);
      throw new Error('Gemini 응답을 파싱할 수 없습니다.');
    }

    // 응답 검증 및 정규화
    const analysis = validateAndNormalizeResponse(parsedResponse);
    return analysis;

  } catch (error) {
    console.error('Gemini API 호출 중 오류 발생:', error);
    
    // API 오류 시 시뮬레이션으로 폴백
    console.warn('Gemini API 오류로 인해 시뮬레이션 모드로 전환합니다.');
    return await simulateLLMAnalysis(policy, currentYear);
  }
}

function validateAndNormalizeResponse(response: any): PolicyAnalysis {
  // 기본값 설정
  const defaultAnalysis: PolicyAnalysis = {
    effects: {},
    reasoning: '정책 분석을 완료했습니다.',
    category: '기타',
    feasibility: 5,
    timeframe: 'short-term'
  };

  try {
    const analysis: PolicyAnalysis = {
      effects: {},
      reasoning: response.reasoning || defaultAnalysis.reasoning,
      category: response.category || defaultAnalysis.category,
      feasibility: Math.max(1, Math.min(10, response.feasibility || defaultAnalysis.feasibility)),
      timeframe: ['immediate', 'short-term', 'long-term'].includes(response.timeframe) 
        ? response.timeframe 
        : defaultAnalysis.timeframe
    };

    // 효과 값 검증 및 정규화
    const effectKeys = ['approval', 'nationalWealth', 'competitiveness', 'technology', 'economicHealth', 'unemployment', 'satisfaction', 'relations'];
    
    effectKeys.forEach(key => {
      if (response.effects && typeof response.effects[key] === 'number') {
        // -10 ~ 10 범위로 제한
        analysis.effects[key as keyof IndicatorEffects] = Math.max(-10, Math.min(10, response.effects[key]));
      }
    });

    return analysis;
  } catch (error) {
    console.error('응답 검증 중 오류:', error);
    return defaultAnalysis;
  }
}

// LLM API 호출 시뮬레이션 (API 키가 없거나 오류 시 사용)
async function simulateLLMAnalysis(policy: string, currentYear: number): Promise<PolicyAnalysis> {
  // 실제 구현에서는 여기서 LLM API를 호출합니다
  // 현재는 더 정교한 키워드 기반 분석으로 시뮬레이션
  
  const policyLower = policy.toLowerCase();
  const effects: IndicatorEffects = {};
  let reasoning = '';
  let category = '기타';
  let feasibility = 5;
  let timeframe: 'immediate' | 'short-term' | 'long-term' = 'short-term';

  // 경제 정책 분석
  if (policyLower.includes('세금') || policyLower.includes('세율') || policyLower.includes('법인세')) {
    category = '경제';
    if (policyLower.includes('인하') || policyLower.includes('감세')) {
      effects.approval = Math.floor(Math.random() * 4) + 2; // 2-5
      effects.satisfaction = Math.floor(Math.random() * 4) + 3; // 3-6
      effects.economicHealth = Math.floor(Math.random() * 6) + 3; // 3-8
      effects.nationalWealth = -(Math.floor(Math.random() * 20) + 15); // -15 to -35 (비용)
      effects.competitiveness = Math.floor(Math.random() * 3) + 2; // 2-4
      reasoning = '세금 인하는 단기적으로 국민과 기업에게 인기가 높지만, 국가 재정에는 부담이 됩니다. 기업 투자 증가로 경제성장에 긍정적 영향이 예상됩니다.';
      feasibility = 7;
    } else if (policyLower.includes('인상') || policyLower.includes('증세')) {
      effects.approval = -(Math.floor(Math.random() * 4) + 3); // -3 to -6
      effects.satisfaction = -(Math.floor(Math.random() * 5) + 4); // -4 to -8
      effects.nationalWealth = Math.floor(Math.random() * 15) + 10; // 10 to 25 (수입)
      effects.economicHealth = -(Math.floor(Math.random() * 4) + 2); // -2 to -5
      reasoning = '증세는 국민들에게 인기가 없지만 국가 재정 건전성 개선에 도움이 됩니다. 단기적으로는 소비 위축이 우려됩니다.';
      feasibility = 4;
    }
  }
  
  // 일자리 정책 분석
  else if (policyLower.includes('일자리') || policyLower.includes('고용') || policyLower.includes('취업')) {
    category = '사회';
    effects.unemployment = -(Math.random() * 2 + 1); // -1 to -3
    effects.satisfaction = Math.floor(Math.random() * 5) + 4; // 4-8
    effects.approval = Math.floor(Math.random() * 4) + 3; // 3-6
    effects.nationalWealth = -(Math.floor(Math.random() * 15) + 8); // -8 to -23 (비용)
    if (policyLower.includes('청년')) {
      effects.satisfaction += 2;
      effects.approval += 1;
    }
    reasoning = '일자리 창출 정책은 국민들에게 매우 인기가 높고 실업률 개선에 직접적 효과가 있습니다. 다만 정부 예산 투입이 필요합니다.';
    feasibility = 8;
    timeframe = 'short-term';
  }
  
  // 기술 정책 분석
  else if (policyLower.includes('기술') || policyLower.includes('IT') || policyLower.includes('AI') || policyLower.includes('반도체')) {
    category = '기술';
    effects.technology = Math.floor(Math.random() * 6) + 5; // 5-10
    effects.competitiveness = Math.floor(Math.random() * 4) + 3; // 3-6
    effects.economicHealth = Math.floor(Math.random() * 6) + 4; // 4-9
    effects.nationalWealth = -(Math.floor(Math.random() * 10) + 3); // -3 to -13 (투자비용)
    effects.relations = Math.floor(Math.random() * 3) + 2; // 2-4
    reasoning = '기술 투자는 장기적으로 국가 경쟁력 향상에 매우 중요합니다. 초기 투자비용이 들지만 미래 성장동력 확보에 필수적입니다.';
    feasibility = 7;
    timeframe = 'long-term';
  }
  
  // 복지 정책 분석
  else if (policyLower.includes('복지') || policyLower.includes('연금') || policyLower.includes('의료') || policyLower.includes('기초생활')) {
    category = '사회';
    effects.satisfaction = Math.floor(Math.random() * 6) + 5; // 5-10
    effects.approval = Math.floor(Math.random() * 5) + 4; // 4-8
    effects.nationalWealth = -(Math.floor(Math.random() * 25) + 15); // -15 to -40 (복지비용)
    if (policyLower.includes('노인') || policyLower.includes('고령')) {
      effects.satisfaction += 1;
    }
    reasoning = '복지 확대는 국민 만족도와 지지율 향상에 크게 기여하지만, 상당한 재정 부담을 수반합니다. 사회 안전망 강화 효과가 있습니다.';
    feasibility = 6;
  }
  
  // 외교 정책 분석
  else if (policyLower.includes('외교') || policyLower.includes('국제') || policyLower.includes('협력') || policyLower.includes('미국') || policyLower.includes('중국')) {
    category = '외교';
    effects.relations = Math.floor(Math.random() * 6) + 4; // 4-9
    effects.competitiveness = Math.floor(Math.random() * 3) + 1; // 1-3
    effects.approval = Math.floor(Math.random() * 3) + 1; // 1-3
    if (policyLower.includes('무역') || policyLower.includes('경제협력')) {
      effects.economicHealth = Math.floor(Math.random() * 4) + 2; // 2-5
      effects.competitiveness += 2;
    }
    reasoning = '외교 협력 강화는 국제적 위상 제고와 경제적 기회 확대에 도움이 됩니다. 국민들의 직접적 체감도는 상대적으로 낮을 수 있습니다.';
    feasibility = 6;
    timeframe = 'long-term';
  }
  
  // 환경 정책 분석
  else if (policyLower.includes('환경') || policyLower.includes('친환경') || policyLower.includes('탄소') || policyLower.includes('재생에너지')) {
    category = '환경';
    effects.satisfaction = Math.floor(Math.random() * 4) + 3; // 3-6
    effects.relations = Math.floor(Math.random() * 4) + 3; // 3-6
    effects.nationalWealth = -(Math.floor(Math.random() * 12) + 5); // -5 to -17 (환경투자비용)
    effects.technology = Math.floor(Math.random() * 4) + 2; // 2-5
    effects.approval = Math.floor(Math.random() * 3) + 1; // 1-3
    reasoning = '환경 정책은 미래 세대를 위한 투자로 국제적 평가가 높지만, 단기적으로는 비용 부담과 산업계 반발이 있을 수 있습니다.';
    feasibility = 5;
    timeframe = 'long-term';
  }
  
  // 기본 정책 (키워드 매칭되지 않은 경우)
  else {
    effects.approval = Math.floor(Math.random() * 7) - 3; // -3 to 3
    effects.satisfaction = Math.floor(Math.random() * 5) - 2; // -2 to 2
    effects.nationalWealth = Math.floor(Math.random() * 10) - 5; // -5 to 4
    reasoning = '제시된 정책의 구체적 내용을 바탕으로 종합적인 영향을 분석했습니다. 더 구체적인 정책 내용이 있다면 더 정확한 분석이 가능합니다.';
    feasibility = 5;
  }

  // 현실성 체크 - 너무 극단적인 값들을 조정
  Object.keys(effects).forEach(key => {
    const value = effects[key as keyof IndicatorEffects];
    if (value !== undefined) {
      if (value > 10) effects[key as keyof IndicatorEffects] = 10;
      if (value < -10) effects[key as keyof IndicatorEffects] = -10;
    }
  });

  return {
    effects,
    reasoning,
    category,
    feasibility,
    timeframe
  };
}