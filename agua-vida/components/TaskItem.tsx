import React from 'react';
import { Task } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

interface TaskItemProps {
  task: Task;
  hasTimer: boolean;
  isFinancial: boolean;
  onToggle: () => void;
  onToggleTimer: () => void;
}

const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    
    if (hours > 0) {
        const paddedHours = String(hours).padStart(2, '0');
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
    }

    return `${paddedMinutes}:${paddedSeconds}`;
}

const formatCurrency = (value: number) => {
    return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

const TaskItem: React.FC<TaskItemProps> = ({ task, hasTimer, isFinancial, onToggle, onToggleTimer }) => {
  return (
    <li
      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg transition-colors duration-200"
    >
      <div 
        onClick={onToggle}
        className="flex items-center cursor-pointer flex-grow mr-2"
        >
        <div
          className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center border-2 transition-all duration-200 ${
            task.completed
              ? 'bg-blue-600 border-blue-600'
              : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-600'
          }`}
        >
          {task.completed && <CheckIcon className="w-4 h-4 text-white" />}
        </div>
        <div className="ml-4 flex-grow">
          <span
            className={`text-base ${
              task.completed ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-700 dark:text-slate-300'
            }`}
          >
            {task.text}
          </span>
          {isFinancial && typeof task.value === 'number' && (
              <p className={`text-sm font-semibold mt-0.5 ${task.completed ? 'text-emerald-700/50 dark:text-emerald-500/50 line-through' : 'text-emerald-600 dark:text-emerald-500'}`}>
                  {formatCurrency(task.value)}
              </p>
          )}
        </div>
      </div>

      {hasTimer && (
          <div className="flex items-center flex-shrink-0">
              <span className="text-sm font-mono text-slate-500 dark:text-slate-400 w-20 text-right">
                  {formatTime(task.timeSpent || 0)}
              </span>
              <button 
                onClick={onToggleTimer} 
                className="ml-2 p-2 rounded-full text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={task.isTimerRunning ? 'Pause timer' : 'Start timer'}
              >
                  {task.isTimerRunning ? <PauseIcon className="w-5 h-5 text-blue-500"/> : <PlayIcon className="w-5 h-5"/>}
              </button>
          </div>
      )}
    </li>
  );
};

export default TaskItem;