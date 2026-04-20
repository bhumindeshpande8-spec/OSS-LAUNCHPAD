export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
      <div className="mt-4 h-3 w-full animate-pulse rounded bg-slate-200" />
      <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-slate-200" />
      <div className="mt-5 flex gap-2">
        <div className="h-7 w-20 animate-pulse rounded-md bg-slate-200" />
        <div className="h-7 w-24 animate-pulse rounded-md bg-slate-200" />
      </div>
    </div>
  );
}
