import { TASK_STATUS_COLORS } from "../../constants/statuses";
import { cn } from "../../lib/helpers";

export function TaskStatusBadge({ status }) {
  return (
    <span className={cn("inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold", TASK_STATUS_COLORS[status])}>
      {status}
    </span>
  );
}
