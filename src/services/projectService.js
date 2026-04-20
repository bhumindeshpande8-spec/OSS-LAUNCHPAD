import { requireSupabase } from "../lib/supabaseClient";

export async function getProjects() {
  const { data, error } = await requireSupabase()
    .from("projects")
    .select("*")
    .order("beginner_friendly", { ascending: false })
    .order("name", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function getProjectBySlug(slug) {
  const { data, error } = await requireSupabase().from("projects").select("*").eq("slug", slug).single();
  if (error) throw error;
  return data;
}
