import React from 'react';
import { Project, UserProfile } from '../types';
import { Button } from './ui/button';
import { Calendar, Info, CheckCircle2, Clock, Send, Users, FileText, MessageSquare, Edit } from 'lucide-react';
import { motion } from 'motion/react';
import { EntityMarkers } from './Gamification';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface ProjectCardProps {
  key?: string | number;
  project: Project;
  onAction?: () => void;
  actionLabel?: string;
  isOwner?: boolean;
  onStatusChange?: (newStatus: 'planned' | 'in-progress' | 'completed') => void;
  onGenerateContract?: () => void;
  onOpenChat?: () => void;
  onConfirmBusiness?: (businessId: string) => void;
  interestedBusinessProfiles?: UserProfile[];
}

export default function ProjectCard({ 
  project, 
  onAction, 
  actionLabel, 
  isOwner, 
  onStatusChange, 
  onGenerateContract, 
  onOpenChat,
  onConfirmBusiness,
  interestedBusinessProfiles
}: ProjectCardProps) {
  const { t, language } = useLanguage();

  const title = (language === 'en' && project.titleEn) ? project.titleEn : project.title;
  const assumptions = (language === 'en' && project.assumptionsEn) ? project.assumptionsEn : project.assumptions;
  const effect = (language === 'en' && project.effectEn) ? project.effectEn : project.effect;

  const statusColors = {
    'planned': 'bg-blue-100 text-blue-700 border-blue-200',
    'in-progress': 'bg-amber-100 text-amber-700 border-amber-200',
    'completed': 'bg-emerald-100 text-emerald-700 border-emerald-200'
  };

  const statusLabels = {
    'planned': t('dashboard.status_planned', 'Planowany'),
    'in-progress': t('dashboard.status_in_progress', 'W realizacji'),
    'completed': t('dashboard.status_completed', 'Zrealizowany')
  };

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col"
    >
      {project.imageUrl && (
        <div className="h-48 w-full overflow-hidden">
          <img 
            src={project.imageUrl} 
            alt={project.title} 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      )}
      <div className="p-6 flex-grow">
        <div className="flex justify-between items-start mb-4">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${statusColors[project.status]}`}>
            {statusLabels[project.status]}
          </span>
          <div className="flex items-center gap-2">
            {isOwner && (
              <Link to={`/edit-project/${project.id}`}>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-slate-400 hover:text-blue-600">
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
            )}
            <div className="flex items-center gap-1 text-slate-400 text-sm">
              <Calendar className="h-4 w-4" />
              {project.deadline && (project.deadline as any).toDate 
                ? (project.deadline as any).toDate().toLocaleDateString()
                : new Date(project.deadline).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-xl font-bold text-slate-900 mb-1">{title}</h3>
          <p className="text-xs text-blue-600 font-semibold mb-2">NGO: {project.ownerName}</p>
        </div>

        <p className="text-slate-600 text-sm line-clamp-2 mb-4">{assumptions}</p>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Info className="h-4 w-4 shrink-0" />
            <span className="line-clamp-1">{t('project_form.effect', 'Efekt')}: {effect}</span>
          </div>
          
          {project.interestedBusinesses && project.interestedBusinesses.length > 0 && isOwner && project.status === 'planned' && (
            <div className="mt-4 p-3 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-xs font-bold text-blue-700 uppercase mb-2">{t('dashboard.interested_businesses', 'Zainteresowane firmy')}:</p>
              <div className="space-y-2">
                {project.interestedBusinesses.map((bizId) => (
                  <div key={bizId} className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-slate-700">
                      {interestedBusinessProfiles?.find(p => p.uid === bizId)?.organizationName || 'Firma...'}
                    </span>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      onClick={() => onConfirmBusiness?.(bizId)}
                      className="h-7 px-2 text-[10px] bg-blue-600 text-white hover:bg-blue-700"
                    >
                      {t('dashboard.confirm_partnership', 'Potwierdź')}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {project.status === 'in-progress' && (
            <div className="flex items-center gap-2 text-sm text-blue-600 font-medium">
              <Users className="h-4 w-4" />
              <span>{t('projects.confirmed_partner', 'Współpraca z')} {project.confirmedBusinesses?.length || 0}</span>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 mt-auto">
          {isOwner && (
            <div className="w-full flex gap-2 mb-2">
              {project.status === 'planned' && project.confirmedBusinesses && project.confirmedBusinesses.length > 0 && (
                <Button 
                  onClick={() => onStatusChange?.('in-progress')}
                  className="flex-grow bg-amber-500 hover:bg-amber-600 text-white text-xs"
                >
                  {t('dashboard.status_in_progress', 'Rozpocznij realizację')}
                </Button>
              )}
              {project.status === 'in-progress' && (
                <Button 
                  onClick={() => onStatusChange?.('completed')}
                  className="flex-grow bg-emerald-500 hover:bg-emerald-600 text-white text-xs"
                >
                  {t('dashboard.status_completed', 'Oznacz jako zrealizowany')}
                </Button>
              )}
            </div>
          )}

          {isOwner && project.status === 'planned' && (
            <Button 
              size="sm"
              variant="outline"
              className="w-full gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 mb-2"
              onClick={() => alert(t('contact.success_msg', 'Wysłano powiadomienia do partnerów biznesowych!'))}
            >
              <Send className="h-4 w-4" /> {t('home.for_business', 'Wyślij do biznesu')}
            </Button>
          )}

          {onAction && (
            <Button onClick={onAction} className="flex-grow gap-2">
              {actionLabel || t('common.details', 'Szczegóły')}
            </Button>
          )}

          {project.status === 'in-progress' && onGenerateContract && (
            <Button 
              variant="outline" 
              onClick={onGenerateContract}
              className="gap-2 text-emerald-600 border-emerald-200 hover:bg-emerald-50 flex-grow"
            >
              <FileText className="h-4 w-4" /> {t('about_platform.contract_gen', 'Umowa')}
            </Button>
          )}

          {(project.status === 'in-progress' || project.status === 'completed') && onOpenChat && (
            <Button 
              variant="outline" 
              onClick={onOpenChat}
              className="gap-2 text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              <MessageSquare className="h-4 w-4" /> {t('dashboard.chat_btn', 'Czat')}
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

