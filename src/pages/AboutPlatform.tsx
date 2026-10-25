import React from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';
import { 
  Target, 
  Award, 
  BookOpen, 
  Users, 
  TrendingUp, 
  ShieldCheck, 
  Zap,
  GraduationCap,
  Briefcase,
  Heart
} from 'lucide-react';

export default function AboutPlatform() {
  const { t } = useLanguage();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-white border-b border-slate-200 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight"
          >
            {t('about_platform.title', 'O platformie Aligo')}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed"
          >
            {t('about_platform.hero_desc', 'Wirtualne miejsce spotkań, które buduje mosty między światem biznesu a sektorem NGO, tworząc przestrzeń dla realnego wpływu społecznego.')}
          </motion.p>
        </div>
      </section>

      {/* Main Description */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeIn}>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">{t('about_us.mission', 'Nasza Misja')}</h2>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                <p>
                  {t('about_platform.hero_desc')}
                </p>
                <p>
                  {t('home.hero_desc')}
                </p>
              </div>
            </motion.div>
            <motion.div 
              {...fadeIn}
              className="bg-blue-600 rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden"
            >
              <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Zap className="h-6 w-6 text-yellow-400" /> {t('about_platform.subtitle', 'Kluczowe Funkcjonalności')}
              </h3>
              <ul className="space-y-4">
                {[
                  t('home.ngo_feat1'),
                  t('home.ngo_feat2'),
                  t('home.biz_feat1'),
                  t('about_platform.contract_gen'),
                  t('about_platform.report_gen'),
                  t('about_platform.csr_calculator')
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <ShieldCheck className="h-5 w-5 text-blue-200 shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Gamification Section */}
      <section id="grywalizacja" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('about_platform.gamification_tab', 'System Odznak i Grywalizacji')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Budujemy zaufanie poprzez transparentny system wskaźników i odznak, które wyróżniają najbardziej zaangażowane podmioty.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {/* Markers */}
            <motion.div {...fadeIn} className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Znaczniki (Wskaźniki)</h3>
              </div>
              <p className="text-slate-600 mb-6">Kolorowe wskaźniki przy nazwie podmiotu informujące o skali działań:</p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  t('home.stats_projects'),
                  t('dashboard.stats_active'),
                  t('dashboard.stats_completed'),
                  t('profile.badges_earned'),
                  t('home.stats_partners')
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm font-medium text-slate-700 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Badges */}
            <motion.div {...fadeIn} className="bg-slate-50 p-8 rounded-3xl border border-slate-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-emerald-600 p-2 rounded-lg text-white">
                  <Award className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900">Odznaki i Medale</h3>
              </div>
              <p className="text-slate-600 mb-6">Prestiżowe wyróżnienia określające jakość i formę zaangażowania:</p>
              <div className="flex flex-wrap gap-3">
                {[
                  t('home.ngo_feat3'),
                  t('home.biz_feat2'),
                  t('csr.esg_score'),
                  t('contract.title'),
                  "Payroll",
                  "Sponsoring",
                  "CSR Impact",
                  "NGO Verified"
                ].map((badge, index) => (
                  <span key={index} className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider border border-emerald-200 shadow-sm">
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Educational Zones */}
      <section id="strefy-wiedzy" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t('nav.knowledge_zones', 'Strefy Wiedzy')}</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              {t('home.how_desc')}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.div 
              {...fadeIn}
              className="group bg-white p-10 rounded-3xl border border-slate-200 hover:border-blue-300 transition-all shadow-sm hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <GraduationCap className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('home.for_ngo')}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {t('home.know_feat1')} &amp; {t('home.know_feat2')}
              </p>
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <BookOpen className="h-5 w-5" />
                <span>{t('home.explore_knowledge')}</span>
              </div>
            </motion.div>

            <motion.div 
              {...fadeIn}
              className="group bg-white p-10 rounded-3xl border border-slate-200 hover:border-emerald-300 transition-all shadow-sm hover:shadow-xl"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{t('home.for_business')}</h3>
              <p className="text-slate-600 mb-6 leading-relaxed">
                {t('home.biz_feat1')} &amp; {t('csr.calculator_title')}
              </p>
              <div className="flex items-center gap-2 text-emerald-600 font-bold">
                <TrendingUp className="h-5 w-5" />
                <span>{t('csr.esg_score')}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 bg-blue-600 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">
            {t('home.enter_platform')}
          </h2>
          <div className="flex flex-wrap justify-center gap-8 text-blue-100">
            <div className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              <span className="font-semibold">{t('home.for_ngo')} &amp; {t('home.for_business')}</span>
            </div>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6" />
              <span className="font-semibold">{t('footer.tagline')}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-6 w-6" />
              <span className="font-semibold">{t('home.ngo_feat2')}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


