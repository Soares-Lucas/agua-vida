import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { User, TaskList } from '../types';
import { mockTaskLists } from '../mockData';
import Header from '../components/Header';
import StatCard from '../components/StatCard';
import TaskListCard from '../components/TaskListCard';
import TaskListView from './TaskListView';
import FAB from '../components/FAB';
import PomodoroTimer from '../components/PomodoroTimer';
import PieChart from '../components/PieChart';
import CreateListModal from '../components/CreateListModal';
import CreateStackModal from '../components/CreateStackModal';
import { SearchIcon } from '../components/icons/SearchIcon';
import { ChevronDownIcon } from '../components/icons/ChevronDownIcon';
import { DollarIcon } from '../components/icons/DollarIcon';

const API_URL = process.env.API_URL || 'http://localhost:8000';

interface DashboardPageProps {
  user: User;
  onLogout: () => void;
  isTestDrive: boolean;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

const formatAverageTime = (totalSeconds: number) => {
    if (totalSeconds === 0) return 'N/A';
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};


const DashboardPage: React.FC<DashboardPageProps> = ({ user, onLogout, isTestDrive, theme, onThemeToggle }) => {
  const [taskLists, setTaskLists] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedListId, setSelectedListId] = useState<string | null>(null);
  const [isFabOpen, setIsFabOpen] = useState(false);
  const [isPomodoroSettingsOpen, setIsPomodoroSettingsOpen] = useState(false);
  const [activeRestTimer, setActiveRestTimer] = useState<{ listId: string; secondsLeft: number } | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'in-progress' | 'completed'>('all');
  const [showFinancialOnly, setShowFinancialOnly] = useState(false);
  const [isMetricsVisible, setIsMetricsVisible] = useState(false);
  
  const [isCreateListModalOpen, setCreateListModalOpen] = useState(false);
  const [isCreateStackModalOpen, setCreateStackModalOpen] = useState(false);

  const timerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restTimerIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const [pomodoroConfig, setPomodoroConfig] = useState({ focus: 25, short: 5, long: 15, sessions: 4 });

  const fetchTaskLists = useCallback(async () => {
    if (isTestDrive) {
      setTaskLists(mockTaskLists);
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/tasklists`);
      if (response.ok) {
        const data = await response.json();
        setTaskLists(data);
      } else {
        console.error("Failed to fetch task lists");
      }
    } catch (error) {
      console.error("Error fetching task lists:", error);
    } finally {
      setLoading(false);
    }
  }, [isTestDrive]);

  useEffect(() => {
    fetchTaskLists();
  }, [fetchTaskLists]);
  
  const stopActiveTimer = useCallback(() => {
    if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
    }
  }, []);

  const stopRestTimer = useCallback(() => {
    if (restTimerIntervalRef.current) {
        clearInterval(restTimerIntervalRef.current);
        restTimerIntervalRef.current = null;
    }
    setActiveRestTimer(null);
  }, []);

  useEffect(() => {
    return () => { // Cleanup on unmount
      stopActiveTimer();
      stopRestTimer();
    };
  }, [stopActiveTimer, stopRestTimer]);

  const handleToggleTask = async (listId: string, taskId: string) => {
    const originalTaskLists = JSON.parse(JSON.stringify(taskLists)); // Deep copy for rollback

    // Optimistically update the UI for better responsiveness
    setTaskLists(prevLists =>
      prevLists.map(list => {
        if (list.id === listId) {
          const newTasks = list.tasks.map(task => {
            if (task.id === taskId) {
              const updatedTask = { ...task, completed: !task.completed };
              // If the task being completed had a running timer, stop it
              if (updatedTask.completed && task.isTimerRunning) {
                stopActiveTimer();
                updatedTask.isTimerRunning = false;
              }
              return updatedTask;
            }
            return task;
          });
          return { ...list, tasks: newTasks };
        }
        return list;
      })
    );

    // If not in test drive mode, sync the change with the backend
    if (!isTestDrive) {
      try {
        const response = await fetch(`${API_URL}/api/tasklists/${listId}/tasks/${taskId}`, { method: 'PATCH' });
        if (!response.ok) {
          // If the API call fails, revert the optimistic update
          console.error("Failed to update task on server, rolling back.");
          setTaskLists(originalTaskLists);
        }
        // On success, the UI is already in the correct state. No further action needed.
      } catch (error) {
        console.error("Error toggling task:", error);
        // On network or other errors, revert the optimistic update
        setTaskLists(originalTaskLists);
      }
    }
  };


  const handleUpdateList = async (listId: string, updates: Partial<Pick<TaskList, 'timerMode' | 'restInterval'>>) => {
    let updatedList: TaskList | null = null;
    if(!isTestDrive) {
        try {
            const response = await fetch(`${API_URL}/api/tasklists/${listId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!response.ok) throw new Error('Failed to update list');
            updatedList = await response.json();
        } catch (error) {
            console.error("Error updating list:", error);
            return;
        }
    }
    
    setTaskLists(prevLists => {
        const newLists = prevLists.map(list => {
            if (list.id === listId) {
                return updatedList || { ...list, ...updates };
            }
            return list;
        });
        return newLists;
    });
  };

