import { TASK_STATUSES } from "../../constants/statuses";
import { Select } from "../ui/Select";

export function TaskFilters({ status, projectId, projects, onStatusChange, onProjectChange }) {
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-2">
      <Select label="Status" value={status} onChange={(event) => onStatusChange(event.target.value)}>
        <option value="">All statuses</option>
        {TASK_STATUSES.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </Select>
      <Select label="Project" value={projectId} onChange={(event) => onProjectChange(event.target.value)}>
        <option value="">All projects</option>
        {projects.map((item) => (
          <option key={item.project_id} value={item.project_id}>
            {item.project?.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
