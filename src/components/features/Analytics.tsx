import React from 'react';
import { Bar } from 'react-chartjs-2';
import useStudyData from '../../hooks/useStudyData';

const Analytics: React.FC = () => {
    const { studyData } = useStudyData();

    const data = {
        labels: studyData.map(data => data.subject),
        datasets: [
            {
                label: 'Progress',
                data: studyData.map(data => data.progress),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Analytics</h2>
            <Bar data={data} options={options} />
        </div>
    );
};

export default Analytics;
