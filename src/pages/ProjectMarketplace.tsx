import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Project } from '../types';
import ProjectCard from '../components/ProjectCard';
import { Search, Filter, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

export default function ProjectMarketplace() {
  const { user, profile } = useAuth();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      // Businesses can see all planned and in-progress projects
      const q = query(
        collection(db, 'projects'), 
        where('status', 'in', ['planned', 'in-progress'])
      );
      const querySnapshot = await getDocs(q);
      const projectsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, 'projects');
    } finally {
      setLoading(false);
    }
  };

  const handleInterest = async (projectId: string) => {
    if (!user || !profile) return;
    try {
      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        interestedBusinesses: arrayUnion(user.uid)
      });
      // Update local state uniquely
      setProjects(prev => prev.map(p => 
        p.id === projectId 
          ? { ...p, interestedBusinesses: Array.from(new Set([...(p.interestedBusinesses || []), user.uid])) } 
          : p
      ));
      alert(t('projects.interest_registered', 'Zgłoszono zainteresowanie projektem!'));
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}`);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">{t('projects.title', 'Baza projektów NGO')}</h1>
        <p className="text-lg text-slate-600">{t('projects.subtitle', 'Przeglądaj inicjatywy organizacji pozarządowych i znajdź partnerów do realizacji celów CSR Twojej firmy.')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
          <input 
            type="text" 
            placeholder={t('projects.search_placeholder', 'Szukaj po tytule lub nazwie organizacji...')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>
        <Button variant="outline" className="gap-2 h-12 px-6 rounded-2xl border-slate-200">
          <Filter className="h-5 w-5" /> {t('common.details', 'Filtry')}
        </Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-64 bg-slate-100 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <ProjectCard 
              key={project.id} 
              project={project}
              actionLabel={project.interestedBusinesses?.includes(user?.uid || '') ? t('projects.interest_registered', 'Zgłoszono zainteresowanie') : t('projects.express_interest', 'Jestem zainteresowany')}
              onAction={() => {
                if (!project.interestedBusinesses?.includes(user?.uid || '')) {
                  handleInterest(project.id!);
                }
              }}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-slate-50 rounded-3xl border border-dashed border-slate-300">
          <AlertCircle className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-2">{t('common.error', 'Nie znaleziono projektów')}</h3>
          <p className="text-slate-500">{t('dashboard.no_projects', 'Spróbuj zmienić kryteria wyszukiwania lub wróć później.')}</p>
        </div>
      )}
    </div>
  );
}

