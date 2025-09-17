import React from 'react';
import { GameState } from '../types/game';
import { Calendar, Zap, FileText, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react';

interface EventLogProps {
  gameState: GameState;
}

export function EventLog({ gameState }: EventLogProps) {
  // 이벤트와 정책을 시간순으로 정렬 (이벤트가 먼저, 그 다음 정책)
  const allItems = [
    ...gameState.events.map(event => ({ ...event, type: 'event', timestamp: event.year * 1000 })),
    ...gameState.policies.map(policy => ({ ...policy, type: 'policy', timestamp: policy.year * 1000 + 1 }))
  ];
  
  const recentEvents = allItems
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, 10);

  const getEventIcon = (item: any) => {
    if ('policy' in item) {
      return <FileText className="w-5 h-5 text-blue-500" />;
    } else {
      return <Zap className="w-5 h-5 text-orange-500" />;
    }
  };

  const getEffectIcon = (value: number) => {
    if (value > 0) return <TrendingUp className="w-4 h-4 text-green-500" />;
    if (value < 0) return <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />;
    return null;
  };

  const formatEffects = (effects: any) => {
    const effectNames: { [key: string]: string } = {
      approval: '지지율',
      debt: '국가부채',
      competitiveness: '기업경쟁력',
      technology: '기술발전도',
      gdpGrowth: '경제성장률',
      unemployment: '실업률',
      satisfaction: '국민만족도',
      relations: '국제관계'
    };

    return Object.entries(effects)
      .filter(([_, value]) => value !== undefined && value !== 0)
      .map(([key, value]) => (
        <div key={key} className="flex items-center gap-1 text-xs">
          {getEffectIcon(value as number)}
          <span className={`${(value as number) > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {effectNames[key]}: {(value as number) > 0 ? '+' : ''}{value}
            {key === 'gdpGrowth' ? '%' : key === 'unemployment' ? '%' : ''}
          </span>
        </div>
      ));
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h3 className="text-xl font-semibold text-gray-800">정책 및 이벤트 기록</h3>
      </div>
      
      {recentEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p>아직 기록된 정책이나 이벤트가 없습니다.</p>
          <p className="text-sm">정책을 시행하고 연도를 진행해보세요!</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {recentEvents.map((item, index) => (
            <div key={index} className="border-l-4 border-blue-200 pl-4 py-2 bg-gray-50 rounded-r-lg">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  {getEventIcon(item)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-blue-900">{item.year}년</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {'policy' in item ? '행동' : '이벤트'}
                    </span>
                  </div>
                  
                  <div className="mb-2">
                    <h4 className="font-medium text-gray-800">
                      {'policy' in item ? '대통령 행동' : item.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {'policy' in item ? item.policy : item.description}
                    </p>
                  </div>
                  
                  {Object.keys(item.effects).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {formatEffects(item.effects)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}