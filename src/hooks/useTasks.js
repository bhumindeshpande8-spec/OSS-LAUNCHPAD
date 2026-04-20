import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { createTask, deleteTask, getTasks, getTasksByProject, updateTask } from "../services/taskService";

export function useTasks(projectId = null) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      setTasks(projectId ? await getTasksByProject(user.id, projectId) : await getTasks(user.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [projectId, user]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const addTask = useCallback(
    async (values, projectName) => {
      const task = await createTask({ userId: user.id, values, projectName });
      setTasks((items) => [task, ...items]);
      return task;
    },
    [user]
  );

  const editTask = useCallback(
    async (taskId, values) => {
      const task = await updateTask({ userId: user.id, taskId, values });
      setTasks((items) => items.map((item) => (item.id === taskId ? task : item)));
      return task;
    },
    [user]
  );

  const removeTask = useCallback(
    async (taskId) => {
      await deleteTask({ userId: user.id, taskId });
      setTasks((items) => items.filter((item) => item.id !== taskId));
    },
    [user]
  );

  return { tasks, loading, error, addTask, editTask, removeTask, refetch: fetchTasks };
}
