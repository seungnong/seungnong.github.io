import React from 'react';
import { Calendar, Save, Upload, RotateCcw } from 'lucide-react';

interface GameControlsProps {
  onNextYear: () => void;
  onSaveGame: () => void;
  onLoadGame: () => void;
  onResetGame: () => void;
  disabled: boolean;
}

export function GameControls({ onNextYear, onSaveGame, onLoadGame, onResetGame, disabled }: GameControlsProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={onNextYear}
          disabled={disabled}
          className="bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Calendar className="w-5 h-5" />
          1년 후
        </button>
        
        <button
          onClick={onSaveGame}
          className="bg-green-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Save className="w-5 h-5" />
          저장
        </button>
        
        <button
          onClick={onLoadGame}
          className="bg-yellow-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-yellow-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <Upload className="w-5 h-5" />
          불러오기
        </button>
        
        <button
          onClick={onResetGame}
          className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" />
          새 게임
        </button>
      </div>
    </div>
  );
}