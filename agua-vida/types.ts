
export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  timeSpent: number; // in seconds
  isTimerRunning?: boolean;
  value?: number;
}

export interface TaskList {
  id:string;
  title: string;
  imageUrl: string;
  tasks: Task[];
  stack?: string; // e.g., "Personal", "Work"
  hasTimer: boolean;
  timerMode: 'none' | 'pomodoro' | 'rest';
  restInterval: number; // in minutes
  isFinancial?: boolean;
}