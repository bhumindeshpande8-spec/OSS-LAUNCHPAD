import { COMMON_TECH, DIFFICULTIES, PROJECT_CATEGORIES } from "../../constants/categories";
import { Button } from "../ui/Button";
import { Select } from "../ui/Select";

export function ProjectFilters({ filters, onChange, onReset }) {
  return (
    <div className="grid gap-3 rounded-lg border border-slate-200 bg-white p-4 md:grid-cols-4">
      <Select label="Difficulty" value={filters.difficulty} onChange={(event) => onChange("difficulty", event.target.value)}>
        <option value="">All difficulties</option>
        {DIFFICULTIES.map((difficulty) => (
          <option key={difficulty} value={difficulty}>
            {difficulty}
          </option>
        ))}
      </Select>
      <Select label="Tech stack" value={filters.tech} onChange={(event) => onChange("tech", event.target.value)}>
        <option value="">All tech</option>
        {COMMON_TECH.map((tech) => (
          <option key={tech} value={tech}>
            {tech}
          </option>
        ))}
      </Select>
      <Select label="Category" value={filters.category} onChange={(event) => onChange("category", event.target.value)}>
        <option value="">All categories</option>
        {PROJECT_CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category}
          </option>
        ))}
      </Select>
      <div className="flex items-end">
        <Button className="w-full" variant="secondary" onClick={onReset}>
          Reset filters
        </Button>
      </div>
    </div>
  );
}
