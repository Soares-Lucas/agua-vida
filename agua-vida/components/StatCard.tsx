import React from 'react';

interface StatCardProps {
  title: string;
  value: number | string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg transition-transform transform hover:-translate-y-1">
      <h3 className="text-sm font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{title}</h3>
      <p className="mt-1 text-4xl font-bold text-blue-600 dark:text-blue-400">{value}</p>
    </div>
  );
};

export default StatCard;