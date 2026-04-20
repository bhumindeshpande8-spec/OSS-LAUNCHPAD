import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, FolderKanban, GitPullRequest, ListTodo } from "lucide-react";
import { StatsCard } from "../components/dashboard/StatsCard";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { EmptyState } from "../components/ui/EmptyState";
import { useAuth } from "../hooks/useAuth";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { getInitials } from "../lib/helpers";

const COLORS = ["#0f766e", "#f59e0b", "#f97363", "#2563eb", "#10b981", "#7c3aed"];

export default function ProfilePage() {
  const { profile } = useAuth();
  const { stats, loading, error } = useDashboardStats();

  if (loading) return <LoadingSpinner label="Loading profile analytics" />;
  if (error) return <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p>;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-mint text-2xl font-bold text-ocean">
            {getInitials(profile?.full_name)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-ink">{profile?.full_name || "Contributor"}</h1>
            <p className="mt-1 text-slate-600">{profile?.email}</p>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500">
              Your profile summarizes how consistently you are converting saved repositories into contribution actions.
            </p>
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <StatsCard icon={FolderKanban} label="Saved projects" value={stats.totals.savedProjects} />
        <StatsCard icon={ListTodo} label="Tasks" value={stats.totals.tasks} tone="amber" />
        <StatsCard icon={CheckCircle2} label="Completed tasks" value={stats.totals.completedTasks} tone="coral" />
        <StatsCard icon={GitPullRequest} label="Merged PR stage" value={stats.totals.mergedCount} tone="indigo" />
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartPanel title="Task status distribution">
          {stats.charts.taskStatus.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.charts.taskStatus}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#0f766e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No task analytics yet" description="Create tasks to see your completion pattern." />
          )}
        </ChartPanel>

        <ChartPanel title="Projects by difficulty">
          {stats.charts.difficulty.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={stats.charts.difficulty} dataKey="value" nameKey="name" outerRadius={95} label>
                  {stats.charts.difficulty.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No saved project analytics yet" description="Save projects to understand your difficulty mix." />
          )}
        </ChartPanel>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <ChartPanel title="Progress stage counts">
          {stats.charts.stages.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={stats.charts.stages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#f97363" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No stage data yet" description="Update saved project stages to see your journey." />
          )}
        </ChartPanel>

        <ChartPanel title="Note categories">
          {stats.charts.notes.length ? (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={stats.charts.notes} dataKey="value" nameKey="name" innerRadius={55} outerRadius={95}>
                  {stats.charts.notes.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyState title="No note analytics yet" description="Add notes for setup, blockers, commands, and PR learnings." />
          )}
        </ChartPanel>
      </section>
    </div>
  );
}

function ChartPanel({ title, children }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-ink">{title}</h2>
      {children}
    </div>
  );
}
