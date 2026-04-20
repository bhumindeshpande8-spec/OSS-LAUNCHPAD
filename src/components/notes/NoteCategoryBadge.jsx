import { Badge } from "../ui/Badge";

const tones = {
  Setup: "teal",
  Learning: "indigo",
  Commands: "amber",
  "PR Notes": "teal",
  Blockers: "rose",
  General: "default"
};

export function NoteCategoryBadge({ category }) {
  return <Badge tone={tones[category] || "default"}>{category}</Badge>;
}
