import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authService } from '../services/auth/authService';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<User>;
  signInWithApple: () => Promise<User>;
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use the authService's onAuthStateChange with retry logic
    const unsubscribe = authService.onAuthStateChange((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async (): Promise<User> => {
    const user = await authService.signInWithGoogle();
    setUser(user);
    return user;
  };

  const signInWithApple = async (): Promise<User> => {
    const user = await authService.signInWithApple();
    setUser(user);
    return user;
  };

  const signOut = async () => {
    await authService.signOut();
    setUser(null);
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
    }
  };

  const value: AuthContextType = {
    user,
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
