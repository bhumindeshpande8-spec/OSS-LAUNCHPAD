import { PROGRESS_STAGES } from "../constants/statuses";
import { requireSupabase } from "../lib/supabaseClient";
import { isUniqueViolation } from "../lib/helpers";
import { logActivity } from "./activityService";
import { getSavedProject } from "./savedProjectService";

const IMPORT_STAGE = "Issue Selected";
const savedSelect = "*, project:projects(*)";
const taskSelect = "*, project:projects(id, name, slug, difficulty, category)";

export class ImportError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "ImportError";
    this.code = code;
  }
}

/**
 * Makes sure the project is in the user's workspace and at least at "Issue Selected".
 * Never moves a project backwards (e.g. a project already at "PR Opened" stays there).
 */
async function ensureProjectAtIssueStage(userId, project) {
  const db = requireSupabase();
  let saved = await getSavedProject(userId, project.id);

  if (!saved) {
    const { data, error } = await db
      .from("saved_projects")
      .insert({ user_id: userId, project_id: project.id, progress_stage: IMPORT_STAGE })
      .select(savedSelect)
      .single();
    if (error && !isUniqueViolation(error)) throw error;
    // A unique violation means another tab saved it a moment ago; use that row instead.
    saved = data || (await getSavedProject(userId, project.id));
    if (data) {
      await logActivity({
        userId,
        actionType: "saved_project",
        entityType: "project",
        entityId: project.id,
        message: `Saved ${project.name} while picking an issue.`
      });
    }
    return { saved, advanced: Boolean(data) };
  }

  const currentIndex = PROGRESS_STAGES.indexOf(saved.progress_stage);
  const targetIndex = PROGRESS_STAGES.indexOf(IMPORT_STAGE);
  if (currentIndex >= targetIndex) return { saved, advanced: false };

  const { data, error } = await db
    .from("saved_projects")
    .update({ progress_stage: IMPORT_STAGE, updated_at: new Date().toISOString() })
    .eq("id", saved.id)
    .eq("user_id", userId)
    .select(savedSelect)
    .single();
  if (error) throw error;
  await logActivity({
    userId,
    actionType: "updated_stage",
    entityType: "saved_project",
    entityId: saved.id,
    message: `Moved ${project.name} to ${IMPORT_STAGE}.`
  });
  return { saved: data, advanced: true };
}

/**
 * Imports a GitHub issue as a task:
 *   1. save the project / advance it to "Issue Selected" (never backwards)
 *   2. insert the task (a DB unique index on user_id + issue_url rejects duplicates)
 *   3. log the import to the activity feed
 */
export async function importIssueAsTask({ userId, project, issue }) {
  const { saved, advanced } = await ensureProjectAtIssueStage(userId, project);

  const { data: task, error } = await requireSupabase()
    .from("tasks")
    .insert({
      user_id: userId,
      project_id: project.id,
      title: `#${issue.number} ${issue.title}`.slice(0, 200),
      issue_url: issue.url,
      description: issue.body || null,
      status: "Todo",
      priority: "Medium"
    })
    .select(taskSelect)
    .single();

  if (error) {
    if (isUniqueViolation(error)) {
      throw new ImportError("duplicate", `Issue #${issue.number} is already in your tasks.`);
    }
    // The project step already succeeded, so say exactly what did and did not happen.
    throw new ImportError(
      "task_failed",
      `${project.name} is in your workspace, but the task could not be created: ${error.message}`
    );
  }

  await logActivity({
    userId,
    actionType: "imported_issue",
    entityType: "task",
    entityId: task.id,
    message: `Picked up issue #${issue.number} from ${project.name}.`
  });

  return { task, savedProject: saved, stageAdvanced: advanced };
}
