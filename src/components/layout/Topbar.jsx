import { Menu, Moon, Rocket, Sun } from "lucide-react";
import { Button } from "../ui/Button";
import { getInitials } from "../../lib/helpers";
import { useAuth } from "../../hooks/useAuth";
import { UIContext } from "../../context/UIContext";
import { useContext } from "react";

export function Topbar() {
  const { profile, logout } = useAuth();
  const { openMobileNav, theme, toggleTheme } = useContext(UIContext);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={openMobileNav} aria-label="Open navigation">
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-2 lg:hidden">
            <Rocket className="h-5 w-5 text-ocean" />
            <span className="font-bold text-ink">OSS Launchpad</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label="Toggle theme">
            {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <div className="hidden text-right sm:block">
            <p className="text-sm font-semibold text-ink">{profile?.full_name || "Contributor"}</p>
            <p className="text-xs text-slate-500">{profile?.email}</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-mint text-sm font-bold text-ocean">
            {getInitials(profile?.full_name)}
          </div>
          <Button variant="secondary" size="sm" onClick={logout}>
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
