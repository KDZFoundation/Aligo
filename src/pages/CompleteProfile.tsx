import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Button } from '../components/ui/button';
import { CheckCircle2, Building2, Heart, Search, ArrowRight, ArrowLeft, Save } from 'lucide-react';
import { UserProfile } from '../types';

export default function CompleteProfile() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    nip: '',
    organizationName: '',
    street: '',
    houseNumber: '',
    postalCode: '',
    city: '',
    county: '',
    voivodeship: '',
    firstName: '',
    lastName: '',
    phone: '',
    completedProjectsCount: 0,
    ongoingProjectsCount: 0,
    platformProjectsCount: 0,
    foundationDate: '',
    socialActivityStartDate: '',
    industry: [],
    communicatorConsent: false,
  });

  useEffect(() => {
    if (profile && profile.nip) {
      // If profile is already complete, maybe redirect?
      // For now let's allow editing if they just landed here
    }
  }, [profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleIndustryChange = (industry: string) => {
    setFormData(prev => {
      const current = prev.industry || [];
      if (current.includes(industry)) {
        return { ...prev, industry: current.filter(i => i !== industry) };
      } else {
        return { ...prev, industry: [...current, industry] };
      }
    });
  };

  const mockFetchGus = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        organizationName: profile?.role === 'ngo' ? 'Fundacja Pomocy Społecznej' : 'Przedsiębiorstwo Handlowe Sp. z o.o.',
        street: 'ul. Marszałkowska',
        houseNumber: '10/12',
        postalCode: '00-001',
        city: 'Warszawa',
        county: 'Warszawa',
        voivodeship: 'Mazowieckie',
      }));
      setLoading(false);
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        ...formData,
        profileType: step === 2 ? 'extended' : 'basic',
        updatedAt: new Date(),
      });
      navigate('/dashboard');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${user.uid}`);
    } finally {
      setLoading(false);
    }
  };

  if (!user || !profile) return <div className="p-24 text-center">Ładowanie...</div>;

  const isNgo = profile.role === 'ngo';

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Uzupełnij swój profil</h1>
        <p className="text-slate-600">Aby w pełni korzystać z platformy Aligo, potrzebujemy kilku informacji o Twojej działalności.</p>
        
        {/* Progress Bar */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 1 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>1</div>
            <span className="font-medium">Dane podstawowe</span>
          </div>
          <div className="w-12 h-0.5 bg-slate-200"></div>
          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-slate-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold border-2 ${step >= 2 ? 'border-blue-600 bg-blue-50' : 'border-slate-300'}`}>2</div>
            <span className="font-medium">Dane rozszerzone</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        {step === 1 && (
          <div className="p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-2xl border border-blue-100">
              {isNgo ? <Heart className="h-8 w-8 text-blue-600" /> : <Building2 className="h-8 w-8 text-blue-600" />}
              <div>
                <h3 className="font-bold text-slate-900">Profil: {isNgo ? 'Organizacja Pozarządowa (NGO)' : 'Biznes'}</h3>
                <p className="text-sm text-slate-600">Wypełniasz dane dla podmiotu typu {isNgo ? 'non-profit' : 'komercyjnego'}.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Numer NIP</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    name="nip"
                    value={formData.nip}
                    onChange={handleChange}
                    placeholder="Wpisz NIP"
                    className="flex-grow p-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  <Button 
                    type="button" 
                    onClick={mockFetchGus}
                    disabled={loading || !formData.nip}
                    variant="outline"
                    className="gap-2 border-blue-200 text-blue-600 hover:bg-blue-50"
                  >
                    <Search className="h-4 w-4" /> Pobierz z {isNgo ? 'GUS/KRS' : 'GUS'}
                  </Button>
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-2">Pełna nazwa organizacji</label>
                <input 
                  type="text" 
                  name="organizationName"
                  value={formData.organizationName}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Ulica</label>
                <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Numer budynku/lokalu</label>
                <input type="text" name="houseNumber" value={formData.houseNumber} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Kod pocztowy</label>
                <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Miejscowość</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Powiat</label>
                <input type="text" name="county" value={formData.county} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Województwo</label>
                <input type="text" name="voivodeship" value={formData.voivodeship} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>

              <div className="md:col-span-2 pt-4 border-t border-slate-100">
                <h4 className="font-bold text-slate-900 mb-4 text-lg">Osoba do kontaktu</h4>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Imię</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Nazwisko</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Telefon</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">E-mail kontaktowy</label>
                <input type="email" name="email" value={formData.email || user.email || ''} onChange={handleChange} className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>

            <div className="flex justify-between pt-8">
              <Button variant="ghost" onClick={() => navigate('/')}>Anuluj</Button>
              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSubmit} disabled={loading}>Zapisz i zakończ później</Button>
                <Button onClick={() => setStep(2)} className="bg-blue-600 hover:bg-blue-700 gap-2">
                  Dalej <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="p-8 md:p-12 space-y-8">
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              <div>
                <h3 className="font-bold text-slate-900">Dane rozszerzone (Znaczniki)</h3>
                <p className="text-sm text-slate-600">Te informacje pozwolą nam przyznać Ci odpowiednie znaczniki wiarygodności.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2 text-center">Zrealizowane projekty społeczne</label>
                <input 
                  type="number" 
                  name="completedProjectsCount"
                  value={formData.completedProjectsCount}
                  onChange={handleChange}
                  className="w-full p-3 text-center text-2xl font-bold rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2 text-center">Projekty w trakcie realizacji</label>
                <input 
                  type="number" 
                  name="ongoingProjectsCount"
                  value={formData.ongoingProjectsCount}
                  onChange={handleChange}
                  className="w-full p-3 text-center text-2xl font-bold rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label className="block text-sm font-bold text-slate-700 mb-2 text-center">Projekty przez Aligo</label>
                <input 
                  type="number" 
                  name="platformProjectsCount"
                  value={formData.platformProjectsCount}
                  onChange={handleChange}
                  className="w-full p-3 text-center text-2xl font-bold rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  {isNgo ? 'Data powstania organizacji' : 'Data rozpoczęcia działań społecznych (CSR)'}
                </label>
                <input 
                  type="date" 
                  name={isNgo ? 'foundationDate' : 'socialActivityStartDate'}
                  value={isNgo ? formData.foundationDate : formData.socialActivityStartDate}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Branża (można wybrać kilka)</label>
                <div className="flex flex-wrap gap-2">
                  {['Edukacja', 'Ekologia', 'Zdrowie', 'Kultura', 'Sport', 'Pomoc społeczna', 'Technologia'].map(ind => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => handleIndustryChange(ind)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        formData.industry?.includes(ind) 
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input 
                    type="checkbox" 
                    name="communicatorConsent"
                    checked={formData.communicatorConsent}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${formData.communicatorConsent ? 'bg-blue-600' : 'bg-slate-300'}`}></div>
                  <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.communicatorConsent ? 'translate-x-6' : ''}`}></div>
                </div>
                <span className="text-slate-700 font-medium">Wyrażam zgodę na korzystanie z komunikatora wewnątrz platformy</span>
              </label>
            </div>

            <div className="flex justify-between pt-8">
              <Button variant="ghost" onClick={() => setStep(1)} className="gap-2">
                <ArrowLeft className="h-4 w-4" /> Powrót
              </Button>
              <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700 gap-2 px-10 h-12 text-lg rounded-full">
                <Save className="h-5 w-5" /> Zapisz i zakończ
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
