import { BarChart3, CheckCircle2, FolderKanban, GitPullRequest, ListTodo } from "lucide-react";
import { Link } from "react-router-dom";
import { ActivityFeed } from "../components/dashboard/ActivityFeed";
import { PendingTasksList } from "../components/dashboard/PendingTasksList";
import { ProgressSummaryChart } from "../components/dashboard/ProgressSummaryChart";
import { RecentProjectsList } from "../components/dashboard/RecentProjectsList";
import { StatsCard } from "../components/dashboard/StatsCard";
import { Button } from "../components/ui/Button";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { useAuth } from "../hooks/useAuth";
import { useDashboardStats } from "../hooks/useDashboardStats";

export default function DashboardPage() {
  const { profile } = useAuth();
  const { stats, loading, error } = useDashboardStats();

  if (loading) return <LoadingSpinner label="Building your dashboard" />;
  if (error) return <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p>;

  return (
    <div className="space-y-6">
      <section className="rounded-lg bg-ink p-6 text-white shadow-soft">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-semibold text-mint">Welcome back</p>
            <h1 className="mt-2 text-3xl font-bold">Keep the next contribution small, clear, and shippable.</h1>
            <p className="mt-3 max-w-2xl text-slate-300">
              {profile?.full_name || "Contributor"}, your workspace connects saved repos, tasks, notes, and progress in one flow.
            </p>
          </div>
          <Link to="/discover">
            <Button variant="inverse">Discover repos</Button>
          </Link>
        </div>
      </section>

      <section className="dashboard-grid">
        <StatsCard icon={FolderKanban} label="Saved projects" value={stats.totals.savedProjects} description="Repos in your contribution workspace" />
        <StatsCard icon={ListTodo} label="Total tasks" value={stats.totals.tasks} description="Setup steps, issues, and PR work" tone="amber" />
        <StatsCard icon={CheckCircle2} label="Tasks done" value={stats.totals.completedTasks} description={`${stats.totals.completionRatio}% completion ratio`} tone="coral" />
        <StatsCard icon={GitPullRequest} label="Merged stage" value={stats.totals.mergedCount} description="Projects that reached PR Merged" tone="indigo" />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-ink">Recent saved projects</h2>
            <Link to="/saved" className="text-sm font-semibold text-ocean">
              View all
            </Link>
          </div>
          <RecentProjectsList items={stats.savedProjects} />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-ocean" />
            <h2 className="text-lg font-bold text-ink">Progress stages</h2>
          </div>
          <ProgressSummaryChart data={stats.charts.stages} />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-ink">Pending tasks</h2>
          <PendingTasksList tasks={stats.tasks} />
        </div>
        <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-bold text-ink">Recent activity</h2>
          <ActivityFeed items={stats.activity} />
        </div>
      </section>
    </div>
  );
}
