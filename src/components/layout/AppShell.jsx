import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { MobileNav } from "./MobileNav";

export function AppShell() {
  return (
    <div className="min-h-screen bg-paper lg:flex">
      <Sidebar />
      <MobileNav />
      <div className="min-w-0 flex-1">
        <Topbar />
        <main className="px-4 py-6 sm:px-6 lg:px-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
