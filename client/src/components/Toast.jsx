import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgClass =
    type === "success"
      ? "bg-emerald-500/10 border-emerald-500 text-emerald-400"
      : type === "error"
      ? "bg-rose-500/10 border-rose-500 text-rose-400"
      : "bg-brand-500/10 border-brand-500 text-indigo-400";

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-4 py-3 border rounded-xl glass-panel ${bgClass} shadow-2xl animate-fade-in`}>
      <span className="text-sm font-semibold">{message}</span>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded transition-colors text-xs opacity-75 hover:opacity-100"
      >
        ✕
      </button>
    </div>
  );
}

export default Toast;
