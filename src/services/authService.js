import { requireSupabase } from "../lib/supabaseClient";

async function withTimeout(promise, message = "Request timed out. Check your internet connection and try again.", ms = 20000) {
  let timerId;
  const timeout = new Promise((_, reject) => {
    timerId = window.setTimeout(() => reject(new Error(message)), ms);
  });

  try {
    return await Promise.race([promise, timeout]);
  } finally {
    window.clearTimeout(timerId);
  }
}

export async function getSession() {
  const { data, error } = await requireSupabase().auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback) {
  return requireSupabase().auth.onAuthStateChange(callback);
}

export async function signInWithEmail({ email, password }) {
  const { data, error } = await withTimeout(requireSupabase().auth.signInWithPassword({ email, password }));
  if (error) throw error;
  return data;
}

export async function signUpWithEmail({ fullName, email, password }) {
  const { data, error } = await withTimeout(
    requireSupabase().auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
  );
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await requireSupabase().auth.signOut();
  if (error) throw error;
}
