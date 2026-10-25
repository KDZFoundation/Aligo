import React from 'react';
import { UserProfile, Badge } from '../types';
import { Award, CheckCircle2, Clock, Calendar, Star, Users, Heart, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { useLanguage } from '../contexts/LanguageContext';

interface GamificationProps {
  profile: UserProfile;
  showTitle?: boolean;
}

export const EntityMarkers = ({ profile }: { profile: UserProfile }) => {
  const { t, language } = useLanguage();
  const isNgo = profile.role === 'ngo';
  
  const markers = [
    { 
      label: t('gamification.completed', 'Zrealizowane', 'Completed'), 
      value: profile.completedProjectsCount || 0, 
      color: 'bg-emerald-500',
      icon: <CheckCircle2 className="h-3 w-3" />
    },
    { 
      label: t('gamification.ongoing', 'W trakcie', 'In Progress'), 
      value: profile.ongoingProjectsCount || 0, 
      color: 'bg-amber-500',
      icon: <Clock className="h-3 w-3" />,
      clickable: true
    },
    { 
      label: t('gamification.via_aligo', 'Przez Aligo', 'Via Aligo'), 
      value: profile.platformProjectsCount || 0, 
      color: 'bg-blue-500',
      icon: <Star className="h-3 w-3" />,
      clickable: true
    },
    { 
      label: isNgo ? t('gamification.since_year', 'Od roku', 'Founded') : t('gamification.csr_since', 'CSR od', 'CSR since'), 
      value: isNgo ? (profile.foundationDate?.split('-')[0] || '-') : (profile.socialActivityStartDate?.split('-')[0] || '-'), 
      color: 'bg-slate-500',
      icon: <Calendar className="h-3 w-3" />
    }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {markers.map((marker, idx) => (
        <div 
          key={idx}
          className={`group relative flex items-center gap-1.5 px-2.5 py-1 rounded-full text-white text-xs font-bold shadow-sm transition-all ${marker.color} ${marker.clickable ? 'cursor-pointer hover:scale-105 active:scale-95' : ''}`}
        >
          {marker.icon}
          <span>{marker.value}</span>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
            {marker.label}
          </div>
        </div>
      ))}
    </div>
  );
};

export const EntityBadges = ({ profile }: { profile: UserProfile }) => {
  const { language } = useLanguage();
  if (!profile.badges || profile.badges.length === 0) return null;

  const getLevelColor = (level?: string) => {
    switch (level) {
      case 'gold': return 'text-yellow-500 border-yellow-200 bg-yellow-50';
      case 'silver': return 'text-slate-400 border-slate-200 bg-slate-50';
      case 'platinum': return 'text-indigo-400 border-indigo-200 bg-indigo-50';
      default: return 'text-blue-500 border-blue-100 bg-blue-50';
    }
  };

  const getBadgeIcon = (type: string) => {
    switch (type) {
      case 'stakeholders': return <Users className="h-4 w-4" />;
      case 'volunteers': return <Heart className="h-4 w-4" />;
      case 'employee_volunteering': return <Briefcase className="h-4 w-4" />;
      default: return <Award className="h-4 w-4" />;
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
    <div className="flex flex-wrap gap-3">
      {profile.badges.map((badge) => (
        <motion.div
          key={badge.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 font-bold text-sm shadow-sm ${getLevelColor(badge.level)}`}
        >
          {getBadgeIcon(badge.type)}
          <span>{getBadgeLabel(badge)}</span>
          {badge.value && <span className="ml-1 opacity-70">({badge.value})</span>}
        </motion.div>
      ))}
    </div>
  );
};

export default function Gamification({ profile, showTitle = true }: GamificationProps) {
  const { t } = useLanguage();
  return (
    <div className="space-y-6">
      <div>
        {showTitle && <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{t('gamification.activity_indicators', 'Wskaźniki aktywności', 'Activity Metrics')}</h4>}
        <EntityMarkers profile={profile} />
      </div>
      
      {profile.badges && profile.badges.length > 0 && (
        <div>
          {showTitle && <h4 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">{t('gamification.badges_awards', 'Odznaki i Wyróżnienia', 'Badges & Awards')}</h4>}
          <EntityBadges profile={profile} />
        </div>
      )}
    </div>
  );
}
