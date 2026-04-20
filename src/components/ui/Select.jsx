import { cn } from "../../lib/helpers";

export function Select({ label, error, children, className, id, ...props }) {
  const inputId = id || props.name;
  return (
    <label className="block">
      {label ? <span className="mb-1.5 block text-sm font-medium text-slate-700">{label}</span> : null}
      <select
        id={inputId}
        className={cn(
          "focus-ring h-11 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-ink",
          error && "border-rose-300",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error ? <span className="mt-1 block text-sm text-rose-600">{error}</span> : null}
    </label>
  );
}
