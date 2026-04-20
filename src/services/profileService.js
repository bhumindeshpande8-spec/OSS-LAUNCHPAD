import { requireSupabase } from "../lib/supabaseClient";

export async function getProfile(userId) {
  if (!userId) return null;
  const { data, error } = await requireSupabase().from("profiles").select("*").eq("id", userId).maybeSingle();
  if (error) throw error;
  return data;
}

export async function upsertProfile(profile) {
  const { data, error } = await requireSupabase().from("profiles").upsert(profile).select("*").single();
  if (error) throw error;
  return data;
}
