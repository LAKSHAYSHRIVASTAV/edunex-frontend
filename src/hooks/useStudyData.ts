import { useState, useEffect } from 'react';

interface StudyData {
  subject: string;
  hoursStudied: number;
  progress: number;
}

const useStudyData = () => {
  const [studyData, setStudyData] = useState<StudyData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = async () => {
      setLoading(true);
      // Dummy data for initial development
      const dummyData: StudyData[] = [
        { subject: 'Mathematics', hoursStudied: 10, progress: 70 },
        { subject: 'Science', hoursStudied: 8, progress: 50 },
        { subject: 'History', hoursStudied: 5, progress: 30 },
      ];
      setStudyData(dummyData);
      setLoading(false);
    };

    fetchData();
  }, []);

  return { studyData, loading };
};

export default useStudyData;