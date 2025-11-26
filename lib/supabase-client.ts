'use client';
import { createClient } from '@supabase/supabase-js';
import { useState, useEffect, createContext, useContext } from 'react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthContext = createContext<any>(null);

export function SupabaseProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const session = supabase.auth.getSession().then(({ data }) => setUser(data?.session?.user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ supabase, user }}>{children}</AuthContext.Provider>;
}

export function useSupabase() {
  return useContext(AuthContext);
}

export default supabase;