import { Link } from "react-router-dom";
import { EmptyState } from "../ui/EmptyState";
import { Badge } from "../ui/Badge";
import { timeAgo } from "../../lib/formatters";

export function RecentProjectsList({ items }) {
  if (!items.length) {
    return <EmptyState title="No saved projects yet" description="Start with Discovery and save a repo that feels approachable." />;
  }

  return (
    <div className="space-y-3">
      {items.slice(0, 5).map((saved) => (
        <Link
          key={saved.id}
          to={`/projects/${saved.project?.slug}`}
          className="block rounded-lg border border-slate-200 bg-white p-4 transition hover:border-teal-200 hover:shadow-sm"
        >
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-ink">{saved.project?.name}</p>
              <p className="mt-1 text-xs text-slate-500">Saved {timeAgo(saved.created_at)}</p>
            </div>
            <Badge tone="teal">{saved.progress_stage}</Badge>
          </div>
        </Link>
      ))}
    </div>
  );
}
