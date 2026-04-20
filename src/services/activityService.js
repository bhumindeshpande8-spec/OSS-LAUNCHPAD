import { requireSupabase } from "../lib/supabaseClient";

export async function logActivity({ userId, actionType, entityType, entityId = null, message }) {
  if (!userId) return null;
  const { data, error } = await requireSupabase()
    .from("activity_logs")
    .insert({
      user_id: userId,
      action_type: actionType,
      entity_type: entityType,
      entity_id: entityId,
      message
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function getRecentActivity(userId, limit = 8) {
  const { data, error } = await requireSupabase()
    .from("activity_logs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data || [];
}
