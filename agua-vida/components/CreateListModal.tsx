import React, { useState } from 'react';
import { XIcon } from './icons/XIcon';

interface CreateListModalProps {
  onClose: () => void;
  onCreate: (listData: { title: string; imageUrl: string; stack: string; hasTimer: boolean; isFinancial: boolean; }) => void;
}

const CreateListModal: React.FC<CreateListModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [stack, setStack] = useState('');
  const [hasTimer, setHasTimer] = useState(false);
  const [isFinancial, setIsFinancial] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('O título da lista é obrigatório.');
      return;
    }
    onCreate({ title, imageUrl: imageUrl || `https://picsum.photos/seed/${encodeURIComponent(title)}/400/300`, stack, hasTimer, isFinancial });
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
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Criar Nova Lista</h2>
          <button onClick={onClose} className="p-2 rounded-full text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500" aria-label="Close">
            <XIcon className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="list-title" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Título da Lista <span className="text-red-500">*</span></label>
            <input id="list-title" type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="list-image" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">URL da Imagem (Opcional)</label>
            <input id="list-image" type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} placeholder="Deixe em branco para uma imagem aleatória" className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label htmlFor="list-stack" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Pilha (Opcional)</label>
            <input id="list-stack" type="text" value={stack} onChange={(e) => setStack(e.target.value)} placeholder="Ex: Trabalho, Pessoal" className="w-full p-2 rounded-md bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <input id="list-timer" type="checkbox" checked={hasTimer} onChange={(e) => setHasTimer(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
              <label htmlFor="list-timer" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">Habilitar Cronômetro</label>
            </div>
            <div className="flex items-center">
              <input id="list-financial" type="checkbox" checked={isFinancial} onChange={(e) => setIsFinancial(e.target.checked)} className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              <label htmlFor="list-financial" className="ml-2 block text-sm text-slate-700 dark:text-slate-300">Lista Financeira</label>
            </div>
          </div>
          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">Criar Lista</button>
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

export default CreateListModal;