import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Book, ChartBar, User } from 'lucide-react';

const Sidebar: React.FC = () => {
    return (
        <aside className="w-64 h-full bg-gray-800 text-white">
            <div className="p-4">
                <h2 className="text-xl font-bold">EDUNEX</h2>
            </div>
            <nav className="mt-4">
                <ul>
                    <li className="hover:bg-gray-700">
                        <Link to="/" className="flex items-center p-4">
                            <Home className="mr-2" />
                            Home
                        </Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link to="/study-planner" className="flex items-center p-4">
                            <Book className="mr-2" />
                            Study Planner
                        </Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link to="/progress-tracker" className="flex items-center p-4">
                            <ChartBar className="mr-2" />
                            Progress Tracker
                        </Link>
                    </li>
                    <li className="hover:bg-gray-700">
                        <Link to="/analytics" className="flex items-center p-4">
                            <User className="mr-2" />
                            Analytics
                        </Link>
                    </li>
                </ul>
            </nav>
        </aside>
    );
};

export default Sidebar;