import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function AboutUs() {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
      <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('about_us.title', 'O nas')}</h1>
      <p className="text-xl text-slate-600 mb-8">{t('about_us.subtitle')}</p>
      
      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('about_us.mission')}</h2>
          <p className="text-slate-600 leading-relaxed">
            {t('about_us.mission_desc')}
          </p>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">{t('about_us.vision')}</h2>
          <p className="text-slate-600 leading-relaxed">
            {t('about_us.vision_desc')}
          </p>
        </div>
      </div>
    </div>
  );
}

