import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { Button } from '../components/ui/button';
import { ArrowLeft, Save, Info, Target, Sparkles } from 'lucide-react';
import { Project } from '../types';

export default function EditProject() {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    assumptions: '',
    effect: '',
    deadline: '',
    status: 'planned',
  });

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'projects', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data() as Project;
          // Ensure only owner can edit
          if (data.ownerId !== user?.uid) {
            navigate('/dashboard');
            return;
          }
          
          // Format date for input type="date"
          let formattedDate = '';
          if (data.deadline) {
            if (typeof data.deadline === 'string') {
              formattedDate = data.deadline.split('T')[0];
            } else if ((data.deadline as any).toDate) {
              formattedDate = (data.deadline as any).toDate().toISOString().split('T')[0];
            }
          }

          setFormData({
            title: data.title || '',
            assumptions: data.assumptions || '',
            effect: data.effect || '',
            deadline: formattedDate,
            status: data.status || 'planned',
          });
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `projects/${id}`);
      } finally {
        setFetching(false);
      }
    };

    if (user) {
      fetchProject();
    }
  }, [id, user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile || !id) return;
    
    setLoading(true);
    try {
      const docRef = doc(db, 'projects', id);
      await updateDoc(docRef, {
        ...formData,
        updatedAt: new Date(),
      });
      navigate('/dashboard');
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `projects/${id}`);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return <div className="max-w-3xl mx-auto px-4 py-12 text-center">Ładowanie...</div>;
  }

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
          <h1 className="text-3xl font-bold mb-2">Edytuj projekt</h1>
          <p className="text-blue-100">Zaktualizuj informacje o swoim projekcie.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Status</label>
                <select 
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl border border-slate-300 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="planned">Planowany</option>
                  <option value="in-progress">W trakcie</option>
                  <option value="completed">Zakończony</option>
                </select>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-100 flex justify-end">
            <Button 
              type="submit" 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 gap-2 px-10 h-12 text-lg rounded-full"
            >
              <Save className="h-5 w-5" /> Zapisz zmiany
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
