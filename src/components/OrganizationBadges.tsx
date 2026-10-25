import React from 'react';
import { Badge } from '../types';
import { Award, Users, HandHeart, Building2, DollarSign, Gift, Target } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface OrganizationBadgesProps {
  badges: Badge[];
}

export default function OrganizationBadges({ badges }: OrganizationBadgesProps) {
  const { language } = useLanguage();

  const getIcon = (type: Badge['type']) => {
    switch (type) {
      case 'stakeholders': return <Users className="h-4 w-4" />;
      case 'volunteers': return <HandHeart className="h-4 w-4" />;
      case 'employee_volunteering': return <Building2 className="h-4 w-4" />;
      case 'payroll': return <DollarSign className="h-4 w-4" />;
      case 'sponsoring': return <Award className="h-4 w-4" />;
      case 'donations': return <Gift className="h-4 w-4" />;
      case 'crm': return <Target className="h-4 w-4" />;
      case 'csr_eco': return <Target className="h-4 w-4" />;
      case 'csr_social': return <HandHeart className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
    }
  };

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'platinum': return 'bg-slate-800 text-slate-100';
      case 'gold': return 'bg-yellow-500 text-white';
      case 'silver': return 'bg-slate-400 text-white';
      default: return 'bg-blue-500 text-white';
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

  return (
    <div className="flex flex-wrap gap-2">
      {badges.map((badge) => (
        <div 
          key={badge.id}
          className={`${getLevelColor(badge.level)} text-xs font-bold w-8 h-8 rounded-full flex items-center justify-center shadow-sm`}
          title={`${getBadgeLabel(badge)}: ${badge.value || ''}`}
        >
          {getIcon(badge.type)}
        </div>
      ))}
    </div>
  );
}
