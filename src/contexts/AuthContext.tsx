import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc, setDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { UserProfile } from '../types';

interface AuthContextType {
  user: { uid: string; email: string } | null;
  profile: UserProfile | null;
  loading: boolean;
  setRole: (role: 'ngo' | 'business') => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  setRole: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Demo User ID - constant for the session
const DEMO_USER_ID = 'demo-user-123';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<{ uid: string; email: string } | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate login with a demo user
    const demoUser = { uid: DEMO_USER_ID, email: 'demo@aligo.pl' };
    setUser(demoUser);

    // Listen to profile changes in Firestore
    const userDocRef = doc(db, 'users', DEMO_USER_ID);
    
    const unsubscribe = onSnapshot(userDocRef, async (docSnap) => {
      try {
        if (docSnap.exists()) {
          setProfile(docSnap.data() as UserProfile);
          setLoading(false);
        } else {
          // Create initial demo profile if it doesn't exist
          const initialProfile: UserProfile = {
            uid: DEMO_USER_ID,
            email: demoUser.email,
            role: 'ngo',
            profileType: 'basic',
            nip: '1234567890',
            organizationName: 'Demo NGO',
            firstName: 'Demo',
            lastName: 'User',
            phone: '123456789',
            street: 'Testowa',
            houseNumber: '1',
            postalCode: '00-000',
            city: 'Warszawa',
            county: 'Warszawski',
            voivodeship: 'Mazowieckie',
            createdAt: serverTimestamp(),
            completedProjectsCount: 0,
            platformProjectsCount: 0
          };
          await setDoc(userDocRef, initialProfile as any);
          setProfile(initialProfile);
          setLoading(false);
        }
      } catch (err) {
        // We'll use a local mock for handleFirestoreError if not imported, or just log
        console.error('Auth Profile Snapshot Error:', err);
      }
    }, (error) => {
      console.error('Firestore Snapshot Listener Error (Users):', error);
    });

    return () => unsubscribe();
  }, []);

  const setRole = async (role: 'ngo' | 'business') => {
    if (!DEMO_USER_ID) return;
    const userDocRef = doc(db, 'users', DEMO_USER_ID);
    await setDoc(userDocRef, { 
      role,
      organizationName: role === 'ngo' ? 'Demo NGO' : 'Demo Business'
    }, { merge: true });
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, setRole }}>
      {children}
    </AuthContext.Provider>
  );
};

