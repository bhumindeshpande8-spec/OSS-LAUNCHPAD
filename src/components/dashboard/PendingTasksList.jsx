import { EmptyState } from "../ui/EmptyState";
import { Badge } from "../ui/Badge";
import { formatDate } from "../../lib/formatters";

export function PendingTasksList({ tasks }) {
  const pending = tasks.filter((task) => task.status !== "Done").slice(0, 5);
  if (!pending.length) {
    return <EmptyState title="No pending tasks" description="When you choose an issue or setup step, track it here." />;
  }

  return (
    <div className="space-y-3">
      {pending.map((task) => (
        <div key={task.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">{task.title}</p>
              <p className="mt-1 text-sm text-slate-500">{task.project?.name}</p>
            </div>
            <Badge tone={task.priority === "High" ? "rose" : task.priority === "Low" ? "teal" : "amber"}>{task.priority}</Badge>
          </div>
          <p className="mt-2 text-xs text-slate-500">Deadline: {formatDate(task.deadline)}</p>
        </div>
      ))}
    </div>
  );
}
