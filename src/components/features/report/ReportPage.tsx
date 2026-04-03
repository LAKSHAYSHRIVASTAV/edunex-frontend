import React, { useState } from "react";
import { useReport } from "./hooks/useReport";
import ReportView from "./components/ReportView";
import PeriodFilter from "./components/PeriodFilter";
import SkeletonLoader from "./components/SkeletonLoader";

export default function ReportPage() {
  const [period, setPeriod] = useState("30d");
  const { data, loading, error } = useReport(period);

  return (
  <div style={{
    background: "#f5f6fa",
    minHeight: "100vh",
    padding: "30px"
  }}>

    {/* FILTER */}
    <PeriodFilter value={period} onChange={setPeriod} />

    {/* ERROR */}
    {error && <div>Error loading report</div>}

    {/* LOADING */}
    {loading && <SkeletonLoader />}

    {/* FINAL UI */}
    {!loading && data && <ReportView data={data} />}

  </div>
);
}