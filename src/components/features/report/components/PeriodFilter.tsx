import React from "react";
import { usePeriods } from "../hooks/useReport";

export default function PeriodFilter({ value, onChange }) {
  const periods = usePeriods();

  return (
    <div className="period-filter" aria-label="Report period">
      {periods.map((period) => (
        <button
          key={period.value}
          type="button"
          className={value === period.value ? "period-chip active" : "period-chip"}
          onClick={() => onChange(period.value)}
        >
          {period.label}
        </button>
      ))}
    </div>
  );
}
