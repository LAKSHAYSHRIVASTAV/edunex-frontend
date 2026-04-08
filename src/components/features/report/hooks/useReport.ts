import { useCallback, useEffect, useMemo, useState } from "react";
import API from "../../../../config/api";

const getStoredUserId = () => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    const user = JSON.parse(storedUser);
    return user?.id || user?._id || null;
  } catch {
    return null;
  }
};

export function useReport(period: string) {
  const userId = useMemo(getStoredUserId, []);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = userId ? `/report/${userId}` : "/summary";
      const res = await API.get(endpoint, { params: { period } });
      setData(res.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Failed to fetch report");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [period, userId]);

  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  return { data, loading, error, refetch: fetchReport };
}

export function usePeriods() {
  const [periods, setPeriods] = useState([
    { value: "7d", label: "7D" },
    { value: "30d", label: "30D" },
    { value: "3m", label: "3M" },
    { value: "6m", label: "6M" },
    { value: "1y", label: "1Y" },
    { value: "all", label: "All" },
  ]);

  useEffect(() => {
    API.get("/report/periods")
      .then((res) => {
        setPeriods(
          res.data.map((period: any) => ({
            value: period.value,
            label: period.value === "all" ? "All" : period.value.toUpperCase(),
          }))
        );
      })
      .catch(() => {});
  }, []);

  return periods;
}
