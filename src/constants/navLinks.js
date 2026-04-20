import { BarChart3, BookOpen, Compass, FolderKanban, LayoutDashboard, ListTodo } from "lucide-react";

export const NAV_LINKS = [
  { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { label: "Discover", path: "/discover", icon: Compass },
  { label: "Saved Projects", path: "/saved", icon: FolderKanban },
  { label: "Tasks", path: "/tasks", icon: ListTodo },
  { label: "Notes", path: "/notes", icon: BookOpen },
  { label: "Profile", path: "/profile", icon: BarChart3 }
];
