import React from 'react';
import { Link } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Study Planner', path: '/study-planner' },
  { name: 'Progress Tracker', path: '/progress-tracker' },
  { name: 'Analytics', path: '/analytics' },
];

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        <LucideIcon name="BookOpen" className="h-8 w-8 mr-2" />
        <h1 className="text-xl font-bold">EDUNEX</h1>
      </div>
      <nav>
        <ul className="flex space-x-4">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link to={link.path} className="hover:text-gray-300">
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;