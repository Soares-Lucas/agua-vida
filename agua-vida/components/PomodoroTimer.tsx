
import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';

interface PomodoroTimerProps {
  onClose: () => void;
  config: {
    focus: number;
    short: number;
    long: number;
    sessions: number;
  };
  onConfigChange: (newConfig: PomodoroTimerProps['config']) => void;
}

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onClose, config, onConfigChange }) => {
  const [localConfig, setLocalConfig] = useState(config);

  const handleSettingsSave = () => {
    onConfigChange(localConfig);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        style={{ animationFillMode: 'forwards' }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Configurações Pomodoro</h2>
            <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Close">
              <XIcon className="w-6 h-6" />
            </button>
        </div>
        
        <div className="p-6">
            <h3 className="text-md font-semibold mb-4 text-slate-700 dark:text-slate-300">Duração (minutos)</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label htmlFor="focus" className="text-slate-600 dark:text-slate-400">Foco</label>
                <input id="focus" type="number" min="1" value={localConfig.focus} onChange={(e) => setLocalConfig({...localConfig, focus: parseInt(e.target.value, 10) || 1})} className="w-20 p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right" />
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="short" className="text-slate-600 dark:text-slate-400">Pausa Curta</label>
                <input id="short" type="number" min="1" value={localConfig.short} onChange={(e) => setLocalConfig({...localConfig, short: parseInt(e.target.value, 10) || 1})} className="w-20 p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right" />
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="long" className="text-slate-600 dark:text-slate-400">Pausa Longa</label>
                <input id="long" type="number" min="1" value={localConfig.long} onChange={(e) => setLocalConfig({...localConfig, long: parseInt(e.target.value, 10) || 1})} className="w-20 p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right" />
              </div>
              <div className="flex justify-between items-center">
                <label htmlFor="sessions" className="text-slate-600 dark:text-slate-400">Sessões para Pausa Longa</label>
                <input id="sessions" type="number" min="1" value={localConfig.sessions} onChange={(e) => setLocalConfig({...localConfig, sessions: parseInt(e.target.value, 10) || 1})} className="w-20 p-1.5 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-right" />
              </div>
            </div>
            <button onClick={handleSettingsSave} className="mt-6 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">
                Salvar e Fechar
            </button>
          </div>
        
         <style>{`
            @keyframes fade-in-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            .animate-fade-in-scale { animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
          `}</style>
      </div>
    </div>
  );
};
export default PomodoroTimer;