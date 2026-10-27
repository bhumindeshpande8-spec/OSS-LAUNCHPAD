import { requireSupabase } from "../lib/supabaseClient";
import { isUniqueViolation } from "../lib/helpers";
import { logActivity } from "./activityService";

const savedSelect = "*, project:projects(*)";

export async function getSavedProjects(userId) {
  const { data, error } = await requireSupabase()
    .from("saved_projects")
    .select(savedSelect)
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

export async function getSavedProject(userId, projectId) {
  const { data, error } = await requireSupabase()
    .from("saved_projects")
    .select(savedSelect)
    .eq("user_id", userId)
    .eq("project_id", projectId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function saveProject({ userId, project }) {
  const { data, error } = await requireSupabase()
    .from("saved_projects")
    .insert({ user_id: userId, project_id: project.id })
    .select(savedSelect)
    .single();
  if (isUniqueViolation(error)) throw new Error(`${project.name} is already in your workspace.`);
  if (error) throw error;
  await logActivity({
    userId,
    actionType: "saved_project",
    entityType: "project",
    entityId: project.id,
    message: `Saved ${project.name} to your contribution workspace.`
  });
  return data;
}

export async function removeSavedProject({ userId, savedProjectId, projectName }) {
  const { error } = await requireSupabase()
    .from("saved_projects")
    .delete()
    .eq("id", savedProjectId)
    .eq("user_id", userId);
  if (error) throw error;
  await logActivity({
    userId,
    actionType: "removed_saved_project",
    entityType: "saved_project",
    entityId: savedProjectId,
    message: `Removed ${projectName} from saved projects.`
  });
}

export async function updateProgressStage({ userId, savedProjectId, stage, projectName }) {
  const { data, error } = await requireSupabase()
    .from("saved_projects")
    .update({ progress_stage: stage, updated_at: new Date().toISOString() })
    .eq("id", savedProjectId)
    .eq("user_id", userId)
    .select(savedSelect)
    .single();
  if (error) throw error;
  await logActivity({
    userId,
    actionType: "updated_stage",
    entityType: "saved_project",
    entityId: savedProjectId,
    message: `Moved ${projectName} to ${stage}.`
  });
  return data;
}
