import React from 'react';
import { User } from '../types';
import { PomodoroIcon } from './icons/PomodoroIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

const API_URL = process.env.API_URL || 'http://localhost:8000';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onPomodoroClick: () => void;
  theme: 'dark' | 'light';
  onThemeToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout, onPomodoroClick, theme, onThemeToggle }) => {
  return (
    <header className="bg-white dark:bg-slate-900 shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">Água Vida</span>
          </div>
          <div className="flex items-center">
             <button
              onClick={onThemeToggle}
              className="p-2 rounded-full text-slate-500 dark:text-yellow-400 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-2"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
            <button
              onClick={onPomodoroClick}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 mr-4"
              aria-label="Open Pomodoro Timer"
            >
              <PomodoroIcon className="w-6 h-6" />
            </button>
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mr-3 hidden sm:block">{user.name}</span>
            <img className="h-8 w-8 rounded-full" src={user.avatarUrl} alt="User avatar" />
            <a
              href={`${API_URL}/api/logout`}
              onClick={onLogout}
              className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-white"
            >
              Sair
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
