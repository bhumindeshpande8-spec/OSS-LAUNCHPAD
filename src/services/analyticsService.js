import { chartDataFromCounts, groupCount } from "../lib/helpers";
import { getRecentActivity } from "./activityService";
import { getSavedProjects } from "./savedProjectService";
import { getTasks } from "./taskService";
import { getNotes } from "./noteService";

export async function getDashboardStats(userId) {
  const [savedProjects, tasks, notes, activity] = await Promise.all([
    getSavedProjects(userId),
    getTasks(userId),
    getNotes(userId),
    getRecentActivity(userId)
  ]);

  const completedTasks = tasks.filter((task) => task.status === "Done").length;
  const mergedCount = savedProjects.filter((saved) => saved.progress_stage === "PR Merged").length;

  return {
    savedProjects,
    tasks,
    notes,
    activity,
    totals: {
      savedProjects: savedProjects.length,
      tasks: tasks.length,
      completedTasks,
      mergedCount,
      completionRatio: tasks.length ? Math.round((completedTasks / tasks.length) * 100) : 0
    },
    charts: {
      difficulty: chartDataFromCounts(groupCount(savedProjects, (item) => item.project?.difficulty)),
      taskStatus: chartDataFromCounts(groupCount(tasks, "status")),
      stages: chartDataFromCounts(groupCount(savedProjects, "progress_stage")),
      notes: chartDataFromCounts(groupCount(notes, "category"))
    }
  };
}
