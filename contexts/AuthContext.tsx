import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User as FirebaseUser } from 'firebase/auth';
import { authService } from '../services/auth/authService';
import { User } from '../types';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';

interface AuthContextType {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  signInWithGoogle: (idToken: string) => Promise<User>;
  signInWithApple: (identityToken: string, nonce: string) => Promise<User>;
  signOut: () => Promise<void>;
  hasCompletedOnboarding: () => Promise<boolean>;
  completeOnboarding: () => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChange(async (fbUser) => {
      setFirebaseUser(fbUser);

      if (fbUser) {
        try {
          const userRef = ref(database, `users/${fbUser.uid}`);
          const snapshot = await get(userRef);
          if (snapshot.exists()) {
            setUser(snapshot.val() as User);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (idToken: string): Promise<User> => {
    const user = await authService.signInWithGoogle(idToken);
    setUser(user);
    return user;
  };

  const signInWithApple = async (identityToken: string, nonce: string): Promise<User> => {
    const user = await authService.signInWithApple(identityToken, nonce);
    setUser(user);
    return user;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
    setFirebaseUser(null);
  };

  const hasCompletedOnboarding = async (): Promise<boolean> => {
    return await authService.hasCompletedOnboarding();
  };

  const completeOnboarding = async () => {
    if (user) {
      await authService.completeOnboarding(user.uid);
      setUser({ ...user, onboardingCompleted: true });
    }
  };

  const deleteAccount = async () => {
    if (user) {
      await authService.deleteAccount(user.uid);
      setUser(null);
      setFirebaseUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    firebaseUser,
    loading,
    signInWithGoogle,
    signInWithApple,
    signOut,
    hasCompletedOnboarding,
    completeOnboarding,
    deleteAccount,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
