"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Loader2 } from "lucide-react"; // We installed this in the last step

// Define the context shape
interface AuthContextType {
  user: User | null;
  loading: boolean;
}

//
// THE FIX IS HERE: Add "export" before const AuthContext
//
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // This listener fires when the user's auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Cleanup the listener on component unmount
    return () => unsubscribe();
  }, []);

  const value = {
    user,
    loading,
  };

  // We show a simple loading state here.
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}