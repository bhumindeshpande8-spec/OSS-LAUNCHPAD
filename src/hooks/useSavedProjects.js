import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import {
  getSavedProject,
  getSavedProjects,
  removeSavedProject,
  saveProject,
  updateProgressStage
} from "../services/savedProjectService";

export function useSavedProjects() {
  const { user } = useAuth();
  const [savedProjects, setSavedProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSavedProjects = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      setSavedProjects(await getSavedProjects(user.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchSavedProjects();
  }, [fetchSavedProjects]);

  const changeStage = useCallback(
    async (savedProjectId, stage, projectName) => {
      const updated = await updateProgressStage({ userId: user.id, savedProjectId, stage, projectName });
      setSavedProjects((items) => items.map((item) => (item.id === updated.id ? updated : item)));
      return updated;
    },
    [user]
  );

  return { savedProjects, loading, error, refetch: fetchSavedProjects, changeStage };
}

export function useSavedProject(projectId) {
  const { user } = useAuth();
  const [savedProject, setSavedProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchSavedProject = useCallback(async () => {
    if (!user || !projectId) return;
    setLoading(true);
    setSavedProject(await getSavedProject(user.id, projectId));
    setLoading(false);
  }, [projectId, user]);

  useEffect(() => {
    fetchSavedProject();
  }, [fetchSavedProject]);

  const save = useCallback(
    async (project) => {
      const saved = await saveProject({ userId: user.id, project });
      setSavedProject(saved);
      return saved;
    },
    [user]
  );

  const remove = useCallback(
    async () => {
      if (!savedProject) return;
      await removeSavedProject({
        userId: user.id,
        savedProjectId: savedProject.id,
        projectName: savedProject.project?.name
      });
      setSavedProject(null);
    },
    [savedProject, user]
  );

  const changeStage = useCallback(
    async (stage) => {
      const updated = await updateProgressStage({
        userId: user.id,
        savedProjectId: savedProject.id,
        stage,
        projectName: savedProject.project?.name
      });
      setSavedProject(updated);
      return updated;
    },
    [savedProject, user]
  );

  return { savedProject, loading, save, remove, changeStage, refetch: fetchSavedProject };
}
