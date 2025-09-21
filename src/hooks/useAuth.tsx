import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  sendEmailVerification,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

export type UserRole = 'patient' | 'health_worker';

export interface UserData {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  emailVerified: boolean;
  createdAt: string;
  profileComplete: boolean;
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<User>;
  signInWithGoogle: (role: UserRole) => Promise<User>;
  logout: () => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (user) {
          setUser(user);
          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data() as UserData);
          }
        } else {
          setUser(null);
          setUserData(null);
        }
      } catch (error) {
        console.error('Error in auth state change:', error);
      }
      
      // Only set loading to false on initial load
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Skip email verification for now to avoid complications
      toast({
        title: "Sign in successful",
        description: "Welcome back!",
      });
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      let errorMessage = "An error occurred during sign in.";
      
      switch (firebaseError.code) {
        case 'auth/user-not-found':
          errorMessage = "No account found with this email.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Incorrect password.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/too-many-requests':
          errorMessage = "Too many failed attempts. Please try again later.";
          break;
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, displayName: string, role: UserRole) => {
    try {
      setLoading(true);
      
      // Step 1: Create user account (most reliable Firebase operation)
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Step 2: Update user profile (simple and fast)
      await updateProfile(result.user, { displayName });
      
      // Step 3: Create basic user document (simplified)
      try {
        const userData: UserData = {
          uid: result.user.uid,
          email: result.user.email!,
          displayName,
          role,
          emailVerified: result.user.emailVerified,
          createdAt: new Date().toISOString(),
          profileComplete: false,
        };
        
        await setDoc(doc(db, 'users', result.user.uid), userData);
      } catch (firestoreError) {
        // Don't fail registration if Firestore fails
        console.warn('Firestore save failed, but user account created:', firestoreError);
      }
      
      // Step 4: Show success message
      toast({
        title: "Account created successfully",
        description: "You can now sign in with your credentials.",
      });
      
      // Step 5: Sign out for security (but don't wait for it)
      signOut(auth).catch(console.warn);
      
      return result.user;
    } catch (error: unknown) {
      const firebaseError = error as { code?: string };
      let errorMessage = "An error occurred during sign up.";
      
      switch (firebaseError.code) {
        case 'auth/email-already-in-use':
          errorMessage = "An account with this email already exists.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Invalid email address.";
          break;
        case 'auth/weak-password':
          errorMessage = "Password should be at least 6 characters.";
          break;
      }
      
      toast({
        title: "Sign up failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async (role: UserRole) => {
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      
      // Check if user document exists
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      
      if (!userDoc.exists()) {
        // Create user document for new Google users
        const userData: UserData = {
          uid: result.user.uid,
          email: result.user.email!,
          displayName: result.user.displayName || result.user.email!,
          role,
          emailVerified: result.user.emailVerified,
          createdAt: new Date().toISOString(),
          profileComplete: false,
        };
        
        await setDoc(doc(db, 'users', result.user.uid), userData);
      }
      
      toast({
        title: "Sign in successful",
        description: "Welcome!",
      });
      
      return result.user;
    } catch (error: unknown) {
      toast({
        title: "Google sign in failed",
        description: "An error occurred during Google sign in.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Signed out",
        description: "You have been signed out successfully.",
      });
    } catch (error) {
      toast({
        title: "Sign out failed",
        description: "An error occurred during sign out.",
        variant: "destructive",
      });
    }
  };

  const sendVerificationEmail = async () => {
    if (user) {
      try {
        await sendEmailVerification(user);
        toast({
          title: "Verification email sent",
          description: "Please check your email inbox.",
        });
      } catch (error) {
        toast({
          title: "Failed to send verification email",
          description: "Please try again later.",
          variant: "destructive",
        });
      }
    }
  };

  const value = {
    user,
    userData,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    logout,
    sendVerificationEmail,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
