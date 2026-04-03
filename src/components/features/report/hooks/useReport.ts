import { useState, useEffect, useCallback } from "react";

const API_BASE = "https://edunex-backend-rj22.onrender.com/api";

export function useReport(period: string) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/summary?period=${period}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const text = await res.text();

      // ✅ Safe JSON parsing
      try {
        const json = JSON.parse(text);
        setData(json);
      } catch {
        console.error("❌ Backend returned HTML instead of JSON:", text);
        setError("Invalid server response");
      }

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch report");
    } finally {
      setLoading(false);
    }

  }, [period]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { data, loading, error, refetch: fetchReport };
}

/* =========================
   PERIODS HOOK
========================= */

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
      .then((res) => res.json())
      .then((data) => {
        const mapped = data.map((p: any) => ({
          value: p.value,
          label: p.label.replace("Last ", ""),
        }));
        setPeriods(mapped);
      })
      .catch(() => {});
  }, []);

  return periods;
}