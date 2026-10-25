import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSwitcher from './LanguageSwitcher';
import { Button } from './ui/button';
import { HeartHandshake, LogIn, LogOut, User as UserIcon, Menu, X } from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';

export default function Layout() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    // No logout in demo mode
  };

  const navLinks = [
    { name: t('nav.home'), path: '/' },
    { name: t('nav.about_platform'), path: '/about-platform' },
    { name: t('nav.projects'), path: '/projects', authRequired: true },
    { name: t('nav.gamification'), path: '/about-platform#grywalizacja' },
    { name: t('nav.knowledge_zones'), path: '/about-platform#strefy-wiedzy' },
    { name: t('nav.about_us'), path: '/about-us' },
    { name: t('nav.contact'), path: '/contact' },
  ];

  const filteredLinks = navLinks.filter(link => !link.authRequired || user);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50 transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-blue-600 to-emerald-500 text-white p-2 rounded-xl shadow-sm group-hover:shadow-md transition-all">
              <HeartHandshake className="h-6 w-6" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">Aligo</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {filteredLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`text-sm font-semibold transition-colors ${isActive(link.path) ? 'text-blue-600' : 'text-slate-600 hover:text-blue-600'}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher variant="pill" />
            {user && (
              <div className="flex items-center gap-3">
                <Link to="/profile">
                  <Button variant="ghost" className="gap-2 font-semibold text-slate-700 hover:text-blue-600 hover:bg-blue-50">
                    <UserIcon className="h-4 w-4" />
                    {profile?.organizationName || t('nav.profile')}
                  </Button>
                </Link>
                <Link to="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                    {t('nav.dashboard')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle & Switcher */}
          <div className="md:hidden flex items-center gap-2">
            <LanguageSwitcher variant="compact" />
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-2 pb-6 space-y-1 shadow-lg absolute w-full">
            {filteredLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-medium ${isActive(link.path) ? 'bg-blue-50 text-blue-700' : 'text-slate-700 hover:bg-slate-50 hover:text-blue-600'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-2 border-t border-slate-100 space-y-3">
              <div className="px-3 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-500">{t('nav.switch_lang')}</span>
                <LanguageSwitcher variant="pill" />
              </div>
              {user && (
                <div className="flex flex-col gap-3 px-3 pt-2">
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full justify-start gap-2">
                      <UserIcon className="h-4 w-4" />
                      {profile?.organizationName || t('nav.user_panel')}
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </header>

      <main className="flex-grow flex flex-col">
        <Outlet />
      </main>

      <footer className="bg-slate-950 text-slate-400 py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <div className="bg-blue-600 p-1.5 rounded-lg">
                <HeartHandshake className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Aligo</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              {t('footer.tagline')}
            </p>
            <div className="pt-2">
              <LanguageSwitcher variant="pill" className="bg-slate-900 border-slate-800" />
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">{t('footer.platform')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/about-platform" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500"></span> {t('nav.about_platform')}</Link></li>
              <li><Link to="/ngo-zone" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500"></span> {t('footer.ngo_zone')}</Link></li>
              <li><Link to="/business-zone" className="hover:text-white transition-colors flex items-center gap-2"><span className="w-1 h-1 rounded-full bg-blue-500"></span> {t('footer.business_zone')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">{t('footer.information')}</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/privacy" className="hover:text-white transition-colors">{t('footer.privacy')}</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/funding" className="hover:text-white transition-colors">{t('footer.funding')}</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-6 tracking-wide text-sm uppercase">{t('footer.contact')}</h3>
            <ul className="space-y-3 text-sm">
              <li className="text-white font-medium">Fundacja D-ARKA</li>
              <li>Ogrodniki 10E</li>
              <li>82-316 Milejewo</li>
              <li>KRS: 0000874086</li>
              <li><a href="mailto:dariusz@d-arka.pl" className="text-blue-400 hover:text-blue-300 transition-colors">dariusz@d-arka.pl</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Aligo. {t('footer.rights')}
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <span className="sr-only">Facebook</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" /></svg>
            </a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
