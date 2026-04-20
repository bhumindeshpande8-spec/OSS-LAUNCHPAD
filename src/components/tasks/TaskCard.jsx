import { CalendarDays, ExternalLink, Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { TaskStatusBadge } from "./TaskStatusBadge";
import { formatDate } from "../../lib/formatters";

export function TaskCard({ task, onEdit, onDelete }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <TaskStatusBadge status={task.status} />
            <Badge tone={task.priority === "High" ? "rose" : task.priority === "Low" ? "teal" : "amber"}>{task.priority}</Badge>
          </div>
          <h3 className="mt-3 text-lg font-bold text-ink">{task.title}</h3>
          <p className="mt-1 text-sm text-slate-600">{task.project?.name}</p>
        </div>
        {onEdit || onDelete ? (
          <div className="flex gap-2">
            {onEdit ? (
              <Button variant="secondary" size="sm" onClick={() => onEdit(task)}>
                <Pencil className="h-4 w-4" /> Edit
              </Button>
            ) : null}
            {onDelete ? (
              <Button variant="danger" size="sm" onClick={() => onDelete(task)}>
                <Trash2 className="h-4 w-4" /> Delete
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
      {task.description ? <p className="mt-4 text-sm leading-6 text-slate-600">{task.description}</p> : null}
      <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-500">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-4 w-4" /> {formatDate(task.deadline)}
        </span>
        {task.issue_url ? (
          <a href={task.issue_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 font-semibold text-ocean">
            Issue link <ExternalLink className="h-3.5 w-3.5" />
          </a>
        ) : null}
      </div>
      {task.notes ? <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-600">{task.notes}</div> : null}
    </article>
  );
}
