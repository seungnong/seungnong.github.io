import React from 'react';
import { X, Brain, Clock, Target, TrendingUp, TrendingDown } from 'lucide-react';

interface PolicyAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: {
    policy: string;
    reasoning: string;
    category: string;
    feasibility: number;
    timeframe: string;
    effects: any;
  } | null;
}

export function PolicyAnalysisModal({ isOpen, onClose, analysis }: PolicyAnalysisModalProps) {
  if (!isOpen || !analysis) return null;

  const getTimeframeText = (timeframe: string) => {
    switch (timeframe) {
      case 'immediate': return '즉시 효과';
      case 'short-term': return '단기 효과';
      case 'long-term': return '장기 효과';
      default: return '단기 효과';
    }
  };

  const getFeasibilityColor = (score: number) => {
    if (score >= 8) return 'text-green-600 bg-green-100';
    if (score >= 6) return 'text-yellow-600 bg-yellow-100';
    if (score >= 4) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getEffectIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < 0) return <TrendingDown className="w-4 h-4 text-red-500" />;
    return null;
  };

  const effectNames: { [key: string]: string } = {
    approval: '대통령 지지율',
    nationalWealth: '국가 순자산',
    competitiveness: '기업 경쟁력',
    technology: '기술 발전도',
    economicHealth: '경제 건전성',
    unemployment: '실업률',
    satisfaction: '국민 만족도',
    relations: '국제 관계'
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">행동 분석 결과</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          <div className="space-y-6">
            {/* 행동 내용 */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">실행한 행동</h3>
              <p className="text-blue-800">{analysis.policy}</p>
            </div>

            {/* 행동 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Target className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-800">{analysis.category}</div>
                <div className="text-sm text-gray-600">행동 분야</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getFeasibilityColor(analysis.feasibility)}`}>
                  {analysis.feasibility}/10
                </div>
                <div className="text-sm text-gray-600 mt-1">실현 가능성</div>
              </div>
              
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <Clock className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-gray-800">{getTimeframeText(analysis.timeframe)}</div>
                <div className="text-sm text-gray-600">효과 발현 시기</div>
              </div>
            </div>

            {/* 분석 근거 */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">분석 근거</h3>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-4 rounded-lg">
                {analysis.reasoning}
              </p>
            </div>

            {/* 예상 효과 */}
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">예상 효과</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(analysis.effects)
                  .filter(([_, value]) => value !== undefined && value !== 0)
                  .map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-700">{effectNames[key]}</span>
                      <div className="flex items-center gap-2">
                        {getEffectIcon(value as number)}
                        <span className={`font-semibold ${(value as number) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          {(value as number) > 0 ? '+' : ''}{value}
                          {key === 'unemployment' ? '%' : ''}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* 확인 버튼 */}
            <div className="flex justify-end pt-4 border-t">
              <button
                onClick={onClose}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}