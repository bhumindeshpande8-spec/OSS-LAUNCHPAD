import { requireSupabase } from "../lib/supabaseClient";
import { logActivity } from "./activityService";

const noteSelect = "*, project:projects(id, name, slug, difficulty, category)";

export async function getNotes(userId) {
  const { data, error } = await requireSupabase()
    .from("notes")
    .select(noteSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getNotesByProject(userId, projectId) {
  const { data, error } = await requireSupabase()
    .from("notes")
    .select(noteSelect)
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createNote({ userId, values, projectName }) {
  const { data, error } = await requireSupabase()
    .from("notes")
    .insert({ ...values, user_id: userId })
    .select(noteSelect)
    .single();
  if (error) throw error;
  await logActivity({
    userId,
    actionType: "created_note",
    entityType: "note",
    entityId: data.id,
    message: `Added ${data.category.toLowerCase()} note "${data.title}"${projectName ? ` for ${projectName}` : ""}.`
  });
  return data;
}

export async function updateNote({ userId, noteId, values }) {
  const { data, error } = await requireSupabase()
    .from("notes")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", noteId)
    .eq("user_id", userId)
    .select(noteSelect)
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNote({ userId, noteId }) {
  const { error } = await requireSupabase().from("notes").delete().eq("id", noteId).eq("user_id", userId);
  if (error) throw error;
}
