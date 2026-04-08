import React, { useState } from "react";
import { useReport } from "./hooks/useReport";
import ReportView from "./components/ReportView";
import PeriodFilter from "./components/PeriodFilter";
import SkeletonLoader from "./components/SkeletonLoader";
import "./components/reportPreview.css";

export default function ReportPage() {
  const [period, setPeriod] = useState("30d");
  const { data, loading, error, refetch } = useReport(period);

  return (
    <main className="report-shell">
      <div className="report-toolbar">
        <PeriodFilter value={period} onChange={setPeriod} />
      </div>

      {error && (
        <section className="report-error">
          <div>
            <h2>Report could not load</h2>
            <p>{error}</p>
          </div>
          <button type="button" onClick={refetch}>
            Try again
          </button>
        </section>
      )}

      {loading && <SkeletonLoader />}
      {!loading && !error && data && <ReportView data={data} period={period} />}
    </main>
  );
}
