import React, { useEffect, useState } from 'react';
import { toast, ToastType } from '../utils/toast';
import { cn } from '../utils/cn';

type ToastItem = { id: number; message: string; type: ToastType };

let counter = 0;

const ToastContainer: React.FC = () => {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    return toast._subscribe((message, type) => {
      const id = ++counter;
      setItems(prev => [...prev, { id, message, type }]);
      setTimeout(() => setItems(prev => prev.filter(t => t.id !== id)), 4000);
    });
  }, []);

  if (items.length === 0) return null;

  return (
    <div className="fixed top-6 right-6 z-[200] flex flex-col gap-3 pointer-events-none">
      {items.map(t => (
        <div
          key={t.id}
          className={cn(
            'px-5 py-4 rounded-2xl shadow-2xl text-sm font-bold max-w-sm animate-in slide-in-from-top-4 fade-in',
            t.type === 'success' && 'bg-emerald-600 text-white',
            t.type === 'error' && 'bg-red-600 text-white',
            t.type === 'info' && 'bg-slate-900 text-white',
          )}
        >
          {t.message}
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
