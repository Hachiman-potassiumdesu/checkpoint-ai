"use client";

import { signInWithPopup, signOut, type User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";
import { auth, githubProvider, googleProvider } from "@/lib/firebase";

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  logOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const user = auth.currentUser;
      setUser(user);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
    setUser(auth.currentUser);
    setIsLoading(false);
  };

  const signInWithGithub = async () => {
    await signInWithPopup(auth, githubProvider);
    setUser(auth.currentUser);
    setIsLoading(false);
  };

  const logOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, signInWithGoogle, signInWithGithub, logOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
