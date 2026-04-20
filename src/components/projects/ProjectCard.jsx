import { Link } from "react-router-dom";
import { ExternalLink, Star } from "lucide-react";
import { Badge } from "../ui/Badge";
import { ProjectMeta } from "./ProjectMeta";

export function ProjectCard({ project }) {
  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-ink">{project.name}</h3>
          <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">{project.description}</p>
        </div>
        {project.beginner_friendly ? (
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-mint text-ocean">
            <Star className="h-4 w-4" />
          </div>
        ) : null}
      </div>
      <div className="mt-4">
        <ProjectMeta project={project} />
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {project.tech_stack?.slice(0, 4).map((tech) => (
          <Badge key={tech}>{tech}</Badge>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <Link to={`/projects/${project.slug}`} className="focus-ring rounded-md text-sm font-semibold text-ocean hover:text-teal-800">
          View details
        </Link>
        <a
          href={project.github_url}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center gap-1 rounded-md text-sm font-semibold text-slate-600 hover:text-ink"
        >
          GitHub <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>
    </article>
  );
}
