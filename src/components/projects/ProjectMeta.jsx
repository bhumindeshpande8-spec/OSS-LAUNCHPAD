import { Badge } from "../ui/Badge";

export function ProjectMeta({ project }) {
  return (
    <div className="flex flex-wrap gap-2">
      <Badge tone={project.difficulty === "Beginner" ? "teal" : project.difficulty === "Easy" ? "amber" : "indigo"}>
        {project.difficulty}
      </Badge>
      <Badge>{project.category}</Badge>
      <Badge tone={project.mentorship_available ? "teal" : "default"}>
        {project.mentorship_available ? "Mentorship" : "Self-guided"}
      </Badge>
      <Badge>{project.setup_complexity} setup</Badge>
    </div>
  );
}
