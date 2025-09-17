import React from 'react';
import { GameState } from '../types/game';
import { TrendingUp, TrendingDown, Users, Building2, Cpu, Globe, DollarSign, Briefcase, Award, PiggyBank } from 'lucide-react';

interface GameDashboardProps {
  gameState: GameState;
}

export function GameDashboard({ gameState }: GameDashboardProps) {
  const { indicators, year, presidentName } = gameState;

  const getIndicatorColor = (value: number, type: 'positive' | 'negative' = 'positive') => {
    if (type === 'negative') {
      if (value <= 30) return 'text-green-600';
      if (value <= 60) return 'text-yellow-600';
      return 'text-red-600';
    }
    
    if (value >= 70) return 'text-green-600';
    if (value >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (value: number, type: 'positive' | 'negative' = 'positive') => {
    if (type === 'negative') {
      if (value <= 30) return 'bg-green-500';
      if (value <= 60) return 'bg-yellow-500';
      return 'bg-red-500';
    }
    
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return { grade: 'S', color: 'text-purple-600 bg-purple-100' };
    if (score >= 80) return { grade: 'A', color: 'text-green-600 bg-green-100' };
    if (score >= 70) return { grade: 'B', color: 'text-blue-600 bg-blue-100' };
    if (score >= 60) return { grade: 'C', color: 'text-yellow-600 bg-yellow-100' };
    if (score >= 50) return { grade: 'D', color: 'text-orange-600 bg-orange-100' };
    return { grade: 'F', color: 'text-red-600 bg-red-100' };
  };

  const scoreGrade = getScoreGrade(indicators.overallScore);
  const wealthDisplay = indicators.nationalWealth >= 0 ? '자산' : '부채';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-blue-900 mb-2">대한민국 {year}년</h2>
        <p className="text-lg text-gray-700">대통령: {presidentName}</p>
      </div>

      {/* 종합 점수 */}
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-800">종합 국정 점수</h3>
              <p className="text-sm text-gray-600">전체 지표 종합 평가</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-3">
              <span className="text-3xl font-bold text-blue-600">{indicators.overallScore}점</span>
              <span className={`px-3 py-1 rounded-full text-lg font-bold ${scoreGrade.color}`}>{scoreGrade.grade}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* 대통령 지지율 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">대통령 지지율</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getIndicatorColor(indicators.approval)}`}>
              {indicators.approval.toFixed(1)}%
            </span>
            {indicators.approval >= 50 ? 
              <TrendingUp className="w-4 h-4 text-green-500" /> : 
              <TrendingDown className="w-4 h-4 text-red-500" />
            }
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(indicators.approval)}`}
              style={{ width: `${indicators.approval}%` }}
            ></div>
          </div>
        </div>

        {/* 국가 순자산 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <PiggyBank className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">국가 순자산</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${indicators.nationalWealth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {indicators.nationalWealth >= 0 ? '+' : ''}{indicators.nationalWealth.toFixed(0)}조원
            </span>
            {indicators.nationalWealth >= 0 ? 
              <TrendingUp className="w-4 h-4 text-green-500" /> : 
              <TrendingDown className="w-4 h-4 text-red-500" />
            }
          </div>
          <p className="text-sm text-gray-500 mt-1">
            국가 {wealthDisplay}
          </p>
        </div>

        {/* 기업 경쟁력 지수 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">기업 경쟁력</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getIndicatorColor(indicators.competitiveness)}`}>
              {indicators.competitiveness.toFixed(0)}
            </span>
            {indicators.competitiveness >= 70 ? 
              <TrendingUp className="w-4 h-4 text-green-500" /> : 
              <TrendingDown className="w-4 h-4 text-red-500" />
            }
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(indicators.competitiveness)}`}
              style={{ width: `${indicators.competitiveness}%` }}
            ></div>
          </div>
        </div>

        {/* 기술 발전도 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">기술 발전도</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getIndicatorColor(indicators.technology)}`}>
              {indicators.technology.toFixed(0)}
            </span>
            {indicators.technology >= 70 ? 
              <TrendingUp className="w-4 h-4 text-green-500" /> : 
              <TrendingDown className="w-4 h-4 text-red-500" />
            }
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(indicators.technology)}`}
              style={{ width: `${indicators.technology}%` }}
            ></div>
          </div>
        </div>

        {/* 경제 건전성 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">경제 건전성</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getIndicatorColor(indicators.economicHealth)}`}>
              {indicators.economicHealth.toFixed(0)}
            </span>
            {indicators.economicHealth >= 70 ? 
              <TrendingUp className="w-4 h-4 text-green-500" /> : 
              <TrendingDown className="w-4 h-4 text-red-500" />
            }
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(indicators.economicHealth)}`}
              style={{ width: `${indicators.economicHealth}%` }}
            ></div>
          </div>
        </div>

        {/* 실업률 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Briefcase className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">실업률</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getIndicatorColor(indicators.unemployment, 'negative')}`}>
              {indicators.unemployment.toFixed(1)}%
            </span>
            {indicators.unemployment <= 3 ? 
              <TrendingUp className="w-4 h-4 text-green-500" /> : 
              <TrendingDown className="w-4 h-4 text-red-500" />
            }
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(indicators.unemployment, 'negative')}`}
              style={{ width: `${indicators.unemployment * 5}%` }}
            ></div>
          </div>
        </div>

        {/* 국민 만족도 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">국민 만족도</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getIndicatorColor(indicators.satisfaction)}`}>
              {indicators.satisfaction.toFixed(0)}
            </span>
            {indicators.satisfaction >= 60 ? 
              <TrendingUp className="w-4 h-4 text-green-500" /> : 
              <TrendingDown className="w-4 h-4 text-red-500" />
            }
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(indicators.satisfaction)}`}
              style={{ width: `${indicators.satisfaction}%` }}
            ></div>
          </div>
        </div>

        {/* 국제 관계 지수 */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="font-medium text-gray-700">국제 관계</span>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${getIndicatorColor(indicators.relations)}`}>
              {indicators.relations.toFixed(0)}
            </span>
            {indicators.relations >= 70 ? 
              <TrendingUp className="w-4 h-4 text-green-500" /> : 
              <TrendingDown className="w-4 h-4 text-red-500" />
            }
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${getProgressBarColor(indicators.relations)}`}
              style={{ width: `${indicators.relations}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}