import { useState } from "react";
import { format } from "date-fns";
import { AlertTriangle, CheckCircle2, ExternalLink, GitPullRequestArrow, MessageSquare, RefreshCw, SearchX } from "lucide-react";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { EmptyState } from "../ui/EmptyState";
import { SkeletonCard } from "../ui/SkeletonCard";
import { timeAgo } from "../../lib/formatters";

function ErrorState({ error, onRetry }) {
  const rateLimited = error.code === "rate_limited";
  const canRetry = !["invalid_repo", "not_found"].includes(error.code);
  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0" />
        <div>
          <p className="font-semibold">{error.message}</p>
          {rateLimited && error.resetAt ? (
            <p className="mt-1">GitHub allows a limited number of anonymous searches. Resets at {format(error.resetAt, "h:mm a")}.</p>
          ) : null}
          {canRetry ? (
            <Button size="sm" variant="secondary" className="mt-3" onClick={onRetry}>
              <RefreshCw className="h-4 w-4" /> Retry
            </Button>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function IssueRow({ issue, imported, importing, disabled, onImport }) {
  return (
    <li className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <a href={issue.url} target="_blank" rel="noreferrer" className="group inline-flex items-start gap-1 font-semibold text-ink hover:text-ocean">
            <span className="text-slate-400">#{issue.number}</span>
            <span className="break-words">{issue.title}</span>
            <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 opacity-0 transition group-hover:opacity-100" />
          </a>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {issue.labels.slice(0, 3).map((label) => (
              <Badge key={label} tone="teal">
                {label}
              </Badge>
            ))}
            {issue.isAssigned ? <Badge tone="amber">Already assigned</Badge> : null}
            <span className="inline-flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" /> {issue.comments}
            </span>
            <span>updated {timeAgo(issue.updatedAt)}</span>
          </div>
        </div>
        {imported ? (
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> Imported
          </span>
        ) : (
          <Button size="sm" className="shrink-0" loading={importing} disabled={disabled} onClick={() => onImport(issue)}>
            Import as task
          </Button>
        )}
      </div>
    </li>
  );
}

export function GoodFirstIssuesPanel({ issuesState, importedUrls, onImport }) {
  const { issues, fetchedAt, loading, error, refresh } = issuesState;
  const [importingId, setImportingId] = useState(null);

  async function handleImport(issue) {
    setImportingId(issue.id);
    try {
      await onImport(issue);
    } finally {
      setImportingId(null);
    }
  }

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
            <GitPullRequestArrow className="h-5 w-5 text-ocean" /> Good first issues
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Live from GitHub. Importing an issue adds it to your tasks and moves this project to <strong>Issue Selected</strong>.
          </p>
        </div>
        {!loading && !error ? (
          <Button size="sm" variant="ghost" onClick={refresh}>
            <RefreshCw className="h-4 w-4" /> Refresh
          </Button>
        ) : null}
      </div>

      <div className="mt-5">
        {loading ? (
          <div className="grid gap-3">
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : error ? (
          <ErrorState error={error} onRetry={refresh} />
        ) : issues.length ? (
          <>
            <ul className="grid gap-3">
              {issues.map((issue) => (
                <IssueRow
                  key={issue.id}
                  issue={issue}
                  imported={importedUrls.has(issue.url)}
                  importing={importingId === issue.id}
                  disabled={importingId !== null}
                  onImport={handleImport}
                />
              ))}
            </ul>
            {fetchedAt ? <p className="mt-3 text-xs text-slate-400">Fetched {timeAgo(new Date(fetchedAt))} · cached for 10 minutes</p> : null}
          </>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No open beginner issues right now"
            description="We searched for labels like “good first issue”, “beginner” and “first-timers-only”. Check back later or browse the repository directly."
          />
        )}
      </div>
    </section>
  );
}
