import { forwardRef } from "react";
import { cn } from "../../lib/helpers";

export const Textarea = forwardRef(function Textarea({ label, error, className, id, ...props }, ref) {
  const inputId = id || props.name;
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span> : null}
      <textarea
        ref={ref}
        id={inputId}
        rows={4}
        className={cn(
          "focus-ring w-full resize-y rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-ink placeholder:text-slate-400",
          error && "border-rose-300",
          className
        )}
        {...props}
      />
      {error ? <span className="mt-1 block text-sm text-rose-600">{error}</span> : null}
    </label>
  );
});
