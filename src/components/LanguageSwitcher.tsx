import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
  variant?: 'pill' | 'compact' | 'dropdown';
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ 
  className = '', 
  variant = 'pill' 
}) => {
  const { language, setLanguage } = useLanguage();

  if (variant === 'compact') {
    return (
      <div className={`flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200 ${className}`}>
        <button
          onClick={() => setLanguage('pl')}
          className={`px-2 py-1 text-xs font-bold rounded transition-all ${
            language === 'pl'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="Polski"
        >
          PL
        </button>
        <button
          onClick={() => setLanguage('en')}
          className={`px-2 py-1 text-xs font-bold rounded transition-all ${
            language === 'en'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
          title="English"
        >
          EN
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center bg-slate-100/80 backdrop-blur-sm p-1 rounded-full border border-slate-200/80 shadow-inner ${className}`}>
      <Globe className="w-4 h-4 text-slate-500 ml-2 mr-1" />
      <button
        type="button"
        onClick={() => setLanguage('pl')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
          language === 'pl'
            ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span>🇵🇱</span>
        <span>PL</span>
      </button>
      <button
        type="button"
        onClick={() => setLanguage('en')}
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold transition-all duration-200 ${
          language === 'en'
            ? 'bg-white text-blue-700 shadow-sm ring-1 ring-slate-200'
            : 'text-slate-500 hover:text-slate-900'
        }`}
      >
        <span>🇬🇧</span>
        <span>EN</span>
      </button>
    </div>
  );
};

export default LanguageSwitcher;
