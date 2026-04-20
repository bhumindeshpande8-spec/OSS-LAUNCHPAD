import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { isSupabaseConfigured } from "../lib/supabaseClient";
import { getSession, onAuthStateChange, signInWithEmail, signOut, signUpWithEmail } from "../services/authService";
import { getProfile, upsertProfile } from "../services/profileService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (activeUser) => {
    if (!activeUser) {
      setProfile(null);
      return null;
    }

    let nextProfile = await getProfile(activeUser.id);
    if (!nextProfile) {
      nextProfile = await upsertProfile({
        id: activeUser.id,
        full_name: activeUser.user_metadata?.full_name || activeUser.email?.split("@")[0],
        email: activeUser.email,
        avatar_url: activeUser.user_metadata?.avatar_url || null
      });
    }
    setProfile(nextProfile);
    return nextProfile;
  }, []);

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      if (!isSupabaseConfigured) {
        setLoading(false);
        return;
      }

      try {
        const session = await getSession();
        if (!mounted) return;
        setUser(session?.user || null);
        await loadProfile(session?.user || null);
      } catch (error) {
        toast.error(error.message);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    bootstrap();

    if (!isSupabaseConfigured) return () => {};

    const {
      data: { subscription }
    } = onAuthStateChange((_event, session) => {
      const activeUser = session?.user || null;
      setUser(activeUser);
      setLoading(false);

      window.setTimeout(() => {
        if (activeUser) {
          loadProfile(activeUser).catch((error) => toast.error(error.message));
        } else {
          setProfile(null);
        }
      }, 0);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile]);

  const login = useCallback(async (values) => {
    const data = await signInWithEmail(values);
    setUser(data.user);
    return data;
  }, []);

  const signup = useCallback(async (values) => {
    const data = await signUpWithEmail(values);
    return data;
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setUser(null);
    setProfile(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      profile,
      loading,
      isAuthenticated: Boolean(user),
      login,
      signup,
      logout,
      refreshProfile: () => loadProfile(user)
    }),
    [loadProfile, loading, login, logout, profile, signup, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
