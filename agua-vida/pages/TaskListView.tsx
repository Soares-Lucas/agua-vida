import React, { useState, useMemo, useEffect, useRef } from 'react';
import { TaskList } from '../types';
import TaskItem from '../components/TaskItem';
import { XIcon } from '../components/icons/XIcon';
import { ClockIcon } from '../components/icons/ClockIcon';
import { DollarIcon } from '../components/icons/DollarIcon';
import AddTaskForm from '../components/AddTaskForm';
import { PlusIcon } from '../components/icons/PlusIcon';
import Confetti from '../components/Confetti';

interface TaskListViewProps {
  list: TaskList;
  onClose: () => void;
  onToggleTask: (listId: string, taskId: string) => void;
  onToggleTimer: (listId: string, taskId: string) => void;
  onUpdateList: (listId: string, updates: Partial<Pick<TaskList, 'timerMode' | 'restInterval'>>) => void;
  onAddTask: (listId: string, taskData: { text: string; value?: number }) => void;
  // FIX: Renamed prop from activeRestimer to activeRestTimer to fix typo.
  activeRestTimer: { listId: string; secondsLeft: number } | null;
  onStartPomodoro: () => void;
}

const formatRestTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const seconds = (totalSeconds % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
}

const TimerModeControl: React.FC<{ list: TaskList; onUpdateList: TaskListViewProps['onUpdateList']}> = ({ list, onUpdateList }) => {
    const modes: TaskList['timerMode'][] = ['none', 'pomodoro', 'rest'];
    const modeLabels = { none: 'Nenhum', pomodoro: 'Pomodoro', rest: 'Descanso' };

    return (
        <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg">
            {modes.map(mode => (
                <button
                    key={mode}
                    onClick={() => onUpdateList(list.id, { timerMode: mode })}
                    className={`flex-1 px-3 py-1.5 text-sm font-semibold rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-100 dark:focus:ring-offset-slate-800 focus:ring-blue-500 ${
                        list.timerMode === mode
                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-300 shadow'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                >
                    {modeLabels[mode]}
                </button>
            ))}
        </div>
    );
};

const TaskListView: React.FC<TaskListViewProps> = ({ list, onClose, onToggleTask, onToggleTimer, onUpdateList, activeRestTimer, onStartPomodoro, onAddTask }) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const prevTasksRef = useRef(list.tasks);

  useEffect(() => {
    const prevTasks = prevTasksRef.current;
    const currentTasks = list.tasks;

    const wasPreviouslyIncomplete = prevTasks.length > 0 && prevTasks.some(t => !t.completed);
    const isNowComplete = currentTasks.length > 0 && currentTasks.every(t => t.completed);

    if (wasPreviouslyIncomplete && isNowComplete) {
      setIsCelebrating(true);
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Close modal after 3 seconds of confetti

      return () => clearTimeout(timer);
    }

    prevTasksRef.current = currentTasks;
  }, [list.tasks, onClose]);

  const completedTasks = list.tasks.filter(t => t.completed).length;
  const totalTasks = list.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isResting = activeRestTimer && activeRestTimer.listId === list.id;

  const sortedTasks = useMemo(() =>
    [...list.tasks].sort((a, b) => {
        if (a.completed === b.completed) return 0; // Keep original order for same status
        return a.completed ? 1 : -1; // Incomplete tasks first
    }),
  [list.tasks]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      {isCelebrating && <Confetti />}
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        style={{ animationFillMode: 'forwards' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{list.title}</h2>
              {list.isFinancial && (
                  <span className="p-1 rounded-full bg-emerald-100 dark:bg-emerald-900/50" title="Lista Financeira">
                      <DollarIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </span>
              )}
            </div>
            {list.hasTimer && (
              <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mt-1">
                <ClockIcon className="w-4 h-4 mr-1.5" />
                <span>Cronômetro ativado</span>
              </div>
            )}
          </div>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            <XIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 flex-grow overflow-y-auto">
          <div className="mb-4">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">Modo de Foco</label>
            <TimerModeControl list={list} onUpdateList={onUpdateList} />
          </div>

          {list.timerMode === 'rest' && (
            <div className="my-4 p-4 bg-slate-100 dark:bg-slate-700/50 rounded-lg">
                <label htmlFor="rest-interval" className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2 block">
                    Intervalo de Descanso (minutos)
                </label>
                 <input 
                    id="rest-interval" 
                    type="number" 
                    min="1" 
                    value={list.restInterval || 1} 
                    onChange={(e) => onUpdateList(list.id, { restInterval: parseInt(e.target.value, 10) || 1 })} 
                    className="w-full p-2 rounded-md bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>
          )}

          <div className="mb-6 h-16 flex items-center justify-center">
            {isResting && (
                <div className="text-center">
                    <p className="text-slate-500 dark:text-slate-400">Tempo de descanso:</p>
                    {/* FIX: Corrected variable name from activeRestimer to activeRestTimer. */}
                    <p className="text-3xl font-bold font-mono text-blue-600 dark:text-blue-400">{formatRestTime(activeRestTimer.secondsLeft)}</p>
                </div>
            )}
            {list.timerMode === 'pomodoro' && !isResting && (
                <button onClick={onStartPomodoro} className="px-6 py-2 rounded-lg font-semibold bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                    Iniciar Pomodoro
                </button>
            )}
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-center mb-1 text-sm text-slate-600 dark:text-slate-400">
              <span>Progresso</span>
              <span>{completedTasks} / {totalTasks}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          
          <ul className="space-y-3">
            {sortedTasks.map(task => (
              <TaskItem key={task.id} task={task} hasTimer={list.hasTimer} isFinancial={!!list.isFinancial} onToggle={() => onToggleTask(list.id, task.id)} onToggleTimer={() => onToggleTimer(list.id, task.id)} />
            ))}
            {list.tasks.length === 0 && !isAddingTask && <p className="text-center text-slate-500 dark:text-slate-400 py-8">Nenhuma tarefa nesta lista ainda.</p>}

            {!isAddingTask && (
              <li className="mt-4">
                <button 
                  onClick={() => setIsAddingTask(true)}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-lg text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700/50 dark:hover:bg-slate-700 transition-colors"
                >
                  <PlusIcon className="w-5 h-5" />
                  Adicionar Tarefa
                </button>
              </li>
            )}

            {isAddingTask && (
              <AddTaskForm
                listId={list.id}
                isFinancial={!!list.isFinancial}
                onSubmit={onAddTask}
                onCancel={() => setIsAddingTask(false)}
              />
            )}
          </ul>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        .animate-fade-in-scale { animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
};

export default TaskListView;
