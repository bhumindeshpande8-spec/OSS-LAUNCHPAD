import { Pencil, Trash2 } from "lucide-react";
import { Button } from "../ui/Button";
import { NoteCategoryBadge } from "./NoteCategoryBadge";
import { timeAgo } from "../../lib/formatters";

export function NoteCard({ note, onEdit, onDelete }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <NoteCategoryBadge category={note.category} />
          <h3 className="mt-3 text-lg font-bold text-ink">{note.title}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {note.project?.name} · Updated {timeAgo(note.updated_at || note.created_at)}
          </p>
        </div>
        {onEdit || onDelete ? (
          <div className="flex gap-2">
            {onEdit ? (
              <Button variant="secondary" size="sm" onClick={() => onEdit(note)}>
                <Pencil className="h-4 w-4" />
              </Button>
            ) : null}
            {onDelete ? (
              <Button variant="danger" size="sm" onClick={() => onDelete(note)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>
      <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">{note.content}</p>
    </article>
  );
}
