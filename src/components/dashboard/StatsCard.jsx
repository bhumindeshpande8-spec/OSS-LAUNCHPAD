export function StatsCard({ label, value, description, icon: Icon, tone = "teal" }) {
  const tones = {
    teal: "bg-mint text-ocean",
    amber: "bg-amber-50 text-amber-700",
    coral: "bg-rose-50 text-rose-700",
    indigo: "bg-indigo-50 text-indigo-700"
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
        </div>
        {Icon ? (
          <div className={`flex h-11 w-11 items-center justify-center rounded-md ${tones[tone]}`}>
            <Icon className="h-5 w-5" />
          </div>
        ) : null}
      </div>
      {description ? <p className="mt-3 text-sm text-slate-600">{description}</p> : null}
    </div>
  );
}
