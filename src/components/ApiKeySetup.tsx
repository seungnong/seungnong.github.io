import React, { useState, useEffect } from 'react';
import { Key, AlertCircle, CheckCircle, Eye, EyeOff } from 'lucide-react';

interface ApiKeySetupProps {
  onApiKeySet: (apiKey: string) => void;
}

export function ApiKeySetup({ onApiKeySet }: ApiKeySetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationResult, setValidationResult] = useState<'success' | 'error' | null>(null);

  useEffect(() => {
    // 환경변수에서 Gemini API 키 확인
    const envApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (envApiKey && envApiKey !== 'your_gemini_api_key_here') {
      onApiKeySet(envApiKey);
    }
  }, [onApiKeySet]);

  const validateApiKey = async (key: string): Promise<boolean> => {
    try {
      const { GoogleGenerativeAI } = await import('@google/generative-ai');
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // 간단한 테스트 요청
      const result = await model.generateContent('Hello');
      const response = await result.response;
      return !!response.text();
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setIsValidating(true);
    setValidationResult(null);

    const isValid = await validateApiKey(apiKey.trim());
    
    if (isValid) {
      setValidationResult('success');
      setTimeout(() => {
        onApiKeySet(apiKey.trim());
      }, 1000);
    } else {
      setValidationResult('error');
    }
    
    setIsValidating(false);
  };

  const handleSkip = () => {
    onApiKeySet('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center mb-6">
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <Key className="w-8 h-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Gemini API 설정</h2>
            <p className="text-gray-600">
              더 정확한 정책 분석을 위해 Google Gemini API 키를 입력해주세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                Google Gemini API Key
              </label>
              <div className="relative">
                <input
                  type={showKey ? 'text' : 'password'}
                  id="apiKey"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIza..."
                  className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {validationResult === 'error' && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>유효하지 않은 API 키입니다. 다시 확인해주세요.</span>
              </div>
            )}

            {validationResult === 'success' && (
              <div className="flex items-center gap-2 text-green-600 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>API 키가 확인되었습니다!</span>
              </div>
            )}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={!apiKey.trim() || isValidating}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center gap-2"
              >
                {isValidating ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    검증 중...
                  </>
                ) : (
                  <>
                    <Key className="w-5 h-5" />
                    API 키 설정
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSkip}
                className="w-full bg-gray-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors duration-200"
              >
                건너뛰기 (시뮬레이션 모드)
              </button>
            </div>
          </form>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-yellow-800">
                <p className="font-medium mb-1">API 키 안전 안내:</p>
                <ul className="space-y-1 text-xs">
                  <li>• API 키는 브라우저에만 저장되며 서버로 전송되지 않습니다</li>
                  <li>• Gemini API는 무료 할당량이 제공되며, 초과 시 요금이 부과됩니다</li>
                  <li>• 건너뛰기 선택 시 시뮬레이션 모드로 실행됩니다</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}