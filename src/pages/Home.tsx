import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { ArrowRight, Building2, Heart, BookOpen, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-24 pb-32 lg:pt-36 lg:pb-40 overflow-hidden bg-slate-50">
        {/* Decorative background */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-600 to-emerald-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]" style={{ clipPath: 'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div initial="initial" animate="animate" variants={staggerContainer} className="max-w-3xl mx-auto">
            <motion.div variants={fadeIn} className="mb-8 flex justify-center">
              <span className="inline-flex items-center rounded-full px-4 py-1.5 text-sm font-semibold text-blue-700 bg-blue-100/80 ring-1 ring-inset ring-blue-600/20 backdrop-blur-sm">
                {t('home.badge')}
              </span>
            </motion.div>
            
            <motion.h1 variants={fadeIn} className="text-6xl md:text-8xl font-black tracking-tighter text-slate-900 mb-4 leading-[0.9]">
              Aligo <br className="hidden md:block" />
              <span className="text-4xl md:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500">
                {t('home.title_sub')}
              </span>
            </motion.h1>
            
            <motion.h2 variants={fadeIn} className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 tracking-tight">
              {t('home.title_main')}
            </motion.h2>
            
            <motion.p variants={fadeIn} className="text-lg md:text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              {t('home.hero_desc')}
            </motion.p>
            
            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link to="/dashboard">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 h-14 text-lg rounded-full shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 transition-all hover:-translate-y-0.5">
                  {t('home.enter_platform')} <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about-platform">
                <Button variant="outline" size="lg" className="px-8 h-14 text-lg rounded-full border-slate-300 text-slate-700 hover:bg-slate-100 transition-all">
                  {t('home.learn_more')}
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Value Proposition / Features */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 tracking-tight">{t('home.how_it_works')}</h2>
            <p className="text-lg text-slate-600">
              {t('home.how_desc')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* NGO Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Heart className="w-32 h-32 text-blue-600" />
              </div>
              <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                <Heart className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">{t('home.for_ngo')}</h3>
              <ul className="space-y-3 mb-8 text-slate-600">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"/> {t('home.ngo_feat1')}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"/> {t('home.ngo_feat2')}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5"/> {t('home.ngo_feat3')}</li>
              </ul>
              <Link to="/dashboard" className="text-blue-600 font-semibold hover:text-blue-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                {t('home.register_org')} <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            
            {/* Business Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <Building2 className="w-32 h-32 text-emerald-600" />
              </div>
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                <Building2 className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">{t('home.for_business')}</h3>
              <ul className="space-y-3 mb-8 text-slate-600">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"/> {t('home.biz_feat1')}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"/> {t('home.biz_feat2')}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5"/> {t('home.biz_feat3')}</li>
              </ul>
              <Link to="/dashboard" className="text-emerald-600 font-semibold hover:text-emerald-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                {t('home.join_business')} <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            
            {/* Education Card */}
            <motion.div 
              whileHover={{ y: -5 }}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                <BookOpen className="w-32 h-32 text-purple-600" />
              </div>
              <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-8 shadow-inner">
                <BookOpen className="h-7 w-7" />
              </div>
              <h3 className="text-2xl font-bold mb-4 text-slate-900">{t('home.knowledge_zone')}</h3>
              <ul className="space-y-3 mb-8 text-slate-600">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5"/> {t('home.know_feat1')}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5"/> {t('home.know_feat2')}</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5"/> {t('home.know_feat3')}</li>
              </ul>
              <Link to="/about-platform" className="text-purple-600 font-semibold hover:text-purple-700 flex items-center gap-1 group-hover:gap-2 transition-all">
                {t('home.explore_knowledge')} <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Us / Trust Section */}
      <section className="py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-500 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-emerald-500 blur-3xl"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col md:flex-row items-center gap-16">
          <div className="md:w-1/2">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10">
              <img 
                src="https://picsum.photos/seed/collaboration/800/600" 
                alt="Współpraca / Collaboration" 
                className="w-full h-auto object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/40 to-transparent"></div>
            </div>
          </div>
          <div className="md:w-1/2">
            <span className="text-blue-400 font-semibold tracking-wider uppercase text-sm mb-4 block">{t('nav.about_us')}</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              {t('about_us.subtitle')}
            </h2>
            <p className="text-lg text-slate-300 mb-6 leading-relaxed">
              {t('about_us.mission_desc')}
            </p>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed">
              {t('about_us.vision_desc')}
            </p>
            <Button variant="outline" size="lg" className="border-slate-600 text-slate-900 hover:bg-white hover:text-slate-900 bg-white/90 transition-all rounded-full px-8" asChild>
              <Link to="/about-us">
                {t('home.learn_more')}
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-blue-600 text-white text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">{t('home.enter_platform')}</h2>
          <p className="text-xl text-blue-100 mb-10">
            {t('home.hero_desc')}
          </p>
          <Link to="/dashboard">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-slate-100 font-bold px-10 h-14 text-lg rounded-full shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              {t('home.enter_platform')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
