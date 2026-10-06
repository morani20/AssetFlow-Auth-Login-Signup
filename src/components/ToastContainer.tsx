import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import type { ToastMessage } from '../types';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-5 inset-x-0 mx-auto z-50 flex flex-col items-center gap-2 max-w-md w-[92%] sm:w-auto pointer-events-none px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
      ))}
    </div>
  );
};

interface ToastItemProps {
  toast: ToastMessage;
  onClose: () => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onClose }) => {
  const [progress, setProgress] = useState(100);

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';
  const isWarning = toast.type === 'warning';

  useEffect(() => {
    const totalDuration = 4500;
    const intervalMs = 50;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += intervalMs;
      const remaining = Math.max(0, 100 - (elapsed / totalDuration) * 100);
      setProgress(remaining);
      if (elapsed >= totalDuration) {
        clearInterval(timer);
        onClose();
      }
    }, intervalMs);

    return () => clearInterval(timer);
  }, [onClose]);

  return (
    <div
      role="alert"
      className="pointer-events-auto relative overflow-hidden rounded-xl border border-slate-700/80 bg-slate-900/95 backdrop-blur-xl shadow-[0_15px_35px_rgba(0,0,0,0.45)] text-white transition-all duration-300 animate-toast-drop min-w-[320px] max-w-md"
    >
      <div className="px-4 py-3 flex items-center gap-3">
        {/* Status Icon */}
        <div className="flex-shrink-0">
          {isSuccess && (
            <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {isError && (
            <div className="w-8 h-8 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {isWarning && (
            <div className="w-8 h-8 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <AlertTriangle className="w-4 h-4" />
            </div>
          )}
          {!isSuccess && !isError && !isWarning && (
            <div className="w-8 h-8 rounded-full bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Info className="w-4 h-4" />
            </div>
          )}
        </div>

        {/* Text Content */}
        <div className="flex-1 min-w-0 text-start">
          <p className="text-xs sm:text-sm font-bold text-white tracking-tight leading-tight">
            {toast.title}
          </p>
          {toast.description && (
            <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5 leading-normal font-normal">
              {toast.description}
            </p>
          )}
        </div>

        {/* Minimal Close Button */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Discrete 1px bottom progress bar */}
      <div className="w-full h-0.5 bg-white/10 overflow-hidden">
        <div
          className={`h-full transition-all duration-75 ease-linear ${
            isSuccess
              ? 'bg-emerald-400'
              : isError
              ? 'bg-rose-400'
              : isWarning
              ? 'bg-amber-400'
              : 'bg-blue-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

