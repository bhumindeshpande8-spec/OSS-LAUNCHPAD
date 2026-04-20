import { EmptyState } from "../ui/EmptyState";
import { timeAgo } from "../../lib/formatters";

export function ActivityFeed({ items }) {
  if (!items.length) {
    return <EmptyState title="No activity yet" description="Your saved repos, notes, and task updates will create a contribution timeline." />;
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="flex gap-3">
          <span className="mt-1 h-2.5 w-2.5 rounded-full bg-ocean" />
          <div>
            <p className="text-sm font-medium text-ink">{item.message}</p>
            <p className="mt-1 text-xs text-slate-500">{timeAgo(item.created_at)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
