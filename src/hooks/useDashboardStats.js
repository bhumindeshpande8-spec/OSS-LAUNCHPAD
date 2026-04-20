import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { getDashboardStats } from "../services/analyticsService";

export function useDashboardStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStats = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      setStats(await getDashboardStats(user.id));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { stats, loading, error, refetch: fetchStats };
}
