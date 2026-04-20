import { Bookmark, BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "../ui/Button";

export function SaveProjectButton({ project, savedProject, onSave, onRemove, loading }) {
  async function handleClick() {
    try {
      if (savedProject) {
        await onRemove();
        toast.success("Project removed from saved list.");
      } else {
        await onSave(project);
        toast.success("Project saved to your workspace.");
      }
    } catch (error) {
      toast.error(error.message);
    }
  }

  return (
    <Button variant={savedProject ? "secondary" : "primary"} loading={loading} onClick={handleClick}>
      {savedProject ? <BookmarkCheck className="h-4 w-4" /> : <Bookmark className="h-4 w-4" />}
      {savedProject ? "Saved" : "Save project"}
    </Button>
  );
}
