import { Search } from "lucide-react";
import { forwardRef } from "react";

export const ProjectSearchBar = forwardRef(function ProjectSearchBar({ value, onChange }, ref) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        ref={ref}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Search by project name, stack, or tag"
        className="focus-ring h-12 w-full rounded-md border border-slate-200 bg-white pl-10 pr-3 text-sm text-ink"
      />
    </label>
  );
});
