import { useEffect, useState } from "react";
import { NOTE_CATEGORIES } from "../../constants/statuses";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";

const initialValues = {
  project_id: "",
  title: "",
  content: "",
  category: "General"
};

export function NoteForm({ savedProjects, initialNote, onSubmit, onCancel, loading }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialNote) {
      setValues({
        project_id: initialNote.project_id,
        title: initialNote.title || "",
        content: initialNote.content || "",
        category: initialNote.category || "General"
      });
    } else if (savedProjects.length === 1) {
      setValues((current) => ({ ...current, project_id: savedProjects[0].project_id }));
    }
  }, [initialNote, savedProjects]);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!values.project_id) nextErrors.project_id = "Choose a saved project.";
    if (!values.title.trim()) nextErrors.title = "Note title is required.";
    if (!values.content.trim()) nextErrors.content = "Note content is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await onSubmit(values);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <Select label="Saved project" value={values.project_id} onChange={(event) => update("project_id", event.target.value)} error={errors.project_id}>
        <option value="">Choose project</option>
        {savedProjects.map((saved) => (
          <option key={saved.project_id} value={saved.project_id}>
            {saved.project?.name}
          </option>
        ))}
      </Select>
      <div className="grid gap-4 md:grid-cols-2">
        <Input label="Title" value={values.title} onChange={(event) => update("title", event.target.value)} error={errors.title} />
        <Select label="Category" value={values.category} onChange={(event) => update("category", event.target.value)}>
          {NOTE_CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </Select>
      </div>
      <Textarea label="Content" value={values.content} onChange={(event) => update("content", event.target.value)} error={errors.content} rows={7} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialNote ? "Update note" : "Create note"}
        </Button>
      </div>
    </form>
  );
}
