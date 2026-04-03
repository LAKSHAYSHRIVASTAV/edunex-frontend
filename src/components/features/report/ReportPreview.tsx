import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReportView from "./components/ReportView";
import SkeletonLoader from "./components/SkeletonLoader";

export default function ReportPreview() {
  const { id } = useParams();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://edunex-backend-rj22.onrender.com/api/report/share/${id}`)
      .then(res => res.json())
      .then((res) => {
        setData(res);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <SkeletonLoader />;

  return <ReportView data={data} />;
}