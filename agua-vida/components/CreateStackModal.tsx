import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';

interface CreateStackModalProps {
  onClose: () => void;
  onCreate: (stackData: { stack: string; title: string }) => void;
}

const CreateStackModal: React.FC<CreateStackModalProps> = ({ onClose, onCreate }) => {
  const [stack, setStack] = useState('');
  const [title, setTitle] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stack.trim() || !title.trim()) {
      alert('Ambos os campos são obrigatórios.');
      return;
    }
    onCreate({ stack, title });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity duration-300" onClick={onClose}>
      <div 
        className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale" 
        style={{ animationFillMode: 'forwards' }} 
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Criar Nova Pilha</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Close">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="stack-name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome da Pilha <span className="text-red-500">*</span></label>
            <input id="stack-name" type="text" value={stack} onChange={(e) => setStack(e.target.value)} required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: Projetos do Cliente X" />
          </div>
          <div>
            <label htmlFor="first-list-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título da Primeira Lista <span className="text-red-500">*</span></label>
            <input id="first-list-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Ex: Fase 1 - Descoberta" />
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Criar Pilha e Lista</button>
          </div>
        </form>
        <style>{`
            @keyframes fade-in-scale { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
            .animate-fade-in-scale { animation: fade-in-scale 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
          `}</style>
      </div>
    </div>
  );
};

export default CreateStackModal;