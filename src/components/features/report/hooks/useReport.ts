import { useState, useEffect, useCallback } from "react";

const API_BASE = "/api";

export function useReport(period) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/report/summary?period=${period}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { data, loading, error, refetch: fetchReport };
}

export function usePeriods() {
  const [periods, setPeriods] = useState([
    { value: "7d", label: "7 days" },
    { value: "30d", label: "30 days" },
    { value: "3m", label: "3 months" },
    { value: "6m", label: "6 months" },
    { value: "1y", label: "1 year" },
    { value: "all", label: "All time" },
  ]);

  useEffect(() => {
    fetch(`${API_BASE}/report/periods`)
      .then((r) => r.json())
      .then((data) => {
        const mapped = data.map((p) => ({
          value: p.value,
          label: p.label.replace("Last ", "").replace("All time", "All time"),
        }));
        setPeriods(mapped);
      })
      .catch(() => {});
  }, []);

  return periods;
}