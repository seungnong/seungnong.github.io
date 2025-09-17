import React, { useState } from 'react';
import { FileText, Send } from 'lucide-react';

interface PolicyInputProps {
  onSubmitPolicy: (policy: string) => void;
  disabled: boolean;
  isAnalyzing?: boolean;
}

export function PolicyInput({ onSubmitPolicy, disabled, isAnalyzing = false }: PolicyInputProps) {
  const [policy, setPolicy] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (policy.trim() && !disabled) {
      onSubmitPolicy(policy.trim());
      setPolicy('');
    }
  };

  const policyExamples = [
    "법인세를 3% 인하한다",
    "청년 일자리 1만개를 만든다",
    "AI 기업에 세금 혜택을 준다",
    "기초연금을 5만원 올린다",
    "미국 대통령과 만난다",
    "국민에게 담화를 발표한다",
    "야당과 협상한다",
    "기업인들과 만난다",
    "최저임금을 올린다",
    "부동산 규제를 완화한다",
    "환경 정책을 강화한다",
    "교육 예산을 늘린다"
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <FileText className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">대통령 행동</h3>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="policy" className="block text-sm font-medium text-gray-700 mb-2">
            대통령으로서 어떤 행동을 하시겠습니까?
          </label>
          <textarea
            id="policy"
            value={policy}
            onChange={(e) => setPolicy(e.target.value)}
            placeholder="예: 청년 창업 지원을 위해 1조원 규모의 펀드를 조성한다 / 미국 대통령과 정상회담을 개최한다 / 국민들에게 직접 담화를 발표한다..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24"
            disabled={disabled}
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-sm text-gray-500">{policy.length}/200자</span>
          </div>
        </div>
        
        <button
          type="submit"
          disabled={!policy.trim() || disabled || isAnalyzing}
          className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
              정책 분석 중...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              행동 실행
            </>
          )}
        </button>
      </form>
      
      <div className="mt-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">행동 예시:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {policyExamples.map((example, index) => (
            <button
              key={index}
              onClick={() => setPolicy(example)}
              disabled={disabled || isAnalyzing}
              className="text-left p-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}