  const handleToggleTimer = (listId: string, taskId: string) => {
    stopActiveTimer();
    
    let isStartingNewTimer = false;
    let newRunningTaskId: string | null = null;

    setTaskLists(currentLists => {
        return currentLists.map(list => {
            if (list.id === listId) {
                let foundTaskWasRunning = false;
                const newTasks = list.tasks.map(task => {
                    if (task.isTimerRunning) {
                        foundTaskWasRunning = true;
                        return { ...task, isTimerRunning: false };
                    }
                    if (task.id === taskId && !foundTaskWasRunning) {
                        isStartingNewTimer = true;
                        newRunningTaskId = taskId;
                        return { ...task, isTimerRunning: true };
                    }
                    return { ...task, isTimerRunning: false };
                });
                return { ...list, tasks: newTasks };
            }
            return {
                ...list,
                tasks: list.tasks.map(t => ({...t, isTimerRunning: false}))
            };
        });
    });

    if (isStartingNewTimer && newRunningTaskId) {
        timerIntervalRef.current = setInterval(() => {
            setTaskLists(prevLists => 
                prevLists.map(list => {
                    if (list.id === listId) {
                        return {
                            ...list,
                            tasks: list.tasks.map(task => 
                                task.id === newRunningTaskId ? { ...task, timeSpent: (task.timeSpent || 0) + 1 } : task
                            )
                        };
                    }
                    return list;
                })
            );
        }, 1000);
    }
  };
  
  const handleStartPomodoro = () => {
    alert(`Iniciando Pomodoro de ${pomodoroConfig.focus} minutos!`);
  };

