import { IndicatorEffects, EventRecord } from '../types/game';

export interface GeneratedEvent {
  title: string;
  description: string;
  effects: IndicatorEffects;
}

export async function generateRandomEventWithLLM(currentYear: number, currentIndicators: any): Promise<GeneratedEvent | null> {
  const apiKey = (window as any).__GEMINI_API_KEY__ || 'AIzaSyDdVoyPwsaxGphaQOzQ8hCAC8hdNyhdr6E';
  
  if (!apiKey) {
    console.warn('Gemini API 키가 설정되지 않았습니다. 기본 이벤트를 사용합니다.');
    return null;
  }

  const prompt = `
당신은 대한민국의 정치/경제/사회 전문가입니다. ${currentYear}년 현재 상황에서 발생할 수 있는 현실적인 이벤트를 하나 생성해주세요.

현재 국가 상황:
- 대통령 지지율: ${currentIndicators.approval.toFixed(1)}%
- 국가 순자산: ${currentIndicators.nationalWealth.toFixed(0)}조원
- 기업 경쟁력: ${currentIndicators.competitiveness.toFixed(0)}
- 기술 발전도: ${currentIndicators.technology.toFixed(0)}
- 경제 건전성: ${currentIndicators.economicHealth.toFixed(0)}
- 실업률: ${currentIndicators.unemployment.toFixed(1)}%
- 국민 만족도: ${currentIndicators.satisfaction.toFixed(0)}
- 국제 관계: ${currentIndicators.relations.toFixed(0)}

다음 중 하나의 카테고리에서 현실적인 이벤트를 생성해주세요:
1. 경제 이벤트 (글로벌 경제 변화, 기업 동향, 금융 시장 등)
2. 사회 이벤트 (사회 갈등, 인구 변화, 교육 이슈 등)
3. 국제 이벤트 (외교 관계, 무역 분쟁, 국제 협력 등)
4. 기술 이벤트 (기술 혁신, 사이버 보안, 디지털 전환 등)
5. 환경/재해 이벤트 (자연재해, 환경 문제, 기후 변화 등)
6. 정치 이벤트 (정치적 갈등, 제도 변화, 여론 변화 등)

각 지표에 대한 영향을 -10부터 +10 사이의 숫자로 평가해주세요:
- approval: 대통령 지지율
- nationalWealth: 국가 순자산 (조원 단위)
- competitiveness: 기업 경쟁력
- technology: 기술 발전도
- economicHealth: 경제 건전성
- unemployment: 실업률 (양수는 실업률 증가, 음수는 감소)
- satisfaction: 국민 만족도
- relations: 국제 관계

응답은 반드시 다음 JSON 형식으로만 해주세요:
{
  "title": "이벤트 제목 (30자 이내)",
  "description": "이벤트 상세 설명 (100자 이내)",
  "effects": {
    "approval": 숫자,
    "nationalWealth": 숫자,
    "competitiveness": 숫자,
    "technology": 숫자,
    "economicHealth": 숫자,
    "unemployment": 숫자,
    "satisfaction": 숫자,
    "relations": 숫자
  }
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
        temperature: 0.8,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 800,
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
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      parsedResponse = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      console.error('원본 응답:', content);
      return null;
    }

    // 응답 검증 및 정규화
    const event = validateAndNormalizeEvent(parsedResponse);
    return event;

  } catch (error) {
    console.error('Gemini API 호출 중 오류 발생:', error);
    return null;
  }
}

function validateAndNormalizeEvent(response: any): GeneratedEvent {
  const defaultEvent: GeneratedEvent = {
    title: '경제 상황 변화',
    description: '국내외 경제 상황의 변화가 있었습니다.',
    effects: {}
  };

  try {
    const event: GeneratedEvent = {
      title: response.title || defaultEvent.title,
      description: response.description || defaultEvent.description,
      effects: {}
    };

    // 효과 값 검증 및 정규화
    const effectKeys = ['approval', 'nationalWealth', 'competitiveness', 'technology', 'economicHealth', 'unemployment', 'satisfaction', 'relations'];
    
    effectKeys.forEach(key => {
      if (response.effects && typeof response.effects[key] === 'number') {
        // -10 ~ 10 범위로 제한
        event.effects[key as keyof IndicatorEffects] = Math.max(-10, Math.min(10, response.effects[key]));
      }
    });

    return event;
  } catch (error) {
    console.error('이벤트 검증 중 오류:', error);
    return defaultEvent;
  }
}