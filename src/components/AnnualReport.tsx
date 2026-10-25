import React, { useState } from 'react';
import { Project, UserProfile } from '../types';
import { Button } from './ui/button';
import { FileBarChart, Download, Printer, X, TrendingUp, CheckCircle2, Clock, Star, Coins, Globe, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface AnnualReportProps {
  projects: Project[];
  profile: UserProfile;
  onClose: () => void;
}

export default function AnnualReport({ projects, profile, onClose }: AnnualReportProps) {
  const { t, language } = useLanguage();
  const currentYear = new Date().getFullYear();
  const isBusiness = profile.role === 'business';
  
  const completed = projects.filter(p => p.status === 'completed').length;
  const ongoing = projects.filter(p => p.status === 'in-progress').length;
  const totalContribution = projects.reduce((sum, p) => sum + (p.contributionValue || 0), 0);
  
  // Group by CSR dimensions for business
  const environmentalProjects = projects.filter(p => ['Ekologia', 'Środowisko', 'Zwierzęta', 'Ecology'].includes((p.category || '') as string));
  const socialProjects = projects.filter(p => ['Zdrowie', 'Pomoc Społeczna', 'Kultura', 'Edukacja', 'Health', 'Social Help', 'Culture', 'Education'].includes((p.category || '') as string));
  const employeeProjects = projects.filter(p => p.title.toLowerCase().includes('warsztat') || p.title.toLowerCase().includes('workshop') || p.effect.toLowerCase().includes('pracowni') || (p.category as string) === 'Edukacja' || (p.category as string) === 'Education');

  const envImpactCount = environmentalProjects.length;
  const socialImpactCount = socialProjects.length;
  const employeeRelationsCount = employeeProjects.length;

  const initialSummary = language === 'en'
    ? (isBusiness 
      ? `In ${currentYear}, ${profile.organizationName} executed its Corporate Social Responsibility (CSR) strategy by actively supporting ${projects.length} social initiatives. Our total commitment of PLN ${totalContribution.toLocaleString()} created real impact, focusing particularly on environmental protection (${envImpactCount} projects), social community interests (${socialImpactCount} projects), and employee engagement initiatives (${employeeRelationsCount} projects).`
      : `In ${currentYear}, ${profile.organizationName} actively participated in building a collaboration ecosystem on the Aligo platform. By executing ${completed} projects, we achieved tangible social impact, engaging corporate partners and optimizing fundraising operations.`)
    : (isBusiness 
      ? `W roku ${currentYear}, firma ${profile.organizationName} zrealizowała strategię Społecznej Odpowiedzialności Biznesu (CSR) poprzez aktywne wsparcie ${projects.length} inicjatyw społecznych. Nasze zaangażowanie o łącznej wartości ${totalContribution.toLocaleString()} zł pozwoliło na realną zmianę, z czego szczególną wagę przyłożyliśmy do działań z zakresu ochrony środowiska (${envImpactCount} projekty), szeroko pojętych interesów społecznych (${socialImpactCount} projektów) oraz inicjatyw wzmacniających relacje i zaangażowanie naszych pracowników (${employeeRelationsCount} projektów).`
      : `W roku ${currentYear}, ${profile.organizationName} aktywnie uczestniczyła w budowaniu ekosystemu współpracy na platformie Aligo. Dzięki realizacji ${completed} projektów, udało się wywrzeć realny wpływ społeczny, angażując partnerów i optymalizując procesy fundraisingu.`);

  const [impactDescription, setImpactDescription] = useState(initialSummary);
  
  const handlePrint = () => {
    window.print();
  };

  const statusMap: Record<string, string> = {
    'planned': t('dashboard.status_planned', 'Planowany', 'Planned'),
    'in-progress': t('dashboard.status_in_progress', 'W realizacji', 'In Progress'),
    'completed': t('dashboard.status_completed', 'Zrealizowany', 'Completed')
  };

  const categoryMap: Record<string, string> = {
    'Ekologia': 'Ecology',
    'Edukacja': 'Education',
    'Zdrowie': 'Health',
    'Kultura': 'Culture',
    'Pomoc Społeczna': 'Social Help',
    'Inne': 'Other'
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className={`p-6 border-b border-slate-100 flex justify-between items-center ${isBusiness ? 'bg-emerald-900' : 'bg-slate-900'} text-white rounded-t-3xl`}>
          <div className="flex items-center gap-3">
            <div className={`${isBusiness ? 'bg-emerald-600' : 'bg-blue-600'} p-2 rounded-xl text-white`}>
              <FileBarChart className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{isBusiness ? t('report.csr_title', 'Raport CSR', 'CSR Report') : t('report.annual_title', 'Raport Roczny', 'Annual Report')} {currentYear}</h2>
              <p className="text-sm text-slate-400">{profile.organizationName}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="gap-2 border-slate-700 text-white hover:bg-slate-800">
              <Printer className="h-4 w-4" /> {t('report.print_btn', 'Drukuj Raport', 'Print Report')}
            </Button>
            <Button variant="ghost" onClick={onClose} className="p-2 h-auto text-slate-400 hover:text-white">
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        {/* Report Content */}
        <div className="flex-grow overflow-y-auto p-12 bg-white print:p-0">
          <div className="max-w-[210mm] mx-auto text-slate-900 space-y-12">
            <div className="text-center">
              <h1 className="text-3xl font-bold uppercase tracking-tight">
                {isBusiness ? t('report.main_heading_biz', 'Raport Społecznej Odpowiedzialności Biznesu', 'Corporate Social Responsibility Report') : t('report.main_heading_ngo', 'Raport Aktywności Społecznej', 'Social Activity Annual Report')}
              </h1>
              <p className="text-slate-500 mt-2">{t('report.subheading', `Podsumowanie zaangażowania na platformie Aligo w roku ${currentYear}`, `Summary of engagement on the Aligo platform in ${currentYear}`)}</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-6">
              <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 text-center">
                <TrendingUp className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold">{projects.length}</p>
                <p className="text-xs text-slate-500 uppercase font-bold mt-1">{t('report.supported_projects', 'Wspierane projekty', 'Supported Projects')}</p>
              </div>
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-100 text-center">
                <CheckCircle2 className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
                <p className="text-3xl font-bold">{completed}</p>
                <p className="text-xs text-slate-500 uppercase font-bold mt-1">{t('report.completed_success', 'Zakończone sukcesem', 'Completed')}</p>
              </div>
              {isBusiness ? (
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                  <Coins className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{totalContribution.toLocaleString()} PLN</p>
                  <p className="text-xs text-slate-500 uppercase font-bold mt-1">{t('report.support_value', 'Wartość wsparcia', 'Total Support')}</p>
                </div>
              ) : (
                <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100 text-center">
                  <Clock className="h-6 w-6 text-amber-600 mx-auto mb-2" />
                  <p className="text-3xl font-bold">{ongoing}</p>
                  <p className="text-xs text-slate-500 uppercase font-bold mt-1">{t('report.in_progress', 'W realizacji', 'In Progress')}</p>
                </div>
              )}
              <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 text-center">
                <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-3xl font-bold">{isBusiness ? projects.length : (profile.platformProjectsCount || 0)}</p>
                <p className="text-xs text-slate-500 uppercase font-bold mt-1">{isBusiness ? t('report.ngo_partners', 'Partnerzy NGO', 'NGO Partners') : t('report.via_aligo', 'Przez Aligo', 'Via Aligo')}</p>
              </div>
            </div>

            {/* Business Specific: Categories Chart/List */}
            {isBusiness && (
              <div className="space-y-6">
                <h3 className="text-xl font-bold border-b border-slate-200 pb-2">{t('report.esg_areas', 'Obszary Zaangażowania ESG / CSR', 'ESG / CSR Engagement Areas')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Environment */}
                  <div className="flex flex-col p-6 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <h4 className="font-bold text-emerald-800 mb-2">{t('report.env_impact', 'Wpływ na środowisko', 'Environmental Impact')}</h4>
                    <span className="text-3xl font-black text-emerald-600 mb-4">{envImpactCount}</span>
                    <ul className="text-sm text-emerald-700 space-y-1">
                      {environmentalProjects.slice(0, 3).map((p, i) => (
                        <li key={i} className="truncate">• {(language === 'en' && p.titleEn) ? p.titleEn : p.title}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Social */}
                  <div className="flex flex-col p-6 bg-blue-50 rounded-2xl border border-blue-100">
                    <h4 className="font-bold text-blue-800 mb-2">{t('report.social_impact', 'Interesy społeczne', 'Social Community Impact')}</h4>
                    <span className="text-3xl font-black text-blue-600 mb-4">{socialImpactCount}</span>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {socialProjects.slice(0, 3).map((p, i) => (
                        <li key={i} className="truncate">• {(language === 'en' && p.titleEn) ? p.titleEn : p.title}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Employee */}
                  <div className="flex flex-col p-6 bg-purple-50 rounded-2xl border border-purple-100">
                    <h4 className="font-bold text-purple-800 mb-2">{t('report.employee_impact', 'Relacje z pracownikami', 'Employee & Workplace Relations')}</h4>
                    <span className="text-3xl font-black text-purple-600 mb-4">{employeeRelationsCount}</span>
                    <ul className="text-sm text-purple-700 space-y-1">
                      {employeeProjects.slice(0, 3).map((p, i) => (
                        <li key={i} className="truncate">• {(language === 'en' && p.titleEn) ? p.titleEn : p.title}</li>
                      ))}
                    </ul>
                  </div>

                </div>
              </div>
            )}

            {/* Projects List */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold border-b border-slate-200 pb-2">{t('report.cooperation_list', 'Wykaz Współpracy', 'Cooperation Overview')}</h3>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-slate-500 text-sm uppercase tracking-wider">
                    <th className="py-3 px-4 border-b border-slate-100">{t('project_form.title_label', 'Projekt', 'Project')}</th>
                    <th className="py-3 px-4 border-b border-slate-100">{isBusiness ? t('report.ngo_partner', 'Partner NGO', 'NGO Partner') : 'Status'}</th>
                    <th className="py-3 px-4 border-b border-slate-100">{t('project_form.category', 'Kategoria', 'Category')}</th>
                    <th className="py-3 px-4 border-b border-slate-100 text-right">{t('projects.budget', 'Wartość', 'Value')}</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {projects.map((p, idx) => {
                    const pTitle = (language === 'en' && p.titleEn) ? p.titleEn : p.title;
                    const pCategory = (language === 'en') ? (categoryMap[p.category || ''] || p.categoryEn || p.category) : (p.category || 'Inne');
                    const pStatus = statusMap[p.status] || p.status;
                    return (
                      <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                        <td className="py-4 px-4 font-bold">{pTitle}</td>
                        <td className="py-4 px-4 text-slate-600">{isBusiness ? p.ownerName : pStatus}</td>
                        <td className="py-4 px-4">
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                            {pCategory}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right font-mono">
                          {p.contributionValue ? `${p.contributionValue.toLocaleString()} PLN` : '---'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary Text */}
            <div className={`p-8 ${isBusiness ? 'bg-emerald-900' : 'bg-slate-900'} text-white rounded-3xl space-y-4`}>
              <h3 className="text-xl font-bold">{t('report.strategic_summary', 'Podsumowanie Strategiczne', 'Strategic Summary')}</h3>
              <textarea 
                value={impactDescription}
                onChange={(e) => setImpactDescription(e.target.value)}
                className="w-full bg-transparent text-slate-300 leading-relaxed border-none focus:ring-0 resize-none h-32"
              />
            </div>

            <div className="pt-12 flex justify-between items-end">
              <div className="text-xs text-slate-400">
                <p>{t('report.generated_date', 'Raport wygenerowany', 'Report generated')}: {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'pl-PL')}</p>
                <p>{t('report.id_label', 'ID Raportu', 'Report ID')}: {profile.uid.substring(0, 8)}-{currentYear}-CSR</p>
              </div>
              <div className="text-center border-t border-slate-200 pt-4 w-48">
                <p className="text-xs font-bold">{t('report.cert_label', 'Certyfikat Aligo CSR', 'Aligo CSR Certificate')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-center">
          <p className="text-xs text-slate-400 italic">{t('report.footer_note', 'Aligo - Łączymy Biznes z Misją. Raport wygenerowany automatycznie.', 'Aligo - Connecting Business with Purpose. Report automatically generated.')}</p>
        </div>
      </div>
    </div>
  );
}
