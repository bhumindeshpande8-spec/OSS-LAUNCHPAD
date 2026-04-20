import { Loader2 } from "lucide-react";
import { cn } from "../../lib/helpers";

export function LoadingSpinner({ label = "Loading", className }) {
  return (
    <div className={cn("flex items-center justify-center gap-3 py-10 text-sm font-medium text-slate-600", className)}>
      <Loader2 className="h-5 w-5 animate-spin text-ocean" />
      {label}
    </div>
  );
}
