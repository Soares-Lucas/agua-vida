import React from 'react';
import { PlusIcon } from './icons/PlusIcon';
import { ListIcon } from './icons/ListIcon';
import { StackIcon } from './icons/StackIcon';

interface FABProps {
  isOpen: boolean;
  onToggle: () => void;
  onCreateList: () => void;
  onCreateStack: () => void;
}

const FAB: React.FC<FABProps> = ({ isOpen, onToggle, onCreateList, onCreateStack }) => {
  return (
    <div className="fixed bottom-8 right-8 z-50">
      <div className="relative flex flex-col items-center gap-3">
        {/* Secondary Action Buttons */}
        <div 
          className={`transition-all duration-300 ease-in-out flex flex-col items-center gap-3 ${
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          }`}
        >
          <div className="flex items-center gap-3">
            <span className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold px-3 py-1 rounded-md shadow-lg">
              Nova Pilha
            </span>
            <button
              onClick={onCreateStack}
              className="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              aria-label="Create new stack"
            >
              <StackIcon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex items-center gap-3">
            <span className="bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-semibold px-3 py-1 rounded-md shadow-lg">
              Nova Lista
            </span>
            <button
              onClick={onCreateList}
              className="bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              aria-label="Create new list"
            >
              <ListIcon className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Main FAB */}
        <button
          onClick={onToggle}
          className="bg-brand-accent text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center hover:bg-emerald-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-emerald-300"
          aria-expanded={isOpen}
          aria-label="Create menu"
        >
          <PlusIcon className={`w-8 h-8 transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`} />
        </button>
      </div>
    </div>
  );
};

export default FAB;