import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Building2, Heart, PlusCircle, Settings, AlertCircle, ArrowRight, TrendingUp, Trophy, FileBarChart, MessageSquare, RefreshCw, UserCircle } from 'lucide-react';
import { collection, query, where, onSnapshot, doc, getDoc, updateDoc, arrayUnion, arrayRemove, or, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import OrganizationMarkers from '../components/OrganizationMarkers';
import OrganizationBadges from '../components/OrganizationBadges';
import ISO26000Info from '../components/ISO26000Info';
import CSRImpactChart from '../components/CSRImpactChart';
import { Project, UserProfile } from '../types';
import ProjectCard from '../components/ProjectCard';
import Gamification from '../components/Gamification';
import ContractGenerator from '../components/ContractGenerator';
import Chat from '../components/Chat';
import AnnualReport from '../components/AnnualReport';
import { seedDatabase } from '../seed';
import { calculateBadges } from '../utils/badgeCalculator';

export default function Dashboard() {
  const { user, profile, loading: authLoading, setRole } = useAuth();
  const { t } = useLanguage();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [selectedProjectForContract, setSelectedProjectForContract] = useState<Project | null>(null);
  const [selectedProjectForChat, setSelectedProjectForChat] = useState<Project | null>(null);
  const [showAnnualReport, setShowAnnualReport] = useState(false);
  const [partnerProfile, setPartnerProfile] = useState<UserProfile | null>(null);
  const [interestedProfiles, setInterestedProfiles] = useState<Record<string, UserProfile[]>>({});


  useEffect(() => {
    if (user && profile) {
      seedDatabase(user.uid, profile.organizationName);
    }
  }, [user, profile]);

  useEffect(() => {
    if (!user || !profile) return;

    let unsubscribe: () => void;

    if (profile.role === 'ngo') {
      const q = query(collection(db, 'projects'), where('ownerId', '==', user.uid));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const projectsData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];
        setProjects(projectsData);
        setLoadingProjects(false);
        
        // Fetch interested profiles logic...
        handleInterestedProfiles(projectsData);
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects'));
    } else {
      // For business, we need projects where they are interested OR confirmed.
      // Firestore 'or' with 'array-contains' on different fields might need index.
      // We'll use two listeners and merge.
      const qInterested = query(collection(db, 'projects'), where('interestedBusinesses', 'array-contains', user.uid));
      const qConfirmed = query(collection(db, 'projects'), where('confirmedBusinesses', 'array-contains', user.uid));
      
      let interestedData: Project[] = [];
      let confirmedData: Project[] = [];

      const updateBusinessProjects = () => {
        // Merge and remove duplicates by ID
        const combined = [...interestedData, ...confirmedData];
        const unique = Array.from(new Map(combined.map(p => [p.id, p])).values());
        setProjects(unique);
        setLoadingProjects(false);
      };

      const unsubInterested = onSnapshot(qInterested, (snap) => {
        interestedData = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        updateBusinessProjects();
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects/interested'));

      const unsubConfirmed = onSnapshot(qConfirmed, (snap) => {
        confirmedData = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        updateBusinessProjects();
      }, (err) => handleFirestoreError(err, OperationType.LIST, 'projects/confirmed'));

      unsubscribe = () => {
        unsubInterested();
        unsubConfirmed();
      };
    }

    return () => unsubscribe();
  }, [user, profile]);

  const handleInterestedProfiles = async (projectsData: Project[]) => {
    const newInterestedProfiles: Record<string, UserProfile[]> = {};
    for (const project of projectsData) {
      if (project.interestedBusinesses && project.interestedBusinesses.length > 0) {
        const profiles: UserProfile[] = [];
        for (const bizId of project.interestedBusinesses) {
          const bizDoc = await getDoc(doc(db, 'users', bizId));
          if (bizDoc.exists()) {
            profiles.push(bizDoc.data() as UserProfile);
          }
        }
        newInterestedProfiles[project.id!] = profiles;
      }
    }
    setInterestedProfiles(newInterestedProfiles);
  };

  const handleStatusChange = async (projectId: string, newStatus: 'planned' | 'in-progress' | 'completed') => {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      });

      // If completed, update user stats
      if (newStatus === 'completed' && profile) {
        await updateDoc(doc(db, 'users', user!.uid), {
          completedProjectsCount: (profile.completedProjectsCount || 0) + 1,
          platformProjectsCount: (profile.platformProjectsCount || 0) + 1
        });
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}`);
    }
  };

  const handleConfirmBusiness = async (projectId: string, businessId: string) => {
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        confirmedBusinesses: arrayUnion(businessId),
        interestedBusinesses: arrayRemove(businessId),
        updatedAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${projectId}`);
    }
  };

  const toggleRole = async () => {
    if (!profile) return;
    const newRole = profile.role === 'ngo' ? 'business' : 'ngo';
    try {
      await setRole(newRole);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGenerateContract = async (project: Project) => {
    if (!profile) return;
    
    // In a real app, we'd fetch the actual partner. 
    // For demo, if NGO is generating, we need a business partner. 
    // If Business is generating, we need the NGO owner.
    
    setLoadingProjects(true);
    try {
      let partnerId = '';
      if (profile.role === 'ngo') {
        partnerId = project.confirmedBusinesses?.[0] || project.interestedBusinesses?.[0] || '';
      } else {
        partnerId = project.ownerId;
      }

      if (partnerId) {
        const partnerDoc = await getDoc(doc(db, 'users', partnerId));
        if (partnerDoc.exists()) {
          setPartnerProfile(partnerDoc.data() as UserProfile);
          setSelectedProjectForContract(project);
        } else {
          // Fallback mock partner for demo if no real one found
          setPartnerProfile({
            organizationName: profile.role === 'ngo' ? 'Partner Biznesowy Sp. z o.o.' : 'Fundacja Współpracy',
            city: 'Warszawa',
            street: 'ul. Przykładowa',
            houseNumber: '1',
            postalCode: '00-000',
            nip: '1234567890',
            firstName: 'Jan',
            lastName: 'Kowalski',
            role: profile.role === 'ngo' ? 'business' : 'ngo',
          } as UserProfile);
          setSelectedProjectForContract(project);
        }
      } else {
        alert('Brak potwierdzonego partnera do wygenerowania umowy.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingProjects(false);
    }
  };

  if (authLoading) {
    return <div className="flex justify-center items-center h-64">Ładowanie...</div>;
  }

  if (!user || !profile) {
    return <Navigate to="/auth" />;
  }

  const isProfileIncomplete = !profile.nip || !profile.organizationName;

  const displayProfile = {
    ...profile,
    completedProjectsCount: profile.role === 'ngo' ? projects.filter(p => p.status === 'completed').length : projects.filter(p => p.status === 'completed' && p.confirmedBusinesses?.includes(user.uid)).length,
    ongoingProjectsCount: profile.role === 'ngo' ? projects.filter(p => p.status === 'in-progress').length : projects.filter(p => p.status === 'in-progress' && p.confirmedBusinesses?.includes(user.uid)).length,
    platformProjectsCount: profile.role === 'ngo' ? projects.length : projects.filter(p => p.confirmedBusinesses?.includes(user.uid)).length,
    badges: profile.badges || calculateBadges(profile, projects)
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {selectedProjectForContract && partnerProfile && (
        <ContractGenerator 
          project={selectedProjectForContract}
          ngoProfile={profile.role === 'ngo' ? profile : partnerProfile}
          businessProfile={profile.role === 'business' ? profile : partnerProfile}
          onClose={() => setSelectedProjectForContract(null)}
        />
      )}

      {selectedProjectForChat && (
        <Chat 
          project={selectedProjectForChat}
          onClose={() => setSelectedProjectForChat(null)}
        />
      )}

      {showAnnualReport && (
        <AnnualReport 
          projects={projects}
          profile={profile}
          onClose={() => setShowAnnualReport(false)}
        />
      )}

      {isProfileIncomplete && (
        <div className="mb-8 bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-amber-800">
            <AlertCircle className="h-6 w-6 shrink-0" />
            <p className="font-medium">Twój profil nie jest jeszcze kompletny. Uzupełnij dane, aby w pełni korzystać z platformy.</p>
          </div>
          <Link to="/complete-profile">
            <Button className="bg-amber-600 hover:bg-amber-700 text-white border-none">Uzupełnij profil</Button>
          </Link>
        </div>
      )}

      {profile.role === 'business' && (
        <div className="mb-8">
          <ISO26000Info />
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-4">
            {profile.organizationName || t('nav.profile')}
            <OrganizationMarkers profile={profile} />
            {profile.badges && <OrganizationBadges badges={profile.badges} />}
          </h1>
          <p className="text-slate-600 mt-2 text-lg">
            {t('dashboard.title', 'Panel sterowania')}: <span className="font-semibold text-blue-600 capitalize">{profile.role === 'ngo' ? t('dashboard.ngo_role', 'Organizacja Pozarządowa') : t('dashboard.business_role', 'Biznes')}</span>
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <Button 
            variant="outline" 
            onClick={toggleRole}
            className="gap-2 rounded-full px-6 border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <RefreshCw className="h-4 w-4" />
            Switch Role (Demo)
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowAnnualReport(true)}
            className="gap-2 rounded-full px-6 border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <FileBarChart className="h-4 w-4" />
            {profile.role === 'business' ? t('about_platform.report_gen', 'Raport CSR') : t('about_platform.report_gen', 'Raport Roczny')}
          </Button>
          <Link to="/profile">
            <Button variant="outline" className="gap-2 rounded-full px-6 border-slate-200 text-slate-700 hover:bg-slate-50">
              <UserCircle className="h-4 w-4" />
              {t('nav.profile', 'Mój profil')}
            </Button>
          </Link>
          {profile.role === 'ngo' && (
            <Link to="/create-project">
              <Button className="gap-2 bg-blue-600 hover:bg-blue-700 rounded-full px-6 shadow-lg shadow-blue-600/20">
                <PlusCircle className="h-4 w-4" />
                {t('dashboard.create_new_project', 'Dodaj projekt')}
              </Button>
            </Link>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                {profile.role === 'ngo' ? (
                  <><Heart className="h-6 w-6 text-blue-600" /> {t('dashboard.my_projects', 'Twoje Projekty')}</>
                ) : (
                  <><TrendingUp className="h-6 w-6 text-emerald-600" /> {t('dashboard.interested_projects', 'Projekty, którymi się interesujesz')}</>
                )}
              </h2>
              {profile.role === 'business' && (
                <Link to="/projects">
                  <Button variant="ghost" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 gap-1">
                    {t('nav.projects', 'Przeglądaj bazę')} <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              )}
            </div>

            {loadingProjects ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-48 bg-slate-100 animate-pulse rounded-2xl"></div>
                <div className="h-48 bg-slate-100 animate-pulse rounded-2xl"></div>
              </div>
            ) : projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    isOwner={profile.role === 'ngo'}
                    onGenerateContract={() => handleGenerateContract(project)}
                    onOpenChat={() => setSelectedProjectForChat(project)}
                    onStatusChange={(status) => handleStatusChange(project.id!, status)}
                    onConfirmBusiness={(bizId) => handleConfirmBusiness(project.id!, bizId)}
                    interestedBusinessProfiles={interestedProfiles[project.id!]}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                <p className="text-slate-500 mb-6">
                  {profile.role === 'ngo' 
                    ? 'Nie masz jeszcze żadnych projektów. Dodaj pierwszy, aby zacząć współpracę z biznesem!' 
                    : 'Nie obserwujesz jeszcze żadnych projektów. Przejdź do bazy, aby znaleźć interesujące inicjatywy.'}
                </p>
                {profile.role === 'ngo' ? (
                  <Link to="/create-project">
                    <Button className="bg-blue-600 hover:bg-blue-700 rounded-full px-8">Dodaj pierwszy projekt</Button>
                  </Link>
                ) : (
                  <Link to="/projects">
                    <Button className="bg-emerald-600 hover:bg-emerald-700 rounded-full px-8">Przeglądaj bazę NGO</Button>
                  </Link>
                )}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-2 mb-6">
              <Trophy className="h-6 w-6 text-yellow-500" />
              <h2 className="text-xl font-bold text-slate-900">Twój Status i Grywalizacja</h2>
            </div>
            <Gamification profile={displayProfile as UserProfile} />
          </section>

          {profile.role === 'business' && (
            <section className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="h-6 w-6 text-emerald-500" />
                <h2 className="text-xl font-bold text-slate-900">Wpływ CSR / ESG</h2>
              </div>
              <p className="text-sm text-slate-500 mb-2">Rozkład Twojego zaangażowania w wymiarach społecznej odpowiedzialności:</p>
              <CSRImpactChart projects={projects} />
            </section>
          )}

          <section className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl text-white shadow-xl">
            <h2 className="text-xl font-bold mb-4">Strefa Wiedzy</h2>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Dostęp do poradników, webinarów i kursów {profile.role === 'ngo' ? 'fundraisingu' : 'CSR'}.
            </p>
            <Link to="/about-platform#strefy-wiedzy">
              <Button className="w-full bg-white text-blue-600 hover:bg-blue-50 font-bold rounded-full">
                Otwórz bazę wiedzy
              </Button>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
}
