import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../firebase';
import { Button } from '../components/ui/button';
import { LogIn, Building2, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Auth() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async (role: 'ngo' | 'business') => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // Check if user profile exists
      const userDocRef = doc(db, 'users', user.uid);
      let userDoc;
      try {
        userDoc = await getDoc(userDocRef);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, `users/${user.uid}`);
        return; // handleFirestoreError throws, but just in case
      }

      if (!userDoc.exists()) {
        // Create basic profile
        try {
          await setDoc(userDocRef, {
            uid: user.uid,
            email: user.email,
            role: role,
            profileType: 'basic',
            nip: '',
            organizationName: user.displayName || '',
            createdAt: new Date(),
          });
          navigate('/complete-profile');
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
        }
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      let errorMessage = t('common.error', 'Wystąpił błąd podczas logowania.');
      
      if (err.code === 'auth/network-request-failed') {
        errorMessage = 'Błąd sieci / Network error';
      } else if (err.code === 'auth/popup-blocked') {
        errorMessage = 'Popup blocked';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Popup closed';
      } else {
        try {
          const parsed = JSON.parse(err.message);
          if (parsed.error) {
            errorMessage = `Error: ${parsed.error}`;
          }
        } catch (e) {
          errorMessage = err.message || errorMessage;
        }
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900">
            {t('auth.login_title', 'Dołącz do Aligo')}
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            {t('nav.home')} &bull; Aligo Connect for Good
          </p>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm text-center">
            {error}
          </div>
        )}

        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <Button 
              onClick={() => handleGoogleLogin('ngo')} 
              disabled={loading}
              className="h-16 text-lg bg-blue-600 hover:bg-blue-700"
            >
              <Heart className="mr-3 h-6 w-6" />
              {t('home.for_ngo', 'Jestem NGO')}
            </Button>
            
            <Button 
              onClick={() => handleGoogleLogin('business')} 
              disabled={loading}
              className="h-16 text-lg bg-emerald-600 hover:bg-emerald-700"
            >
              <Building2 className="mr-3 h-6 w-6" />
              {t('home.for_business', 'Jestem Biznesem')}
            </Button>
          </div>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-slate-500">
                Google Auth
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

