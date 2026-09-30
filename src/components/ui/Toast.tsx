import React, { useEffect } from 'react'
import { Bell, CheckCircle2, AlertCircle, AlertTriangle, X } from 'lucide-react'

interface ToastProps {
  title: string
  message: string
  type?: 'info' | 'success' | 'warning' | 'urgent'
  onClose: () => void
  duration?: number
}

export const Toast: React.FC<ToastProps> = ({
  title,
  message,
  type = 'info',
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    const timer = setTimeout(onClose, duration)
    return () => clearTimeout(timer)
  }, [onClose, duration])

  const typeConfig = {
    info: {
      icon: <Bell className="w-5 h-5 text-cyan-400" />,
      border: 'border-cyan-500/30',
      bg: 'bg-slate-900/95',
      badge: 'bg-cyan-500/10 text-cyan-400',
    },
    success: {
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      border: 'border-emerald-500/40',
      bg: 'bg-slate-900/95',
      badge: 'bg-emerald-500/10 text-emerald-400',
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5 text-amber-400" />,
      border: 'border-amber-500/40',
      bg: 'bg-slate-900/95',
      badge: 'bg-amber-500/10 text-amber-400',
    },
    urgent: {
      icon: <AlertCircle className="w-5 h-5 text-red-400 animate-bounce" />,
      border: 'border-red-500/60 shadow-[0_0_24px_rgba(239,68,68,0.25)]',
      bg: 'bg-slate-900/95',
      badge: 'bg-red-500/20 text-red-400 font-bold',
    },
  }

  const cfg = typeConfig[type]

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-in slide-in-from-bottom-5 duration-300">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl border ${cfg.border} ${cfg.bg} backdrop-blur-xl shadow-2xl text-left`}
      >
        <div className="p-1 rounded-lg shrink-0 mt-0.5">{cfg.icon}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-100 truncate">{title}</h4>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-0.5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  )
}
export default Toast
