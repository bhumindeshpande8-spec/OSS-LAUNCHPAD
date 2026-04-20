import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { createNote, deleteNote, getNotes, getNotesByProject, updateNote } from "../services/noteService";

export function useNotes(projectId = null) {
  const { user } = useAuth();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotes = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      setNotes(projectId ? await getNotesByProject(user.id, projectId) : await getNotes(user.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, user]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const addNote = useCallback(
    async (values, projectName) => {
      const note = await createNote({ userId: user.id, values, projectName });
      setNotes((items) => [note, ...items]);
      return note;
    },
    [user]
  );

  const editNote = useCallback(
    async (noteId, values) => {
      const note = await updateNote({ userId: user.id, noteId, values });
      setNotes((items) => items.map((item) => (item.id === noteId ? note : item)));
      return note;
    },
    [user]
  );

  const removeNote = useCallback(
    async (noteId) => {
      await deleteNote({ userId: user.id, noteId });
      setNotes((items) => items.filter((item) => item.id !== noteId));
    },
    [user]
  );

  return { notes, loading, error, addNote, editNote, removeNote, refetch: fetchNotes };
}
