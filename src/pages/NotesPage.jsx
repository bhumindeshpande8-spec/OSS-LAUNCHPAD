import { useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Plus } from "lucide-react";
import { NOTE_CATEGORIES } from "../constants/statuses";
import { Button } from "../components/ui/Button";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { Modal } from "../components/ui/Modal";
import { Select } from "../components/ui/Select";
import { NoteCard } from "../components/notes/NoteCard";
import { NoteForm } from "../components/notes/NoteForm";
import { useNotes } from "../hooks/useNotes";
import { useSavedProjects } from "../hooks/useSavedProjects";

export default function NotesPage() {
  const { savedProjects } = useSavedProjects();
  const { notes, loading, error, addNote, editNote, removeNote } = useNotes();
  const [category, setCategory] = useState("");
  const [projectId, setProjectId] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [deletingNote, setDeletingNote] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredNotes = useMemo(
    () => notes.filter((note) => (!category || note.category === category) && (!projectId || note.project_id === projectId)),
    [category, notes, projectId]
  );

  async function handleSubmit(values) {
    setSubmitting(true);
    try {
      const saved = savedProjects.find((item) => item.project_id === values.project_id);
      if (editingNote) {
        await editNote(editingNote.id, values);
        toast.success("Note updated.");
      } else {
        await addNote(values, saved?.project?.name);
        toast.success("Note created.");
      }
      setFormOpen(false);
      setEditingNote(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function confirmDelete() {
    setSubmitting(true);
    try {
      await removeNote(deletingNote.id);
      toast.success("Note deleted.");
      setDeletingNote(null);
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
          <h1 className="text-3xl font-bold text-ink">Notes</h1>
          <p className="mt-2 text-slate-600">Capture setup steps, commands, blockers, and PR context for each repo.</p>
        </div>
        <Button onClick={() => setFormOpen(true)} disabled={!savedProjects.length}>
          <Plus className="h-4 w-4" /> New note
        </Button>
      </div>

      <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2">
        <Select label="Category" value={category} onChange={(event) => setCategory(event.target.value)}>
          <option value="">All categories</option>
          {NOTE_CATEGORIES.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <Select label="Project" value={projectId} onChange={(event) => setProjectId(event.target.value)}>
          <option value="">All projects</option>
          {savedProjects.map((saved) => (
            <option key={saved.project_id} value={saved.project_id}>
              {saved.project?.name}
            </option>
          ))}
        </Select>
      </div>

      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p> : null}
      {loading ? (
        <LoadingSpinner label="Loading notes" />
      ) : !savedProjects.length ? (
        <EmptyState title="Save a project first" description="Notes are linked to saved projects for easier viva explanation and real workflow context." />
      ) : filteredNotes.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={(item) => {
                setEditingNote(item);
                setFormOpen(true);
              }}
              onDelete={setDeletingNote}
            />
          ))}
        </div>
      ) : (
        <EmptyState title="No notes match your filters" description="Create a note or broaden the current filters." />
      )}

      <Modal open={formOpen} title={editingNote ? "Edit note" : "Create note"} onClose={() => { setFormOpen(false); setEditingNote(null); }}>
        <NoteForm savedProjects={savedProjects} initialNote={editingNote} onSubmit={handleSubmit} onCancel={() => { setFormOpen(false); setEditingNote(null); }} loading={submitting} />
      </Modal>

      <ConfirmDialog
        open={Boolean(deletingNote)}
        title="Delete note?"
        description={`Delete "${deletingNote?.title}" from your workspace.`}
        confirmLabel="Delete note"
        loading={submitting}
        onClose={() => setDeletingNote(null)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
