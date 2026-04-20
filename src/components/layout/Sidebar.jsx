import { NavLink } from "react-router-dom";
import { Rocket } from "lucide-react";
import { NAV_LINKS } from "../../constants/navLinks";
import { cn } from "../../lib/helpers";

export function Sidebar() {
  return (
    <aside className="hidden min-h-screen w-72 border-r border-slate-200 bg-white px-4 py-5 lg:block">
      <div className="flex items-center gap-3 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-md bg-ocean text-white">
          <Rocket className="h-5 w-5" />
        </div>
        <div>
          <p className="text-base font-bold text-ink">OSS Launchpad</p>
          <p className="text-xs text-slate-500">Contribution workspace</p>
        </div>
      </div>
      <nav className="mt-8 space-y-1">
        {NAV_LINKS.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              cn(
                "focus-ring flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition",
                isActive ? "bg-mint text-ocean" : "text-slate-600 hover:bg-slate-100 hover:text-ink"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
