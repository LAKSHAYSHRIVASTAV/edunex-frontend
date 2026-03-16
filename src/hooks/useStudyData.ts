import { useState, useEffect } from "react";

export interface DashboardData {
  weeklyHours: {
    Mon: number;
    Tue: number;
    Wed: number;
    Thu: number;
    Fri: number;
    Sat: number;
    Sun: number;
  };
  subjectDistribution: { subject: string; percentage: number }[];
  totalHours: number;
  avgDaily: number;
  streak?: number;
}

const useStudyData = () => {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Dummy data
      const data: DashboardData = {
        weeklyHours: {
          Mon: 2,
          Tue: 3,
          Wed: 1,
          Thu: 4,
          Fri: 2,
          Sat: 5,
          Sun: 3,
        },

        subjectDistribution: [
          { subject: "Mathematics", percentage: 35 },
          { subject: "Science", percentage: 30 },
          { subject: "History", percentage: 20 },
          { subject: "AI", percentage: 15 },
        ],

        totalHours: 20,
        avgDaily: 2.8,
        streak: 5,
      };

      setDashboardData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { dashboardData, loading };
};

export default useStudyData;