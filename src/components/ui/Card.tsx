import React from 'react';

interface CardProps {
  title: string;
  content: string;
  actions?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, content, actions }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-700 mb-4">{content}</p>
      {actions && <div className="mt-4">{actions}</div>}
    </div>
  );
};

export default Card;