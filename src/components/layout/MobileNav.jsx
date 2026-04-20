import { useContext } from "react";
import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import { UIContext } from "../../context/UIContext";
import { NAV_LINKS } from "../../constants/navLinks";
import { Button } from "../ui/Button";
import { cn } from "../../lib/helpers";

export function MobileNav() {
  const { isMobileNavOpen, closeMobileNav } = useContext(UIContext);
  if (!isMobileNavOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button className="absolute inset-0 bg-ink/40" aria-label="Close navigation" onClick={closeMobileNav} />
      <aside className="relative h-full w-80 max-w-[86vw] bg-white p-4 shadow-2xl">
        <div className="flex items-center justify-between">
          <p className="font-bold text-ink">OSS Launchpad</p>
          <Button variant="ghost" size="sm" onClick={closeMobileNav} aria-label="Close navigation">
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="mt-6 space-y-1">
          {NAV_LINKS.map(({ label, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              onClick={closeMobileNav}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-md px-3 py-3 text-sm font-semibold",
                  isActive ? "bg-mint text-ocean" : "text-slate-600 hover:bg-slate-100"
                )
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </div>
  );
}
