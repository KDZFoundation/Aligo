import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { User, Building2, MapPin, Phone, Mail, Award, ArrowLeft, Settings, ShieldCheck, Calendar } from 'lucide-react';
import BadgeDetailCard from '../components/BadgeDetailCard';
import { calculateBadges } from '../utils/badgeCalculator';
import { Project } from '../types';
import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';

export default function Profile() {
  const { user, profile, loading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    if (!user || !profile) return;

    const q = profile.role === 'ngo' 
      ? query(collection(db, 'projects'), where('ownerId', '==', user.uid))
      : query(collection(db, 'projects'), where('interestedBusinesses', 'array-contains', user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const projectsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Project[];
      setProjects(projectsData);
    }, (err) => {
      handleFirestoreError(err, OperationType.LIST, 'projects');
    });

    return () => unsubscribe();
  }, [user, profile]);

  if (authLoading) {
    return <div className="flex justify-center items-center h-screen">Ładowanie...</div>;
  }

  if (!user || !profile) {
    return <Navigate to="/auth" />;
  }

  const badges = profile.badges || calculateBadges(profile, projects);

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="mb-8 flex items-center justify-between">
        <Link to="/dashboard">
          <Button variant="ghost" className="gap-2 text-slate-600 hover:text-blue-600">
            <ArrowLeft className="h-4 w-4" /> Powrót do panelu
          </Button>
        </Link>
        <Link to="/complete-profile">
          <Button variant="outline" className="gap-2 rounded-full border-slate-200">
            <Settings className="h-4 w-4" /> Edytuj profil
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Basic Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-full flex items-center justify-center mb-4 border-4 border-white shadow-md">
                <User className="h-12 w-12 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900">{profile.organizationName}</h1>
              <p className="text-blue-600 font-semibold text-sm uppercase tracking-wider mt-1">
                {profile.role === 'ngo' ? 'Organizacja Pozarządowa' : 'Partner Biznesowy'}
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 text-slate-600">
                <ShieldCheck className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">NIP</p>
                  <p className="font-medium">{profile.nip}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-slate-600">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Adres</p>
                  <p className="font-medium">{profile.street} {profile.houseNumber}</p>
                  <p className="font-medium">{profile.postalCode} {profile.city}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-slate-600">
                <Phone className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Telefon</p>
                  <p className="font-medium">{profile.phone}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-slate-600">
                <Mail className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">E-mail</p>
                  <p className="font-medium">{profile.email || user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-slate-600">
                <Calendar className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">
                    {profile.role === 'ngo' ? 'Data założenia' : 'Działalność CSR od'}
                  </p>
                  <p className="font-medium">{profile.foundationDate || profile.socialActivityStartDate || 'Brak danych'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-600/20">
            <h3 className="text-lg font-bold mb-2">Wiarygodność</h3>
            <p className="text-blue-100 text-sm mb-6">Twój profil jest zweryfikowany i widoczny dla potencjalnych partnerów.</p>
            <div className="flex items-center gap-2 bg-white/10 p-3 rounded-2xl">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              <span className="font-bold">Status: Zweryfikowany</span>
            </div>
          </div>
        </div>

        {/* Right Column: Badges Breakdown */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-yellow-100 p-2 rounded-xl">
                <Award className="h-6 w-6 text-yellow-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Odznaki i Medale</h2>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {badges.length > 0 ? (
                badges.map((badge) => (
                  <BadgeDetailCard key={badge.id} badge={badge} />
                ))
              ) : (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl p-12 text-center">
                  <Award className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <p className="text-slate-500 font-medium">Nie posiadasz jeszcze żadnych odznak.</p>
                  <p className="text-slate-400 text-sm mt-1">Realizuj projekty i angażuj się w społeczność, aby zdobywać medale!</p>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Jak zdobywać odznaki?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-bold text-blue-600">Dla NGO</h4>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                    Angażuj wielu partnerów biznesowych w jeden projekt.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                    Buduj stałe relacje oparte na zaufaniu.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></span>
                    Raportuj efekty swoich działań terminowo.
                  </li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-emerald-600">Dla Biznesu</h4>
                <ul className="text-sm text-slate-600 space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    Wspieraj projekty finansowo i merytorycznie.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    Wdrażaj wolontariat pracowniczy w swojej firmie.
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0"></span>
                    Korzystaj z mechanizmu payroll giving.
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
