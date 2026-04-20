import { useMemo, useRef, useState } from "react";
import { SearchX } from "lucide-react";
import { EmptyState } from "../components/ui/EmptyState";
import { SkeletonCard } from "../components/ui/SkeletonCard";
import { ProjectCard } from "../components/projects/ProjectCard";
import { ProjectFilters } from "../components/projects/ProjectFilters";
import { ProjectSearchBar } from "../components/projects/ProjectSearchBar";
import { useDebounce } from "../hooks/useDebounce";
import { useProjects } from "../hooks/useProjects";

export default function DiscoverPage() {
  const { projects, loading, error } = useProjects();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ difficulty: "", tech: "", category: "" });
  const searchRef = useRef(null);
  const debouncedSearch = useDebounce(search, 250);

  const filteredProjects = useMemo(() => {
    const query = debouncedSearch.toLowerCase().trim();
    return projects.filter((project) => {
      const searchable = [project.name, project.description, project.category, ...(project.tech_stack || []), ...(project.tags || [])]
        .join(" ")
        .toLowerCase();
      const matchesSearch = !query || searchable.includes(query);
      const matchesDifficulty = !filters.difficulty || project.difficulty === filters.difficulty;
      const matchesTech = !filters.tech || project.tech_stack?.includes(filters.tech);
      const matchesCategory = !filters.category || project.category === filters.category;
      return matchesSearch && matchesDifficulty && matchesTech && matchesCategory;
    });
  }, [debouncedSearch, filters, projects]);

  function changeFilter(field, value) {
    setFilters((current) => ({ ...current, [field]: value }));
  }

  function resetFilters() {
    setSearch("");
    setFilters({ difficulty: "", tech: "", category: "" });
    searchRef.current?.focus();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink">Discover projects</h1>
        <p className="mt-2 text-slate-600">Find beginner-friendly open source repositories with clear metadata before you commit time.</p>
      </div>
      <ProjectSearchBar ref={searchRef} value={search} onChange={setSearch} />
      <ProjectFilters filters={filters} onChange={changeFilter} onReset={resetFilters} />

      {error ? <p className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-700">{error}</p> : null}

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : filteredProjects.length ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      ) : (
        <EmptyState icon={SearchX} title="No projects match that search" description="Try a broader stack, category, or difficulty filter." actionLabel="Clear filters" onAction={resetFilters} />
      )}
    </div>
  );
}
