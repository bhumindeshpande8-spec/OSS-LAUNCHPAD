import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Badge } from "../components/ui/Badge";
import { ProgressStageSelector } from "../components/projects/ProgressStageSelector";
import { useSavedProjects } from "../hooks/useSavedProjects";
import { stagePercent } from "../lib/helpers";

export default function SavedProjectsPage() {
  const { savedProjects, loading, error, changeStage } = useSavedProjects();

  async function handleStage(saved, stage) {
    try {
      await changeStage(saved.id, stage, saved.project?.name);
      toast.success("Progress stage updated.");
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <LoadingSpinner label="Loading saved projects" />;
  if (error) return <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Saved projects</h1>
        <p className="mt-2 text-slate-600">Your bookmarked repositories and current contribution stage.</p>
      </div>
      {!savedProjects.length ? (
        <EmptyState title="No saved projects" description="Save a repository from Discover to begin tracking your contribution path." />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {savedProjects.map((saved) => (
            <article key={saved.id} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link to={`/projects/${saved.project?.slug}`} className="text-lg font-bold text-ink hover:text-ocean">
                    {saved.project?.name}
                  </Link>
                  <p className="mt-1 text-sm text-slate-600">{saved.project?.description}</p>
                </div>
                <Badge tone="teal">{saved.project?.difficulty}</Badge>
              </div>
              <div className="mt-4">
                <ProgressStageSelector value={saved.progress_stage} onChange={(stage) => handleStage(saved, stage)} />
              </div>
              <div className="mt-4 h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-ocean" style={{ width: `${stagePercent(saved.progress_stage)}%` }} />
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
