import React from 'react';
import { UserProfile } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface OrganizationMarkersProps {
  profile: UserProfile;
}

export default function OrganizationMarkers({ profile }: OrganizationMarkersProps) {
  const { t } = useLanguage();
  const markers = [
    { label: t('gamification.completed', 'Zrealizowane', 'Completed'), value: profile.completedProjectsCount || 0, color: 'bg-emerald-500' },
    { label: t('gamification.ongoing', 'W trakcie', 'In Progress'), value: profile.ongoingProjectsCount || 0, color: 'bg-blue-500' },
    { label: t('gamification.via_aligo', 'Przez platformę', 'Via platform'), value: profile.platformProjectsCount || 0, color: 'bg-purple-500' },
  ];

  return (
    <div className="flex items-center gap-2">
      {markers.map((marker, index) => (
        <div 
          key={index}
          className={`${marker.color} text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center shadow-sm`}
          title={`${marker.label}: ${marker.value}`}
        >
          {marker.value}
        </div>
      ))}
      <div className="bg-slate-200 text-slate-600 text-xs font-bold px-2 h-6 rounded-full flex items-center justify-center">
        {profile.role === 'ngo' ? (profile.foundationDate || 'NGO') : (profile.socialActivityStartDate || t('role.business', 'Biznes', 'Business'))}
      </div>
    </div>
  );
}
