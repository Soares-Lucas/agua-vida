import React, { useState } from 'react';

interface AddTaskFormProps {
  listId: string;
  isFinancial: boolean;
  onSubmit: (listId: string, taskData: { text: string; value?: number }) => void;
  onCancel: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ listId, isFinancial, onSubmit, onCancel }) => {
  const [text, setText] = useState('');
  const [value, setValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    
    const taskData: { text: string; value?: number } = { text };
    if (isFinancial && value) {
      taskData.value = parseFloat(value);
    }

    onSubmit(listId, taskData);
    // Reset form and close
    setText('');
    setValue('');
    onCancel();
  };

  return (
    <li className="p-3 bg-slate-100 dark:bg-slate-900/80 rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Descreva a nova tarefa..."
          className="w-full p-2 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          autoFocus
        />
        {isFinancial && (
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500 dark:text-slate-400">R$</span>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full p-2 pl-10 rounded-md bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        )}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg text-sm font-medium bg-white dark:bg-slate-600 border border-slate-300 dark:border-slate-500 hover:bg-slate-100 dark:hover:bg-slate-500">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Salvar Tarefa
          </button>
        </div>
      </form>
    </li>
  );
};

export default AddTaskForm;
