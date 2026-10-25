import React from 'react';
import { Project, UserProfile } from '../types';
import { Button } from './ui/button';
import { FileText, Download, Printer, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ContractGeneratorProps {
  project: Project;
  ngoProfile: UserProfile;
  businessProfile: UserProfile;
  onClose: () => void;
}

export default function ContractGenerator({ project, ngoProfile, businessProfile, onClose }: ContractGeneratorProps) {
  const { t, language } = useLanguage();
  const dateLocale = language === 'en' ? 'en-US' : 'pl-PL';
  const today = new Date().toLocaleDateString(dateLocale);

  const title = (language === 'en' && project.titleEn) ? project.titleEn : project.title;
  const assumptions = (language === 'en' && project.assumptionsEn) ? project.assumptionsEn : project.assumptions;
  const effect = (language === 'en' && project.effectEn) ? project.effectEn : project.effect;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-xl text-white">
              <FileText className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{t('contract.modal_title', 'Generator Umowy Współpracy', 'Partnership Agreement Generator')}</h2>
              <p className="text-sm text-slate-500">{t('contract.project_label', 'Projekt', 'Project')}: {title}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="h-4 w-4" /> {t('contract.print_btn', 'Drukuj / PDF', 'Print / PDF')}
            </Button>
            <Button variant="ghost" onClick={onClose} className="p-2 h-auto">
              <X className="h-6 w-6 text-slate-400" />
            </Button>
          </div>
        </div>

        {/* Contract Content */}
        <div className="flex-grow overflow-y-auto p-12 bg-white print:p-0" id="contract-content">
          <div className="max-w-[210mm] mx-auto text-slate-900 font-serif leading-relaxed space-y-8">
            <div className="text-right mb-12">
              <p>{t('contract.location', 'Miejscowość', 'Location')}: {ngoProfile.city || 'Warszawa'}, {t('contract.date', 'Data', 'Date')}: {today}</p>
            </div>

            <div className="text-center mb-12">
              <h1 className="text-2xl font-bold uppercase underline">{t('contract.doc_title', 'Umowa o Współpracę Partnerską', 'Partnership Cooperation Agreement')}</h1>
              <p className="mt-2 text-sm text-slate-500 font-sans">{t('contract.doc_subtitle', '(wygenerowana za pośrednictwem platformy Aligo)', '(generated via Aligo platform)')}</p>
            </div>

            <div className="space-y-6">
              <p>{t('contract.parties_intro', 'Zawarta pomiędzy:', 'Concluded between:')}</p>
              
              <div className="grid grid-cols-2 gap-12">
                <div>
                  <h3 className="font-bold border-b border-slate-200 pb-2 mb-3">{t('contract.party_ngo', 'Zleceniobiorca (NGO):', 'Contractor (NGO):')}</h3>
                  <p className="font-bold">{ngoProfile.organizationName}</p>
                  <p>{ngoProfile.street} {ngoProfile.houseNumber}</p>
                  <p>{ngoProfile.postalCode} {ngoProfile.city}</p>
                  <p>{t('profile.nip', 'NIP')}: {ngoProfile.nip}</p>
                  <p>{t('contract.rep_by', 'Reprezentowany przez', 'Represented by')}: {ngoProfile.firstName} {ngoProfile.lastName}</p>
                </div>
                <div>
                  <h3 className="font-bold border-b border-slate-200 pb-2 mb-3">{t('contract.party_biz', 'Zleceniodawca (Biznes):', 'Client (Business):')}</h3>
                  <p className="font-bold">{businessProfile.organizationName}</p>
                  <p>{businessProfile.street} {businessProfile.houseNumber}</p>
                  <p>{businessProfile.postalCode} {businessProfile.city}</p>
                  <p>{t('profile.nip', 'NIP')}: {businessProfile.nip}</p>
                  <p>{t('contract.rep_by', 'Reprezentowany przez', 'Represented by')}: {businessProfile.firstName} {businessProfile.lastName}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-center">{t('contract.sec1_title', '§ 1. Przedmiot Umowy', '§ 1. Subject of the Agreement')}</h3>
              <p>{t('contract.sec1_p1', `Przedmiotem niniejszej umowy jest realizacja projektu pt. "${title}", którego szczegółowe założenia zostały określone w załączniku do niniejszej umowy oraz na platformie Aligo.`, `The subject of this agreement is the execution of the project titled "${title}", whose detailed objectives have been specified in the appendix to this agreement and on the Aligo platform.`)}</p>
              <p><strong>{t('contract.main_goals', 'Główne założenia projektu', 'Main project assumptions')}:</strong> {assumptions}</p>
              <p><strong>{t('contract.expected_effect', 'Planowany efekt', 'Expected impact')}:</strong> {effect}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-center">{t('contract.sec2_title', '§ 2. Zobowiązania Stron', '§ 2. Obligations of the Parties')}</h3>
              <p>1. {t('contract.sec2_p1', `Zleceniobiorca zobowiązuje się do należytej realizacji projektu zgodnie z harmonogramem i terminem końcowym ustalonym na dzień: ${new Date(project.deadline).toLocaleDateString(dateLocale)}.`, `The Contractor agrees to execute the project duly in accordance with the schedule and final deadline set for: ${new Date(project.deadline).toLocaleDateString(dateLocale)}.`)}</p>
              <p>2. {t('contract.sec2_p2', 'Zleceniodawca zobowiązuje się do wsparcia projektu w formie ustalonej pomiędzy stronami za pośrednictwem platformy Aligo.', 'The Client agrees to support the project in the form agreed between parties via the Aligo platform.')}</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-center">{t('contract.sec3_title', '§ 3. Postanowienia Końcowe', '§ 3. Final Provisions')}</h3>
              <p>1. {t('contract.sec3_p1', 'Wszelkie zmiany niniejszej umowy wymagają formy pisemnej pod rygorem nieważności.', 'Any amendments to this agreement must be in written form under penalty of invalidity.')}</p>
              <p>2. {t('contract.sec3_p2', 'W sprawach nieuregulowanych niniejszą umową mają zastosowanie przepisy Kodeksu Cywilnego.', 'In matters not regulated by this agreement, relevant civil code provisions shall apply.')}</p>
              <p>3. {t('contract.sec3_p3', 'Umowę sporządzono w dwóch jednobrzmiących egzemplarzach, po jednym dla każdej ze stron.', 'This agreement has been prepared in two identical copies, one for each party.')}</p>
            </div>

            <div className="grid grid-cols-2 gap-12 pt-24">
              <div className="text-center border-t border-slate-400 pt-4">
                <p className="text-sm font-bold">{t('contract.sig_ngo', 'Podpis Zleceniobiorcy', 'Contractor Signature')}</p>
              </div>
              <div className="text-center border-t border-slate-400 pt-4">
                <p className="text-sm font-bold">{t('contract.sig_biz', 'Podpis Zleceniodawcy', 'Client Signature')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-3xl flex justify-center">
          <p className="text-xs text-slate-400 italic">{t('contract.generated_note', 'Dokument wygenerowany automatycznie przez system Aligo - Fundacja D-ARKA', 'Document automatically generated by the Aligo system - D-ARKA Foundation')}</p>
        </div>
      </div>
    </div>
  );
}
