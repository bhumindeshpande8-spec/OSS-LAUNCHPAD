import { useCallback, useEffect, useRef, useState } from "react";
import { getBeginnerIssues } from "../services/githubService";

export function useGoodFirstIssues(githubUrl) {
  const [issues, setIssues] = useState([]);
  const [fetchedAt, setFetchedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const requestId = useRef(0);

  const fetchIssues = useCallback(
    async ({ force = false } = {}) => {
      if (!githubUrl) return;
      // Ignore responses from an older request if the user navigated to another project meanwhile.
      const id = ++requestId.current;
      setLoading(true);
      setError(null);
      try {
        const result = await getBeginnerIssues(githubUrl, { force });
        if (id !== requestId.current) return;
        setIssues(result.issues);
        setFetchedAt(result.fetchedAt);
      } catch (err) {
        if (id !== requestId.current) return;
        setIssues([]);
        setError(err);
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [githubUrl]
  );

  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  const refresh = useCallback(() => fetchIssues({ force: true }), [fetchIssues]);

  return { issues, fetchedAt, loading, error, refresh };
}
