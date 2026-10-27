import { forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/helpers";

const variants = {
  primary: "bg-ocean text-white hover:bg-teal-800",
  secondary: "border border-slate-200 bg-white text-ink hover:bg-slate-50",
  subtle: "bg-slate-100 text-slate-700 hover:bg-slate-200",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  ghost: "text-slate-700 hover:bg-slate-100",
  // For use on dark surfaces like the dashboard hero and landing CTA.
  inverse: "bg-white text-ink hover:bg-slate-100"
};

const sizes = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base"
};

export const Button = forwardRef(function Button(
  { children, className, variant = "primary", size = "md", loading = false, disabled = false, type = "button", ...props },
  ref
) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-md font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
});
