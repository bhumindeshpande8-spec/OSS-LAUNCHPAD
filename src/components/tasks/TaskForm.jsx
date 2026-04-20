import { useEffect, useState } from "react";
import { TASK_PRIORITIES, TASK_STATUSES } from "../../constants/statuses";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Select } from "../ui/Select";
import { Textarea } from "../ui/Textarea";

const initialValues = {
  project_id: "",
  title: "",
  issue_url: "",
  description: "",
  status: "Todo",
  priority: "Medium",
  deadline: "",
  notes: ""
};

export function TaskForm({ savedProjects, initialTask, onSubmit, onCancel, loading }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialTask) {
      setValues({
        project_id: initialTask.project_id,
        title: initialTask.title || "",
        issue_url: initialTask.issue_url || "",
        description: initialTask.description || "",
        status: initialTask.status || "Todo",
        priority: initialTask.priority || "Medium",
        deadline: initialTask.deadline || "",
        notes: initialTask.notes || ""
      });
    } else if (savedProjects.length === 1) {
      setValues((current) => ({ ...current, project_id: savedProjects[0].project_id }));
    }
  }, [initialTask, savedProjects]);

  function update(field, value) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!values.project_id) nextErrors.project_id = "Choose a saved project.";
    if (!values.title.trim()) nextErrors.title = "Task title is required.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    await onSubmit({ ...values, deadline: values.deadline || null });
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
      <Input label="Task title" value={values.title} onChange={(event) => update("title", event.target.value)} error={errors.title} />
      <Input label="Issue URL" value={values.issue_url} onChange={(event) => update("issue_url", event.target.value)} placeholder="https://github.com/org/repo/issues/1" />
      <Textarea label="Description" value={values.description} onChange={(event) => update("description", event.target.value)} />
      <div className="grid gap-4 md:grid-cols-3">
        <Select label="Status" value={values.status} onChange={(event) => update("status", event.target.value)}>
          {TASK_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </Select>
        <Select label="Priority" value={values.priority} onChange={(event) => update("priority", event.target.value)}>
          {TASK_PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </Select>
        <Input label="Deadline" type="date" value={values.deadline} onChange={(event) => update("deadline", event.target.value)} />
      </div>
      <Textarea label="Personal notes" value={values.notes} onChange={(event) => update("notes", event.target.value)} />
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" loading={loading}>
          {initialTask ? "Update task" : "Create task"}
        </Button>
      </div>
    </form>
  );
}
