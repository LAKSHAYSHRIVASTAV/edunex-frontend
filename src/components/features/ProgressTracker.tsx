import React from 'react';
import { Line } from 'react-chartjs-2';
import { useStudyData } from '../../hooks/useStudyData';

const ProgressTracker: React.FC = () => {
    const { progressData } = useStudyData();

    const chartData = {
        labels: progressData.map(data => data.date),
        datasets: [
            {
                label: 'Progress',
                data: progressData.map(data => data.progress),
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
            },
        },
    };

    return (
        <div className="p-4 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Progress Tracker</h2>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default ProgressTracker;