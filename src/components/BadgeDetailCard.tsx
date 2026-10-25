import React from 'react';
import { Badge } from '../types';
import { Award, Users, HandHeart, Building2, DollarSign, Gift, Target, Megaphone, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface BadgeDetailCardProps {
  badge: Badge;
}

const BadgeDetailCard: React.FC<BadgeDetailCardProps> = ({ badge }) => {
  const { t, language } = useLanguage();

  const getIcon = (type: Badge['type']) => {
    switch (type) {
      case 'stakeholders': return <Users className="h-8 w-8" />;
      case 'volunteers': return <HandHeart className="h-8 w-8" />;
      case 'employee_volunteering': return <Building2 className="h-8 w-8" />;
      case 'payroll': return <DollarSign className="h-8 w-8" />;
      case 'sponsoring': return <Award className="h-8 w-8" />;
      case 'donations': return <Gift className="h-8 w-8" />;
      case 'crm': return <Megaphone className="h-8 w-8" />;
      case 'charity': return <Heart className="h-8 w-8" />;
      case 'csr_eco': return <Target className="h-8 w-8" />;
      case 'csr_social': return <HandHeart className="h-8 w-8" />;
      default: return <Award className="h-8 w-8" />;
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'platinum': return 'from-slate-700 to-slate-900 text-slate-100 border-slate-600';
      case 'gold': return 'from-yellow-400 to-yellow-600 text-white border-yellow-300';
      case 'silver': return 'from-slate-300 to-slate-500 text-white border-slate-200';
      default: return 'from-emerald-500 to-emerald-700 text-white border-emerald-400';
    }
  };

  const getBadgeDescription = (type: Badge['type']) => {
    if (language === 'en') {
      switch (type) {
        case 'stakeholders': return 'Number of stakeholders served by the organization. Reflects community scale and trust.';
        case 'volunteers': return 'Number of active volunteers. Demonstrates capacity to engage people in noble causes.';
        case 'employee_volunteering': return 'Awarded for corporate volunteering initiatives, connecting business with community support.';
        case 'payroll': return 'Verifies participation in payroll giving programs with recurring employee financial contributions.';
        case 'sponsoring': return 'Level of social project sponsorship. Reflects partnership generosity and consistency.';
        case 'donations': return 'Value and frequency of financial and material donations to NGOs.';
        case 'crm': return 'Number of Cause-Related Marketing agreements executed.';
        case 'charity': return 'Number of charitable actions supported or organized.';
        case 'csr_eco': return 'Awarded for environmental and ecological initiatives, showing commitment to a green transition.';
        case 'csr_social': return 'Awarded for supporting broad social initiatives (health, education, relief).';
        default: return 'Honorary badge for outstanding achievements in building NGO-Business relations.';
      }
    }
    switch (type) {
      case 'stakeholders': return 'Liczba interesariuszy obsłużonych przez podmiot. Świadczy o skali oddziaływania i zaufaniu społeczności.';
      case 'volunteers': return 'Liczba wolontariuszy współpracujących z podmiotem. Pokazuje zdolność do angażowania ludzi w szczytne cele.';
      case 'employee_volunteering': return 'Odznaka przyznawana za realizację programów wolontariatu pracowniczego. Łączy świat biznesu z realną pomocą.';
      case 'payroll': return 'Znaczek potwierdzający udział w programie odpisów od pensji (payroll giving). Stałe wsparcie finansowe od pracowników.';
      case 'sponsoring': return 'Poziom zaangażowania w sponsoring projektów społecznych. Gradacja odzwierciedla hojność i stałość partnerstwa.';
      case 'donations': return 'Wartość i częstotliwość przekazywanych darowizn. Kluczowy wskaźnik wsparcia materialnego dla NGO.';
      case 'crm': return 'Liczba zrealizowanych umów marketingu zaangażowanego społecznie (Cause Related Marketing).';
      case 'charity': return 'Liczba zorganizowanych lub wspartych akcji charytatywnych o charakterze doraźnym.';
      case 'csr_eco': return 'Odznaka przyznawana za wsparcie inicjatyw z zakresu ochrony środowiska i ekologii. Świadczy o zaangażowaniu w zieloną transformację.';
      case 'csr_social': return 'Odznaka przyznawana za wsparcie szeroko pojętych inicjatyw społecznych (zdrowie, edukacja, pomoc).';
      default: return 'Odznaka honorowa za wybitne osiągnięcia w budowaniu relacji NGO-Biznes.';
    }
  };

  const getBadgeLabel = (badge: Badge) => {
    if (language === 'en') {
      const labelsEn: Record<string, string> = {
        'Interesariusze': 'Stakeholders',
        'Wolontariusze': 'Volunteers',
        'Wolontariat Pracowniczy': 'Corporate Volunteering',
        'Program Payroll': 'Payroll Giving',
        'Sponsoring': 'Sponsorship',
        'Darowizny': 'Donations',
        'Umowy CRM': 'CRM Agreements',
        'Akcje Charytatywne': 'Charitable Actions',
        'CSR: Ochrona Środowiska': 'CSR: Environmental Protection',
        'CSR: Inicjatywy Społeczne': 'CSR: Social Initiatives'
      };
      return labelsEn[badge.label] || badge.label;
    }
    return badge.label;
  };

  const getLevelLabel = (level?: string) => {
    if (language === 'en') {
      return level === 'platinum' ? 'Platinum' : level === 'gold' ? 'Gold' : 'Silver';
    }
    return level === 'platinum' ? 'Platynowy' : level === 'gold' ? 'Złoty' : 'Srebrny';
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 flex items-start gap-6 shadow-sm hover:shadow-md transition-all">
      <div className={`shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br ${getLevelColor(badge.level)} flex items-center justify-center shadow-lg border-2`}>
        {getIcon(badge.type)}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold text-slate-900">{getBadgeLabel(badge)}</h3>
          {badge.value && (
            <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-bold border border-blue-100">
              {badge.value}
            </span>
          )}
        </div>
        <p className="text-slate-600 text-sm leading-relaxed">
          {getBadgeDescription(badge.type)}
        </p>
        {badge.level && badge.level !== 'none' && (
          <div className="mt-3 flex items-center gap-2">
            <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded border ${
              badge.level === 'platinum' ? 'bg-slate-100 text-slate-700 border-slate-200' :
              badge.level === 'gold' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              'bg-slate-50 text-slate-600 border-slate-100'
            }`}>
              {t('badge.level_prefix', 'Poziom', 'Level')}: {getLevelLabel(badge.level)}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BadgeDetailCard;
