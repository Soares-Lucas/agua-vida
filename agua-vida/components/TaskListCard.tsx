import React from 'react';
import { TaskList } from '../types';
import { DollarIcon } from './icons/DollarIcon';

interface TaskListCardProps {
  list: TaskList;
  onClick: () => void;
}

const TaskListCard: React.FC<TaskListCardProps> = ({ list, onClick }) => {
  const completedTasks = list.tasks.filter(t => t.completed).length;
  const totalTasks = list.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  return (
    <div
      onClick={onClick}
      className="bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
    >
      <div className="relative">
        <img className="h-40 w-full object-cover" src={list.imageUrl} alt={list.title} />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
        {list.isFinancial && (
            <div className="absolute top-2 right-2 bg-emerald-500/80 text-white p-1.5 rounded-full" title="Lista Financeira">
                <DollarIcon className="w-4 h-4" />
            </div>
        )}
        <div className="absolute bottom-0 left-0 p-4">
          <h3 className="text-lg font-bold text-white">{list.title}</h3>
          {list.stack && (
            <span className="text-xs font-semibold uppercase text-blue-200 bg-blue-600/50 px-2 py-1 rounded-full">{list.stack}</span>
          )}
        </div>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-center mb-2 text-sm text-slate-600 dark:text-slate-400">
            <span>Progresso</span>
            <span>{completedTasks} / {totalTasks}</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-500" style={{width: `${progress}%`}}></div>
        </div>
      </div>
    </div>
  );
};

export default TaskListCard;