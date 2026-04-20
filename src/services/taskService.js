import { requireSupabase } from "../lib/supabaseClient";
import { logActivity } from "./activityService";

const taskSelect = "*, project:projects(id, name, slug, difficulty, category)";

export async function getTasks(userId) {
  const { data, error } = await requireSupabase()
    .from("tasks")
    .select(taskSelect)
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getTasksByProject(userId, projectId) {
  const { data, error } = await requireSupabase()
    .from("tasks")
    .select(taskSelect)
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function createTask({ userId, values, projectName }) {
  const { data, error } = await requireSupabase()
    .from("tasks")
    .insert({ ...values, user_id: userId })
    .select(taskSelect)
    .single();
  if (error) throw error;
  await logActivity({
    userId,
    actionType: "created_task",
    entityType: "task",
    entityId: data.id,
    message: `Created task "${data.title}"${projectName ? ` for ${projectName}` : ""}.`
  });
  return data;
}

export async function updateTask({ userId, taskId, values }) {
  const { data, error } = await requireSupabase()
    .from("tasks")
    .update({ ...values, updated_at: new Date().toISOString() })
    .eq("id", taskId)
    .eq("user_id", userId)
    .select(taskSelect)
    .single();
  if (error) throw error;
  if (values.status === "Done") {
    await logActivity({
      userId,
      actionType: "completed_task",
      entityType: "task",
      entityId: taskId,
      message: `Completed task "${data.title}".`
    });
  }
  return data;
}

export async function deleteTask({ userId, taskId }) {
  const { error } = await requireSupabase().from("tasks").delete().eq("id", taskId).eq("user_id", userId);
  if (error) throw error;
}
