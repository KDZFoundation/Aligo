import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import { useLanguage } from '../contexts/LanguageContext';

export default function Contact() {
  const { t } = useLanguage();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 flex flex-col md:flex-row gap-12">
      <div className="md:w-1/2">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('contact.title', 'Skontaktuj się z nami')}</h1>
        <p className="text-lg text-slate-600 mb-8">
          {t('contact.subtitle', 'Masz pytania dotyczące platformy Aligo? Nasi specjaliści są do Twojej dyspozycji.')}
        </p>
        <div className="space-y-4 text-slate-600 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <p className="font-bold text-slate-900 text-lg">Fundacja D-ARKA</p>
          <p>Ogrodniki 10E<br/>82-316 Milejewo</p>
          <p>KRS: 0000874086</p>
          <p>Email: <a href="mailto:dariusz@d-arka.pl" className="text-blue-600 font-semibold underline">dariusz@d-arka.pl</a></p>
        </div>
      </div>
      <div className="md:w-1/2 bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        {sent ? (
          <div className="p-6 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-center font-semibold">
            {t('contact.success_msg', 'Wiadomość została wysłana, dziękujemy!')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-slate-700">{t('contact.form_name', 'Imię i nazwisko')}</label>
              <input type="text" id="name" required className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700">{t('contact.form_email', 'Adres e-mail')}</label>
              <input type="email" id="email" required className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700">{t('contact.form_message', 'Treść wiadomości')}</label>
              <textarea id="message" rows={4} required className="mt-1 block w-full rounded-xl border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border" />
            </div>
            <Button type="submit" className="w-full h-12 text-base rounded-xl bg-blue-600 hover:bg-blue-700">{t('contact.form_send', 'Wyślij wiadomość')}</Button>
          </form>
        )}
      </div>
    </div>
  );
}

