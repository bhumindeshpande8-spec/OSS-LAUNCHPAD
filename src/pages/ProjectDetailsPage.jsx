import { ExternalLink } from "lucide-react";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { ProjectMeta } from "../components/projects/ProjectMeta";
import { ProgressStageSelector } from "../components/projects/ProgressStageSelector";
import { SaveProjectButton } from "../components/projects/SaveProjectButton";
import { TaskCard } from "../components/tasks/TaskCard";
import { NoteCard } from "../components/notes/NoteCard";
import { useProject } from "../hooks/useProjects";
import { useSavedProject } from "../hooks/useSavedProjects";
import { useTasks } from "../hooks/useTasks";
import { useNotes } from "../hooks/useNotes";

export default function ProjectDetailsPage() {
  const { slug } = useParams();
  const { project, loading, error } = useProject(slug);
  const saved = useSavedProject(project?.id);
  const tasks = useTasks(project?.id);
  const notes = useNotes(project?.id);

  async function handleStage(stage) {
    try {
      await saved.changeStage(stage);
      toast.success("Progress stage updated.");
    } catch (err) {
      toast.error(err.message);
    }
  }

  if (loading) return <LoadingSpinner label="Loading project details" />;
  if (error) return <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p>;

  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
          <div>
            <h1 className="text-3xl font-bold text-ink">{project.name}</h1>
            <p className="mt-3 max-w-3xl leading-7 text-slate-600">{project.description}</p>
            <div className="mt-5">
              <ProjectMeta project={project} />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <SaveProjectButton project={project} savedProject={saved.savedProject} onSave={saved.save} onRemove={saved.remove} loading={saved.loading} />
            <a href={project.github_url} target="_blank" rel="noreferrer">
              <Button variant="secondary">
                GitHub <ExternalLink className="h-4 w-4" />
              </Button>
            </a>
          </div>
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags?.map((tag) => (
            <Badge key={tag}>{tag}</Badge>
          ))}
        </div>
      </section>

      {saved.savedProject ? (
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-bold text-ink">Personal contribution workflow</h2>
          <div className="mt-4 max-w-md">
            <ProgressStageSelector value={saved.savedProject.progress_stage} onChange={handleStage} />
          </div>
        </section>
      ) : (
        <EmptyState title="Save this project to manage it" description="After saving, your project tasks and notes will appear here." />
      )}

      {saved.savedProject ? (
        <section className="grid gap-6 xl:grid-cols-2">
          <div>
            <h2 className="mb-4 text-lg font-bold text-ink">Project tasks</h2>
            {tasks.loading ? <LoadingSpinner label="Loading tasks" /> : tasks.tasks.length ? tasks.tasks.slice(0, 3).map((task) => <TaskCard key={task.id} task={task} />) : <EmptyState title="No tasks for this project" description="Create tasks from the Tasks page to plan setup, issue selection, and PR work." />}
          </div>
          <div>
            <h2 className="mb-4 text-lg font-bold text-ink">Project notes</h2>
            {notes.loading ? <LoadingSpinner label="Loading notes" /> : notes.notes.length ? notes.notes.slice(0, 3).map((note) => <NoteCard key={note.id} note={note} />) : <EmptyState title="No notes for this project" description="Create notes from the Notes page for commands, blockers, and learnings." />}
          </div>
        </section>
      ) : null}
    </div>
  );
}
