import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { ProgressTracker } from './ProgressTracker';
import { Analytics } from './Analytics';

const Dashboard: React.FC = () => {
    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <Card title="Study Sessions" content="Track your study sessions and progress." />
                <Card title="Upcoming Deadlines" content="Stay on top of your assignments." />
                <Card title="Performance Overview" content="Analyze your performance across subjects." />
            </div>
            <div className="mb-4">
                <Button label="Plan Study Schedule" onClick={() => console.log('Planning...')} />
            </div>
            <ProgressTracker />
            <Analytics />
        </div>
    );
};

export default Dashboard;