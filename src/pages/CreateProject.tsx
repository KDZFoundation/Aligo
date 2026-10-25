import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { collection, addDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Button } from '../components/ui/button';
import { ArrowLeft, Save, Info, Target, Sparkles } from 'lucide-react';
import { Project } from '../types';

export default function CreateProject() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    assumptions: '',
    effect: '',
    deadline: '',
    status: 'planned',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    
    setLoading(true);
    try {
      await addDoc(collection(db, 'projects'), {
        ...formData,
        ownerId: user.uid,
        ownerName: profile.organizationName,
        interestedBusinesses: [],
        confirmedBusinesses: [],
        createdAt: new Date(),
      });
      navigate('/dashboard');
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'projects');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/dashboard')}
        className="mb-8 gap-2 text-slate-600"
      >
        <ArrowLeft className="h-4 w-4" /> Powrót do panelu
      </Button>

      <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="bg-blue-600 p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Dodaj nowy projekt</h1>
          <p className="text-blue-100">Zdefiniuj cele i założenia projektu, aby przyciągnąć partnerów biznesowych.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-500" /> Tytuł projektu
              </label>
              <input 
                required
                type="text" 
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="np. Budowa ogrodu społecznego"
                className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Target className="h-4 w-4 text-blue-500" /> Założenia projektu
              </label>
              <textarea 
                required
                name="assumptions"
                value={formData.assumptions}
                onChange={handleChange}
                rows={4}
                placeholder="Opisz główne cele, grupę docelową i planowane działania..."
                className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" /> Planowany efekt
              </label>
              <textarea 
                required
                name="effect"
                value={formData.effect}
                onChange={handleChange}
                rows={3}
                placeholder="Co uda się osiągnąć dzięki realizacji tego projektu?"
                className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Termin realizacji</label>
              <input 
                required
                type="date" 
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 gap-2 px-10 h-12 text-lg rounded-full"
            >
              <Save className="h-5 w-5" /> Opublikuj projekt
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
