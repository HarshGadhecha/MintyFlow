import authService from '@/services/authService';
import { User } from '@/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signOut: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  completeOnboarding: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Debug: Log state changes
  useEffect(() => {
    console.log('[AuthContext] State changed:', {
      hasUser: !!user,
      userId: user?.uid,
      loading,
    });
  }, [user, loading]);

  useEffect(() => {
    // console.log('[AuthContext] Component mounted, initializing auth listener');

    // Listen to auth state changes
    const unsubscribe = authService.onAuthStateChange(async (user) => {
      console.log('[AuthContext] Auth state changed:', {
        hasUser: !!user,
        userId: user?.uid,
        userEmail: user?.email,
        userName: user?.displayName,
      });

      setUser(user);
      // console.log('[AuthContext] Setting loading to false after auth state change');
      setLoading(false);
    });

    return () => {
      console.log('[AuthContext] Cleaning up auth listener');
      unsubscribe();
    };
  }, []);

  const signInWithGoogle = async () => {
    try {
      // console.log('[AuthContext] signInWithGoogle called, setting loading to true');
      setLoading(true);

      // console.log('[AuthContext] Calling authService.signInWithGoogle()');
      await authService.signInWithGoogle();
      // console.log('[AuthContext] authService.signInWithGoogle() completed');
    } catch (error: any) {
      console.error('[AuthContext] Google Sign-In Error:', error);
      setLoading(false);
      // Only throw error if it's not a user cancellation
      if (error.code !== 'ERR_CANCELED' && error.message !== 'User cancelled') {
        throw error;
      }
    }
    // Note: loading will be set to false by onAuthStateChange on success
  };

  const signInWithApple = async () => {
    try {
      // console.log('[AuthContext] signInWithApple called, setting loading to true');
      setLoading(true);
      // console.log('[AuthContext] Calling authService.signInWithApple()');
      await authService.signInWithApple();
      // console.log('[AuthContext] authService.signInWithApple() completed');
    } catch (error: any) {
      console.error('[AuthContext] Apple Sign-In Error:', error);

      // Handle user cancellation gracefully
      if (error.code === 'ERR_CANCELED' || error.code === 'ERR_REQUEST_CANCELED') {
        console.log('[AuthContext] User cancelled Apple Sign-In');
        setLoading(false);
        // User cancelled - don't throw an error
        return;
      }

      setLoading(false);
      throw error;
    }
    // Note: loading will be set to false by onAuthStateChange on success
  };

  const signOut = async () => {
    try {
      // console.log('[AuthContext] signOut called, setting loading to true');
      setLoading(true);
      // console.log('[AuthContext] Calling authService.signOut()');
      await authService.signOut();
      console.log('[AuthContext] authService.signOut() completed, clearing user state');
      setUser(null);
      console.log('[AuthContext] User state cleared');
    } catch (error) {
      console.error('[AuthContext] Sign Out Error:', error);
      throw error;
    } finally {
      console.log('[AuthContext] signOut finally block, setting loading to false');
      setLoading(false);
    }
  };

  const deleteAccount = async () => {
    try {
      console.log('[AuthContext] deleteAccount called, setting loading to true');
      setLoading(true);

      console.log('[AuthContext] Calling authService.deleteAccount()');
      await authService.deleteAccount();

      console.log('[AuthContext] Account deleted, clearing user state');
      setUser(null);
      console.log('[AuthContext] User state cleared after account deletion');
    } catch (error) {
      console.error('[AuthContext] Delete Account Error:', error);
      throw error;
    } finally {
      console.log('[AuthContext] deleteAccount finally block, setting loading to false');
      setLoading(false);
    }
  };

  const completeOnboarding = async () => {
    try {
      console.log('[AuthContext] completeOnboarding called');
      await authService.completeOnboarding();

      // Update local user state
      if (user) {
        setUser({ ...user, onboardingCompleted: true });
      }
      console.log('[AuthContext] Onboarding completed');
    } catch (error) {
      console.error('[AuthContext] Complete Onboarding Error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithGoogle,
        signInWithApple,
        signOut,
        deleteAccount,
        completeOnboarding,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}


