import React, { useEffect, useState } from 'react';

interface ToasterProps {
  message: string;
  onUndo: () => void;
  onClose: () => void;
  duration?: number;
}

export function Toaster({ message, onUndo, onClose, duration = 5000 }: ToasterProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - 100 / (duration / 50);
        return newProgress < 0 ? 0 : newProgress;
      });
    }, 50);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [duration, onClose]);

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="
        fixed 
        bottom-40 
        left-1/2 
        -translate-x-1/2
        bg-slate-900 
        text-white 
        rounded-xl 
        shadow-lg 
        z-50
        overflow-hidden
      "
    >
      <div className="h-1 bg-slate-700">
        <div
          className="h-full bg-white transition-all duration-75 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="px-4 py-3 flex items-center gap-4">
        <p className="text-sm font-normal">{message}</p>
        <button
          type="button"
          onClick={onUndo}
          className="
            text-sm 
            font-semibold 
            text-white 
            hover:text-slate-200 
            underline
            focus-visible:outline-white
            focus-visible:outline-2
            rounded
          "
        >
          Ångra
        </button>
      </div>
    </div>
  );
}
