import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/auth/ProtectedRoute";
import { LoadingSpinner } from "../components/ui/LoadingSpinner";
import { PublicLayout } from "../layouts/PublicLayout";
import { DashboardLayout } from "../layouts/DashboardLayout";

const LandingPage = lazy(() => import("../pages/LandingPage"));
const LoginPage = lazy(() => import("../pages/LoginPage"));
const SignupPage = lazy(() => import("../pages/SignupPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
const DiscoverPage = lazy(() => import("../pages/DiscoverPage"));
const ProjectDetailsPage = lazy(() => import("../pages/ProjectDetailsPage"));
const SavedProjectsPage = lazy(() => import("../pages/SavedProjectsPage"));
const TasksPage = lazy(() => import("../pages/TasksPage"));
const NotesPage = lazy(() => import("../pages/NotesPage"));
const ProfilePage = lazy(() => import("../pages/ProfilePage"));
const NotFoundPage = lazy(() => import("../pages/NotFoundPage"));

export function AppRouter() {
  return (
    <Suspense fallback={<LoadingSpinner label="Loading OSS Launchpad" className="min-h-screen" />}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
        </Route>
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/discover" element={<DiscoverPage />} />
            <Route path="/projects/:slug" element={<ProjectDetailsPage />} />
            <Route path="/saved" element={<SavedProjectsPage />} />
            <Route path="/tasks" element={<TasksPage />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
