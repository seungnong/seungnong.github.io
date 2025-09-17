import { RandomEvent } from '../types/game';

export const randomEvents: RandomEvent[] = [
  {
    title: "글로벌 경제 위기",
    description: "미국과 중국 간 무역분쟁이 심화되면서 글로벌 경제가 침체에 빠졌습니다. 한국 경제에도 타격이 예상됩니다.",
    effects: {
      economicHealth: -15,
      unemployment: 1.5,
      approval: -5,
      satisfaction: -8,
      competitiveness: -3
    },
    probability: 0.15
  },
  {
    title: "K-문화 세계적 확산",
    description: "한국의 K-팝, K-드라마가 전 세계적으로 큰 인기를 끌며 한류 열풍이 다시 한 번 불고 있습니다.",
    effects: {
      relations: 8,
      competitiveness: 5,
      satisfaction: 6,
      approval: 3,
      economicHealth: 4
    },
    probability: 0.2
  },
  {
    title: "사이버 보안 사고",
    description: "대형 금융기관과 공공기관을 겨냥한 사이버 공격이 발생했습니다. 국가 보안 시스템의 취약점이 드러났습니다.",
    effects: {
      approval: -8,
      satisfaction: -5,
      technology: -2,
      relations: -3
    },
    probability: 0.12
  },
  {
    title: "반도체 기술 혁신",
    description: "한국 기업이 차세대 반도체 기술 개발에 성공하며 글로벌 시장에서 경쟁우위를 확보했습니다.",
    effects: {
      technology: 10,
      competitiveness: 8,
      economicHealth: 8,
      approval: 5,
      relations: 4
    },
    probability: 0.1
  },
  {
    title: "자연재해 발생",
    description: "대형 태풍으로 인한 피해가 전국적으로 발생했습니다. 신속한 복구 대책이 필요합니다.",
    effects: {
      nationalWealth: -15,
      satisfaction: -6,
      approval: -3,
      economicHealth: -5
    },
    probability: 0.18
  },
  {
    title: "국제 기술 협력 성과",
    description: "주요국과의 기술 협력 프로젝트가 성공적으로 마무리되어 기술력 향상과 국제적 위상이 높아졌습니다.",
    effects: {
      technology: 6,
      relations: 7,
      competitiveness: 4,
      approval: 4
    },
    probability: 0.15
  },
  {
    title: "청년 실업률 개선",
    description: "정부의 청년 일자리 창출 정책이 효과를 보이며 청년층 취업률이 크게 향상되었습니다.",
    effects: {
      unemployment: -2,
      satisfaction: 8,
      approval: 7,
      economicHealth: 6
    },
    probability: 0.12
  },
  {
    title: "외교 갈등 발생",
    description: "주변국과의 외교적 갈등이 발생하여 국제 관계에 긴장감이 조성되었습니다.",
    effects: {
      relations: -10,
      approval: -6,
      competitiveness: -2,
      satisfaction: -4
    },
    probability: 0.14
  }
];