export const PROGRESS_STAGES = [
  "Interested",
  "Exploring",
  "Setup Done",
  "Issue Selected",
  "PR Opened",
  "PR Merged"
];

export const TASK_STATUSES = ["Todo", "In Progress", "Done"];

export const TASK_PRIORITIES = ["Low", "Medium", "High"];

export const NOTE_CATEGORIES = ["General", "Setup", "Learning", "Commands", "PR Notes", "Blockers"];

export const STAGE_COLORS = {
  Interested: "bg-slate-100 text-slate-700 border-slate-200",
  Exploring: "bg-cyan-50 text-cyan-700 border-cyan-200",
  "Setup Done": "bg-teal-50 text-teal-700 border-teal-200",
  "Issue Selected": "bg-amber-50 text-amber-700 border-amber-200",
  "PR Opened": "bg-indigo-50 text-indigo-700 border-indigo-200",
  "PR Merged": "bg-emerald-50 text-emerald-700 border-emerald-200"
};

export const TASK_STATUS_COLORS = {
  Todo: "bg-slate-100 text-slate-700 border-slate-200",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200",
  Done: "bg-emerald-50 text-emerald-700 border-emerald-200"
};
