import React, { useState } from 'react';
import { BookOpen, X } from 'lucide-react';
import { Button } from './ui/button';
import { useLanguage } from '../contexts/LanguageContext';

export default function ISO26000Info() {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLanguage();

  return (
    <>
      <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-emerald-900">{t('iso.card_title', 'Ścieżka CSR: ISO 26000', 'CSR Path: ISO 26000')}</h3>
          <p className="text-sm text-emerald-700 mt-1">
            {t('iso.card_desc', 'Dowiedz się, jak wdrożyć społecznie odpowiedzialne praktyki w Twoim biznesie zgodnie z międzynarodowymi standardami.', 'Learn how to implement socially responsible practices in your business according to international standards.')}
          </p>
        </div>
        <Button onClick={() => setIsOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white gap-2">
          <BookOpen className="h-4 w-4" /> {t('iso.card_btn', 'Poznaj ISO 26000', 'Explore ISO 26000')}
        </Button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
          <div className="bg-white p-8 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold">{t('iso.modal_title', 'ISO 26000: Przegląd', 'ISO 26000: Overview')}</h2>
              <Button variant="ghost" className="p-2" onClick={() => setIsOpen(false)}><X className="h-6 w-6" /></Button>
            </div>
            <div className="space-y-4 text-slate-600 leading-relaxed">
              <p>
                {t('iso.modal_desc', 'ISO 26000 to międzynarodowy standard oferujący wytyczne dotyczące społecznej odpowiedzialności organizacji. W przeciwieństwie do innych norm ISO, nie jest to standard certyfikowany, lecz przewodnik, który pomaga przekształcić zasady w efektywne działania.', 'ISO 26000 is an international standard offering guidelines on social responsibility for organizations. Unlike other ISO standards, it is not a certified standard but a guidance document that helps convert principles into effective actions.')}
              </p>
              <h4 className="font-bold text-slate-900">{t('iso.core_areas', 'Kluczowe obszary:', 'Core guidance areas:')}</h4>
              <ul className="list-disc pl-5 space-y-2">
                <li>{t('iso.area_governance', 'Ład organizacyjny', 'Organizational Governance')}</li>
                <li>{t('iso.area_human_rights', 'Prawa człowieka', 'Human Rights')}</li>
                <li>{t('iso.area_labor', 'Praktyki z zakresu pracy', 'Labor Practices')}</li>
                <li>{t('iso.area_environment', 'Środowisko', 'The Environment')}</li>
                <li>{t('iso.area_operating', 'Uczciwe praktyki operacyjne', 'Fair Operating Practices')}</li>
                <li>{t('iso.area_consumer', 'Zagadnienia konsumenckie', 'Consumer Issues')}</li>
                <li>{t('iso.area_community', 'Zaangażowanie społeczne i rozwój społeczności lokalnych', 'Community Involvement & Development')}</li>
              </ul>
            </div>
            <Button className="mt-8 w-full" onClick={() => setIsOpen(false)}>{t('common.close', 'Zamknij', 'Close')}</Button>
          </div>
        </div>
      )}
    </>
  );
}
