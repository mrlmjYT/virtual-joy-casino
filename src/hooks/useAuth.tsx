import { useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, username: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            username
          }
        }
      });

      if (error) throw error;

      toast({
        title: "Registrierung erfolgreich!",
        description: "Sie sind jetzt angemeldet.",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Fehler bei der Registrierung",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      toast({
        title: "Anmeldung erfolgreich!",
        description: "Willkommen zurück!",
      });

      return { error: null };
    } catch (error: any) {
      toast({
        title: "Fehler bei der Anmeldung",
        description: error.message,
        variant: "destructive",
      });
      return { error };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      toast({
        title: "Abmeldung erfolgreich",
        description: "Bis bald!",
      });
    } catch (error: any) {
      toast({
        title: "Fehler bei der Abmeldung",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const signInAsGuest = () => {
    // Guest mode - no actual authentication
    toast({
      title: "Gast-Modus aktiviert",
      description: "⚠️ Hinweis: Dein Fortschritt wird nicht gespeichert!",
    });
    return { error: null };
  };

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInAsGuest,
  };
};