  const handleCreateList = async (listData: { title: string; imageUrl: string; stack: string; hasTimer: boolean; isFinancial: boolean; }) => {
    const newList: Omit<TaskList, 'id'> = {
        ...listData,
        tasks: [],
        timerMode: 'none',
        restInterval: 5,
    };

    if (isTestDrive) {
        const fullNewList: TaskList = { ...newList, id: `tl${Date.now()}` };
        setTaskLists(prev => [...prev, fullNewList]);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/api/tasklists`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newList),
        });
        if (response.ok) {
            const createdList = await response.json();
            setTaskLists(prev => [...prev, createdList]);
        } else {
            console.error("Failed to create task list");
        }
    } catch (error) {
        console.error("Error creating task list:", error);
    }
  };

  const handleCreateStack = async (stackData: { stack: string; title: string }) => {
      await handleCreateList({ 
          ...stackData, 
          imageUrl: `https://picsum.photos/seed/${stackData.title}/400/300`, 
          hasTimer: false,
          isFinancial: false, 
      });
  };
  
  const handleAddTask = async (listId: string, taskData: { text: string; value?: number }) => {
    if (isTestDrive) {
        const newTask = {
            id: `t${Date.now()}`,
            text: taskData.text,
            value: taskData.value,
            completed: false,
            timeSpent: 0,
        };
        const updatedLists = taskLists.map(list => {
            if (list.id === listId) {
                return { ...list, tasks: [...list.tasks, newTask] };
            }
            return list;
        });
        setTaskLists(updatedLists);
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/api/tasklists/${listId}/tasks`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });
        if (response.ok) {
            const updatedList = await response.json();
            const updatedLists = taskLists.map(list => list.id === listId ? updatedList : list);
            setTaskLists(updatedLists);
        } else {
            console.error("Failed to add task");
        }
    } catch (error) {
        console.error("Error adding task:", error);
    }
  };

  useEffect(() => {
    const listInRestMode = taskLists.find(l => l.timerMode === 'rest');
    if (listInRestMode) {
        const allTasksCompleted = listInRestMode.tasks.every(t => t.completed);
        const timerNotRunning = !activeRestTimer || activeRestTimer.listId !== listInRestMode.id;
        
        if (allTasksCompleted && timerNotRunning) {
            stopRestTimer();
            const seconds = (listInRestMode.restInterval || 5) * 60;
            setActiveRestTimer({ listId: listInRestMode.id, secondsLeft: seconds });

            restTimerIntervalRef.current = setInterval(() => {
                setActiveRestTimer(currentTimer => {
                    if (currentTimer && currentTimer.secondsLeft > 1) {
                        return { ...currentTimer, secondsLeft: currentTimer.secondsLeft - 1 };
                    } else {
                        stopRestTimer();
                        return null;
                    }
                });
            }, 1000);
        }
    }
  }, [taskLists, activeRestTimer, stopRestTimer]);


  const listStats = useMemo(() => {
    let completedListsCount = 0;
    let inProgressListsCount = 0;
    let openListsCount = 0;
    let totalCompletionTime = 0;
    let completedListsWithTime = 0;

    taskLists.forEach(list => {
        if (list.tasks.length === 0) {
            openListsCount++;
            return;
        }
        const isCompleted = list.tasks.every(t => t.completed);
        const isStarted = list.tasks.some(t => t.completed);

        if (isCompleted) {
            completedListsCount++;
            const listTime = list.tasks.reduce((sum, task) => sum + task.timeSpent, 0);
            if(listTime > 0) {
               totalCompletionTime += listTime;
               completedListsWithTime++;
            }
        } else if (isStarted) {
            inProgressListsCount++;
        } else {
            openListsCount++;
        }
    });

    const averageTime = completedListsWithTime > 0 ? totalCompletionTime / completedListsWithTime : 0;

    const pieData = [
        { label: 'Concluídas', value: completedListsCount, color: '#10b981' },
        { label: 'Em Andamento', value: inProgressListsCount, color: '#f59e0b' },
        { label: 'Em Aberto', value: openListsCount, color: '#64748b' },
    ].filter(item => item.value > 0);

    return { pieData, averageCompletionTime: formatAverageTime(averageTime) };
  }, [taskLists]);

  const stackStats = useMemo(() => {
    const stacks: { [key: string]: TaskList[] } = {};
    taskLists.forEach(list => {
        const stackName = list.stack || 'Uncategorized';
        if (!stacks[stackName]) stacks[stackName] = [];
        stacks[stackName].push(list);
    });

    let completedStacksCount = 0, inProgressStacksCount = 0, openStacksCount = 0;
    let totalStackCompletionTime = 0, completedStacksWithTime = 0;

    Object.values(stacks).forEach(listsInStack => {
        if (listsInStack.length === 0) return;
        const getStatus = (l: TaskList) => (l.tasks.length > 0 && l.tasks.every(t => t.completed)) ? 'completed' : (l.tasks.some(t => t.completed) ? 'in-progress' : 'open');
        const statuses = listsInStack.map(getStatus);

        if (statuses.every(s => s === 'completed')) {
            completedStacksCount++;
            const timeForThisStack = listsInStack.reduce((sum, l) => sum + l.tasks.reduce((ts, t) => ts + t.timeSpent, 0), 0);
            if (timeForThisStack > 0) {
                totalStackCompletionTime += timeForThisStack;
                completedStacksWithTime++;
            }
        } else if (statuses.every(s => s === 'open')) {
            openStacksCount++;
        } else {
            inProgressStacksCount++;
        }
    });

    const averageTime = completedStacksWithTime > 0 ? totalStackCompletionTime / completedStacksWithTime : 0;

    const pieData = [
        { label: 'Concluídas', value: completedStacksCount, color: '#10b981' },
        { label: 'Em Andamento', value: inProgressStacksCount, color: '#f59e0b' },
        { label: 'Em Aberto', value: openStacksCount, color: '#64748b' },
    ].filter(item => item.value > 0);

    return { pieData, averageCompletionTime: formatAverageTime(averageTime) };
  }, [taskLists]);

  const filteredTaskLists = useMemo(() => {
    return taskLists
      .filter(list => list.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter(list => !showFinancialOnly || list.isFinancial)
      .filter(list => {
        if (filterStatus === 'all') return true;
        const isCompleted = list.tasks.length > 0 && list.tasks.every(t => t.completed);
        const isStarted = list.tasks.some(t => t.completed) && !isCompleted;
        if (filterStatus === 'completed') return isCompleted;
        if (filterStatus === 'in-progress') return isStarted;
        return false;
      });
  }, [taskLists, searchQuery, filterStatus, showFinancialOnly]);

  const selectedList = useMemo(() => 
    taskLists.find(list => list.id === selectedListId), 
    [taskLists, selectedListId]
  );

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-100 dark:bg-blue-950"><p className="text-slate-500">Carregando painel...</p></div>;
  }

  const FilterButton: React.FC<{ status: typeof filterStatus, children: React.ReactNode }> = ({ status, children }) => (
    <button
        onClick={() => setFilterStatus(status)}
        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            filterStatus === status 
            ? 'bg-blue-600 text-white' 
            : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
        }`}
    >
        {children}
    </button>
  );

  return (
    <div className="bg-slate-50 dark:bg-blue-950 min-h-screen">
      <Header user={user} onLogout={onLogout} onPomodoroClick={() => setIsPomodoroSettingsOpen(true)} theme={theme} onThemeToggle={onThemeToggle} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Painel</h1>
        <p className="mt-1 text-slate-500 dark:text-slate-400">Bem-vindo(a) de volta, {user.name.split(' ')[0]}.</p>

        <div className="mt-8 bg-white dark:bg-slate-800/50 p-6 rounded-xl shadow-lg">
            <div 
                onClick={() => setIsMetricsVisible(prev => !prev)} 
                className="flex justify-between items-center cursor-pointer"
                aria-expanded={isMetricsVisible}
            >
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Métricas</h2>
                <ChevronDownIcon className={`w-6 h-6 text-slate-500 transition-transform duration-300 ${isMetricsVisible ? 'rotate-180' : ''}`} />
            </div>
            {isMetricsVisible && (
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-slate-200 dark:border-slate-700 pt-6">
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center">Estatísticas das Pilhas</h3>
                        <PieChart data={stackStats.pieData} />
                        <StatCard title="Tempo Médio de Conclusão das Pilhas" value={stackStats.averageCompletionTime} />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 text-center">Estatísticas das Listas</h3>
                        <PieChart data={listStats.pieData} />
                        <StatCard title="Tempo Médio de Conclusão das Listas" value={listStats.averageCompletionTime} />
                    </div>
                </div>
            )}
        </div>

        <div className="mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Suas Listas de Tarefas</h2>
              <div className="flex items-center gap-2 flex-wrap justify-center">
                  <div className="relative">
                      <input 
                        type="text" 
                        placeholder="Pesquisar..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-40 sm:w-48 pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                      <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  </div>
                  <div className="flex items-center gap-2">
                    <FilterButton status="all">Todos</FilterButton>
                    <FilterButton status="in-progress">Em Andamento</FilterButton>
                    <FilterButton status="completed">Concluídos</FilterButton>
                  </div>
                   <button
                    onClick={() => setShowFinancialOnly(prev => !prev)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                        showFinancialOnly 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700'
                    }`}
                  >
                      <DollarIcon className="w-4 h-4" />
                      <span>Apenas Financeiro</span>
                  </button>
              </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTaskLists.map(list => (
              <TaskListCard key={list.id} list={list} onClick={() => setSelectedListId(list.id)} />
              ))}
          </div>
          {filteredTaskLists.length === 0 && !loading && (
            <div className="text-center py-16 col-span-full">
                <p className="text-slate-500 dark:text-slate-400">Nenhuma lista encontrada.</p>
                <p className="text-sm text-slate-400">Tente ajustar seus filtros ou busca.</p>
            </div>
          )}
        </div>
      </main>

      {selectedList && (
        <TaskListView
          list={selectedList}
          onClose={() => setSelectedListId(null)}
          onToggleTask={handleToggleTask}
          onToggleTimer={handleToggleTimer}
          onUpdateList={handleUpdateList}
          onAddTask={handleAddTask}
          activeRestTimer={activeRestTimer}
          onStartPomodoro={handleStartPomodoro}
        />
      )}

      <FAB
        isOpen={isFabOpen}
        onToggle={() => setIsFabOpen(prev => !prev)}
        onCreateList={() => { setCreateListModalOpen(true); setIsFabOpen(false); }}
        onCreateStack={() => { setCreateStackModalOpen(true); setIsFabOpen(false); }}
      />
      
      {isPomodoroSettingsOpen && (
        <PomodoroTimer 
          onClose={() => setIsPomodoroSettingsOpen(false)}
          config={pomodoroConfig}
          onConfigChange={setPomodoroConfig}
        />
      )}

      {isCreateListModalOpen && (
        <CreateListModal 
            onClose={() => setCreateListModalOpen(false)} 
            onCreate={handleCreateList} 
        />
      )}
      
      {isCreateStackModalOpen && (
        <CreateStackModal 
            onClose={() => setCreateStackModalOpen(false)} 
            onCreate={handleCreateStack}
        />
      )}
    </div>
  );
};

export default DashboardPage;
