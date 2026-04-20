import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Modal } from "../components/ui/Modal";
import { TaskCard } from "../components/tasks/TaskCard";
import { TaskFilters } from "../components/tasks/TaskFilters";
import { TaskForm } from "../components/tasks/TaskForm";
import { useSavedProjects } from "../hooks/useSavedProjects";
import { useTasks } from "../hooks/useTasks";

export default function TasksPage() {
  const { savedProjects } = useSavedProjects();
  const { tasks, loading, error, addTask, editTask, removeTask } = useTasks();
  const [status, setStatus] = useState("");
  const [projectId, setProjectId] = useState("");
  const [editingTask, setEditingTask] = useState(null);
  const [deletingTask, setDeletingTask] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const filteredTasks = useMemo(
    () => tasks.filter((task) => (!status || task.status === status) && (!projectId || task.project_id === projectId)),
    [projectId, status, tasks]
  );

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      const saved = savedProjects.find((item) => item.project_id === values.project_id);
      if (editingTask) {
        await editTask(editingTask.id, values);
        toast.success("Task updated.");
      } else {
        await addTask(values, saved?.project?.name);
        toast.success("Task created.");
      }
      setFormOpen(false);
      setEditingTask(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    setSubmitting(true);
    try {
      await removeTask(deletingTask.id);
      toast.success("Task deleted.");
      setDeletingTask(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-ink">Tasks and issues</h1>
          <p className="mt-2 text-slate-600">Track setup work, selected issues, PR steps, and blockers.</p>
        </div>
        <Button onClick={() => setFormOpen(true)} disabled={!savedProjects.length}>
          <Plus className="h-4 w-4" /> New task
        </Button>
      </div>

      <TaskFilters status={status} projectId={projectId} projects={savedProjects} onStatusChange={setStatus} onProjectChange={setProjectId} />
      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p> : null}

      {loading ? (
        <LoadingSpinner label="Loading tasks" />
      ) : !savedProjects.length ? (
        <EmptyState title="Save a project first" description="Tasks are linked to saved projects so your workflow stays organized." />
      ) : filteredTasks.length ? (
        <div className="grid gap-4">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={(item) => {
                setEditingTask(item);
                setFormOpen(true);
              }}
              onDelete={setDeletingTask}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No tasks match your filters" description="Clear filters or create a new task for a saved project." />
      )}

      <Modal open={formOpen} title={editingTask ? "Edit task" : "Create task"} onClose={() => { setFormOpen(false); setEditingTask(null); }}>
        <TaskForm savedProjects={savedProjects} initialTask={editingTask} onSubmit={handleSubmit} onCancel={() => { setFormOpen(false); setEditingTask(null); }} loading={submitting} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingTask)}
        title="Delete task?"
        description={`Delete "${deletingTask?.title}" from your workspace.`}
        confirmLabel="Delete task"
        loading={submitting}
        onClose={() => setDeletingTask(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
